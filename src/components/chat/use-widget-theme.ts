"use client";

import { useEffect, useState } from "react";

import {
  isWidgetDarkMode,
  type WidgetTheme,
} from "@/lib/widget/theme";

function getInitialDarkMode(theme: WidgetTheme): boolean {
  return theme === "dark";
}

export function useWidgetTheme(theme: WidgetTheme): boolean {
  const [isDark, setIsDark] = useState(() => getInitialDarkMode(theme));

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const update = () => {
      setIsDark(isWidgetDarkMode(theme, media.matches));
    };

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [theme]);

  return isDark;
}
