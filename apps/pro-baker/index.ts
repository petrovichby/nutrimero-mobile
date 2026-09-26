// FIRST: @nutrimero/core/native installs the forced Intl polyfills (ADR 0001) before anything
// formats a message — Hermes has no Intl.PluralRules on this runtime.
import "@nutrimero/core/native";
import { registerRootComponent } from "expo";
import { AppRoot } from "./src/app-root";

registerRootComponent(AppRoot);
