
"use client";

import { useState } from "react";

const products = [
  { id: "flag", name: "דגלי קבלת המלכות", price: 0 },
  { id: "sign", name: "שלטי קבלת המלכות", price: 0 },
  { id: "sticker", name: "מדבקות קמפיין", price: 0 },
  { id: "kit", name: "ערכת פרסום לבית", price: 0 },
];

export default function OrderForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [address, setAddress] = useState("");
  const [items, setItems] = useState<Record<string, number>>({});
  const [installation, setInstallation] = useState("לא");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const selectedItems = products
    .filter((product) => (items[product.id] || 0) > 0)
    .map((product) => ({
      product_id: product.id,
      name: product.name,
      quantity: items[product.id],
    }));

  async function sendCode() {
    setMessage("");

    if (phone.replace(/\D/g, "").length < 9) {
      setMessage("נא להזין מספר טלפון תקין.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "שליחת הקוד נכשלה");

      setOtpSent(true);
      setMessage("קוד אימות נשלח למספר הטלפון שהזנת.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "אירעה שגיאה.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    setMessage("");

    if (code.trim().length < 4) {
      setMessage("נא להזין את קוד האימות שקיבלת.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "האימות נכשל");

      setVerified(true);
      setMessage("מספר הטלפון אומת בהצלחה.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "אירעה שגיאה.");
    } finally {
      setLoading(false);
    }
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!verified) {
      setMessage("יש לאמת את מספר הטלפון לפני שליחת ההזמנה.");
      return;
    }

    if (selectedItems.length === 0) {
      setMessage("נא לבחור לפחות מוצר אחד.");
      return;
    }

    if (!address.trim()) {
      setMessage("נא להזין כתובת מלאה.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          phone,
          address,
          items: selectedItems,
          installation_required: installation === "כן",
          notes,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "שליחת ההזמנה נכשלה");

      setMessage("ההזמנה התקבלה בהצלחה! תודה על השתתפותך בקמפיין.");
      setName("");
      setPhone("");
      setCode("");
      setAddress("");
      setItems({});
      setInstallation("לא");
      setNotes("");
      setOtpSent(false);
      setVerified(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "אירעה שגיאה.");
    } finally {
      setLoading(false);
    }
  }

  function updateQuantity(id: string, value: number) {
    setItems((current) => ({
      ...current,
      [id]: Math.max(0, Math.min(99, value)),
    }));
  }

  return (
    <section className="order-section" id="order">
      <div className="order-heading">
        <span className="section-kicker">מצטרפים לפעילות</span>
        <h2>מזמינים ומפיצים את הבשורה</h2>
        <p>ממלאים את הפרטים, בוחרים את המוצרים ונציג מטעמנו יחזור אליכם.</p>
      </div>

      <form className="order-form" onSubmit={submitOrder}>
        <label className="form-label">
          שם מלא
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="שם פרטי ומשפחה"
            autoComplete="name"
          />
        </label>

        <div className="form-label">
          מספר טלפון
          <div className="phone-row">
            <input
              required
              type="tel"
              value={phone}
              disabled={verified}
              onChange={(event) => {
                setPhone(event.target.value);
                setVerified(false);
                setOtpSent(false);
              }}
              placeholder="05X-XXXXXXX"
              autoComplete="tel"
            />
            {!verified && (
              <button type="button" onClick={sendCode} disabled={loading}>
                {loading ? "שולח..." : otpSent ? "שלח שוב" : "שליחת קוד"}
              </button>
            )}
            {verified && <span className="verified-label">הטלפון אומת ✓</span>}
          </div>
        </div>

        {otpSent && !verified && (
          <div className="form-label">
            קוד אימות שקיבלת ב־SMS
            <div className="phone-row">
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="קוד אימות"
              />
              <button type="button" onClick={verifyCode} disabled={loading}>
                {loading ? "בודק..." : "אימות"}
              </button>
            </div>
          </div>
        )}

        <label className="form-label">
          כתובת מלאה
          <input
            required
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="עיר, רחוב ומספר בית"
            autoComplete="street-address"
          />
          <small>בשלב הבא נחבר השלמת כתובת באמצעות Google Maps.</small>
        </label>

        <div className="products-picker">
          <h3>בחירת מוצרים</h3>
          <p>בחרו את המוצרים ואת הכמות הרצויה.</p>
          {products.map((product) => (
            <div className="product-choice" key={product.id}>
              <span>{product.name}</span>
              <div className="quantity-control">
                <button
                  type="button"
                  aria-label={`הפחתת כמות ${product.name}`}
                  onClick={() =>
                    updateQuantity(product.id, (items[product.id] || 0) - 1)
                  }
                >
                  −
                </button>
                <input
                  aria-label={`כמות ${product.name}`}
                  type="number"
                  min="0"
                  max="99"
                  value={items[product.id] || 0}
                  onChange={(event) =>
                    updateQuantity(product.id, Number(event.target.value))
                  }
                />
                <button
                  type="button"
                  aria-label={`הוספת כמות ${product.name}`}
                  onClick={() =>
                    updateQuantity(product.id, (items[product.id] || 0) + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <fieldset className="installation-field">
          <legend>האם נדרשת התקנה?</legend>
          <label>
            <input
              type="radio"
              name="installation"
              value="כן"
              checked={installation === "כן"}
              onChange={() => setInstallation("כן")}
            />
            כן
          </label>
          <label>
            <input
              type="radio"
              name="installation"
              value="לא"
              checked={installation === "לא"}
              onChange={() => setInstallation("לא")}
            />
            לא
          </label>
        </fieldset>

        <label className="form-label">
          הערות נוספות
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            placeholder="פרטים נוספים שחשוב לנו לדעת..."
          />
        </label>

        {message && (
          <div className="form-message" role="status">
            {message}
          </div>
        )}

        <button className="submit-order" type="submit" disabled={loading}>
          {loading ? "שולח הזמנה..." : "שליחת הזמנה"}
        </button>

        <p className="form-disclaimer">
          שליחת הטופס אינה כרוכה בתשלום. פרטי ההזמנה ישמשו לצורך יצירת קשר
          ותיאום הפעילות.
        </p>
      </form>
    </section>
  );
}
