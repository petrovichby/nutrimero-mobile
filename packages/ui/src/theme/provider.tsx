import { createContext, type ReactNode, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { displayFace, type FontName, stampFace, type UiWeight, uiFace } from "../fonts";
import { type App, type Roles, rolesFor, type Scheme } from "./roles";

export interface Theme {
  app: App;
  scheme: Scheme;
  locale: string;
  color: Roles;
  /** UI face for this locale's script at a weight (G-1); components never pick a family. */
  face(weight?: UiWeight): FontName;
  stampFace: FontName;
  displayFace: FontName;
}

const ThemeContext = createContext<Theme | null>(null);

export function createTheme(app: App, scheme: Scheme, locale: string): Theme {
  return {
    app,
    scheme,
    locale,
    color: rolesFor(app, scheme),
    face: (weight = "400") => uiFace(locale, weight),
    stampFace: stampFace(locale),
    displayFace: displayFace(),
  };
}

/** Provides the app's palette, the OS scheme and the locale's faces to every shared component. */
export function ThemeProvider({
  app,
  locale,
  children,
}: {
  app: App;
  locale: string;
  children: ReactNode;
}) {
  const scheme: Scheme = useColorScheme() === "dark" ? "dark" : "light";
  const theme = useMemo(() => createTheme(app, scheme, locale), [app, scheme, locale]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (theme === null) throw new Error("useTheme must be used inside <ThemeProvider>");
  return theme;
}
