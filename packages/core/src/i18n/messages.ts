import be from "../../messages/be.json";
import de from "../../messages/de.json";
import en from "../../messages/en.json";
import hu from "../../messages/hu.json";
import lt from "../../messages/lt.json";
import pl from "../../messages/pl.json";
import uk from "../../messages/uk.json";

/** Constitution IX (1.1.0): the seven UI locales. Label languages are a separate, api-owned set. */
export const LOCALES = ["en", "de", "hu", "lt", "be", "pl", "uk"] as const;
export type Locale = (typeof LOCALES)[number];
export type MessageCatalog = typeof en;

export const messages: Record<Locale, MessageCatalog> = { en, de, hu, lt, be, pl, uk };
