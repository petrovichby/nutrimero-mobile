import de from "../../messages/de.json";
import en from "../../messages/en.json";
import lt from "../../messages/lt.json";

export type Locale = "en" | "de" | "lt";
export type MessageCatalog = typeof en;

export const messages: Record<Locale, MessageCatalog> = { en, de, lt };
