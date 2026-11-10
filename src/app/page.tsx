"use client";
import { useEffect, useSyncExternalStore } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Sections from "@/components/Sections";
export type Language = "en" | "bn";
export type Theme = "dark" | "light";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("khaja-preference", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("khaja-preference", callback); };
}
function read(key: string, fallback: string) { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } }
function save(key: string, value: string) { try {localStorage.setItem(key, value);} catch {} window.dispatchEvent(new Event("khaja-preference")); }
export default function Home() {
  const language: Language = useSyncExternalStore(subscribe, () => read("khaja-language", "en") === "bn" ? "bn" : "en", () => "en");
  const theme: Theme = useSyncExternalStore(subscribe, () => read("khaja-theme", "dark") === "light" ? "light" : "dark", () => "dark");
  useEffect(() => {document.documentElement.dataset.theme = theme; document.documentElement.lang = language;}, [theme, language]);
  return <main data-theme={theme} className="website-shell">
    <Navbar language={language} setLanguage={value => save("khaja-language",value)} theme={theme} setTheme={value => save("khaja-theme",value)}/>
    <Hero language={language}/><Sections language={language}/>
  </main>;
}
