import {
  FaFacebookF,
  FaInstagram,
  FaDiscord,
  FaGamepad,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "./Footer.css";

function Footer({ language = "en" }) {
  const isArabic = language === "ar";

  const text = {
    en: {
      description:
        "Your ultimate destination for PC and PlayStation games.",
      quickLinks: "QUICK LINKS",
      ourGames: "OUR GAMES",
      contactUs: "CONTACT US",
      home: "Home",
      store: "Store",
      pc: "PC Games",
      ps: "PlayStation Games",
      email: "support@gamezone.com",
      copyright: "© 2026 GAME ZONE. All rights reserved.",
    },
    ar: {
      description:
        "وجهتك المثالية لاكتشاف أفضل ألعاب الكمبيوتر والبلايستيشن.",
      quickLinks: "روابط سريعة",
      ourGames: "ألعابنا",
      contactUs: "تواصل معنا",
      home: "الرئيسية",
      store: "المتجر",
      pc: "ألعاب الكمبيوتر",
      ps: "ألعاب بلايستيشن",
      email: "support@gamezone.com",
      copyright: "© 2026 GAME ZONE. جميع الحقوق محفوظة.",
    },
  };

  const content = isArabic ? text.ar : text.en;

  return (
    <footer className="footer-section">

      <div className="footer-container">

        <div className="footer-brand">
          <div className="footer-logo">
            <FaGamepad />
            <h2>
              GAME <span>ZONE</span>
            </h2>
          </div>

          <p>{content.description}</p>

          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebookF />
            </a>

            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>

            <a href="https://discord.com" target="_blank" rel="noreferrer">
              <FaDiscord />
            </a>
          </div>
        </div>

<div className="footer-links">
  <h3>{content.quickLinks}</h3>

  <a href="#home">{content.home}</a>
  <a href="#featured">{content.store}</a>
</div>

<div className="footer-links">
  <h3>{content.ourGames}</h3>

  <a href="#categories">{content.pc}</a>
  <a href="#categories">{content.ps}</a>
</div>

        <div className="footer-contact">
          <h3>{content.contactUs}</h3>

          <p>
            <FaEnvelope />
            <span>{content.email}</span>
          </p>

          <p>
            <FaMapMarkerAlt />
            <span>Egypt</span>
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>{content.copyright}</p>
      </div>

    </footer>
  );
}

export default Footer;