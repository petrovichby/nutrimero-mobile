/**
 * The search fold shared by the snapshot script and the app (004 FR-012, research R9): case,
 * diacritics and a few letters that do not decompose, so "migdolų" finds "migdolu" and "Mehl"
 * finds "mehl". Both the stored keys and the query go through this one function.
 */
const LETTERS: Readonly<Record<string, string>> = {
  ł: "l",
  ø: "o",
  đ: "d",
  ß: "ss",
  æ: "ae",
  œ: "oe",
  ı: "i",
};

/** Precomposed letters of the seven UI locales, for a runtime without String#normalize. */
const PRECOMPOSED: Readonly<Record<string, string>> = {
  á: "a",
  à: "a",
  â: "a",
  ä: "a",
  ą: "a",
  ã: "a",
  å: "a",
  ć: "c",
  č: "c",
  ç: "c",
  é: "e",
  è: "e",
  ê: "e",
  ë: "e",
  ę: "e",
  ė: "e",
  ě: "e",
  í: "i",
  ì: "i",
  î: "i",
  ï: "i",
  į: "i",
  ń: "n",
  ñ: "n",
  ň: "n",
  ó: "o",
  ò: "o",
  ô: "o",
  ö: "o",
  ő: "o",
  õ: "o",
  ř: "r",
  ś: "s",
  š: "s",
  ť: "t",
  ú: "u",
  ù: "u",
  û: "u",
  ü: "u",
  ű: "u",
  ų: "u",
  ū: "u",
  ů: "u",
  ý: "y",
  ź: "z",
  ż: "z",
  ž: "z",
  ё: "е",
  й: "и",
  ї: "і",
  ў: "у",
};

const COMBINING = /[̀-ͯ]/g;

export function foldWithoutNormalize(text: string): string {
  let out = "";
  for (const char of text.toLowerCase()) {
    out += LETTERS[char] ?? PRECOMPOSED[char] ?? char;
  }
  return out.replace(/\s+/g, " ").trim();
}

export function foldForSearch(text: string): string {
  if (typeof "".normalize !== "function") return foldWithoutNormalize(text);
  let out = "";
  for (const char of text.toLowerCase().normalize("NFD").replace(COMBINING, "")) {
    out += LETTERS[char] ?? char;
  }
  return out.replace(/\s+/g, " ").trim();
}
