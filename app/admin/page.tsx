
"use client";

import { useEffect, useMemo, useState } from "react";

type OrderItem = {
  product_id: string;
  name: string;
  quantity: number;
};

type Order = {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  installation_required: boolean;
  notes: string;
  status: string;
  created_at: string;
};

const statuses: Record<string, string> = {
  new: "הזמנה חדשה",
  in_progress: "בטיפול",
  completed: "הושלמה",
  cancelled: "בוטלה",
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        cache: "no-store",
        credentials: "same-origin",
      });

      if (response.status === 401) {
        setLoggedIn(false);
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "טעינת ההזמנות נכשלה.");
      }

      setOrders(result.orders || []);
      setLoggedIn(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "אירעה שגיאה."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("login");
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "הכניסה נכשלה.");
      }

      setPassword("");
      setLoggedIn(true);
      await loadOrders();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "אירעה שגיאה."
      );
    } finally {
      setBusy("");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    setLoggedIn(false);
    setOrders([]);
    setPassword("");
  }

  async function updateStatus(id: string, status: string) {
    setBusy(id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "עדכון הסטטוס נכשל.");
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );

      setSuccess("סטטוס ההזמנה עודכן בהצלחה.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "אירעה שגיאה."
      );
    } finally {
      setBusy("");
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter =
        filter === "all" || order.status === filter;

      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        order.full_name.toLowerCase().includes(searchText) ||
        order.phone.includes(searchText) ||
        order.address.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, search]);

  const counts = {
    all: orders.length,
    new: orders.filter((o) => o.status === "new").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  if (loading && !loggedIn) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-logo">✦</div>
          <h1>מערכת ניהול הקמפיין</h1>
          <p>טוען...</p>
        </div>
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <main className="admin-login-page">
        <form className="admin-login-card" onSubmit={login}>
          <div className="admin-logo">✦</div>

          <span className="admin-kicker">
            הנה זה משיח בא
          </span>

          <h1>מערכת הניהול</h1>
          <p>כניסה למנהלי הקמפיין בלבד</p>

          <label>
            סיסמת מנהל
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="הקלד סיסמה"
              required
              autoComplete="current-password"
            />
          </label>

          {error && <div className="admin-error">{error}</div>}

          <button
            className="admin-primary-button"
            type="submit"
            disabled={busy === "login"}
          >
            {busy === "login" ? "מתחבר..." : "כניסה למערכת"}
          </button>

          <a className="admin-back-link" href="/">
            חזרה לאתר הראשי
          </a>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <span className="admin-kicker">הנה זה משיח בא</span>
          <h1>לוח ניהול הקמפיין</h1>
          <p>ניהול הזמנות ופעילות הקמפיין</p>
        </div>

        <div className="admin-header-actions">
          <a href="/" className="admin-secondary-button">
            צפייה באתר
          </a>
          <button onClick={logout} className="admin-dark-button">
            יציאה
          </button>
        </div>
      </header>

      <section className="admin-stats">
        <article className="admin-stat">
          <span>כל ההזמנות</span>
          <strong>{counts.all}</strong>
        </article>

        <article className="admin-stat">
          <span>חדשות</span>
          <strong>{counts.new}</strong>
        </article>

        <article className="admin-stat">
          <span>בטיפול</span>
          <strong>{counts.in_progress}</strong>
        </article>

        <article className="admin-stat">
          <span>הושלמו</span>
          <strong>{counts.completed}</strong>
        </article>
      </section>

      <section className="admin-orders-section">
        <div className="admin-section-heading">
          <div>
            <h2>הזמנות שהתקבלו</h2>
            <p>כל ההזמנות שנשלחו דרך האתר</p>
          </div>

          <button
            className="admin-secondary-button"
            onClick={loadOrders}
            disabled={loading}
          >
            {loading ? "טוען..." : "↻ רענון"}
          </button>
        </div>

        <div className="admin-toolbar">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם, טלפון או כתובת..."
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">כל ההזמנות</option>
            <option value="new">חדשות</option>
            <option value="in_progress">בטיפול</option>
            <option value="completed">הושלמו</option>
            <option value="cancelled">בוטלו</option>
          </select>
        </div>

        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}

        {filteredOrders.length === 0 ? (
          <div className="admin-empty">
            <span>📦</span>
            <h3>אין הזמנות להצגה</h3>
            <p>כאן יופיעו ההזמנות שיתקבלו באתר.</p>
          </div>
        ) : (
          <div className="admin-order-list">
            {filteredOrders.map((order) => (
              <article className="admin-order-card" key={order.id}>
                <div className="admin-order-top">
                  <div>
                    <span className="admin-order-number">
                      הזמנה #{order.id.slice(0, 8)}
                    </span>
                    <h3>{order.full_name}</h3>
                    <span className="admin-order-date">
                      {new Date(order.created_at).toLocaleString("he-IL")}
                    </span>
                  </div>

                  <select
                    className={`admin-status status-${order.status}`}
                    value={order.status}
                    disabled={busy === order.id}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                  >
                    {Object.entries(statuses).map(([value, label]) => (
                      <option value={value} key={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-order-details">
                  <div>
                    <span>טלפון</span>
                    <a href={`tel:${order.phone}`}>
                      {order.phone}
                    </a>
                  </div>

                  <div>
                    <span>כתובת</span>
                    <strong>{order.address}</strong>
                  </div>

                  <div>
                    <span>התקנה</span>
                    <strong>
                      {order.installation_required ? "נדרשת" : "לא נדרשת"}
                    </strong>
                  </div>
                </div>

                <div className="admin-order-products">
                  <strong>מוצרים שהוזמנו</strong>

                  {(order.items || []).map((item, index) => (
                    <div key={`${item.product_id}-${index}`}>
                      <span>{item.name}</span>
                      <b>כמות: {item.quantity}</b>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="admin-order-notes">
                    <strong>הערות:</strong> {order.notes}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="admin-footer">
        מערכת ניהול קמפיין הנה זה משיח בא
      </footer>
    </main>
  );
}
