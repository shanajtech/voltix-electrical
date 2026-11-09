
import type { Language } from "@/app/page";

interface HeroProps {
  language: Language;
}

export default function Hero({ language }: HeroProps) {
  const bn = language === "bn";

  return (
    <section className="hero-section" id="home">
      <div className="hero-image" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-light" aria-hidden="true" />

      <div className="hero-container">
        <div className="hero-content">
          <p className="hero-eyebrow">
            <span className="eyebrow-line" />
            {bn
              ? "মেরাজনগর · শ্যামপুর · ঢাকা"
              : "MERAJNAGAR · SHYAMPUR · DHAKA"}
          </p>

          <h1 className={`hero-heading ${bn ? "bangla-heading" : ""}`}>
            {bn ? (
              <>
                উন্নত মানের
                <br />
                ইলেকট্রিক্যাল সেবা
                <br />
                আপনার বাসা ও
                <br />
                <span>প্রতিষ্ঠানের জন্য।</span>
              </>
            ) : (
              <>
                PREMIUM ELECTRICAL
                <br />
                SERVICES
                <br />
                FOR YOUR HOME
                <br />
                <span>& BUSINESS.</span>
              </>
            )}
          </h1>

          <p className="hero-description">
            {bn
              ? "বাসাবাড়ির ওয়্যারিং, ফ্যান ও মোটর মেরামত, বৈদ্যুতিক রক্ষণাবেক্ষণ এবং মিটার সংক্রান্ত কাজে সহায়তা।"
              : "House wiring, fan and motor repairs, electrical maintenance, and meter-related service assistance for homes and businesses."}
          </p>

          <div className="hero-actions">
            <a
              className="btn-primary"
              href="https://wa.me/8801717716586"
              target="_blank"
              rel="noopener noreferrer"
            >
              {bn ? "হোয়াটসঅ্যাপে যোগাযোগ" : "GET A QUOTE"}
              <span>↗</span>
            </a>

            <a className="btn-outline" href="tel:+8801717716586">
              {bn ? "সরাসরি কল করুন" : "CALL NOW"}
              <span>↗</span>
            </a>
          </div>

          <a className="scroll-indicator" href="#services">
            {bn ? "নিচে দেখুন" : "SCROLL"}
            <span>↓</span>
          </a>
        </div>
      </div>

      <div className="hero-info-strip">
        <div className="info-strip-inner">
          {[
            ["HOUSE WIRING", "বাসাবাড়ির ওয়্যারিং"],
            ["FAN & MOTOR REPAIR", "ফ্যান ও মোটর মেরামত"],
            ["ELECTRICAL MAINTENANCE", "বৈদ্যুতিক রক্ষণাবেক্ষণ"],
            ["METER ASSISTANCE", "মিটার সংক্রান্ত সহায়তা"],
          ].map(([en, bangla]) => (
            <div className="info-item" key={en}>
              <span className="info-square" />
              {bn ? bangla : en}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

