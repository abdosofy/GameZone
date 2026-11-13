import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGamepad,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import "./Register.css";

function Register({ language, onRegister }) {
  const isArabic = language === "ar";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const content = {
    en: {
      welcome: "JOIN THE BATTLE",
      title: "Create Account",
      subtitle: "Your next gaming adventure starts here.",
      name: "Full Name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      namePlaceholder: "Enter your full name",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Create a password",
      confirmPlaceholder: "Confirm your password",
      button: "CREATE ACCOUNT",
      haveAccount: "Already have an account?",
      login: "Sign In",
      nameError: "Please enter your name.",
      emailError: "Please enter a valid email.",
      passwordError: "Password must be at least 6 characters.",
      confirmError: "Passwords do not match.",
      duplicateError: "This email is already registered.",
      generalError: "Something went wrong. Please try again.",
      success: "Account created successfully!",
      redirect: "Redirecting to login...",
      secure: "Your gaming journey starts now",
      terms: "By creating an account, you agree to our Terms & Conditions.",
    },
    ar: {
      welcome: "انضم إلى المعركة",
      title: "إنشاء حساب جديد",
      subtitle: "مغامرتك القادمة في عالم الألعاب تبدأ من هنا.",
      name: "الاسم بالكامل",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      namePlaceholder: "اكتب اسمك بالكامل",
      emailPlaceholder: "اكتب بريدك الإلكتروني",
      passwordPlaceholder: "أنشئ كلمة مرور",
      confirmPlaceholder: "أعد كتابة كلمة المرور",
      button: "إنشاء الحساب",
      haveAccount: "لديك حساب بالفعل؟",
      login: "تسجيل الدخول",
      nameError: "من فضلك اكتب اسمك.",
      emailError: "البريد الإلكتروني غير صحيح.",
      passwordError: "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
      confirmError: "كلمتا المرور غير متطابقتين.",
      duplicateError: "هذا البريد الإلكتروني مسجل بالفعل.",
      generalError: "حدث خطأ، حاول مرة أخرى.",
      success: "تم إنشاء الحساب بنجاح!",
      redirect: "جاري تحويلك لتسجيل الدخول...",
      secure: "رحلتك في عالم الألعاب تبدأ الآن",
      terms: "بإنشاء حساب، أنت توافق على الشروط والأحكام.",
    },
  };

  const t = content[isArabic ? "ar" : "en"];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();

    if (!name) {
      setError(t.nameError);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError(t.emailError);
      return;
    }

    if (formData.password.length < 6) {
      setError(t.passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.confirmError);
      return;
    }

    const result = onRegister({
      name,
      email,
      password: formData.password,
      createdAt: new Date().toISOString(),
    });

    if (!result.success) {
      setError(
        result.message === "هذا البريد الإلكتروني مسجل بالفعل"
          ? t.duplicateError
          : t.generalError
      );
      return;
    }

    setSuccess(t.success);

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="register-page">
      <div className="register-glow register-glow-one"></div>
      <div className="register-glow register-glow-two"></div>
      <div className="register-grid"></div>

      <div className="register-container">
        <Link to="/" className="register-logo">
          <span className="register-logo-icon">
            <FaGamepad />
          </span>
          <span>
            GAME<span>ZONE</span>
          </span>
        </Link>

        <div className="register-card">
          <div className="register-card-top">
            <div className="register-icon">
              <FaGamepad />
            </div>

            <span className="register-welcome">
              {t.welcome}
            </span>

            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-input-group">
              <label>{t.name}</label>

              <div className="register-input-wrapper">
                <FaUser className="register-input-icon" />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.namePlaceholder}
                  autoComplete="name"
                  required
                  disabled={!!success}
                />
              </div>
            </div>

            <div className="register-input-group">
              <label>{t.email}</label>

              <div className="register-input-wrapper">
                <FaEnvelope className="register-input-icon" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.emailPlaceholder}
                  autoComplete="email"
                  required
                  disabled={!!success}
                />
              </div>
            </div>

            <div className="register-input-group">
              <label>{t.password}</label>

              <div className="register-input-wrapper">
                <FaLock className="register-input-icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t.passwordPlaceholder}
                  autoComplete="new-password"
                  required
                  disabled={!!success}
                />

                <button
                  type="button"
                  className="register-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="register-input-group">
              <label>{t.confirmPassword}</label>

              <div className="register-input-wrapper">
                <FaLock className="register-input-icon" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t.confirmPlaceholder}
                  autoComplete="new-password"
                  required
                  disabled={!!success}
                />

                <button
                  type="button"
                  className="register-eye"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="register-message register-error">
                {error}
              </div>
            )}

            {success && (
              <div className="register-message register-success">
                <FaCheckCircle />
                <span>{t.success}</span>
              </div>
            )}

            <button
              type="submit"
              className="register-submit"
              disabled={!!success}
            >
              <span>{success ? t.redirect : t.button}</span>
              <FaArrowRight />
            </button>
          </form>

          <div className="register-terms">
            {t.terms}
          </div>

          <div className="register-login">
            <span>{t.haveAccount}</span>
            <Link to="/login">{t.login}</Link>
          </div>
        </div>

        <div className="register-footer-text">
          <span></span>
          {t.secure}
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default Register;