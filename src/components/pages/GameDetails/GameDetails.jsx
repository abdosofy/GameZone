import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import {
  FaShoppingCart,
  FaHeart,
  FaArrowLeft,
  FaDesktop,
  FaPlaystation,
  FaCheckCircle,
} from "react-icons/fa";

import Navbar from "../../Navbar/Navbar";
import { getGames } from "../../../data/games";

import "./GameDetails.css";

function GameDetails({ language, onLanguageChange }) {
  const { id } = useParams();
  const isArabic = language === "ar";

  // تحميل الألعاب من مصدر البيانات الموحد
  const [games, setGames] = useState(() => getGames());

  // تحديث الألعاب عند إضافتها أو تعديلها أو حذفها
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

  // Cart State
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("gameZoneCart") || "[]"
      );
    } catch {
      return [];
    }
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("gameZoneWishlist") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [message, setMessage] = useState("");

  // البحث عن اللعبة الحالية
  const game = games.find(
    (item) => String(item.id) === String(id)
  );

  // التأكد من وجود اللعبة في السلة والمفضلة
  const isInCart = game
    ? cart.some((item) => item.id === game.id)
    : false;

  const isInWishlist = game
    ? wishlist.includes(game.id)
    : false;

  // لو اللعبة غير موجودة
  if (!game) {
    return (
      <main className="game-details-page">
        <Navbar
          language={language}
          onLanguageChange={onLanguageChange}
        />

        <div className="game-not-found">
          <h2>
            {isArabic
              ? "اللعبة غير موجودة"
              : "Game Not Found"}
          </h2>

          <Link to="/store">
            {isArabic
              ? "العودة للمتجر"
              : "Back to Store"}
          </Link>
        </div>
      </main>
    );
  }

  // تجهيز البيانات
  const price = Number(game.price) || 0;
  const oldPrice = Number(game.oldPrice) || 0;

  const isFree = game.free === true || price === 0;

  // لا نعرض خصمًا إلا لو السعر القديم أكبر من الحالي
  const validOldPrice =
    !isFree && oldPrice > price ? oldPrice : 0;

  const discount = validOldPrice
    ? Math.round(
        ((validOldPrice - price) / validOldPrice) * 100
      )
    : 0;

  const gameGenre = isArabic
    ? game.genreAr || game.genre || "ألعاب"
    : game.genre || "Gaming";

  const gameDescription = isArabic
    ? game.descriptionAr ||
      game.description ||
      "اكتشف تجربة لعب مميزة."
    : game.description ||
      "Discover an amazing gaming experience.";

  // إضافة اللعبة إلى السلة
  const handleAddToCart = () => {
    if (isFree) return;

    const existingGame = cart.find(
      (item) => item.id === game.id
    );

    let updatedCart;

    if (existingGame) {
      updatedCart = cart.map((item) =>
        item.id === game.id
          ? {
              ...item,
              quantity: Number(item.quantity || 1) + 1,
              name: game.name,
              platform: game.platform,
              image: game.image,
              price,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id: game.id,
          name: game.name,
          platform: game.platform,
          image: game.image,
          price,
          quantity: 1,
        },
      ];
    }

    setCart(updatedCart);

    localStorage.setItem(
      "gameZoneCart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));

    setMessage(
      isArabic
        ? "تمت إضافة اللعبة إلى السلة بنجاح!"
        : "Game added to cart successfully!"
    );
  };

  // إضافة أو إزالة اللعبة من المفضلة
  const handleWishlist = () => {
    let updatedWishlist;

    if (isInWishlist) {
      updatedWishlist = wishlist.filter(
        (item) => item !== game.id
      );
    } else {
      updatedWishlist = [...wishlist, game.id];
    }

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "gameZoneWishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(new Event("wishlistUpdated"));

    setMessage(
      isInWishlist
        ? isArabic
          ? "تمت إزالة اللعبة من المفضلة"
          : "Removed from wishlist"
        : isArabic
          ? "تمت إضافة اللعبة إلى المفضلة!"
          : "Added to wishlist!"
    );
  };

  return (
    <main className="game-details-page">
      <Navbar
        language={language}
        onLanguageChange={onLanguageChange}
      />

      {/* Cinematic Hero */}
      <section className="game-cinematic-hero">
        <img
          src={game.image}
          alt={game.name}
          className="game-hero-background"
        />

        <div className="game-hero-overlay"></div>

        <div className="game-hero-content">
          <Link to="/store" className="game-back-link">
            <FaArrowLeft />

            {isArabic
              ? "العودة للمتجر"
              : "Back to Store"}
          </Link>

          <div className="game-hero-info">
            <span className="game-eyebrow">
              GAME ZONE ORIGINAL STORE
            </span>

            <h1>{game.name}</h1>

            <div className="game-hero-meta">
              <span>
                {game.platform === "pc" ? (
                  <FaDesktop />
                ) : (
                  <FaPlaystation />
                )}

                {game.platform === "pc"
                  ? "PC"
                  : "PlayStation"}
              </span>

              <span>{gameGenre}</span>

              <span>
                <FaCheckCircle />

                {isArabic
                  ? "منتج رقمي"
                  : "Digital Product"}
              </span>
            </div>

            <p className="game-hero-description">
              {gameDescription}
            </p>

            <div className="game-hero-tags">
              <span>
                {isArabic
                  ? "تجربة ألعاب مميزة"
                  : "Premium Gaming Experience"}
              </span>

              <span>
                {isArabic
                  ? "تسليم رقمي"
                  : "Digital Delivery"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Game Purchase Section */}
      <section className="game-details-container">
        <div className="game-purchase-layout">

          {/* Game Information */}
          <div className="game-extra-info">
            <span className="details-label">
              {isArabic
                ? "عن اللعبة"
                : "ABOUT THIS GAME"}
            </span>

            <h2>
              {isArabic
                ? `اكتشف عالم ${game.name}`
                : `Discover ${game.name}`}
            </h2>

            <p>{gameDescription}</p>

            <div className="game-info-features">
              <div className="game-feature">
                <FaCheckCircle />

                <div>
                  <strong>
                    {isArabic
                      ? "منتج رقمي"
                      : "Digital Product"}
                  </strong>

                  <span>
                    {isArabic
                      ? "اللعبة بصيغة رقمية"
                      : "Digital game product"}
                  </span>
                </div>
              </div>

              <div className="game-feature">
                {game.platform === "pc" ? (
                  <FaDesktop />
                ) : (
                  <FaPlaystation />
                )}

                <div>
                  <strong>
                    {isArabic
                      ? "المنصة"
                      : "Platform"}
                  </strong>

                  <span>
                    {game.platform === "pc"
                      ? "PC"
                      : "PlayStation"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Card */}
          <aside className="game-purchase-card">
            <div className="purchase-image">
              <img
                src={game.image}
                alt={game.name}
              />

              {discount > 0 && (
                <span className="details-discount">
                  -{discount}%
                </span>
              )}
            </div>

            <div className="purchase-content">
              <span className="purchase-label">
                {isArabic
                  ? "السعر الحالي"
                  : "CURRENT PRICE"}
              </span>

              <div className="details-price">
                {isFree ? (
                  <strong>
                    {isArabic
                      ? "مجانية"
                      : "FREE TO PLAY"}
                  </strong>
                ) : (
                  <>
                    <strong>
                      {price.toLocaleString()} EGP
                    </strong>

                    {validOldPrice > 0 && (
                      <span>
                        {validOldPrice.toLocaleString()} EGP
                      </span>
                    )}
                  </>
                )}
              </div>

              {discount > 0 && (
                <p className="purchase-saving">
                  {isArabic
                    ? `وفّر ${(
                        validOldPrice - price
                      ).toLocaleString()} جنيه`
                    : `Save ${(
                        validOldPrice - price
                      ).toLocaleString()} EGP`}
                </p>
              )}

              <button
                type="button"
                className="details-cart-button"
                onClick={handleAddToCart}
                disabled={isFree}
              >
                <FaShoppingCart />

                {isFree
                  ? isArabic
                    ? "لعبة مجانية"
                    : "Free to Play"
                  : isInCart
                    ? isArabic
                      ? "أضف نسخة أخرى للسلة"
                      : "Add Another to Cart"
                    : isArabic
                      ? "أضف إلى السلة"
                      : "Add to Cart"}
              </button>

              <button
                type="button"
                className={`details-wishlist-button ${
                  isInWishlist
                    ? "wishlist-active"
                    : ""
                }`}
                onClick={handleWishlist}
              >
                <FaHeart />

                {isInWishlist
                  ? isArabic
                    ? "إزالة من المفضلة"
                    : "Remove from Wishlist"
                  : isArabic
                    ? "إضافة إلى المفضلة"
                    : "Add to Wishlist"}
              </button>

              {message && (
                <p className="details-message">
                  {message}
                </p>
              )}

              <div className="purchase-guarantees">
                <div>
                  <FaCheckCircle />

                  {isArabic
                    ? "منتج رقمي"
                    : "Digital Product"}
                </div>

                <div>
                  <FaCheckCircle />

                  {isArabic
                    ? "تفاصيل واضحة للمنتج"
                    : "Clear Product Details"}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default GameDetails;