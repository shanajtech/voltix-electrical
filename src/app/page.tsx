

"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export type Language = "en" | "bn";
export type Theme = "dark" | "light";

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("khaja-theme");
    const savedLanguage = localStorage.getItem("khaja-language");

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }

    if (savedLanguage === "en" || savedLanguage === "bn") {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("khaja-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("khaja-language", language);
  }, [language]);

  return (
    <main data-theme={theme} className="website-shell">
      <Navbar
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
      />
      <Hero language={language} />
    </main>
  );
}



