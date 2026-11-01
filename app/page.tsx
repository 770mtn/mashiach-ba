
import Link from "next/link";
import OrderForm from "@/components/OrderForm";

const products = [
  {
    id: 1,
    name: "דגל משיח",
    description: "דגל להפצה ולתלייה",
    price: "להגדרה",
    symbol: "🚩"
  },
  {
    id: 2,
    name: "שלט משיח",
    description: "שלט לתלייה בבית או בחוץ",
    price: "להגדרה",
    symbol: "✦"
  },
  {
    id: 3,
    name: "מוצרי הקמפיין",
    description: "מוצרי הפצה נוספים",
    price: "להגדרה",
    symbol: "⭐"
  }
];

export default function Home() {
  return (
    <>
      <div className="topbar">
        הנה זה משיח בא – הקמפיין מגיע עד אליך לבית!
      </div>

      <header className="hero">
        <div className="container hero-content">
          <div className="hero-label">
            קמפיין קבלת פני משיח צדקנו
          </div>

          <h1>
            הנה זה משיח בא!
            <br />
            מגיע עד אליך לבית
          </h1>

          <p>
            דגלים, שלטים ומוצרי הקמפיין.
            בוחרים מה רוצים, משאירים פרטים,
            והפנייה מועברת לפעילים באזור שלכם.
          </p>

          <Link href="#order" className="button">
            להזמנת מוצרי הקמפיין
          </Link>
        </div>
      </header>

      <main className="container">
        <section className="section">
          <h2 className="section-title">
            מוצרי הקמפיין
          </h2>

          <p className="section-description">
            בחרו את המוצרים שתרצו להזמין.
          </p>

          <div className="products">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  {product.symbol}
                </div>

                <div className="product-content">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>

                  <div className="product-price">
                    {product.price}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="order">
          <h2 className="section-title">
            רוצים להזמין?
          </h2>

          <p className="section-description">
            מלאו את פרטי ההזמנה ונחזור אליכם.
          </p>

          <OrderForm />

        </section>
      </main>

      <footer>
        <div className="container">
          הנה זה משיח בא – מגיע עד אליך לבית
        </div>
      </footer>
    </>
  );
}
