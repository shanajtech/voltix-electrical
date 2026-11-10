
"use client";

import { useState } from "react";
import type { Language, Theme } from "@/app/page";

interface NavbarProps {
  language: Language;
  setLanguage: (value: Language) => void;
  theme: Theme;
  setTheme: (value: Theme) => void;
}

export default function Navbar({
  language,
  setLanguage,
  theme,
  setTheme,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isBangla = language === "bn";

  const links = [
    { en: "Home", bn: "হোম", href: "#home" },
    { en: "Services", bn: "সেবাসমূহ", href: "#services" },
    { en: "Work stages", bn: "কাজের ধাপ", href: "#projects" },
    { en: "About", bn: "পরিচিতি", href: "#about" },
    { en: "Contact", bn: "যোগাযোগ", href: "#contact" },
  ];

  return (
    <header className="site-header">
      <nav className="nav-inner" aria-label="Main navigation">
        <a className="brand" href="#home">
          <span className="brand-mark">KE</span>
          <span className="brand-name">
            KHAJA <strong>ENTERPRISE</strong>
          </span>
        </a>

        <div
          id="primary-menu"
          className={`nav-menu ${menuOpen ? "is-open" : ""}`}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {isBangla ? link.bn : link.en}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <a className="nav-phone" href="tel:+8801717716586">
            01717716586
          </a>

          <button
            type="button"
            className="utility-button"
            aria-label="Change language"
            onClick={() =>
              setLanguage(isBangla ? "en" : "bn")
            }
          >
            {isBangla ? "EN" : "বাংলা"}
          </button>

          <button
            type="button"
            className="utility-button"
            aria-label="Toggle color theme"
            aria-pressed={theme === "light"}
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>

          <a
            className="quote-button"
            href="#quote"


          >
            {isBangla ? "কাজ নিয়ে কথা বলুন" : "DISCUSS YOUR WORK"}
            <span>↗</span>
          </a>
        </div>

        <button
          type="button"
          className="mobile-menu-button"
          aria-controls="primary-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>
    </header>
  );
}
