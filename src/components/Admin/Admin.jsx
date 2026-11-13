import { useEffect, useMemo, useState } from "react";

import {
  FaGamepad,
  FaHome,
  FaShoppingBag,
  FaUsers,
  FaChartLine,
  FaCog,
  FaBars,
  FaBell,
  FaSearch,
  FaDollarSign,
  FaClipboardList,
  FaEllipsisH,
  FaPlus,
  FaChevronRight,
  FaFire,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaEye,
  FaBoxOpen,
  FaStore,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaCheckCircle,
} from "react-icons/fa";

import { getGames, saveGames } from "../../data/games";
import "./Admin.css";

const emptyForm = {
  name: "",
  platform: "pc",
  genre: "",
  genreAr: "",
  description: "",
  descriptionAr: "",
  price: "",
  oldPrice: "",
  image: "",
};

const defaultSettings = {
  storeName: "GAME ZONE",
  email: "",
  phone: "",
  currency: "EGP",
  welcomeMessage: "Welcome to GAME ZONE",
};

function Admin() {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // الألعاب
  const [games, setGames] = useState(() => getGames());
  const [searchGame, setSearchGame] = useState("");
  const [showGameForm, setShowGameForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  // الطلبات
  const [orders, setOrders] = useState(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("gameZoneOrders") || "[]"
      );
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  });

  const [searchOrder, setSearchOrder] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // العملاء
  const [users, setUsers] = useState(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("gameZoneUsers") || "[]"
      );
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  });

  const [searchCustomer, setSearchCustomer] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // إعدادات المتجر
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = JSON.parse(
        localStorage.getItem("gameZoneSettings") || "null"
      );

      return {
        ...defaultSettings,
        ...(savedSettings || {}),
      };
    } catch {
      return { ...defaultSettings };
    }
  });

  const [settingsSaved, setSettingsSaved] = useState(false);

  // تحديث البيانات
  useEffect(() => {
    const updateGames = () => {
      setGames(getGames());
    };

    const updateOrders = () => {
      try {
        const data = JSON.parse(
          localStorage.getItem("gameZoneOrders") || "[]"
        );
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setOrders([]);
      }
    };

    const updateUsers = () => {
      try {
        const data = JSON.parse(
          localStorage.getItem("gameZoneUsers") || "[]"
        );
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        setUsers([]);
      }
    };

    window.addEventListener("gamesUpdated", updateGames);
    window.addEventListener("storage", updateGames);
    window.addEventListener("ordersUpdated", updateOrders);
    window.addEventListener("storage", updateOrders);
    window.addEventListener("usersUpdated", updateUsers);
    window.addEventListener("storage", updateUsers);

    return () => {
      window.removeEventListener("gamesUpdated", updateGames);
      window.removeEventListener("storage", updateGames);
      window.removeEventListener("ordersUpdated", updateOrders);
      window.removeEventListener("storage", updateOrders);
      window.removeEventListener("usersUpdated", updateUsers);
      window.removeEventListener("storage", updateUsers);
    };
  }, []);

  // تجميع العملاء من الحسابات والطلبات
  const customers = useMemo(() => {
    const customerMap = new Map();

    users.forEach((user) => {
      const email = (user.email || "").trim().toLowerCase();

      if (!email) return;

      customerMap.set(email, {
        name: user.name || "Customer",
        email,
        phone: "",
        createdAt: user.createdAt || "",
        orders: [],
      });
    });

    orders.forEach((order) => {
      const email = (
        order.customer?.email ||
        order.email ||
        ""
      ).trim().toLowerCase();

      if (!email) return;

      const existing = customerMap.get(email);

      if (existing) {
        existing.orders.push(order);

        if (!existing.phone && order.customer?.phone) {
          existing.phone = order.customer.phone;
        }

        if (
          (!existing.name || existing.name === "Customer") &&
          order.customer?.name
        ) {
          existing.name = order.customer.name;
        }
      } else {
        customerMap.set(email, {
          name: order.customer?.name || order.name || "Customer",
          email,
          phone: order.customer?.phone || order.phone || "",
          createdAt: "",
          orders: [order],
        });
      }
    });

    return Array.from(customerMap.values());
  }, [users, orders]);

  // البحث عن العملاء
  const filteredCustomers = customers.filter((customer) => {
    const search = searchCustomer.toLowerCase();

    return (
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      customer.phone.toLowerCase().includes(search)
    );
  });

  // حسابات Analytics
  const analytics = useMemo(() => {
    const validOrders = orders.filter(
      (order) => order.status !== "cancelled"
    );

    const totalRevenue = validOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    const completedOrders = orders.filter(
      (order) => order.status === "completed"
    ).length;

    const processingOrders = orders.filter(
      (order) => order.status === "processing"
    ).length;

    const pendingOrders = orders.filter(
      (order) => !order.status || order.status === "pending"
    ).length;

    const cancelledOrders = orders.filter(
      (order) => order.status === "cancelled"
    ).length;

    const monthlySales = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      date.setMonth(date.getMonth() - i);

      const month = date.getMonth();
      const year = date.getFullYear();

      const monthRevenue = validOrders
        .filter((order) => {
          const orderDate = new Date(order.date);

          return (
            !Number.isNaN(orderDate.getTime()) &&
            orderDate.getMonth() === month &&
            orderDate.getFullYear() === year
          );
        })
        .reduce(
          (sum, order) => sum + Number(order.total || 0),
          0
        );

      monthlySales.push({
        label: date.toLocaleDateString("en-US", {
          month: "short",
        }),
        revenue: monthRevenue,
      });
    }

    const maxRevenue = Math.max(
      ...monthlySales.map((item) => item.revenue),
      1
    );

    const gameSales = {};

    validOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const name = item.name || "Unknown Game";
        const quantity = Number(item.quantity || 1);

        gameSales[name] = (gameSales[name] || 0) + quantity;
      });
    });

    const topGames = Object.entries(gameSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    const maxGameSales = Math.max(
      ...topGames.map((game) => game.sales),
      1
    );

    return {
      totalRevenue,
      completedOrders,
      processingOrders,
      pendingOrders,
      cancelledOrders,
      monthlySales,
      maxRevenue,
      topGames,
      maxGameSales,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalGames: games.length,
    };
  }, [orders, customers, games]);

  // عناصر القائمة الجانبية
  const menuItems = [
    { id: "overview", label: "Overview", icon: <FaHome /> },
    { id: "games", label: "Manage Games", icon: <FaGamepad /> },
    { id: "orders", label: "Orders", icon: <FaShoppingBag /> },
    { id: "users", label: "Customers", icon: <FaUsers /> },
    { id: "analytics", label: "Analytics", icon: <FaChartLine /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  const stats = [
    {
      title: "Total Games",
      value: games.length,
      icon: <FaGamepad />,
      color: "purple",
      note: "Games in your store",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: <FaShoppingBag />,
      color: "pink",
      note: "Recorded orders",
    },
    {
      title: "Total Customers",
      value: customers.length,
      icon: <FaUsers />,
      color: "blue",
      note: "Registered and purchasing customers",
    },
    {
      title: "Total Revenue",
      value: `${analytics.totalRevenue.toLocaleString()} EGP`,
      icon: <FaDollarSign />,
      color: "green",
      note: "Non-cancelled orders",
    },
  ];

  const pageTitles = {
    overview: "Dashboard Overview",
    games: "Manage Games",
    orders: "Orders Management",
    users: "Customers",
    analytics: "Analytics",
    settings: "Settings",
  };

  const handleMenuClick = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  // إضافة لعبة
  const openAddForm = () => {
    setEditingGame(null);
    setFormData(emptyForm);
    setShowGameForm(true);
  };

  // تعديل لعبة
  const openEditForm = (game) => {
    setEditingGame(game);

    setFormData({
      name: game.name || "",
      platform: game.platform || "pc",
      genre: game.genre || "",
      genreAr: game.genreAr || "",
      description: game.description || "",
      descriptionAr: game.descriptionAr || "",
      price: game.price ?? "",
      oldPrice: game.oldPrice ?? "",
      image: game.image || "",
    });

    setShowGameForm(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // حفظ اللعبة
  const handleSaveGame = (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter the game name.");
      return;
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      alert("Please enter a valid game price.");
      return;
    }

    const gameData = {
      ...formData,
      name: formData.name.trim(),
      price: Number(formData.price),
      oldPrice:
        formData.oldPrice === "" ? 0 : Number(formData.oldPrice),
    };

    let updatedGames;

    if (editingGame) {
      updatedGames = games.map((game) =>
        game.id === editingGame.id
          ? { ...game, ...gameData }
          : game
      );
    } else {
      const newGame = {
        id: Date.now(),
        ...gameData,
      };

      updatedGames = [newGame, ...games];
    }

    saveGames(updatedGames);
    setGames(updatedGames);
    setShowGameForm(false);
    setEditingGame(null);
    setFormData(emptyForm);
  };

  // حذف لعبة
  const handleDeleteGame = (gameId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this game?"
    );

    if (!confirmed) return;

    const updatedGames = games.filter(
      (game) => game.id !== gameId
    );

    saveGames(updatedGames);
    setGames(updatedGames);
  };

  // تحديث حالة الطلب
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    );

    localStorage.setItem(
      "gameZoneOrders",
      JSON.stringify(updatedOrders)
    );

    setOrders(updatedOrders);
    window.dispatchEvent(new Event("ordersUpdated"));

    if (selectedOrder?.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
      });
    }
  };

  // حذف طلب
  const handleDeleteOrder = (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    const updatedOrders = orders.filter(
      (order) => order.id !== orderId
    );

    localStorage.setItem(
      "gameZoneOrders",
      JSON.stringify(updatedOrders)
    );

    setOrders(updatedOrders);
    setSelectedOrder(null);

    window.dispatchEvent(new Event("ordersUpdated"));
  };

  // تنسيق التاريخ
  const formatOrderDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleString();
  };

  // فلترة الألعاب
  const filteredGames = games.filter((game) =>
    game.name?.toLowerCase().includes(searchGame.toLowerCase())
  );

  // فلترة الطلبات
  const filteredOrders = orders.filter((order) => {
    const search = searchOrder.toLowerCase();

    const customerName =
      order.customer?.name || order.name || "";

    const customerEmail =
      order.customer?.email || order.email || "";

    const matchesSearch =
      String(order.id || "").toLowerCase().includes(search) ||
      customerName.toLowerCase().includes(search) ||
      customerEmail.toLowerCase().includes(search);

    const matchesStatus =
      orderFilter === "all" ||
      (order.status || "pending") === orderFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    const normalized = (status || "pending").toLowerCase();

    if (normalized === "completed") return "completed";
    if (normalized === "processing") return "processing";
    if (normalized === "cancelled") return "cancelled";

    return "pending";
  };

  const getCustomerName = (order) =>
    order.customer?.name || order.name || "Customer";

  const getCustomerEmail = (order) =>
    order.customer?.email || order.email || "No email";

  const getCustomerPhone = (order) =>
    order.customer?.phone || order.phone || "No phone";

  // تغيير إعدادات المتجر
  const handleSettingsChange = (event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSettingsSaved(false);
  };

  // حفظ إعدادات المتجر
  const handleSaveSettings = (event) => {
    event.preventDefault();

    localStorage.setItem(
      "gameZoneSettings",
      JSON.stringify(settings)
    );

    setSettingsSaved(true);
    alert("Store settings saved successfully!");
  };

  // استعادة الإعدادات الافتراضية
  const handleResetSettings = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset store settings?"
    );

    if (!confirmed) return;

    setSettings({ ...defaultSettings });
    localStorage.setItem(
      "gameZoneSettings",
      JSON.stringify(defaultSettings)
    );

    setSettingsSaved(true);
  };

  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <FaGamepad />
          </div>

          <div>
            <h2>GAME <span>ZONE</span></h2>
            <small>ADMIN PANEL</small>
          </div>
        </div>

        <div className="admin-menu-label">MAIN MENU</div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>

              {activePage === item.id && (
                <span className="admin-active-indicator" />
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-upgrade-card">
            <FaFire />
            <h4>Ready for Battle?</h4>
            <p>Your gaming store control center is ready.</p>
          </div>

          <button
            className="admin-logout"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <FaSignOutAlt />
            Back to Website
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-menu"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaBars />
            </button>

            <div>
              <span className="admin-breadcrumb">GAME ZONE / ADMIN</span>
              <h1>{pageTitles[activePage]}</h1>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-search">
              <FaSearch />
              <input type="text" placeholder="Search anything..." />
            </div>

            <button className="admin-notification">
              <FaBell />
              <span />
            </button>

            <div className="admin-profile">
              <div className="admin-avatar">A</div>

              <div>
                <strong>Administrator</strong>
                <small>Super Admin</small>
              </div>
            </div>
          </div>
        </header>

        {/* OVERVIEW */}
        {activePage === "overview" ? (
          <div className="admin-content">
            <section className="admin-welcome">
              <div>
                <span className="admin-welcome-tag">
                  <span className="admin-live-dot" />
                  CONTROL CENTER
                </span>

                <h2>
                  Welcome Back, <span>Admin!</span>
                </h2>

                <p>
                  Here's what's happening with your gaming store today.
                </p>
              </div>

              <div className="admin-welcome-icon">
                <FaGamepad />
              </div>
            </section>

            <section className="admin-stats-grid">
              {stats.map((stat) => (
                <div className="admin-stat-card" key={stat.title}>
                  <div className={`admin-stat-icon ${stat.color}`}>
                    {stat.icon}
                  </div>

                  <div className="admin-stat-info">
                    <span>{stat.title}</span>
                    <h3>{stat.value}</h3>
                    <small>{stat.note}</small>
                  </div>

                  <button className="admin-stat-more">
                    <FaEllipsisH />
                  </button>
                </div>
              ))}
            </section>

            <section className="admin-main-grid">
              <div className="admin-panel admin-games-panel">
                <div className="admin-panel-header">
                  <div>
                    <span className="admin-section-subtitle">
                      YOUR CATALOG
                    </span>
                    <h3>Recently Added Games</h3>
                  </div>

                  <button
                    className="admin-view-all"
                    onClick={() => setActivePage("games")}
                  >
                    View All <FaChevronRight />
                  </button>
                </div>

                <div className="admin-games-list">
                  {games.slice(0, 5).map((game) => (
                    <div className="admin-game-row" key={game.id}>
                      <div className="admin-game-image">
                        {game.image ? (
                          <img src={game.image} alt={game.name} />
                        ) : (
                          <FaGamepad />
                        )}
                      </div>

                      <div className="admin-game-details">
                        <strong>{game.name}</strong>
                        <span>
                          {game.platform === "pc"
                            ? "PC Game"
                            : "PlayStation"}
                        </span>
                      </div>

                      <div className="admin-game-price">
                        {game.price} EGP
                      </div>
                    </div>
                  ))}

                  {games.length === 0 && (
                    <p className="admin-empty">No games found.</p>
                  )}
                </div>
              </div>

              <div className="admin-panel admin-quick-panel">
                <div className="admin-panel-header">
                  <div>
                    <span className="admin-section-subtitle">
                      QUICK ACTIONS
                    </span>
                    <h3>Store Management</h3>
                  </div>
                </div>

                <button
                  className="admin-action-card"
                  onClick={() => {
                    setActivePage("games");
                    openAddForm();
                  }}
                >
                  <span className="admin-action-icon purple">
                    <FaPlus />
                  </span>

                  <span>
                    <strong>Add New Game</strong>
                    <small>Add a game to your store catalog</small>
                  </span>

                  <FaChevronRight />
                </button>

                <button
                  className="admin-action-card"
                  onClick={() => setActivePage("orders")}
                >
                  <span className="admin-action-icon pink">
                    <FaClipboardList />
                  </span>

                  <span>
                    <strong>Manage Orders</strong>
                    <small>Review customer orders</small>
                  </span>

                  <FaChevronRight />
                </button>

                <button
                  className="admin-action-card"
                  onClick={() => setActivePage("users")}
                >
                  <span className="admin-action-icon blue">
                    <FaUsers />
                  </span>

                  <span>
                    <strong>View Customers</strong>
                    <small>Check registered accounts</small>
                  </span>

                  <FaChevronRight />
                </button>
              </div>
            </section>

            <section className="admin-panel admin-orders-panel">
              <div className="admin-panel-header">
                <div>
                  <span className="admin-section-subtitle">
                    LATEST ACTIVITY
                  </span>
                  <h3>Recent Orders</h3>
                </div>

                <button
                  className="admin-view-all"
                  onClick={() => setActivePage("orders")}
                >
                  View All <FaChevronRight />
                </button>
              </div>

              {orders.length > 0 ? (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.slice(0, 5).map((order, index) => (
                        <tr key={order.id || index}>
                          <td>#{order.id || index + 1}</td>
                          <td>{getCustomerName(order)}</td>
                          <td>
                            <span
                              className={`admin-status ${getStatusClass(
                                order.status
                              )}`}
                            >
                              {order.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="admin-empty-orders">
                  <div>
                    <FaShoppingBag />
                  </div>
                  <strong>No orders yet</strong>
                  <p>New customer orders will appear here.</p>
                </div>
              )}
            </section>

            <footer className="admin-footer">
              <span>© 2026 GAME ZONE. All rights reserved.</span>
              <span>
                POWERED BY <strong>GAME ZONE</strong>
              </span>
            </footer>
          </div>

        ) : activePage === "games" ? (
          /* MANAGE GAMES */
          <div className="admin-content">
            <section className="admin-games-toolbar">
              <div>
                <span className="admin-section-subtitle">YOUR CATALOG</span>
                <h2>All Games ({games.length})</h2>
                <p>Manage your PC and PlayStation games.</p>
              </div>

              <button
                className="admin-add-game-btn"
                onClick={openAddForm}
              >
                <FaPlus /> Add New Game
              </button>
            </section>

            <div className="admin-games-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search games by name..."
                value={searchGame}
                onChange={(event) => setSearchGame(event.target.value)}
              />
            </div>

            <section className="admin-managed-games">
              {filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                  <article className="admin-managed-game" key={game.id}>
                    <div className="admin-managed-game-image">
                      {game.image ? (
                        <img src={game.image} alt={game.name} />
                      ) : (
                        <FaGamepad />
                      )}
                    </div>

                    <div className="admin-managed-game-info">
                      <h3>{game.name}</h3>
                      <span className="admin-game-platform">
                        {game.platform === "pc" ? "PC" : "PlayStation"}
                      </span>
                      <p>{game.genre || "No genre specified"}</p>
                      <strong>{game.price} EGP</strong>
                    </div>

                    <div className="admin-managed-game-actions">
                      <button
                        className="admin-edit-game"
                        onClick={() => openEditForm(game)}
                        title="Edit game"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="admin-delete-game"
                        onClick={() => handleDeleteGame(game.id)}
                        title="Delete game"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="admin-empty-games">
                  <FaGamepad />
                  <h3>No games found</h3>
                  <p>Try another search or add a new game.</p>
                </div>
              )}
            </section>
          </div>

        ) : activePage === "orders" ? (
          /* ORDERS MANAGEMENT */
          <div className="admin-content">
            <section className="admin-games-toolbar">
              <div>
                <span className="admin-section-subtitle">SALES CENTER</span>
                <h2>All Orders ({orders.length})</h2>
                <p>Review and manage customer purchases.</p>
              </div>
            </section>

            <div className="admin-orders-toolbar">
              <div className="admin-games-search">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search by order ID, name or email..."
                  value={searchOrder}
                  onChange={(event) => setSearchOrder(event.target.value)}
                />
              </div>

              <select
                className="admin-order-filter"
                value={orderFilter}
                onChange={(event) => setOrderFilter(event.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {filteredOrders.length > 0 ? (
              <section className="admin-panel admin-orders-panel">
                <div className="admin-table-wrap">
                  <table className="admin-table admin-orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td><strong>#{order.id}</strong></td>

                          <td>
                            <div className="admin-order-customer">
                              <strong>{getCustomerName(order)}</strong>
                              <small>{getCustomerEmail(order)}</small>
                            </div>
                          </td>

                          <td>{order.items?.length || 0} items</td>

                          <td>
                            <strong>
                              {Number(order.total || 0).toLocaleString()} EGP
                            </strong>
                          </td>

                          <td>{formatOrderDate(order.date)}</td>

                          <td>
                            <select
                              className={`admin-status-select ${getStatusClass(
                                order.status
                              )}`}
                              value={order.status || "pending"}
                              onChange={(event) =>
                                handleUpdateOrderStatus(
                                  order.id,
                                  event.target.value
                                )
                              }
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td>
                            <div className="admin-order-actions">
                              <button
                                className="admin-order-view"
                                title="View order"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <FaEye />
                              </button>

                              <button
                                className="admin-order-delete"
                                title="Delete order"
                                onClick={() => handleDeleteOrder(order.id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : (
              <div className="admin-empty-games">
                <FaBoxOpen />
                <h3>No orders found</h3>
                <p>New customer orders will appear here.</p>
              </div>
            )}
          </div>

        ) : activePage === "analytics" ? (
          /* ANALYTICS */
          <div className="admin-content">
            <section className="admin-games-toolbar">
              <div>
                <span className="admin-section-subtitle">
                  STORE PERFORMANCE
                </span>
                <h2>Analytics Overview</h2>
                <p>
                  Track your store sales, orders and best-selling games.
                </p>
              </div>
            </section>

            <section className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon green">
                  <FaDollarSign />
                </div>
                <div className="admin-stat-info">
                  <span>Total Revenue</span>
                  <h3>{analytics.totalRevenue.toLocaleString()} EGP</h3>
                  <small>Non-cancelled orders</small>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon pink">
                  <FaShoppingBag />
                </div>
                <div className="admin-stat-info">
                  <span>Total Orders</span>
                  <h3>{analytics.totalOrders}</h3>
                  <small>All recorded orders</small>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon blue">
                  <FaUsers />
                </div>
                <div className="admin-stat-info">
                  <span>Total Customers</span>
                  <h3>{analytics.totalCustomers}</h3>
                  <small>Registered customers</small>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon purple">
                  <FaGamepad />
                </div>
                <div className="admin-stat-info">
                  <span>Total Games</span>
                  <h3>{analytics.totalGames}</h3>
                  <small>Games in your catalog</small>
                </div>
              </div>
            </section>

            <section className="admin-analytics-grid">
              <div className="admin-panel admin-analytics-panel">
                <div className="admin-panel-header">
                  <div>
                    <span className="admin-section-subtitle">
                      REVENUE REPORT
                    </span>
                    <h3>Sales - Last 6 Months</h3>
                  </div>
                  <FaChartLine className="admin-analytics-header-icon" />
                </div>

                <div className="admin-sales-chart">
                  {analytics.monthlySales.map((month, index) => {
                    const height =
                      (month.revenue / analytics.maxRevenue) * 100;

                    return (
                      <div
                        className="admin-sales-column"
                        key={`${month.label}-${index}`}
                      >
                        <div className="admin-sales-bar-area">
                          <span className="admin-sales-value">
                            {month.revenue.toLocaleString()} EGP
                          </span>
                          <div
                            className="admin-sales-bar"
                            style={{
                              height: `${Math.max(height, 3)}%`,
                            }}
                          />
                        </div>
                        <span className="admin-sales-month">
                          {month.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="admin-panel admin-analytics-panel">
                <div className="admin-panel-header">
                  <div>
                    <span className="admin-section-subtitle">
                      ORDER REPORT
                    </span>
                    <h3>Order Status</h3>
                  </div>
                  <FaClipboardList className="admin-analytics-header-icon" />
                </div>

                <div className="admin-order-status-list">
                  <div className="admin-analytics-status-row">
                    <span className="admin-analytics-status-dot completed" />
                    <span>Completed</span>
                    <strong>{analytics.completedOrders}</strong>
                  </div>

                  <div className="admin-analytics-status-row">
                    <span className="admin-analytics-status-dot processing" />
                    <span>Processing</span>
                    <strong>{analytics.processingOrders}</strong>
                  </div>

                  <div className="admin-analytics-status-row">
                    <span className="admin-analytics-status-dot pending" />
                    <span>Pending</span>
                    <strong>{analytics.pendingOrders}</strong>
                  </div>

                  <div className="admin-analytics-status-row">
                    <span className="admin-analytics-status-dot cancelled" />
                    <span>Cancelled</span>
                    <strong>{analytics.cancelledOrders}</strong>
                  </div>
                </div>

                <div className="admin-order-status-total">
                  <span>Total Orders</span>
                  <strong>{analytics.totalOrders}</strong>
                </div>
              </div>
            </section>

            <section className="admin-panel admin-top-games-panel">
              <div className="admin-panel-header">
                <div>
                  <span className="admin-section-subtitle">
                    BEST PERFORMERS
                  </span>
                  <h3>Top Selling Games</h3>
                </div>
                <FaFire className="admin-analytics-header-icon" />
              </div>

              {analytics.topGames.length > 0 ? (
                <div className="admin-top-games-list">
                  {analytics.topGames.map((game, index) => (
                    <div
                      className="admin-top-game-row"
                      key={game.name}
                    >
                      <div className="admin-top-game-rank">
                        #{index + 1}
                      </div>

                      <div className="admin-top-game-info">
                        <strong>{game.name}</strong>
                        <div className="admin-top-game-progress">
                          <span
                            style={{
                              width: `${
                                (game.sales / analytics.maxGameSales) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <strong className="admin-top-game-sales">
                        {game.sales} sold
                      </strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-empty-games">
                  <FaGamepad />
                  <h3>No sales data yet</h3>
                  <p>
                    Games will appear here after customers place orders.
                  </p>
                </div>
              )}
            </section>
          </div>

        ) : activePage === "users" ? (
          /* CUSTOMERS MANAGEMENT */
          <div className="admin-content">
            <section className="admin-games-toolbar">
              <div>
                <span className="admin-section-subtitle">
                  CUSTOMER CENTER
                </span>
                <h2>All Customers ({customers.length})</h2>
                <p>
                  Manage your registered customers and their purchases.
                </p>
              </div>
            </section>

            <div className="admin-games-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchCustomer}
                onChange={(event) =>
                  setSearchCustomer(event.target.value)
                }
              />
            </div>

            <section className="admin-customers-grid">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => {
                  const totalSpent = customer.orders
                    .filter((order) => order.status !== "cancelled")
                    .reduce(
                      (sum, order) =>
                        sum + Number(order.total || 0),
                      0
                    );

                  return (
                    <article
                      className="admin-customer-card"
                      key={customer.email}
                    >
                      <div className="admin-customer-card-top">
                        <div className="admin-customer-avatar">
                          {(customer.name || "C")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="admin-customer-main">
                          <h3>{customer.name}</h3>
                          <p>{customer.email}</p>
                        </div>
                      </div>

                      <div className="admin-customer-info">
                        <div>
                          <span>Phone</span>
                          <strong>
                            {customer.phone || "Not provided"}
                          </strong>
                        </div>

                        <div>
                          <span>Total Orders</span>
                          <strong>{customer.orders.length}</strong>
                        </div>

                        <div>
                          <span>Total Spent</span>
                          <strong>
                            {totalSpent.toLocaleString()} EGP
                          </strong>
                        </div>
                      </div>

                      <button
                        className="admin-customer-details-btn"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <FaEye />
                        View Customer
                      </button>
                    </article>
                  );
                })
              ) : (
                <div className="admin-empty-games">
                  <FaUsers />
                  <h3>No customers found</h3>
                  <p>Registered customers will appear here.</p>
                </div>
              )}
            </section>
          </div>

        ) : activePage === "settings" ? (
          /* SETTINGS */
          <div className="admin-content">
            <section className="admin-games-toolbar">
              <div>
                <span className="admin-section-subtitle">
                  STORE CONFIGURATION
                </span>
                <h2>Store Settings</h2>
                <p>
                  Manage your store information and basic preferences.
                </p>
              </div>
            </section>

            <form
              className="admin-settings-form"
              onSubmit={handleSaveSettings}
            >
              <div className="admin-panel admin-settings-panel">
                <div className="admin-panel-header">
                  <div>
                    <span className="admin-section-subtitle">
                      GENERAL INFORMATION
                    </span>
                    <h3>Store Details</h3>
                  </div>
                  <FaStore className="admin-settings-header-icon" />
                </div>

                <div className="admin-settings-grid">
                  <label className="admin-settings-field">
                    <span>
                      <FaStore /> Store Name
                    </span>
                    <input
                      type="text"
                      name="storeName"
                      value={settings.storeName}
                      onChange={handleSettingsChange}
                      placeholder="Enter store name"
                      required
                    />
                  </label>

                  <label className="admin-settings-field">
                    <span>
                      <FaEnvelope /> Store Email
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={settings.email}
                      onChange={handleSettingsChange}
                      placeholder="Enter store email"
                    />
                  </label>

                  <label className="admin-settings-field">
                    <span>
                      <FaPhone /> Phone Number
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={settings.phone}
                      onChange={handleSettingsChange}
                      placeholder="Enter phone number"
                    />
                  </label>

                  <label className="admin-settings-field">
                    <span>
                      <FaGlobe /> Currency
                    </span>
                    <select
                      name="currency"
                      value={settings.currency}
                      onChange={handleSettingsChange}
                    >
                      <option value="EGP">EGP - Egyptian Pound</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </label>

                  <label className="admin-settings-field admin-settings-full">
                    <span>
                      <FaEdit /> Welcome Message
                    </span>
                    <textarea
                      name="welcomeMessage"
                      value={settings.welcomeMessage}
                      onChange={handleSettingsChange}
                      placeholder="Write a welcome message..."
                      rows="4"
                    />
                  </label>
                </div>
              </div>

              <div className="admin-settings-actions">
                <button
                  type="button"
                  className="admin-settings-reset"
                  onClick={handleResetSettings}
                >
                  <FaTimes />
                  Reset Defaults
                </button>

                <button
                  type="submit"
                  className="admin-settings-save"
                >
                  <FaSave />
                  Save Settings
                </button>
              </div>

              {settingsSaved && (
                <div className="admin-settings-success">
                  <FaCheckCircle />
                  Your settings have been saved successfully.
                </div>
              )}
            </form>
          </div>

        ) : (
          <div className="admin-placeholder">
            <div className="admin-placeholder-icon">
              {menuItems.find((item) => item.id === activePage)?.icon}
            </div>
            <span className="admin-section-subtitle">
              COMING NEXT
            </span>
            <h2>{pageTitles[activePage]}</h2>
            <p>This section is ready for development.</p>
            <button onClick={() => setActivePage("overview")}>
              Back to Overview
            </button>
          </div>
        )}

        {/* GAME FORM MODAL */}
        {showGameForm && (
          <div
            className="admin-modal-overlay"
            onClick={() => setShowGameForm(false)}
          >
            <div
              className="admin-game-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="admin-modal-header">
                <div>
                  <span className="admin-section-subtitle">
                    GAME CATALOG
                  </span>
                  <h2>
                    {editingGame ? "Edit Game" : "Add New Game"}
                  </h2>
                </div>

                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={() => setShowGameForm(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSaveGame}>
                <div className="admin-form-grid">
                  <label>
                    Game Name *
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Enter game name"
                      required
                    />
                  </label>

                  <label>
                    Platform *
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleFormChange}
                    >
                      <option value="pc">PC</option>
                      <option value="playstation">PlayStation</option>
                    </select>
                  </label>

                  <label>
                    Genre
                    <input
                      name="genre"
                      value={formData.genre}
                      onChange={handleFormChange}
                      placeholder="Example: Action"
                    />
                  </label>

                  <label>
                    Genre Arabic
                    <input
                      name="genreAr"
                      value={formData.genreAr}
                      onChange={handleFormChange}
                      placeholder="نوع اللعبة بالعربي"
                    />
                  </label>

                  <label>
                    Price (EGP) *
                    <input
                      type="number"
                      name="price"
                      min="0"
                      value={formData.price}
                      onChange={handleFormChange}
                      placeholder="Game price"
                      required
                    />
                  </label>

                  <label>
                    Old Price (EGP)
                    <input
                      type="number"
                      name="oldPrice"
                      min="0"
                      value={formData.oldPrice}
                      onChange={handleFormChange}
                      placeholder="Old price (optional)"
                    />
                  </label>

                  <label className="admin-form-full">
                    Image URL
                    <input
                      name="image"
                      value={formData.image}
                      onChange={handleFormChange}
                      placeholder="https://example.com/game-image.jpg"
                    />
                  </label>

                  <label className="admin-form-full">
                    Description
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Write game description..."
                      rows="3"
                    />
                  </label>

                  <label className="admin-form-full">
                    Description Arabic
                    <textarea
                      name="descriptionAr"
                      value={formData.descriptionAr}
                      onChange={handleFormChange}
                      placeholder="اكتب وصف اللعبة بالعربي..."
                      rows="3"
                    />
                  </label>
                </div>

                <div className="admin-modal-actions">
                  <button
                    type="button"
                    className="admin-cancel-btn"
                    onClick={() => setShowGameForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="admin-save-game-btn"
                  >
                    <FaSave />
                    {editingGame ? "Save Changes" : "Add Game"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div
            className="admin-modal-overlay"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="admin-game-modal admin-order-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="admin-modal-header">
                <div>
                  <span className="admin-section-subtitle">
                    ORDER DETAILS
                  </span>
                  <h2>#{selectedOrder.id}</h2>
                </div>

                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={() => setSelectedOrder(null)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="admin-order-details">
                <h3>Customer Information</h3>

                <p>
                  <strong>Name:</strong> {getCustomerName(selectedOrder)}
                </p>
                <p>
                  <strong>Email:</strong> {getCustomerEmail(selectedOrder)}
                </p>
                <p>
                  <strong>Phone:</strong> {getCustomerPhone(selectedOrder)}
                </p>
                <p>
                  <strong>Date:</strong> {formatOrderDate(selectedOrder.date)}
                </p>
                <p>
                  <strong>Payment:</strong>{" "}
                  {selectedOrder.paymentMethod || "N/A"}
                </p>

                <h3>Ordered Games</h3>

                {selectedOrder.items?.length > 0 ? (
                  selectedOrder.items.map((item, index) => (
                    <div
                      className="admin-order-item"
                      key={`${item.id}-${index}`}
                    >
                      <div>
                        <strong>{item.name || "Game"}</strong>
                        <small>Quantity: {item.quantity || 1}</small>
                      </div>

                      <strong>
                        {(
                          Number(item.price || 0) *
                          Number(item.quantity || 1)
                        ).toLocaleString()} EGP
                      </strong>
                    </div>
                  ))
                ) : (
                  <p>No items found.</p>
                )}

                <div className="admin-order-total-details">
                  <span>Subtotal</span>
                  <strong>
                    {Number(selectedOrder.subtotal || 0).toLocaleString()} EGP
                  </strong>

                  <span>Discount</span>
                  <strong>
                    {Number(
                      selectedOrder.discountAmount || 0
                    ).toLocaleString()} EGP
                  </strong>

                  <span>Final Total</span>
                  <strong>
                    {Number(selectedOrder.total || 0).toLocaleString()} EGP
                  </strong>
                </div>

                <label className="admin-order-status-label">
                  Update Order Status
                  <select
                    className={`admin-status-select ${getStatusClass(
                      selectedOrder.status
                    )}`}
                    value={selectedOrder.status || "pending"}
                    onChange={(event) =>
                      handleUpdateOrderStatus(
                        selectedOrder.id,
                        event.target.value
                      )
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMER DETAILS MODAL */}
        {selectedCustomer && (
          <div
            className="admin-modal-overlay"
            onClick={() => setSelectedCustomer(null)}
          >
            <div
              className="admin-game-modal admin-customer-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="admin-modal-header">
                <div>
                  <span className="admin-section-subtitle">
                    CUSTOMER PROFILE
                  </span>
                  <h2>{selectedCustomer.name}</h2>
                </div>

                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={() => setSelectedCustomer(null)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="admin-order-details">
                <h3>Customer Information</h3>

                <p><strong>Name:</strong> {selectedCustomer.name}</p>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {selectedCustomer.phone || "Not provided"}
                </p>
                <p>
                  <strong>Registration Date:</strong>{" "}
                  {selectedCustomer.createdAt
                    ? formatOrderDate(selectedCustomer.createdAt)
                    : "Not available"}
                </p>

                <h3>Customer Orders</h3>

                {selectedCustomer.orders.length > 0 ? (
                  selectedCustomer.orders.map((order, index) => (
                    <div
                      className="admin-order-item"
                      key={order.id || index}
                    >
                      <div>
                        <strong>#{order.id || index + 1}</strong>
                        <small>{formatOrderDate(order.date)}</small>
                        <small>Status: {order.status || "pending"}</small>
                      </div>

                      <strong>
                        {Number(order.total || 0).toLocaleString()} EGP
                      </strong>
                    </div>
                  ))
                ) : (
                  <p>This customer has no orders yet.</p>
                )}

                <div className="admin-order-total-details">
                  <span>Total Orders</span>
                  <strong>{selectedCustomer.orders.length}</strong>

                  <span>Total Purchases</span>
                  <strong>
                    {selectedCustomer.orders
                      .filter((order) => order.status !== "cancelled")
                      .reduce(
                        (sum, order) =>
                          sum + Number(order.total || 0),
                        0
                      )
                      .toLocaleString()} EGP
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;