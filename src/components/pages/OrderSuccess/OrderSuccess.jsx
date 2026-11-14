import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaGamepad,
  FaShoppingBag,
  FaArrowRight,
  FaReceipt,
} from "react-icons/fa";


import "./OrderSuccess.css";

function OrderSuccess({ language, onLanguageChange }) {
  const isArabic = language === "ar";

  let order = null;

  try {
    order = JSON.parse(
      localStorage.getItem("gameZoneLastOrder") || "null"
    );
  } catch {
    order = null;
  }

  const formatPrice = (price) => {
    return `$${Number(price || 0).toFixed(2)}`;
  };

  if (!order) {
    return (
      <div className="order-success-page">
        <Navbar
          language={language}
          onLanguageChange={onLanguageChange}
        />

        <div className="order-not-found">
          <FaReceipt className="not-found-icon" />

          <h2>
            {isArabic ? "لا يوجد طلب لعرضه" : "No Order Found"}
          </h2>

          <p>
            {isArabic
              ? "لم نعثر على بيانات طلب سابقة."
              : "We couldn't find a previous order."}
          </p>

          <Link to="/store" className="success-store-btn">
            {isArabic ? "العودة للمتجر" : "Back to Store"}
          </Link>
        </div>
      </div>
    );
  }

  const customer = order.customer || {};
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="order-success-page">

      <main className="order-success-container">
        <div className="success-animation">
          <div className="success-icon-circle">
            <FaCheckCircle />
          </div>
        </div>

        <div className="success-heading">
          <span>
            {isArabic ? "تم بنجاح" : "SUCCESS"}
          </span>

          <h1>
            {isArabic
              ? "تم تأكيد طلبك!"
              : "Your Order Is Confirmed!"}
          </h1>

          <p>
            {isArabic
              ? "شكراً لثقتك في GAME ZONE. طلبك اتسجل بنجاح."
              : "Thank you for choosing GAME ZONE. Your order has been placed successfully."}
          </p>
        </div>

        <div className="order-number-card">
          <div className="order-number-icon">
            <FaReceipt />
          </div>

          <div>
            <span>
              {isArabic ? "رقم الطلب" : "ORDER NUMBER"}
            </span>

            <strong>{order.id}</strong>
          </div>

          <div className="order-status">
            {isArabic ? "تم التأكيد" : "Confirmed"}
          </div>
        </div>

        <div className="order-success-grid">
          <section className="order-details-card">
            <div className="order-section-title">
              <FaShoppingBag />

              <h2>
                {isArabic ? "تفاصيل الطلب" : "Order Details"}
              </h2>
            </div>

            <div className="ordered-games">
              {items.map((item, index) => {
                const itemName =
                  item.name || item.title || item.gameName || "Game";

                const itemImage =
                  item.image || item.img || item.imageUrl;

                const quantity = Number(item.quantity || 1);

                return (
                  <div
                    className="ordered-game"
                    key={item.id || index}
                  >
                    {itemImage ? (
                      <img src={itemImage} alt={itemName} />
                    ) : (
                      <div className="ordered-game-placeholder">
                        <FaGamepad />
                      </div>
                    )}

                    <div className="ordered-game-info">
                      <h3>{itemName}</h3>

                      <span>
                        {isArabic
                          ? `الكمية: ${quantity}`
                          : `Quantity: ${quantity}`}
                      </span>
                    </div>

                    <strong>
                      {formatPrice(
                        Number(item.price || 0) * quantity
                      )}
                    </strong>
                  </div>
                );
              })}
            </div>

            <div className="order-price-details">
              <div className="order-price-row">
                <span>
                  {isArabic ? "المجموع الفرعي" : "Subtotal"}
                </span>

                <strong>{formatPrice(order.subtotal)}</strong>
              </div>

              {Number(order.discountAmount) > 0 && (
                <div className="order-price-row discount">
                  <span>
                    {isArabic ? "الخصم" : "Discount"}
                    {order.couponCode && ` (${order.couponCode})`}
                  </span>

                  <strong>
                    -{formatPrice(order.discountAmount)}
                  </strong>
                </div>
              )}

              <div className="order-price-row total">
                <span>
                  {isArabic ? "الإجمالي النهائي" : "Total"}
                </span>

                <strong>{formatPrice(order.total)}</strong>
              </div>
            </div>
          </section>

          <aside className="order-customer-card">
            <div className="order-section-title">
              <FaGamepad />

              <h2>
                {isArabic ? "بيانات العميل" : "Customer Information"}
              </h2>
            </div>

            <div className="customer-info-row">
              <span>{isArabic ? "الاسم" : "Name"}</span>

              <strong>
                {customer.name ||
                  customer.fullName ||
                  customer.firstName ||
                  "—"}
              </strong>
            </div>

            <div className="customer-info-row">
              <span>{isArabic ? "البريد الإلكتروني" : "Email"}</span>

              <strong>{customer.email || "—"}</strong>
            </div>

            <div className="customer-info-row">
              <span>{isArabic ? "رقم الهاتف" : "Phone"}</span>

              <strong>{customer.phone || "—"}</strong>
            </div>

            <div className="customer-info-row">
              <span>
                {isArabic ? "طريقة الدفع" : "Payment Method"}
              </span>

              <strong>{order.paymentMethod || "—"}</strong>
            </div>

            <div className="customer-info-row">
              <span>{isArabic ? "تاريخ الطلب" : "Order Date"}</span>

              <strong>
                {order.date
                  ? new Date(order.date).toLocaleDateString(
                      isArabic ? "ar-EG" : "en-US"
                    )
                  : "—"}
              </strong>
            </div>
          </aside>
        </div>

        <div className="order-success-footer">
          <p>
            {isArabic
              ? "شكراً لكونك جزءاً من مجتمع GAME ZONE 🎮"
              : "Thanks for being part of the GAME ZONE community 🎮"}
          </p>

          <Link to="/store" className="success-store-btn">
            <FaArrowRight />

            {isArabic ? "العودة إلى المتجر" : "Continue Shopping"}
          </Link>
        </div>
      </main>
    </div>
  );
}

export default OrderSuccess;