
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

type OrderItem = {
  product_id: string;
  name: string;
  quantity: number;
};

type Order = {
  id: string;
  request_number?: number;
  full_name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  installation_required: boolean;
  notes: string;
  status: string;
  created_at: string;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  special_price: number | null;
  is_available: boolean;
  is_visible: boolean;
  allows_installation: boolean;
  display_order: number;
};

const statuses: Record<string, string> = {
  new: "הזמנה חדשה",
  in_progress: "בטיפול",
  completed: "הושלמה",
  cancelled: "בוטלה",
};

const emptyProduct = {
  name: "",
  description: "",
  image_url: "",
  price: "",
  special_price: "",
  is_available: true,
  is_visible: true,
  allows_installation: false,
  display_order: "0",
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState("orders");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  async function loadOrders() {
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
  }

  async function loadProducts() {
    const response = await fetch("/api/admin/products", {
      cache: "no-store",
      credentials: "same-origin",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "טעינת המוצרים נכשלה.");
    }

    setProducts(result.products || []);
  }

  async function loadAll() {
    setLoading(true);
    setError("");

    try {
      await loadOrders();

      if (document.cookie || true) {
        await loadProducts();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "אירעה שגיאה.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("login");
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "הכניסה נכשלה.");
      }

      setPassword("");
      setLoggedIn(true);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "אירעה שגיאה.");
    } finally {
      setBusy("");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false);
    setOrders([]);
    setProducts([]);
    setPassword("");
  }

  async function updateStatus(id: string, status: string) {
    setBusy(id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
      setError(err instanceof Error ? err.message : "אירעה שגיאה.");
    } finally {
      setBusy("");
    }
  }

  function startEdit(product: Product) {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      description: product.description || "",
      image_url: product.image_url || "",
      price: product.price?.toString() || "",
      special_price: product.special_price?.toString() || "",
      is_available: product.is_available,
      is_visible: product.is_visible,
      allows_installation: product.allows_installation,
      display_order: product.display_order.toString(),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetProductForm() {
    setEditingProduct(null);
    setProductForm(emptyProduct);
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProduct(true);
    setError("");
    setSuccess("");

    const payload = {
      name: productForm.name.trim(),
      description: productForm.description.trim() || null,
      image_url: productForm.image_url.trim() || null,
      price: productForm.price === "" ? null : Number(productForm.price),
      special_price:
        productForm.special_price === ""
          ? null
          : Number(productForm.special_price),
      is_available: productForm.is_available,
      is_visible: productForm.is_visible,
      allows_installation: productForm.allows_installation,
      display_order: Number(productForm.display_order),
    };

    try {
      const response = await fetch("/api/admin/products", {
        method: editingProduct ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingProduct
            ? { id: editingProduct, ...payload }
            : payload
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "שמירת המוצר נכשלה.");
      }

      await loadProducts();
      resetProductForm();
      setSuccess(
        editingProduct ? "המוצר עודכן בהצלחה." : "המוצר נוסף בהצלחה."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "אירעה שגיאה.");
    } finally {
      setSavingProduct(false);
    }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`למחוק את המוצר "${product.name}"?`)) return;

    setBusy(product.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "מחיקת המוצר נכשלה.");
      }

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );

      setSuccess("המוצר נמחק.");
      if (editingProduct === product.id) resetProductForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "אירעה שגיאה.");
    } finally {
      setBusy("");
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter =
        filter === "all" || order.status === filter;
      const text = search.trim().toLowerCase();

      const matchesSearch =
        !text ||
        (order.full_name || "").toLowerCase().includes(text) ||
        (order.phone || "").includes(text) ||
        (order.address || "").toLowerCase().includes(text);

      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, search]);

  const counts = {
    all: orders.length,
    new: orders.filter((o) => o.status === "new").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
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
          <span className="admin-kicker">הנה זה משיח בא</span>
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
          <p>ניהול ההזמנות, המוצרים והפעילות</p>
        </div>

        <div className="admin-header-actions">
          <a href="/" className="admin-secondary-button">צפייה באתר</a>
          <button onClick={logout} className="admin-dark-button">יציאה</button>
        </div>
      </header>

      <nav className="admin-tabs">
        <button
          className={tab === "orders" ? "active" : ""}
          onClick={() => setTab("orders")}
        >
          📦 הזמנות ({orders.length})
        </button>
        <button
          className={tab === "products" ? "active" : ""}
          onClick={() => setTab("products")}
        >
          🛍️ מוצרים ({products.length})
        </button>
      </nav>

      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      {tab === "orders" && (
        <>
          <section className="admin-stats">
            <article className="admin-stat">
              <span>כל ההזמנות</span><strong>{counts.all}</strong>
            </article>
            <article className="admin-stat">
              <span>חדשות</span><strong>{counts.new}</strong>
            </article>
            <article className="admin-stat">
              <span>בטיפול</span><strong>{counts.in_progress}</strong>
            </article>
            <article className="admin-stat">
              <span>הושלמו</span><strong>{counts.completed}</strong>
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
                onClick={loadAll}
                disabled={loading}
              >
                ↻ רענון
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
                          הזמנה #{order.request_number || order.id.slice(0, 8)}
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
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        {Object.entries(statuses).map(([value, label]) => (
                          <option value={value} key={value}>{label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-order-details">
                      <div>
                        <span>טלפון</span>
                        <a href={`tel:${order.phone}`}>{order.phone}</a>
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
        </>
      )}

      {tab === "products" && (
        <section className="admin-orders-section">
          <div className="admin-section-heading">
            <div>
              <h2>ניהול מוצרי הקמפיין</h2>
              <p>הוספה, עריכה, מחיקה וניהול הזמינות באתר</p>
            </div>
            <button
              className="admin-secondary-button"
              onClick={resetProductForm}
            >
              + מוצר חדש
            </button>
          </div>

          <form className="admin-product-form" onSubmit={saveProduct}>
            <h3>{editingProduct ? "עריכת מוצר" : "הוספת מוצר חדש"}</h3>

            <label>
              שם המוצר *
              <input
                required
                maxLength={150}
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                placeholder="לדוגמה: דגל משיח"
              />
            </label>

            <label>
              תיאור
              <textarea
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({ ...productForm, description: e.target.value })
                }
                placeholder="תיאור המוצר..."
                rows={3}
              />
            </label>

            <label>
              כתובת תמונה
              <input
                type="url"
                value={productForm.image_url}
                onChange={(e) =>
                  setProductForm({ ...productForm, image_url: e.target.value })
                }
                placeholder="https://..."
              />
            </label>

            {productForm.image_url && (
              <img
                src={productForm.image_url}
                alt="תצוגה מקדימה"
                className="admin-product-preview"
              />
            )}

            <div className="admin-product-fields">
              <label>
                מחיר
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  placeholder="0"
                />
              </label>

              <label>
                מחיר מיוחד
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.special_price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, special_price: e.target.value })
                  }
                  placeholder="ללא מחיר מיוחד"
                />
              </label>

              <label>
                סדר תצוגה
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={productForm.display_order}
                  onChange={(e) =>
                    setProductForm({ ...productForm, display_order: e.target.value })
                  }
                />
              </label>
            </div>

            <div className="admin-product-checks">
              <label>
                <input
                  type="checkbox"
                  checked={productForm.is_available}
                  onChange={(e) =>
                    setProductForm({ ...productForm, is_available: e.target.checked })
                  }
                />
                זמין להזמנה
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={productForm.is_visible}
                  onChange={(e) =>
                    setProductForm({ ...productForm, is_visible: e.target.checked })
                  }
                />
                מוצג באתר
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={productForm.allows_installation}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      allows_installation: e.target.checked,
                    })
                  }
                />
                מאפשר התקנה
              </label>
            </div>

            <div className="admin-product-actions">
              <button
                className="admin-primary-button"
                type="submit"
                disabled={savingProduct}
              >
                {savingProduct
                  ? "שומר..."
                  : editingProduct
                    ? "שמירת שינויים"
                    : "הוספת מוצר"}
              </button>

              {editingProduct && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={resetProductForm}
                >
                  ביטול עריכה
                </button>
              )}
            </div>
          </form>

          <h3 className="admin-products-title">
            המוצרים במערכת ({products.length})
          </h3>

          {products.length === 0 ? (
            <div className="admin-empty">
              <span>🛍️</span>
              <h3>עדיין אין מוצרים</h3>
              <p>הוסף את המוצר הראשון באמצעות הטופס.</p>
            </div>
          ) : (
            <div className="admin-products-grid">
              {products.map((product) => (
                <article className="admin-product-card" key={product.id}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} />
                  ) : (
                    <div className="admin-product-no-image">🛍️</div>
                  )}

                  <div className="admin-product-card-content">
                    <h3>{product.name}</h3>
                    <p>{product.description || "אין תיאור למוצר."}</p>

                    <div className="admin-product-prices">
                      {product.special_price !== null ? (
                        <>
                          <strong>₪{product.special_price}</strong>
                          {product.price !== null && (
                            <del>₪{product.price}</del>
                          )}
                        </>
                      ) : (
                        <strong>
                          {product.price !== null ? `₪${product.price}` : "ללא מחיר"}
                        </strong>
                      )}
                    </div>

                    <div className="admin-product-badges">
                      <span>{product.is_available ? "זמין להזמנה" : "לא זמין"}</span>
                      <span>{product.is_visible ? "מוצג באתר" : "מוסתר"}</span>
                    </div>

                    <div className="admin-product-actions">
                      <button
                        className="admin-secondary-button"
                        onClick={() => startEdit(product)}
                      >
                        עריכה
                      </button>
                      <button
                        className="admin-delete-button"
                        disabled={busy === product.id}
                        onClick={() => deleteProduct(product)}
                      >
                        {busy === product.id ? "מוחק..." : "מחיקה"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <footer className="admin-footer">
        מערכת ניהול קמפיין הנה זה משיח בא
      </footer>
    </main>
  );
}
