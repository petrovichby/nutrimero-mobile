/**
 * Records the Label desk's api fixtures (spec 002 T005) from a LOCAL nutrimero-api.
 *
 * Rules (coordinator, 2026-09-23):
 * - The api must run at `contract/SOURCE`'s commit, seeded with `fid:import`. The same rule
 *   as Home's snapshot.
 * - Never production. The base URL must be a loopback address, and anything else is refused.
 *
 * Every fixture is built through the api's own routes over real FID corpus rows, the way the
 * api's label e2e suites build theirs, so no fixture holds a state the api could not produce.
 * Output is one TypeScript module per fixture, typed with `satisfies` against the generated
 * contract types, so the typecheck gate verifies every fixture's shape.
 *
 *   node scripts/record-label-fixtures.ts --api-url http://localhost:4199 --api-commit <sha>
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(import.meta.dirname, "..", "packages/features/labels/src/__fixtures__");

/** Real corpus rows, as the api's label e2e suites use them. */
const WHEAT_FLOUR = "389D858"; // cereals containing gluten; wheat
const HAZELNUTS = "0A0D77E"; // nuts; hazelnuts
/** The api issuing suite's own drift ingredient: it adds an allergen the counter card states. */
const DRIFT_INGREDIENT = "22F4A0C";
const GRAM = "B001";

function arg(name: string): string {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (value === undefined) {
    throw new Error(`missing ${name}`);
  }
  return value;
}

const apiUrl = new URL(arg("--api-url"));
const apiCommit = arg("--api-commit");
const source = readFileSync(join(import.meta.dirname, "..", "contract/SOURCE"), "utf8");

if (!["localhost", "127.0.0.1", "::1", "[::1]"].includes(apiUrl.hostname)) {
  throw new Error(`refused: fixtures come from a local api only, never ${apiUrl.hostname}`);
}
if (!source.includes(apiCommit) || apiCommit.length < 7) {
  throw new Error(
    `refused: --api-commit ${apiCommit} is not contract/SOURCE's commit (${source.trim()})`,
  );
}

type Json = Record<string, unknown>;

/** A string field of an api response, or a loud failure — the script never guesses a shape. */
function str(body: Json, key: string): string {
  const value = body[key];
  if (typeof value !== "string") throw new Error(`expected a string at "${key}"`);
  return value;
}

/** A nested object field of an api response, or a loud failure. */
function obj(body: Json, key: string): Json {
  const value = body[key];
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`expected an object at "${key}"`);
  }
  return Object.fromEntries(Object.entries(value));
}

async function call(
  method: string,
  path: string,
  options: { token?: string; company?: string; body?: unknown } = {},
): Promise<{ status: number; body: Json; date: string | null }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.token !== undefined) headers.Authorization = `Bearer ${options.token}`;
  if (options.company !== undefined) headers["X-Company-Id"] = options.company;
  const response = await fetch(new URL(path, apiUrl), {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const text = await response.text();
  return {
    status: response.status,
    body: text === "" ? {} : JSON.parse(text),
    date: response.headers.get("date"),
  };
}

async function expectOk(
  label: string,
  pending: Promise<{ status: number; body: Json; date: string | null }>,
) {
  const result = await pending;
  if (result.status < 200 || result.status >= 300) {
    throw new Error(`${label}: ${result.status} ${JSON.stringify(result.body)}`);
  }
  return result;
}

const run = Date.now().toString(36);

async function register(name: string, companyName: string) {
  const { body } = await expectOk(
    `register ${name}`,
    call("POST", "/api/v1/auth/register", {
      body: {
        email: `${name}-${run}@fixtures.test`,
        password: "Fixture-Recording-Passphrase-2026!",
        displayName: name,
        companyName,
      },
    }),
  );
  return {
    token: str(obj(body, "tokens"), "accessToken"),
    companyId: str(obj(body, "company"), "id"),
  };
}

const anna = await register("anna", "Bäckerei Anna");
const as = { token: anna.token, company: anna.companyId };

async function recipe(name: string, components: [string, string][]) {
  const { body } = await expectOk(
    `recipe ${name}`,
    call("POST", "/api/v1/recipes", { ...as, body: { name } }),
  );
  const recipeId = str(body, "id");
  for (const [fidId, quantity] of components) {
    await expectOk(
      `component ${fidId}`,
      call("POST", `/api/v1/recipes/${recipeId}/components`, {
        ...as,
        body: { target: "fid_ingredient", fidId, quantity, unitId: GRAM },
      }),
    );
  }
  return recipeId;
}

async function product(name: string, productNumber: string, recipeId: string | null) {
  const { body } = await expectOk(
    `product ${name}`,
    call("POST", "/api/v1/products", { ...as, body: { name, number: productNumber } }),
  );
  const productId = str(body, "id");
  if (recipeId !== null) {
    await expectOk(
      `compose ${name}`,
      call("POST", `/api/v1/products/${productId}/compositions`, {
        ...as,
        body: { kind: "recipe", recipeId },
      }),
    );
  }
  return productId;
}

async function assign(productId: string, ruleSetId: string) {
  await expectOk(
    `assign ${ruleSetId}`,
    call("POST", `/api/v1/products/${productId}/declarations`, { ...as, body: { ruleSetId } }),
  );
}

// --- The fixture company -------------------------------------------------------------------

const loafRecipe = await recipe("Haselnussbrot", [
  [WHEAT_FLOUR, "600"],
  [HAZELNUTS, "400"],
]);
const loaf = await product("Haselnussbrot", "HB-500", loafRecipe); // counter card, complete
await assign(loaf, "eu1_counter_card");

const packagedRecipe = await recipe("Nussecke", [
  [WHEAT_FLOUR, "500"],
  [HAZELNUTS, "500"],
]);
const packaged = await product("Nussecke", "NE-120", packagedRecipe); // packaging: P-02
await assign(packaged, "eu1_packaging");
await assign(packaged, "usa_packaging"); // no engine for this region

const empty = await product("Saisonbrot", "SB-001", null); // no composition
await assign(empty, "eu1_counter_card");

// Issued labels: an active one, one superseded by a change upstream, and a withdrawn one.
const issue = (language: string) =>
  expectOk(
    `issue ${language}`,
    call(
      "POST",
      `/api/v1/products/${loaf}/labels/eu1_counter_card/issued?language=${language}`,
      as,
    ),
  );
const firstGerman = (await issue("de-DE")).body;
const english = (await issue("en-US")).body;
await expectOk(
  "withdraw en-US",
  call("POST", `/api/v1/issued-labels/${str(english, "id")}/withdraw`, as),
);
// Change the recipe (as the api's issuing suite does) so the German label's text changes: the
// single read of the issued label now reports that current data differs, and reissuing
// supersedes it.
await expectOk(
  "upstream change: a new allergen",
  call("POST", `/api/v1/recipes/${loafRecipe}/components`, {
    ...as,
    body: { target: "fid_ingredient", fidId: DRIFT_INGREDIENT, quantity: "200", unitId: GRAM },
  }),
);
const drifted = await expectOk(
  "read superseded-to-be label",
  call("GET", `/api/v1/issued-labels/${str(firstGerman, "id")}`, as),
);
const secondGerman = (await issue("de-DE")).body;

// A second person who belongs to two bakeries.
const boris = await register("boris", "Konditorei Boris");
const { body: code } = await expectOk(
  "join code",
  call("POST", "/api/v1/companies/current/join-code", as),
);
const { body: request } = await expectOk(
  "join request",
  call("POST", "/api/v1/join-requests", {
    token: boris.token,
    body: { joinCode: str(code, "joinCode") },
  }),
);
await expectOk(
  "approve",
  call("POST", `/api/v1/join-requests/${str(request, "requestId")}/approve`, {
    ...as,
    body: { role: "viewer" },
  }),
);

// --- Reads the desk makes -----------------------------------------------------------------

const read = async (label: string, path: string, auth: { token: string; company?: string } = as) =>
  (await expectOk(label, call("GET", path, auth))).body;

// The counter card in each offered label language (en-US and de-DE today; add hu-HU, lt-LT and
// pl-PL here when the api proves them — spec 002 T026).
const counterCards = [];
for (const language of ["en-US", "de-DE"]) {
  counterCards.push({
    name: `counterCard${language.slice(0, 1).toUpperCase()}${language.slice(1, 2)}${language.slice(3)}`,
    file: `counter-card-${language.toLowerCase()}.ts`,
    type: `paths["/api/v1/products/{id}/labels/{ruleSetId}"]["get"]["responses"][200]["content"]["application/json"]`,
    value: await read(
      `counter card ${language}`,
      `/api/v1/products/${loaf}/labels/eu1_counter_card?language=${language}`,
    ),
    note: `O9 — EU1 counter card in ${language}`,
  });
}

const fixtures: { name: string; file?: string; type: string; value: unknown; note: string }[] = [
  {
    name: "meTwoBakeries",
    type: `paths["/api/v1/me"]["get"]["responses"][200]["content"]["application/json"]`,
    value: await read("me", "/api/v1/me", { token: boris.token }),
    note: "O4 — a viewer in one bakery and admin of another",
  },
  {
    name: "ruleSets",
    type: `paths["/api/v1/fid/declaration-rule-sets"]["get"]["responses"][200]["content"]["application/json"]`,
    value: await read("rule-sets", "/api/v1/fid/declaration-rule-sets?limit=50", {
      token: anna.token,
    }),
    note: "O5 — the seeded rule-sets",
  },
  {
    name: "products",
    type: `paths["/api/v1/products"]["get"]["responses"][200]["content"]["application/json"]`,
    value: await read("products", "/api/v1/products?limit=200"),
    note: "O6",
  },
  {
    name: "declarationsOverview",
    type: `paths["/api/v1/declarations"]["get"]["responses"][200]["content"]["application/json"]`,
    value: await read("declarations", "/api/v1/declarations?limit=200"),
    note: "O7",
  },
  {
    name: "gridCounterCardComplete",
    type: `paths["/api/v1/products/{id}/declarations"]["get"]["responses"][200]["content"]["application/json"]`,
    value: await read("grid loaf", `/api/v1/products/${loaf}/declarations`),
    note: "O8 — EU1 counter card, complete",
  },
  {
    name: "gridPackaging",
    type: `paths["/api/v1/products/{id}/declarations"]["get"]["responses"][200]["content"]["application/json"]`,
    value: await read("grid packaged", `/api/v1/products/${packaged}/declarations`),
    note: "O8 — EU1 packaging (Additives cannot_be_held, PARKED P-02) and USA packaging",
  },
  {
    name: "gridNoComposition",
    type: `paths["/api/v1/products/{id}/declarations"]["get"]["responses"][200]["content"]["application/json"]`,
    value: await read("grid empty", `/api/v1/products/${empty}/declarations`),
    note: "O8 — a product with no composition",
  },
  ...counterCards,
  {
    name: "packagingEnUS",
    file: "packaging-en-us.ts",
    type: `paths["/api/v1/products/{id}/labels/{ruleSetId}"]["get"]["responses"][200]["content"]["application/json"]`,
    value: await read(
      "packaging label",
      `/api/v1/products/${packaged}/labels/eu1_packaging?language=en-US`,
    ),
    note: "O9 — EU1 packaging in en-US, with nutrition",
  },
  {
    name: "noEngine",
    type: `paths["/api/v1/products/{id}/labels/{ruleSetId}"]["get"]["responses"][200]["content"]["application/json"]`,
    value: await read(
      "usa label",
      `/api/v1/products/${packaged}/labels/usa_packaging?language=en-US`,
    ),
    note: "O9 — a region without a label engine",
  },
  {
    name: "issuedList",
    type: `paths["/api/v1/products/{id}/labels/{ruleSetId}/issued"]["get"]["responses"][200]["content"]["application/json"]`,
    value: await read("issued list", `/api/v1/products/${loaf}/labels/eu1_counter_card/issued`),
    note: "O10 — active, superseded and withdrawn",
  },
  {
    name: "issuedActive",
    type: `paths["/api/v1/issued-labels/{issuedId}"]["get"]["responses"][200]["content"]["application/json"]`,
    value: await read("issued active", `/api/v1/issued-labels/${str(secondGerman, "id")}`),
    note: "O11 — the active German label; current data matches",
  },
  {
    name: "issuedDrifted",
    type: `paths["/api/v1/issued-labels/{issuedId}"]["get"]["responses"][200]["content"]["application/json"]`,
    value: drifted.body,
    note: "O11 — read after an upstream change, before reissue: current data differs",
  },
  {
    name: "issuedSuperseded",
    type: `paths["/api/v1/issued-labels/{issuedId}"]["get"]["responses"][200]["content"]["application/json"]`,
    value: await read("issued superseded", `/api/v1/issued-labels/${str(firstGerman, "id")}`),
    note: "O11 — superseded by the reissue",
  },
  {
    name: "issuedWithdrawn",
    type: `paths["/api/v1/issued-labels/{issuedId}"]["get"]["responses"][200]["content"]["application/json"]`,
    value: await read("issued withdrawn", `/api/v1/issued-labels/${str(english, "id")}`),
    note: "O11 — withdrawn",
  },
];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const header = (note: string) =>
  `// Recorded by scripts/record-label-fixtures.ts from a local nutrimero-api at ${apiCommit}.\n// ${note}. Do not edit by hand: re-record instead.\n`;

for (const fixture of fixtures) {
  const file = fixture.file ?? `${fixture.name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}.ts`;
  writeFileSync(
    join(OUT, file),
    `${header(fixture.note)}import type { paths } from "@nutrimero/core";\n\nexport const ${fixture.name} = ${JSON.stringify(fixture.value, null, 2)} satisfies ${fixture.type};\n`,
  );
}

writeFileSync(
  join(OUT, "README.md"),
  `# Label desk fixtures\n\nRecorded by \`scripts/record-label-fixtures.ts\` from a **local** nutrimero-api at\n\`${apiCommit}\` (\`contract/SOURCE\`), seeded with \`fid:import\`. Never from production.\nRecorded ${new Date().toISOString().slice(0, 10)}.\n\nThe company is built through the api's own routes over real FID corpus rows:\n\n| Product | Composition | Label types | Covers |\n|---|---|---|---|\n| Haselnussbrot (HB-500) | wheat flour 600 g + hazelnuts 400 g | eu1_counter_card | complete grid; counter-card renderings (en-US, de-DE); issued: active, superseded (after an upstream change), withdrawn |\n| Nussecke (NE-120) | wheat flour 500 g + hazelnuts 500 g | eu1_packaging, usa_packaging | P-02 Additives gap; packaging rendering with nutrition; no-engine rendering |\n| Saisonbrot (SB-001) | none | eu1_counter_card | no-composition gaps |\n\nA second person belongs to both bakeries (the /me fixture).\n\nEach module is typed with \`satisfies\` against the generated contract types.\n`,
);

process.stdout.write(`wrote ${fixtures.length} fixtures to ${OUT}\n`);
