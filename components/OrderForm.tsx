
"use client";

import { useState } from "react";

const products = [
  { id: "flag", name: "דגלי קבלת המלכות" },
  { id: "sign", name: "שלטי קבלת המלכות" },
  { id: "sticker", name: "מדבקות קמפיין" },
  { id: "kit", name: "ערכת פרסום לבית" },
];

export default function OrderForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState<Record<string, number>>({});
  const [installation, setInstallation] = useState("לא");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function api(url: string, data: object) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "הפעולה נכשלה.");
    }

    return result;
  }

  async function sendCode() {
    setMessage("");

    if (phone.replace(/\D/g, "").length < 9) {
      setMessage("נא להזין מספר טלפון תקין.");
      return;
    }

    setLoading(true);

    try {
      await api("/api/otp/send", { phone });
      setOtpSent(true);
      setVerified(false);
      setVerificationToken("");
      setMessage("קוד אימות נשלח.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "שגיאה.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    setLoading(true);
    setMessage("");

    try {
      const result = await api("/api/otp/verify", {
        phone,
        code,
      });

      setVerified(true);
      setVerificationToken(result.verificationToken);
      setMessage("מספר הטלפון אומת בהצלחה.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "שגיאה.");
    } finally {
      setLoading(false);
    }
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const selectedItems = products
      .filter((product) => (items[product.id] || 0) > 0)
      .map((product) => ({
        product_id: product.id,
        quantity: items[product.id],
      }));

    if (!verified || !verificationToken) {
      setMessage("יש לאמת את מספר הטלפון.");
      return;
    }

    if (selectedItems.length === 0) {
      setMessage("נא לבחור לפחות מוצר אחד.");
      return;
    }

    setLoading(true);

    try {
      await api("/api/orders", {
        full_name: name,
        phone,
        verificationToken,
        address,
        items: selectedItems,
        installation_required: installation === "כן",
        notes,
      });

      setMessage("ההזמנה התקבלה בהצלחה!");

      setName("");
      setPhone("");
      setCode("");
      setAddress("");
      setItems({});
      setInstallation("לא");
      setNotes("");
      setOtpSent(false);
      setVerified(false);
      setVerificationToken("");

    } catch (error) {
      setMessage(error instanceof Error ? error.message : "שגיאה.");
    } finally {
      setLoading(false);
    }
  }

  function updateQuantity(id: string, quantity: number) {
    setItems((current) => ({
      ...current,
      [id]: Math.max(0, Math.min(99, quantity)),
    }));
  }

  return (
    <section className="order-section">
      <div className="order-heading">
        <span className="section-kicker">מצטרפים לפעילות</span>
        <h2>מזמינים ומפיצים את הבשורה</h2>
        <p>ממלאים את הפרטים, בוחרים מוצרים ונציג יחזור אליכם.</p>
      </div>

      <form className="order-form" onSubmit={submitOrder}>
        <label className="form-label">
          שם מלא
          <input required value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name" placeholder="שם פרטי ומשפחה" />
        </label>

        <div className="form-label">
          מספר טלפון
          <div className="phone-row">
            <input required type="tel" value={phone}
              disabled={verified}
              onChange={(e) => {
                setPhone(e.target.value);
                setOtpSent(false);
                setVerified(false);
                setVerificationToken("");
                setCode("");
              }}
              placeholder="05X-XXXXXXX" />
            {!verified && (
              <button type="button" onClick={sendCode} disabled={loading}>
                {loading ? "שולח..." : otpSent ? "שלח שוב" : "שליחת קוד"}
              </button>
            )}
            {verified && <span>הטלפון אומת ✓</span>}
          </div>
        </div>

        {otpSent && !verified && (
          <div className="form-label">
            קוד אימות
            <div className="phone-row">
              <input value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric" placeholder="קוד שקיבלת ב-SMS" />
              <button type="button" onClick={verifyCode} disabled={loading}>
                אימות
              </button>
            </div>
          </div>
        )}

        <label className="form-label">
          כתובת מלאה
          <input required value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="עיר, רחוב ומספר בית" />
        </label>

        <div className="products-picker">
          <h3>בחירת מוצרים</h3>
          {products.map((product) => (
            <div className="product-choice" key={product.id}>
              <span>{product.name}</span>
              <div className="quantity-control">
                <button type="button"
                  onClick={() => updateQuantity(
                    product.id,
                    (items[product.id] || 0) - 1
                  )}>−</button>
                <input type="number" min="0" max="99"
                  value={items[product.id] || 0}
                  onChange={(e) => updateQuantity(
                    product.id,
                    Number(e.target.value)
                  )} />
                <button type="button"
                  onClick={() => updateQuantity(
                    product.id,
                    (items[product.id] || 0) + 1
                  )}>+</button>
              </div>
            </div>
          ))}
        </div>

        <fieldset className="installation-field">
          <legend>האם נדרשת התקנה?</legend>
          <label>
            <input type="radio" name="installation"
              checked={installation === "כן"}
              onChange={() => setInstallation("כן")} /> כן
          </label>
          <label>
            <input type="radio" name="installation"
              checked={installation === "לא"}
              onChange={() => setInstallation("לא")} /> לא
          </label>
        </fieldset>

        <label className="form-label">
          הערות נוספות
          <textarea rows={4} value={notes}
            onChange={(e) => setNotes(e.target.value)} />
        </label>

        {message && (
          <div className="form-message" role="status">
            {message}
          </div>
        )}

        <button className="submit-order" type="submit" disabled={loading}>
          {loading ? "שולח..." : "שליחת הזמנה"}
        </button>

        <p className="form-disclaimer">
          שליחת הטופס אינה כרוכה בתשלום.
        </p>
      </form>
    </section>
  );
}
