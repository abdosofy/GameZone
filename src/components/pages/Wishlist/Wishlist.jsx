import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  FaHeart,
  FaTrash,
  FaArrowRight,
  FaGamepad,
  FaDesktop,
  FaPlaystation,
  FaShoppingCart,
} from "react-icons/fa";

import "./Wishlist.css";

// Games Data
const games = [
  {
    id: "valorant",
    name: "VALORANT",
    platform: "pc",
    image: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/fullportrait.png",
    price: 0,
    free: true,
  },
  {
    id: "cyberpunk-2077",
    name: "Cyberpunk 2077",
    platform: "pc",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
    price: 999,
  },
  {
    id: "elden-ring",
    name: "Elden Ring",
    platform: "pc",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
    price: 1190,
  },
  {
    id: "red-dead-redemption-2",
    name: "Red Dead Redemption 2",
    platform: "pc",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
    price: 1200,
  },
  {
    id: "god-of-war-ragnarok",
    name: "God of War Ragnarök",
    platform: "playstation",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/header.jpg",
    price: 1250,
  },
  {
    id: "the-last-of-us-part-i",
    name: "The Last of Us Part I",
    platform: "playstation",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/header.jpg",
    price: 1260,
  },
  {
    id: "spider-man-remastered",
    name: "Marvel's Spider-Man Remastered",
    platform: "playstation",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg",
    price: 1100,
  },
  {
    id: "ghost-of-tsushima",
    name: "Ghost of Tsushima",
    platform: "playstation",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/header.jpg",
    price: 1350,
  },
  {
    id: "grand-theft-auto-v",
    name: "Grand Theft Auto V",
    platform: "pc",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
    price: 650,
  },
  {
    id: "forza-horizon-5",
    name: "Forza Horizon 5",
    platform: "pc",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg",
    price: 850,
  },
  {
    id: "doom-eternal",
    name: "DOOM Eternal",
    platform: "pc",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/782330/header.jpg",
    price: 550,
  },
  {
    id: "sekiro",
    name: "Sekiro: Shadows Die Twice",
    platform: "pc",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg",
    price: 750,
  },
  {
    id: "dying-light-2",
    name: "Dying Light 2",
    platform: "pc",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/534380/header.jpg",
    price: 700,
  },
  {
    id: "lies-of-p",
    name: "Lies of P",
    platform: "pc",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/header.jpg",
    price: 900,
  },
  {
    id: "spider-man-miles-morales",
    name: "Marvel's Spider-Man: Miles Morales",
    platform: "playstation",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1817190/header.jpg",
    price: 950,
  },
  {
    id: "ratchet-and-clank",
    name: "Ratchet & Clank: Rift Apart",
    platform: "playstation",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1895880/header.jpg",
    price: 1100,
  },
  {
    id: "returnal",
    name: "Returnal",
    platform: "playstation",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1649240/header.jpg",
    price: 1000,
  },
  {
    id: "sackboy",
    name: "Sackboy: A Big Adventure",
    platform: "playstation",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1599660/header.jpg",
    price: 650,
  },
  {
    id: "stellar-blade",
    name: "Stellar Blade",
    platform: "playstation",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/3489700/header.jpg",
    price: 1350,
  },
  {
    id: "last-of-us-part-ii",
    name: "The Last of Us Part II Remastered",
    platform: "playstation",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2531310/header.jpg",
    price: 1250,
  },
  {
    id: "counter-strike-2",
    name: "Counter-Strike 2",
    platform: "pc",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
    price: 450,
  },
  {
    id: "hogwarts-legacy",
    name: "Hogwarts Legacy",
    platform: "playstation",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg",
    price: 900,
  },
  {
    id: "resident-evil-4",
    name: "Resident Evil 4",
    platform: "pc",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg",
    price: 850,
  },
  {
    id: "witcher-3",
    name: "The Witcher 3",
    platform: "pc",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
    price: 700,
  },
  {
    id: "black-myth-wukong",
    name: "Black Myth: Wukong",
    platform: "pc",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2358720/header.jpg",
    price: 1450,
  },
];

function Wishlist({ language, onLanguageChange }) {
  const isArabic = language === "ar";

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("gameZoneWishlist") || "[]"
      );
    } catch {
      return [];
    }
  });

  // Listen for wishlist changes
  useEffect(() => {
    const updateWishlist = () => {
      try {
        setWishlist(
          JSON.parse(
            localStorage.getItem("gameZoneWishlist") || "[]"
          )
        );
      } catch {
        setWishlist([]);
      }
    };

    window.addEventListener("wishlistUpdated", updateWishlist);
    window.addEventListener("storage", updateWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlist);
      window.removeEventListener("storage", updateWishlist);
    };
  }, []);

  // Get full game information
  const wishlistGames = games.filter((game) =>
    wishlist.includes(game.id)
  );

  // Remove one game
  const removeFromWishlist = (gameId) => {
    const updatedWishlist = wishlist.filter(
      (id) => id !== gameId
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "gameZoneWishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  // Clear all games
  const clearWishlist = () => {
    setWishlist([]);

    localStorage.setItem(
      "gameZoneWishlist",
      JSON.stringify([])
    );

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <main className="wishlist-page">

      <section className="wishlist-container">

        {/* Page Heading */}
        <div className="wishlist-heading">
          <span className="wishlist-label">
            {isArabic ? "مجموعتك الخاصة" : "YOUR COLLECTION"}
          </span>

          <h1>
            {isArabic ? "قائمة المفضلة" : "My Wishlist"}
            <FaHeart />
          </h1>

          <p>
            {isArabic
              ? "احتفظ بألعابك المفضلة واجمعها في مكان واحد."
              : "Save your favorite games and keep them in one place."}
          </p>
        </div>

        {wishlistGames.length === 0 ? (
          /* Empty Wishlist */
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">
              <FaHeart />
            </div>

            <h2>
              {isArabic
                ? "قائمة المفضلة فارغة"
                : "Your Wishlist Is Empty"}
            </h2>

            <p>
              {isArabic
                ? "لسه مفيش ألعاب هنا. اكتشف الألعاب وضيف اللي يعجبك!"
                : "No games here yet. Explore our store and save your favorites!"}
            </p>

            <Link to="/store" className="wishlist-store-btn">
              <FaGamepad />
              {isArabic ? "تصفح الألعاب" : "Explore Games"}
            </Link>
          </div>
        ) : (
          /* Wishlist Content */
          <div className="wishlist-content">

            <div className="wishlist-top">
              <div>
                <span className="wishlist-count">
                  {wishlistGames.length}
                </span>

                <span>
                  {isArabic ? " لعبة في المفضلة" : " Games Saved"}
                </span>
              </div>

              <button
                type="button"
                className="wishlist-clear-btn"
                onClick={clearWishlist}
              >
                <FaTrash />
                {isArabic ? "مسح الكل" : "Clear All"}
              </button>
            </div>

            <div className="wishlist-grid">
              {wishlistGames.map((game) => (
                <article
                  className="wishlist-card"
                  key={game.id}
                >
                  <div className="wishlist-card-image">
                    <img
                      src={game.image}
                      alt={game.name}
                    />

                    <span className="wishlist-platform">
                      {game.platform === "pc" ? (
                        <>
                          <FaDesktop />
                          PC
                        </>
                      ) : (
                        <>
                          <FaPlaystation />
                          PlayStation
                        </>
                      )}
                    </span>

                    <button
                      type="button"
                      className="wishlist-remove-btn"
                      onClick={() => removeFromWishlist(game.id)}
                      aria-label="Remove from wishlist"
                      title={isArabic ? "إزالة من المفضلة" : "Remove"}
                    >
                      <FaHeart />
                    </button>
                  </div>

                  <div className="wishlist-card-info">
                    <h3>{game.name}</h3>

                    <div className="wishlist-card-bottom">
                      <div className="wishlist-price">
                        {game.free ? (
                          <strong>
                            {isArabic ? "مجانية" : "FREE"}
                          </strong>
                        ) : (
                          <strong>{game.price} EGP</strong>
                        )}
                      </div>

                      <Link
                        to={`/game/${game.id}`}
                        className="wishlist-view-btn"
                      >
                        {isArabic ? "التفاصيل" : "Details"}
                        <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Wishlist;