import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { getGames } from "../../../data/games";

import "./Store.css";

function Store({ language, onLanguageChange }) {
  const isArabic = language === "ar";

  const [searchParams, setSearchParams] = useSearchParams();

  // تحميل الألعاب من ملف البيانات الموحد
  const [games, setGames] = useState(() => getGames());

  const [activePlatform, setActivePlatform] = useState(
    searchParams.get("platform") || "all"
  );

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const [sortOption, setSortOption] = useState("default");

  // تحديث الألعاب تلقائيًا عند تعديلها من لوحة التحكم
  useEffect(() => {
    const updateGames = () => {
      setGames(getGames());
    };

    window.addEventListener("gamesUpdated", updateGames);
    window.addEventListener("storage", updateGames);

    return () => {
      window.removeEventListener("gamesUpdated", updateGames);
      window.removeEventListener("storage", updateGames);
    };
  }, []);

  // متابعة البحث والمنصة من رابط الصفحة
  useEffect(() => {
    const platform = searchParams.get("platform");
    const search = searchParams.get("search");

    setActivePlatform(
      platform === "pc" || platform === "playstation"
        ? platform
        : "all"
    );

    setSearchTerm(search || "");
  }, [searchParams]);

  // تأثير حركة الكروت ثلاثي الأبعاد
  const handleCardMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = ((centerY - y) / centerY) * 5;

    card.style.setProperty("--rotate-x", `${rotateX}deg`);
    card.style.setProperty("--rotate-y", `${rotateY}deg`);
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const resetCardMove = (event) => {
    const card = event.currentTarget;

    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.setProperty("--mouse-x", "50%");
    card.style.setProperty("--mouse-y", "50%");
  };

  // تغيير فلتر المنصة مع الاحتفاظ بالبحث
  const handlePlatformChange = (platform) => {
    setActivePlatform(platform);

    const params = new URLSearchParams(searchParams);

    if (platform === "all") {
      params.delete("platform");
    } else {
      params.set("platform", platform);
    }

    if (searchTerm.trim()) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }

    setSearchParams(params);
  };

  // البحث محليًا بدون تحديث رابط الصفحة مع كل حرف
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // تصفية وترتيب الألعاب
  const filteredGames = games
    .filter((game) => {
      const matchesPlatform =
        activePlatform === "all" ||
        game.platform === activePlatform;

      const searchText = searchTerm.trim().toLowerCase();

      const name = String(game.name || "").toLowerCase();
      const genre = String(game.genre || "").toLowerCase();
      const genreAr = String(game.genreAr || "").toLowerCase();

      const description = String(
        game.description || ""
      ).toLowerCase();

      const descriptionAr = String(
        game.descriptionAr || ""
      ).toLowerCase();

      const matchesSearch =
        name.includes(searchText) ||
        genre.includes(searchText) ||
        description.includes(searchText) ||
        genreAr.includes(searchText) ||
        descriptionAr.includes(searchText);

      return matchesPlatform && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;

      if (sortOption === "low") return priceA - priceB;
      if (sortOption === "high") return priceB - priceA;

      if (sortOption === "name") {
        return String(a.name || "").localeCompare(
          String(b.name || "")
        );
      }

      return 0;
    });

  return (
    <div className="store-page">
      <div className="store-atmosphere" aria-hidden="true">
        <span className="store-orb orb-one"></span>
        <span className="store-orb orb-two"></span>
        <span className="store-orb orb-three"></span>
        <div className="store-grid-bg"></div>
      </div>


      <section className="store-container">
        <div className="store-header">
          <span className="store-subtitle">
            {isArabic
              ? "اكتشف عالم الألعاب"
              : "DISCOVER YOUR NEXT GAME"}
          </span>

          <h1>
            {isArabic ? "متجر الألعاب" : "GAME STORE"}
          </h1>

          <p>
            {isArabic
              ? "اكتشف أفضل ألعاب الكمبيوتر وبلايستيشن."
              : "Explore the best PC and PlayStation games."}
          </p>
        </div>

        <div className="store-controls">
          <div className="store-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder={
                isArabic
                  ? "ابحث عن لعبة..."
                  : "Search for a game..."
              }
              value={searchTerm}
              onChange={(e) =>
                handleSearchChange(e.target.value)
              }
            />
          </div>

          <select
            className="store-sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">
              {isArabic
                ? "الترتيب الافتراضي"
                : "Default Sorting"}
            </option>

            <option value="low">
              {isArabic
                ? "السعر: من الأقل للأعلى"
                : "Price: Low to High"}
            </option>

            <option value="high">
              {isArabic
                ? "السعر: من الأعلى للأقل"
                : "Price: High to Low"}
            </option>

            <option value="name">
              {isArabic ? "الاسم" : "Name"}
            </option>
          </select>
        </div>

        <div className="store-filters">
          <button
            className={activePlatform === "all" ? "active" : ""}
            onClick={() => handlePlatformChange("all")}
          >
            {isArabic ? "كل الألعاب" : "All Games"}
          </button>

          <button
            className={activePlatform === "pc" ? "active" : ""}
            onClick={() => handlePlatformChange("pc")}
          >
            PC Games
          </button>

          <button
            className={
              activePlatform === "playstation" ? "active" : ""
            }
            onClick={() =>
              handlePlatformChange("playstation")
            }
          >
            PlayStation
          </button>
        </div>

        <div className="store-results">
          {isArabic
            ? `عدد الألعاب: ${filteredGames.length}`
            : `${filteredGames.length} Games Found`}
        </div>

        {filteredGames.length > 0 ? (
          <div className="games-grid">
            {filteredGames.map((game) => (
              <div
                className="game-card"
                key={game.id}
                onMouseMove={handleCardMove}
                onMouseLeave={resetCardMove}
              >
                <div className="game-card-glow"></div>

                <div className="game-image">
                  <img
                    src={game.image}
                    alt={game.name}
                    loading="lazy"
                  />

                  <div className="game-image-overlay"></div>

                  <span className="game-platform">
                    {game.platform === "pc"
                      ? "PC"
                      : "PlayStation"}
                  </span>

                  <span className="game-image-label">
                    {isArabic
                      ? "متاح الآن"
                      : "AVAILABLE NOW"}
                  </span>
                </div>

                <div className="game-info">
                  <span className="game-genre">
                    {isArabic
                      ? game.genreAr || game.genre
                      : game.genre}
                  </span>

                  <h3>{game.name}</h3>

                  <p>
                    {isArabic
                      ? game.descriptionAr ||
                        game.description
                      : game.description}
                  </p>

                  <div className="game-card-bottom">
                    <strong>
                      {Number(game.price) === 0
                        ? isArabic
                          ? "مجانية"
                          : "Free"
                        : `${Number(
                            game.price
                          ).toLocaleString()} EGP`}
                    </strong>

                    <Link
                      to={`/game/${game.id}`}
                      className="game-details-btn"
                    >
                      {isArabic
                        ? "التفاصيل"
                        : "View Details"}

                      <span className="details-arrow">
                        ↗
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="store-empty">
            <h2>
              {isArabic
                ? "مفيش ألعاب موجودة"
                : "No Games Found"}
            </h2>

            <p>
              {isArabic
                ? "جرب تبحث باسم لعبة تانية."
                : "Try searching for another game."}
            </p>

            <button
              onClick={() => {
                setSearchTerm("");
                setSortOption("default");
                setActivePlatform("all");
                setSearchParams({});
              }}
            >
              {isArabic
                ? "عرض كل الألعاب"
                : "Show All Games"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Store;