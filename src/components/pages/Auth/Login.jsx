import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaGamepad,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaSignInAlt,
} from "react-icons/fa";

import "./Login.css";

function Login({ language, onLogin, currentUser }) {
  const isArabic = language === "ar";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const content = {
    en: {
      welcome: "WELCOME BACK",
      title: "Sign In",
      subtitle: "Enter your account and continue your adventure.",
      email: "Email Address",
      password: "Password",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      button: "SIGN IN",
      noAccount: "Don't have an account?",
      register: "Create Account",
      emailError: "Please enter a valid email.",
      passwordError: "Please enter your password.",
      loginError: "Email or password is incorrect.",
      alreadyLogged: "You are already signed in.",
      continue: "Continue to Store",
      secure: "Your gaming world is waiting",
    },
    ar: {
      welcome: "مرحباً بعودتك",
      title: "تسجيل الدخول",
      subtitle: "سجل دخولك واستكمل مغامرتك في عالم الألعاب.",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      emailPlaceholder: "اكتب بريدك الإلكتروني",
      passwordPlaceholder: "اكتب كلمة المرور",
      button: "تسجيل الدخول",
      noAccount: "ليس لديك حساب؟",
      register: "إنشاء حساب جديد",
      emailError: "من فضلك أدخل بريدًا إلكترونيًا صحيحًا.",
      passwordError: "من فضلك أدخل كلمة المرور.",
      loginError: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      alreadyLogged: "أنت مسجل الدخول بالفعل.",
      continue: "الانتقال إلى المتجر",
      secure: "عالم الألعاب في انتظارك",
    },
  };

  const t = content[isArabic ? "ar" : "en"];

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      setError(t.emailError);
      return;
    }

    if (!password) {
      setError(t.passwordError);
      return;
    }

    const result = onLogin(cleanEmail, password);

    if (!result.success) {
      setError(t.loginError);
      return;
    }

    navigate("/");
  };

  if (currentUser) {
    return (
      <div className="login-page">
        <div className="login-glow login-glow-one"></div>
        <div className="login-glow login-glow-two"></div>

        <div className="login-card login-already-card">
          <div className="login-icon">
            <FaGamepad />
          </div>

          <h1>{t.alreadyLogged}</h1>

          <p>
            {isArabic
              ? `أهلاً ${currentUser.name}`
              : `Welcome ${currentUser.name}`}
          </p>

          <button
            className="login-submit"
            onClick={() => navigate("/store")}
          >
            {t.continue}
            <FaArrowRight />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>
      <div className="login-grid"></div>

      <div className="login-container">
        <Link to="/" className="login-logo">
          <span className="login-logo-icon">
            <FaGamepad />
          </span>

          <span>
            GAME<span>ZONE</span>
          </span>
        </Link>

        <div className="login-card">
          <div className="login-card-top">
            <div className="login-icon">
              <FaSignInAlt />
            </div>

            <span className="login-welcome">
              {t.welcome}
            </span>

            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label>{t.email}</label>

              <div className="login-input-wrapper">
                <FaEnvelope className="login-input-icon" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  placeholder={t.emailPlaceholder}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="login-input-group">
              <label>{t.password}</label>

              <div className="login-input-wrapper">
                <FaLock className="login-input-icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder={t.passwordPlaceholder}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button type="submit" className="login-submit">
              <span>{t.button}</span>
              <FaArrowRight />
            </button>
          </form>

          <div className="login-register">
            <span>{t.noAccount}</span>
            <Link to="/register">{t.register}</Link>
          </div>
        </div>

        <div className="login-footer-text">
          <span></span>
          {t.secure}
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default Login;