import { useCallback, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { AuthContext } from "./context/AuthContext";

import Intro from "./components/Intro/Intro";
import Background from "./components/Background/Background";
import Navbar from "./components/Navbar/Navbar";

import Home from "./components/pages/Home";
import Store from "./components/pages/Store/Store";
import GameDetails from "./components/pages/GameDetails/GameDetails";
import Cart from "./components/pages/Cart/Cart";
import Wishlist from "./components/pages/Wishlist/Wishlist";
import Checkout from "./components/pages/Checkout/Checkout";
import OrderSuccess from "./components/pages/OrderSuccess/OrderSuccess";

import Login from "./components/pages/Auth/Login";
import Register from "./components/pages/Auth/Register";

import Admin from "./components/Admin/Admin";
import Footer from "./components/Footer/Footer";

import "./App.css";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("gameZoneLanguage") || "en";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("gameZoneCurrentUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("gameZoneLanguage", newLanguage);
  };

  const getUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem("gameZoneUsers") || "[]");
      return Array.isArray(users) ? users : [];
    } catch {
      return [];
    }
  };

  const handleRegister = (newUser) => {
    const users = getUsers();

    const emailExists = users.some(
      (user) => user.email?.toLowerCase() === newUser.email.toLowerCase()
    );

    if (emailExists) {
      return {
        success: false,
        message: "هذا البريد الإلكتروني مسجل بالفعل",
      };
    }

    localStorage.setItem(
      "gameZoneUsers",
      JSON.stringify([...users, newUser])
    );

    return {
      success: true,
      message: "تم إنشاء الحساب بنجاح",
    };
  };

  const handleLogin = (email, password) => {
    const users = getUsers();

    const user = users.find(
      (item) =>
        item.email?.toLowerCase() === email.toLowerCase() &&
        item.password === password
    );

    if (!user) {
      return {
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      };
    }

    const loggedInUser = {
      name: user.name,
      email: user.email,
    };

    localStorage.setItem(
      "gameZoneCurrentUser",
      JSON.stringify(loggedInUser)
    );

    setCurrentUser(loggedInUser);

    return {
      success: true,
      user: loggedInUser,
    };
  };

  const handleLogout = () => {
    localStorage.removeItem("gameZoneCurrentUser");
    setCurrentUser(null);
  };

  if (showIntro) {
    return <Intro onComplete={handleIntroComplete} />;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        onLogout: handleLogout,
      }}
    >
      <div className="app">
        <Background />

        {!isAdmin && (
          <Navbar
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        )}

        <div
          className="page-transition"
          key={location.pathname + location.search}
        >
          <Routes location={location}>
            <Route
              path="/"
              element={
                <Home
                  language={language}
                  onLanguageChange={handleLanguageChange}
                />
              }
            />

            <Route
              path="/store"
              element={
                <Store
                  language={language}
                  onLanguageChange={handleLanguageChange}
                />
              }
            />

            <Route
              path="/game/:id"
              element={
                <GameDetails
                  language={language}
                  onLanguageChange={handleLanguageChange}
                />
              }
            />

            <Route
              path="/cart"
              element={
                <Cart
                  language={language}
                  onLanguageChange={handleLanguageChange}
                />
              }
            />

            <Route
              path="/wishlist"
              element={
                <Wishlist
                  language={language}
                  onLanguageChange={handleLanguageChange}
                />
              }
            />

            <Route
              path="/checkout"
              element={
                <Checkout
                  language={language}
                  onLanguageChange={handleLanguageChange}
                />
              }
            />

            <Route
              path="/order-success"
              element={
                <OrderSuccess
                  language={language}
                  onLanguageChange={handleLanguageChange}
                />
              }
            />

            <Route
              path="/login"
              element={
                <Login
                  language={language}
                  onLogin={handleLogin}
                  currentUser={currentUser}
                />
              }
            />

            <Route
              path="/register"
              element={
                <Register
                  language={language}
                  onRegister={handleRegister}
                />
              }
            />

            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>

        {!isAdmin && <Footer language={language} />}
      </div>
    </AuthContext.Provider>
  );
}

export default App;