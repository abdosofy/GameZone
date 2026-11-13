import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  FaLock,
  FaCreditCard,
  FaTrash,
  FaArrowLeft,
  FaCheckCircle,
  FaGamepad,
  FaTag,
  FaPhone,
} from "react-icons/fa";
import "./Checkout.css";

function Checkout({ language, onLanguageChange }) {
  const isArabic = language === "ar";
  const navigate = useNavigate();
  const location = useLocation();

  // بيانات الكوبون القادمة من Cart
  const discount = Number(location.state?.discount || 0);
  const couponCode = location.state?.couponCode || "";

  // بيانات السلة
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("gameZoneCart") || "[]"
      );
    } catch {
      return [];
    }
  });

  // بيانات العميل
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // طريقة الدفع
  const [paymentMethod, setPaymentMethod] = useState("card");

  // بيانات البطاقة التجريبية
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  // تحديث السلة
  useEffect(() => {
    const updateCart = () => {
      try {
        setCart(
          JSON.parse(
            localStorage.getItem("gameZoneCart") || "[]"
          )
        );
      } catch {
        setCart([]);
      }
    };

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  // المجموع قبل الخصم
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  // قيمة الخصم
  const discountAmount = subtotal * (discount / 100);

  // الإجمالي النهائي
  const total = subtotal - discountAmount;

  // تحديث بيانات العميل
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // حذف منتج من الطلب
  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(updatedCart);

    localStorage.setItem(
      "gameZoneCart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // تأكيد الطلب وحفظه في سجل الطلبات
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cart.length) return;

    // إنشاء الطلب
    const order = {
      id: `GZ-${Date.now()}`,

      customer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
      },

      paymentMethod,
      items: [...cart],
      subtotal,
      discount,
      couponCode,
      discountAmount,
      total,
      date: new Date().toISOString(),
      status: "pending",
    };

    try {
      // حفظ آخر طلب لصفحة نجاح الطلب
      localStorage.setItem(
        "gameZoneLastOrder",
        JSON.stringify(order)
      );

      // قراءة الطلبات السابقة
      const savedOrders = JSON.parse(
        localStorage.getItem("gameZoneOrders") || "[]"
      );

      // إضافة الطلب الجديد
      const updatedOrders = [
        order,
        ...(Array.isArray(savedOrders) ? savedOrders : []),
      ];

      // حفظ سجل الطلبات بالكامل
      localStorage.setItem(
        "gameZoneOrders",
        JSON.stringify(updatedOrders)
      );

      // تفريغ السلة
      localStorage.setItem(
        "gameZoneCart",
        JSON.stringify([])
      );

      setCart([]);

      window.dispatchEvent(new Event("cartUpdated"));

      // الانتقال لصفحة نجاح الطلب
      navigate("/order-success");
    } catch (error) {
      console.error("Order saving error:", error);

      alert(
        isArabic
          ? "حصلت مشكلة أثناء حفظ الطلب. حاول مرة تانية."
          : "There was a problem saving your order. Please try again."
      );
    }
  };

  return (
    <div className="checkout-page">


      <div className="checkout-container">

        {/* HEADER */}

        <div className="checkout-heading">

          <span className="checkout-label">
            {isArabic ? "الخطوة الأخيرة" : "FINAL STEP"}
          </span>

          <h1>
            {isArabic ? "إتمام الشراء" : "Checkout"}
          </h1>

          <p>
            {isArabic
              ? "راجع طلبك وأدخل بياناتك لإتمام العملية."
              : "Review your order and enter your details."}
          </p>

        </div>

        {cart.length === 0 ? (

          <div className="checkout-empty">

            <FaGamepad />

            <h2>
              {isArabic
                ? "سلتك فارغة"
                : "Your cart is empty"}
            </h2>

            <Link to="/store">
              {isArabic ? "تصفح الألعاب" : "Browse Games"}
            </Link>

          </div>

        ) : (

          <form
            className="checkout-layout"
            onSubmit={handleSubmit}
          >

            {/* MAIN */}

            <div className="checkout-main">

              {/* CUSTOMER INFORMATION */}

              <section className="checkout-card">

                <h2>
                  {isArabic
                    ? "بيانات العميل"
                    : "Customer Information"}
                </h2>

                <label>
                  {isArabic ? "الاسم بالكامل" : "Full Name"}
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder={
                    isArabic ? "اكتب اسمك" : "Enter your name"
                  }
                  value={customer.name}
                  onChange={handleCustomerChange}
                  required
                />

                <label>
                  {isArabic
                    ? "البريد الإلكتروني"
                    : "Email Address"}
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={customer.email}
                  onChange={handleCustomerChange}
                  required
                />

                {/* PHONE NUMBER */}

                <label>
                  {isArabic ? "رقم الهاتف" : "Phone Number"}
                </label>

                <div className="checkout-phone-input">

                  <FaPhone />

                  <input
                    type="tel"
                    name="phone"
                    inputMode="tel"
                    placeholder={
                      isArabic
                        ? "مثال: 01012345678"
                        : "Example: +201012345678"
                    }
                    value={customer.phone}
                    onChange={handleCustomerChange}
                    required
                  />

                </div>

                <p className="checkout-phone-note">
                  {isArabic
                    ? "هنستخدم الرقم ده للتواصل معاك بخصوص طلبك وإرسال رسالة التأكيد بعد ربط خدمة الرسائل."
                    : "We'll use this number for order updates and confirmation messages once messaging is connected."}
                </p>

              </section>

              {/* PAYMENT METHOD */}

              <section className="checkout-card">

                <h2>
                  {isArabic
                    ? "طريقة الدفع"
                    : "Payment Method"}
                </h2>

                <label className="payment-option">

                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <FaCreditCard />

                  <span>
                    {isArabic
                      ? "بطاقة بنكية Visa"
                      : "Visa / Credit / Debit Card"}
                  </span>

                </label>

                <label className="payment-option">

                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <FaLock />

                  <span>
                    {isArabic
                      ? "الدفع عند تأكيد الطلب"
                      : "Pay on Order Confirmation"}
                  </span>

                </label>

                <p className="checkout-payment-note">
                  {isArabic
                    ? "الدفع تجريبي حاليًا، ولم يتم ربط بوابة دفع حقيقية."
                    : "Payment is currently a demo. No real payment is processed."}
                </p>

              </section>

              {/* VISA CARD DETAILS */}

              {paymentMethod === "card" && (

                <section className="checkout-card visa-section">

                  <h2>
                    {isArabic
                      ? "بيانات البطاقة البنكية"
                      : "Card Details"}
                  </h2>

                  {/* CARD PREVIEW */}

                  <div className="visa-preview">

                    <div className="visa-preview-top">
                      <span>GAME ZONE</span>
                      <strong>VISA</strong>
                    </div>

                    <div className="visa-preview-number">
                      {cardDetails.cardNumber ||
                        "•••• •••• •••• ••••"}
                    </div>

                    <div className="visa-preview-bottom">

                      <div>
                        <small>CARD HOLDER</small>
                        <strong>
                          {cardDetails.cardName || "YOUR NAME"}
                        </strong>
                      </div>

                      <div>
                        <small>EXPIRES</small>
                        <strong>
                          {cardDetails.expiry || "MM/YY"}
                        </strong>
                      </div>

                    </div>

                  </div>

                  {/* CARD NUMBER */}

                  <label>
                    {isArabic ? "رقم البطاقة" : "Card Number"}
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardDetails.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 16)
                        .replace(/(.{4})/g, "$1 ")
                        .trim();

                      setCardDetails((previous) => ({
                        ...previous,
                        cardNumber: value,
                      }));
                    }}
                    required
                  />

                  {/* CARD HOLDER */}

                  <label>
                    {isArabic
                      ? "اسم صاحب البطاقة"
                      : "Card Holder Name"}
                  </label>

                  <input
                    type="text"
                    autoComplete="off"
                    placeholder={
                      isArabic
                        ? "الاسم الموجود على البطاقة"
                        : "Name on card"
                    }
                    value={cardDetails.cardName}
                    onChange={(e) =>
                      setCardDetails((previous) => ({
                        ...previous,
                        cardName: e.target.value,
                      }))
                    }
                    required
                  />

                  {/* EXPIRY AND CVV */}

                  <div className="visa-inputs-row">

                    <div>

                      <label>
                        {isArabic
                          ? "تاريخ الانتهاء"
                          : "Expiry Date"}
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardDetails.expiry}
                        onChange={(e) => {
                          let value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);

                          if (value.length > 2) {
                            value =
                              value.slice(0, 2) +
                              "/" +
                              value.slice(2);
                          }

                          setCardDetails((previous) => ({
                            ...previous,
                            expiry: value,
                          }));
                        }}
                        required
                      />

                    </div>

                    <div>

                      <label>CVV</label>

                      <input
                        type="password"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="•••"
                        maxLength={4}
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails((previous) => ({
                            ...previous,
                            cvv: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 4),
                          }))
                        }
                        required
                      />

                    </div>

                  </div>

                  <p className="visa-security-note">
                    <FaLock />

                    {isArabic
                      ? "واجهة تجريبية فقط. لا تدخل بيانات بطاقة حقيقية."
                      : "Demo interface only. Never enter real card details."}
                  </p>

                </section>

              )}

            </div>

            {/* ORDER SUMMARY */}

            <aside className="checkout-summary">

              <h2>
                {isArabic ? "ملخص الطلب" : "Order Summary"}
              </h2>

              <div className="checkout-items">

                {cart.map((item) => (

                  <div
                    className="checkout-item"
                    key={item.id}
                  >

                    <div className="checkout-item-info">

                      <strong>{item.name}</strong>

                      <span>
                        {isArabic ? "الكمية:" : "Qty:"}{" "}
                        {item.quantity || 1}
                      </span>

                      <span>
                        $
                        {(
                          Number(item.price || 0) *
                          Number(item.quantity || 1)
                        ).toFixed(2)}
                      </span>

                    </div>

                    <button
                      type="button"
                      className="checkout-remove"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>

                  </div>

                ))}

              </div>

              {/* SUBTOTAL */}

              <div className="checkout-price-row">

                <span>
                  {isArabic ? "المجموع الفرعي" : "Subtotal"}
                </span>

                <strong>
                  ${subtotal.toFixed(2)}
                </strong>

              </div>

              {/* DISCOUNT */}

              {discount > 0 && (

                <div className="checkout-price-row checkout-discount-row">

                  <span>
                    <FaTag />

                    {isArabic ? "كود الخصم" : "Coupon"}{" "}
                    ({couponCode}) - {discount}%
                  </span>

                  <strong>
                    -${discountAmount.toFixed(2)}
                  </strong>

                </div>

              )}

              {/* TOTAL */}

              <div className="checkout-total">

                <span>
                  {isArabic
                    ? "الإجمالي النهائي"
                    : "Final Total"}
                </span>

                <strong>
                  ${total.toFixed(2)}
                </strong>

              </div>

              {/* CONFIRM ORDER */}

              <button
                type="submit"
                className="checkout-submit"
              >

                <FaCheckCircle />

                {isArabic
                  ? "تأكيد الطلب"
                  : "Confirm Order"}

              </button>

              <p className="checkout-secure">
                <FaLock />

                {isArabic
                  ? "بياناتك محمية"
                  : "Your information is protected"}
              </p>

              <Link
                to="/cart"
                className="checkout-back"
              >
                <FaArrowLeft />

                {isArabic
                  ? "العودة للسلة"
                  : "Back to Cart"}
              </Link>

            </aside>

          </form>

        )}

      </div>

    </div>
  );
}

export default Checkout;