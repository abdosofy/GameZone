import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaGamepad,
  FaShieldAlt,
  FaTag,
  FaCheckCircle,
} from "react-icons/fa";

import "./Cart.css";

function Cart({ language, onLanguageChange }) {
  const isArabic = language === "ar";

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("gameZoneCart") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // UPDATE CART
  const updateCart = (items) => {
    setCartItems(items);

    localStorage.setItem(
      "gameZoneCart",
      JSON.stringify(items)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // INCREASE QUANTITY
  const increaseQuantity = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: (item.quantity || 1) + 1,
          }
        : item
    );

    updateCart(updatedItems);
  };

  // DECREASE QUANTITY
  const decreaseQuantity = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.max(
              1,
              (item.quantity || 1) - 1
            ),
          }
        : item
    );

    updateCart(updatedItems);
  };

  // REMOVE ITEM
  const removeItem = (id) => {
    const updatedItems = cartItems.filter(
      (item) => item.id !== id
    );

    updateCart(updatedItems);
  };

  // TOTAL ITEMS
  const totalItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );

  // SUBTOTAL
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  // COUPON SYSTEM
  const applyCoupon = (e) => {
    e.preventDefault();

    const code = couponCode.trim().toUpperCase();

    const coupons = {
      GAME10: 10,
      ZONE20: 20,
    };

    if (couponApplied) {
      setCouponMessage(
        isArabic
          ? "تم تطبيق كود خصم بالفعل"
          : "A coupon is already applied"
      );
      return;
    }

    if (!code) {
      setCouponMessage(
        isArabic
          ? "اكتب كود الخصم أولاً"
          : "Please enter a coupon code"
      );
      return;
    }

    if (coupons[code]) {
      setDiscount(coupons[code]);
      setCouponApplied(true);

      setCouponMessage(
        isArabic
          ? `مبروك! حصلت على خصم ${coupons[code]}%`
          : `${coupons[code]}% discount applied successfully!`
      );
    } else {
      setDiscount(0);

      setCouponMessage(
        isArabic
          ? "كود الخصم غير صحيح"
          : "Invalid coupon code"
      );
    }
  };

  // REMOVE COUPON
  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setCouponApplied(false);
    setCouponMessage("");
  };

  // FINAL TOTAL
  const discountAmount =
    totalPrice * (discount / 100);

  const finalTotal =
    totalPrice - discountAmount;

  return (
    <div className="cart-page">


      <div className="cart-container">

        {/* HEADER */}

        <div className="cart-header">

          <div>
            <span className="cart-eyebrow">
              GAME ZONE / SHOPPING CART
            </span>

            <h1>
              {isArabic
                ? "سلة المشتريات"
                : "Shopping Cart"}
            </h1>

            <p>
              {isArabic
                ? "راجع ألعابك قبل إتمام الشراء"
                : "Review your games before checkout"}
            </p>
          </div>

          <div className="cart-header-icon">
            <FaShoppingCart />
          </div>

        </div>

        {/* EMPTY CART */}

        {cartItems.length === 0 ? (

          <div className="cart-empty">

            <FaGamepad className="empty-cart-icon" />

            <h2>
              {isArabic
                ? "سلتك فارغة!"
                : "Your Cart Is Empty!"}
            </h2>

            <p>
              {isArabic
                ? "ابدأ بإضافة ألعابك المفضلة"
                : "Start adding your favorite games"}
            </p>

            <Link
              to="/store"
              className="cart-shop-button"
            >
              {isArabic
                ? "تصفح الألعاب"
                : "Explore Games"}

              <FaArrowLeft />
            </Link>

          </div>

        ) : (

          <div className="cart-layout">

            {/* CART ITEMS */}

            <div className="cart-items-section">

              <div className="cart-items-heading">

                <h2>
                  {isArabic ? "ألعابك" : "Your Games"}
                </h2>

                <span>
                  {totalItems}{" "}
                  {isArabic ? "منتج" : "Items"}
                </span>

              </div>

              {cartItems.map((item) => (

                <div
                  className="cart-item"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  <div className="cart-item-info">

                    <h3>{item.name}</h3>

                    <span className="cart-item-platform">
                      {item.platform}
                    </span>

                    <p className="cart-item-price">
                      ${Number(item.price).toFixed(2)}
                    </p>

                  </div>

                  {/* QUANTITY */}

                  <div className="cart-quantity">

                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                      aria-label="Decrease quantity"
                    >
                      <FaMinus />
                    </button>

                    <span>
                      {item.quantity || 1}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                      aria-label="Increase quantity"
                    >
                      <FaPlus />
                    </button>

                  </div>

                  {/* ITEM TOTAL */}

                  <div className="cart-item-total">

                    <strong>
                      $
                      {(
                        Number(item.price) *
                        Number(item.quantity || 1)
                      ).toFixed(2)}
                    </strong>

                    <button
                      className="cart-remove-button"
                      onClick={() =>
                        removeItem(item.id)
                      }
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </div>

              ))}

              <Link
                to="/store"
                className="cart-back-store"
              >
                <FaArrowLeft />

                {isArabic
                  ? "العودة للمتجر"
                  : "Continue Shopping"}
              </Link>

            </div>

            {/* ORDER SUMMARY */}

            <aside className="cart-summary">

              <h2>
                {isArabic
                  ? "ملخص الطلب"
                  : "Order Summary"}
              </h2>

              <div className="summary-row">

                <span>
                  {isArabic
                    ? "عدد المنتجات"
                    : "Items"}
                </span>

                <strong>{totalItems}</strong>

              </div>

              <div className="summary-row">

                <span>
                  {isArabic
                    ? "المجموع الفرعي"
                    : "Subtotal"}
                </span>

                <strong>
                  ${totalPrice.toFixed(2)}
                </strong>

              </div>

              <div className="summary-row">

                <span>
                  {isArabic
                    ? "التوصيل"
                    : "Delivery"}
                </span>

                <strong className="free-delivery">
                  {isArabic ? "مجاني" : "FREE"}
                </strong>

              </div>

              {/* COUPON */}

              <form
                className="coupon-form"
                onSubmit={applyCoupon}
              >

                <label>
                  <FaTag />

                  {isArabic
                    ? "كود الخصم"
                    : "Discount Code"}
                </label>

                <div className="coupon-input-group">

                  <input
                    type="text"
                    placeholder={
                      isArabic
                        ? "أدخل كود الخصم"
                        : "Enter coupon code"
                    }
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponMessage("");
                    }}
                    disabled={couponApplied}
                  />

                  <button
                    type="submit"
                    disabled={couponApplied}
                  >
                    {isArabic ? "تطبيق" : "Apply"}
                  </button>

                </div>

                {couponMessage && (

                  <p
                    className={
                      couponApplied
                        ? "coupon-success"
                        : "coupon-error"
                    }
                  >
                    {couponApplied && <FaCheckCircle />}

                    {couponMessage}
                  </p>

                )}

                {couponApplied && (

                  <button
                    type="button"
                    className="remove-coupon"
                    onClick={removeCoupon}
                  >
                    {isArabic
                      ? "إزالة كود الخصم"
                      : "Remove Coupon"}
                  </button>

                )}

              </form>

              <div className="summary-divider" />

              {/* DISCOUNT */}

              {discount > 0 && (

                <div className="summary-row discount-row">

                  <span>
                    {isArabic ? "الخصم" : "Discount"}
                    {" "}({discount}%)
                  </span>

                  <strong>
                    -${discountAmount.toFixed(2)}
                  </strong>

                </div>

              )}

              {/* FINAL TOTAL */}

              <div className="summary-total">

                <span>
                  {isArabic
                    ? "الإجمالي"
                    : "Total"}
                </span>

                <strong>
                  ${finalTotal.toFixed(2)}
                </strong>

              </div>

              {/* CHECKOUT */}

              <Link
                to="/checkout"
                className="checkout-button"
                state={{
                  discount,
                  couponCode: couponApplied
                    ? couponCode.trim().toUpperCase()
                    : "",
                }}
              >
                {isArabic
                  ? "إتمام الشراء"
                  : "Proceed to Checkout"}
              </Link>

              <div className="cart-security">

                <FaShieldAlt />

                <span>
                  {isArabic
                    ? "تسوق بأمان مع GAME ZONE"
                    : "Secure Shopping with GAME ZONE"}
                </span>

              </div>

            </aside>

          </div>

        )}

      </div>

    </div>
  );
}

export default Cart;