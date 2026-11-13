import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiSearch,
  FiChevronDown,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

const countries = [
  { code: "EG", name: "Egypt", arName: "مصر", flag: "🇪🇬", currency: "EGP" },
  { code: "SA", name: "Saudi Arabia", arName: "السعودية", flag: "🇸🇦", currency: "SAR" },
  { code: "AE", name: "United Arab Emirates", arName: "الإمارات", flag: "🇦🇪", currency: "AED" },
  { code: "US", name: "United States", arName: "الولايات المتحدة", flag: "🇺🇸", currency: "USD" },
  { code: "GB", name: "United Kingdom", arName: "بريطانيا", flag: "🇬🇧", currency: "GBP" },
  { code: "DE", name: "Germany", arName: "ألمانيا", flag: "🇩🇪", currency: "EUR" },
  { code: "FR", name: "France", arName: "فرنسا", flag: "🇫🇷", currency: "EUR" },
];

function Navbar({ language = "en", onLanguageChange }) {
  const isArabic = language === "ar";
  const navigate = useNavigate();

  const { currentUser, onLogout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // CART COUNT
  const [cartCount, setCartCount] = useState(() => {
    try {
      const cart = JSON.parse(
        localStorage.getItem("gameZoneCart") || "[]"
      );

      return cart.reduce(
        (total, item) => total + Number(item.quantity || 1),
        0
      );
    } catch {
      return 0;
    }
  });

  // WISHLIST COUNT
  const [wishlistCount, setWishlistCount] = useState(() => {
    try {
      const wishlist = JSON.parse(
        localStorage.getItem("gameZoneWishlist") || "[]"
      );

      return wishlist.length;
    } catch {
      return 0;
    }
  });

  // UPDATE CART COUNT
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(
          localStorage.getItem("gameZoneCart") || "[]"
        );

        const count = cart.reduce(
          (total, item) => total + Number(item.quantity || 1),
          0
        );

        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // UPDATE WISHLIST COUNT
  useEffect(() => {
    const updateWishlistCount = () => {
      try {
        const wishlist = JSON.parse(
          localStorage.getItem("gameZoneWishlist") || "[]"
        );

        setWishlistCount(wishlist.length);
      } catch {
        setWishlistCount(0);
      }
    };

    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("wishlistUpdated", updateWishlistCount);

    return () => {
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
    };
  }, []);

  // COUNTRY
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const savedCountry = localStorage.getItem("gameZoneCountry") || "EG";

    return countries.some((country) => country.code === savedCountry)
      ? savedCountry
      : "EG";
  });

  const currentCountry =
    countries.find((country) => country.code === selectedCountry) ||
    countries[0];

  // CLOSE MOBILE MENU
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // LOGOUT
  const handleLogout = () => {
    onLogout();
    setAccountOpen(false);
    closeMenu();
    navigate("/");
  };

  // SEARCH TOGGLE
  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
    setCountryOpen(false);
    setAccountOpen(false);
    closeMenu();
  };

  // COUNTRY SELECT
  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    localStorage.setItem("gameZoneCountry", countryCode);
    setCountryOpen(false);
  };

  // SEARCH GAMES
  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchValue.trim();

    if (!query) return;

    navigate(`/store?search=${encodeURIComponent(query)}`);

    setSearchOpen(false);
    setSearchValue("");
    closeMenu();
  };

  // LANGUAGE
  const toggleLanguage = () => {
    const newLanguage = isArabic ? "en" : "ar";

    onLanguageChange?.(newLanguage);

    closeMenu();
    setCountryOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  };

  return (
    <header className="navbar">

      {/* LOGO */}
      <Link to="/" className="nav-logo" onClick={closeMenu}>
        GAME <span>ZONE</span>
      </Link>

      {/* MOBILE MENU BUTTON */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* NAVIGATION LINKS */}
      <nav className={`nav-links ${menuOpen ? "active" : ""}`}>

        <Link to="/" onClick={closeMenu}>
          {isArabic ? "الرئيسية" : "Home"}
        </Link>

        <Link to="/store" onClick={closeMenu}>
          {isArabic ? "المتجر" : "Store"}
        </Link>

        <Link to="/store?platform=pc" onClick={closeMenu}>
          {isArabic ? "ألعاب الكمبيوتر" : "PC Games"}
        </Link>

        <Link to="/store?platform=playstation" onClick={closeMenu}>
          {isArabic ? "بلايستيشن" : "PlayStation"}
        </Link>

      </nav>

      {/* NAV ACTIONS */}
      <div className="nav-actions">

        {/* COUNTRY */}
        <div className="country-selector">

          <button
            className={`country-toggle ${countryOpen ? "active" : ""}`}
            onClick={() => {
              setCountryOpen((prev) => !prev);
              setSearchOpen(false);
              setAccountOpen(false);
              closeMenu();
            }}
            aria-label={isArabic ? "اختيار الدولة" : "Choose country"}
            aria-expanded={countryOpen}
          >
            <span className="country-current-flag">
              {currentCountry.flag}
            </span>

            <FiChevronDown className="country-arrow" />
          </button>

          <div
            className={`country-dropdown ${
              countryOpen ? "country-dropdown-active" : ""
            }`}
          >
            <p className="country-dropdown-title">
              {isArabic ? "اختر الدولة" : "SELECT COUNTRY"}
            </p>

            {countries.map((country) => (
              <button
                key={country.code}
                className={`country-option ${
                  selectedCountry === country.code ? "selected" : ""
                }`}
                onClick={() => handleCountrySelect(country.code)}
              >
                <span className="country-option-flag">
                  {country.flag}
                </span>

                <span className="country-option-name">
                  {isArabic ? country.arName : country.name}
                </span>

                <span className="country-currency">
                  {country.currency}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* LANGUAGE */}
        <button
          className="language-toggle"
          onClick={toggleLanguage}
          aria-label={isArabic ? "Switch to English" : "التغيير للعربية"}
        >
          {isArabic ? "EN" : "AR"}
        </button>

        {/* SEARCH */}
        <button
          className={`nav-icon search-toggle ${searchOpen ? "active" : ""}`}
          onClick={toggleSearch}
          aria-label={isArabic ? "البحث" : "Toggle search"}
          aria-expanded={searchOpen}
        >
          {searchOpen ? <FiX /> : <FiSearch />}
        </button>

        {/* WISHLIST */}
        <Link
          to="/wishlist"
          className="nav-icon wishlist-icon"
          aria-label={`${isArabic ? "المفضلة" : "Wishlist"}: ${wishlistCount}`}
          onClick={closeMenu}
        >
          <FiHeart />
          <small>{wishlistCount}</small>
        </Link>

        {/* CART */}
        <Link
          to="/cart"
          className="nav-icon cart-icon"
          aria-label={`${isArabic ? "سلة التسوق" : "Shopping cart"}: ${cartCount}`}
          onClick={closeMenu}
        >
          <FiShoppingCart />
          <small>{cartCount}</small>
        </Link>

        {/* ACCOUNT */}
        {currentUser ? (
          <div className="account-menu">

            <button
              className={`account-toggle ${
                accountOpen ? "active" : ""
              }`}
              onClick={() => {
                setAccountOpen((prev) => !prev);
                setCountryOpen(false);
                setSearchOpen(false);
                closeMenu();
              }}
              aria-expanded={accountOpen}
            >
              <FiUser className="account-user-icon" />

              <span className="account-user-name">
                {currentUser.name}
              </span>

              <FiChevronDown className="account-arrow" />
            </button>

            <div
              className={`account-dropdown ${
                accountOpen ? "account-dropdown-active" : ""
              }`}
            >
              <div className="account-info">

                <div className="account-avatar">
                  <FiUser />
                </div>

                <div>
                  <strong>{currentUser.name}</strong>
                  <span>{currentUser.email}</span>
                </div>

              </div>

              <div className="account-divider"></div>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                <FiLogOut />
                {isArabic ? "تسجيل الخروج" : "LOG OUT"}
              </button>
            </div>

          </div>
        ) : (
          <div className="auth-buttons">

            <Link
              to="/login"
              className="login-btn"
              onClick={closeMenu}
            >
              {isArabic ? "تسجيل الدخول" : "SIGN IN"}
            </Link>

            <Link
              to="/register"
              className="register-btn"
              onClick={closeMenu}
            >
              {isArabic ? "إنشاء حساب" : "JOIN US"}
            </Link>

          </div>
        )}

      </div>

      {/* SEARCH PANEL */}
      <div className={`search-panel ${searchOpen ? "search-active" : ""}`}>

        <form className="search-form" onSubmit={handleSearch}>

          <FiSearch className="search-input-icon" />

          <input
            type="text"
            placeholder={
              isArabic
                ? "ابحث عن لعبتك المفضلة..."
                : "Search for your favorite games..."
            }
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <button type="submit" className="search-submit">
            {isArabic ? "بحث" : "SEARCH"}
          </button>

        </form>

      </div>

    </header>
  );
}

export default Navbar;