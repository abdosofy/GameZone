import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaShieldAlt,
  FaBolt,
  FaHeadset,
  FaLock,
} from "react-icons/fa";

import "./Home.css";

function Home({ language, onLanguageChange }) {
  const isArabic = language === "ar";
  const navigate = useNavigate();

  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
          } else {
            entry.target.classList.remove("reveal-active");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const content = {
    en: {
      label: "WELCOME TO THE NEXT LEVEL",
      title: "PLAY BEYOND",
      highlight: "LIMITS.",
      description:
        "Discover your next adventure. Explore the world of gaming.",
      button: "EXPLORE GAMES",
      games: "GAMES",
      support: "SUPPORT",
      featuredLabel: "HANDPICKED FOR YOU",
      featuredTitle: "FEATURED GAMES",
      featuredDescription:
        "Discover the most exciting games and start your next adventure.",
      addToCart: "ADD TO CART",
      discount: "SALE",
      platform: "PC GAME",
      whyLabel: "THE GAME ZONE ADVANTAGE",
      whyTitle: "WHY CHOOSE US",
      whyDescription:
        "We make your gaming experience better, safer, and faster.",
      whyFeatures: [
        {
          title: "100% ORIGINAL GAMES",
          description: "Get authentic games from trusted sources.",
        },
        {
          title: "INSTANT DELIVERY",
          description: "Receive your digital game codes quickly.",
        },
        {
          title: "24/7 SUPPORT",
          description: "Our support team is always ready to help.",
        },
        {
          title: "SECURE PAYMENTS",
          description: "Your transactions and information are protected.",
        },
      ],
    },

    ar: {
      label: "أهلاً بك في المستوى التالي",
      title: "العب بلا",
      highlight: "حدود.",
      description:
        "اكتشف مغامرتك القادمة واستمتع بعالم الألعاب.",
      button: "اكتشف الألعاب",
      games: "لعبة",
      support: "دعم متواصل",
      featuredLabel: "اختيارات مميزة لك",
      featuredTitle: "ألعاب مميزة",
      featuredDescription:
        "اكتشف أقوى الألعاب وابدأ مغامرتك القادمة.",
      addToCart: "أضف للسلة",
      discount: "خصم",
      platform: "لعبة كمبيوتر",
      whyLabel: "مميزات GAME ZONE",
      whyTitle: "ليه تختارنا؟",
      whyDescription:
        "بنقدملك تجربة ألعاب أفضل وأسرع وأكثر أمانًا.",
      whyFeatures: [
        {
          title: "ألعاب أصلية 100%",
          description: "احصل على ألعاب أصلية من مصادر موثوقة.",
        },
        {
          title: "استلام رقمي سريع",
          description: "استلم أكواد ألعابك الرقمية بسرعة.",
        },
        {
          title: "دعم فني متواصل",
          description: "فريق الدعم جاهز لمساعدتك في أي وقت.",
        },
        {
          title: "دفع آمن",
          description: "معاملاتك وبياناتك في أمان.",
        },
      ],
    },
  };

  const text = isArabic ? content.ar : content.en;

  const featuredGames = [
    {
      id: 1,
      name: "God of War Ragnarök",
      image:
        "https://cdn.akamai.steamstatic.com/steam/apps/2322010/header.jpg",
      oldPrice: 1800,
      price: 1250,
      discount: "30%",
    },
    {
      id: 2,
      name: "Cyberpunk 2077",
      image:
        "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
      oldPrice: 1500,
      price: 999,
      discount: "33%",
    },
    {
      id: 3,
      name: "Elden Ring",
      image:
        "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
      oldPrice: 1700,
      price: 1190,
      discount: "30%",
    },
  ];

  return (
    <main className="home-page">
      {/* HERO SECTION */}
      <section className="home-hero" id="home">
        <div className="hero-content">
          <p className="hero-label">{text.label}</p>

          <h1>
            {text.title}
            <br />
            <span>{text.highlight}</span>
          </h1>

          <p className="hero-description">
            {text.description}
          </p>

          <button
            className="hero-button"
            onClick={() => navigate("/store")}
          >
            {text.button}
          </button>

          <div className="hero-stats">
            <div>
              <strong>1000+</strong>
              <span>{text.games}</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>{text.support}</span>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <div className="image-glow"></div>

          <img
            src="/images/hero.png"
            alt="Gaming character"
          />

          <div className="image-decoration"></div>
        </div>
      </section>

      {/* FEATURED GAMES */}
      <section className="featured-section" id="featured">
        <div className="featured-heading scroll-reveal">
          <p className="featured-label">
            {text.featuredLabel}
          </p>

          <h2>{text.featuredTitle}</h2>

          <p>{text.featuredDescription}</p>
        </div>

        <div className="featured-grid">
          {featuredGames.map((game) => (
            <article
              className="game-card scroll-reveal"
              key={game.id}
              onClick={() => navigate("/store")}
              style={{ cursor: "pointer" }}
            >
              <div className="game-image">
                <img
                  src={game.image}
                  alt={game.name}
                  loading="lazy"
                />

                <span className="game-discount">
                  {text.discount} {game.discount}
                </span>
              </div>

              <div className="game-info">
                <div className="game-info-top">
                  <span className="game-platform">
                    {text.platform}
                  </span>

                  <span className="game-number">
                    0{game.id}
                  </span>
                </div>

                <h3>{game.name}</h3>

                <div className="game-prices">
                  <span className="old-price">
                    {game.oldPrice} EGP
                  </span>

                  <strong>{game.price} EGP</strong>
                </div>

                <button
                  className="game-cart-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/store");
                  }}
                >
                  {text.addToCart}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section" id="categories">
        <div className="categories-heading scroll-reveal">
          <p>
            {isArabic
              ? "اختر منصتك"
              : "CHOOSE YOUR PLATFORM"}
          </p>

          <h2>
            {isArabic
              ? "تصفح حسب المنصة"
              : "GAME CATEGORIES"}
          </h2>

          <span>
            {isArabic
              ? "اكتشف الألعاب المناسبة لمنصتك المفضلة"
              : "Explore games made for your favorite platform"}
          </span>
        </div>

        <div className="categories-grid">
          <div className="category-card pc-category scroll-reveal">
            <div className="category-overlay"></div>

            <div className="category-content">
              <span>01 / PC GAMING</span>

              <h3>PC GAMES</h3>

              <p>
                {isArabic
                  ? "اكتشف عالم ألعاب الكمبيوتر"
                  : "Discover the world of PC gaming"}
              </p>

              <button
                onClick={() =>
                  navigate("/store?platform=pc")
                }
              >
                {isArabic
                  ? "اكتشف الألعاب"
                  : "EXPLORE GAMES"}
              </button>
            </div>
          </div>

          <div className="category-card ps-category scroll-reveal">
            <div className="category-overlay"></div>

            <div className="category-content">
              <span>02 / PLAYSTATION</span>

              <h3>PLAYSTATION</h3>

              <p>
                {isArabic
                  ? "استمتع بأفضل ألعاب بلايستيشن"
                  : "Experience the best PlayStation games"}
              </p>

              <button
                onClick={() =>
                  navigate("/store?platform=playstation")
                }
              >
                {isArabic
                  ? "اكتشف الألعاب"
                  : "EXPLORE GAMES"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-section" id="why-us">
        <div className="why-heading scroll-reveal">
          <p>{text.whyLabel}</p>

          <h2>{text.whyTitle}</h2>

          <span>{text.whyDescription}</span>
        </div>

        <div className="why-grid">
          <article className="why-card scroll-reveal">
            <div className="why-icon">
              <FaShieldAlt />
            </div>

            <h3>{text.whyFeatures[0].title}</h3>

            <p>{text.whyFeatures[0].description}</p>
          </article>

          <article className="why-card scroll-reveal">
            <div className="why-icon">
              <FaBolt />
            </div>

            <h3>{text.whyFeatures[1].title}</h3>

            <p>{text.whyFeatures[1].description}</p>
          </article>

          <article className="why-card scroll-reveal">
            <div className="why-icon">
              <FaHeadset />
            </div>

            <h3>{text.whyFeatures[2].title}</h3>

            <p>{text.whyFeatures[2].description}</p>
          </article>

          <article className="why-card scroll-reveal">
            <div className="why-icon">
              <FaLock />
            </div>

            <h3>{text.whyFeatures[3].title}</h3>

            <p>{text.whyFeatures[3].description}</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Home;