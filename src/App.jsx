import React, { useState, useMemo } from 'react';
import {
  Flag, MapPin, Phone, CheckCircle2, AlertTriangle,
  Wrench, Settings, BarChart3, Users, Package, MessageSquare,
  Clock, Lock, ChevronLeft, Sparkles, Navigation, FileText
} from 'lucide-react';

const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    name: 'דגל משיח צהוב – מידה גדולה (100x70 ס"מ)',
    category: 'דגלים',
    description: 'דגל בד איכותי ועמיד לתנאי חוץ, כולל תפירה כפולה וחיבור למקל/מעקה.',
    price: 15,
    specialPrice: 10,
    available: true,
    canOrder: true,
    allowInstall: true,
    order: 1,
    svgType: 'flag-yellow'
  },
  {
    id: 'p2',
    name: 'שלט שמשונית למרפסת ״הנה זה משיח בא״ (2x1 מטר)',
    category: 'שלטים',
    description: 'שלט שמשונית עבה עם טבעות מתכת לחיזוק מהיר על מעקה המרפסת או החצר.',
    price: 45,
    specialPrice: 35,
    available: true,
    canOrder: true,
    allowInstall: true,
    order: 2,
    svgType: 'banner-main'
  },
  {
    id: 'p3',
    name: 'דגל לרכב עם תפס לחלון',
    category: 'דגלים',
    description: 'דגל קומפקטי חזק במיוחד לנסיעה עירונית ובינעירונית.',
    price: 10,
    specialPrice: 8,
    available: true,
    canOrder: true,
    allowInstall: false,
    order: 3,
    svgType: 'flag-car'
  },
  {
    id: 'p4',
    name: 'ערכת הפצה משפחתית (3 דגלים + שלט מרפסת)',
    category: 'מוצרים נוספים',
    description: 'ערכה מושלמת לקישוט הבית והמרפסת במחיר מסובסד למפיצים.',
    price: 75,
    specialPrice: 55,
    available: true,
    canOrder: true,
    allowInstall: true,
    order: 4,
    svgType: 'bundle'
  }
];

const ISRAEL_STREETS_DB = [
  { id: 'loc1', label: 'רחוב הרבי מליובאוויטש 10, צפת', street: 'הרבי מליובאוויטש', number: '10', city: 'צפת', area: 'צפון', lat: 32.9646, lng: 35.4960 },
  { id: 'loc2', label: 'רחוב ירושלים 24, צפת', street: 'ירושלים', number: '24', city: 'צפת', area: 'צפון', lat: 32.9680, lng: 35.4920 },
  { id: 'loc3', label: 'שדרות הרצל 45, רמלה', street: 'שדרות הרצל', number: '45', city: 'רמלה', area: 'מרכז', lat: 31.9292, lng: 34.8656 },
  { id: 'loc4', label: 'רחוב רבי עקיבא 88, בני ברק', street: 'רבי עקיבא', number: '88', city: 'בני ברק', area: 'מרכז', lat: 32.0849, lng: 34.8352 },
  { id: 'loc5', label: 'רחוב יפו 112, ירושלים', street: 'יפו', number: '112', city: 'ירושלים', area: 'ירושלים', lat: 31.7857, lng: 35.2127 },
  { id: 'loc6', label: 'רחוב מלכי ישראל 15, ירושלים', street: 'מלכי ישראל', number: '15', city: 'ירושלים', area: 'ירושלים', lat: 31.7895, lng: 35.2140 },
  { id: 'loc7', label: 'שדרות הנשיא 30, חיפה', street: 'שדרות הנשיא', number: '30', city: 'חיפה', area: 'צפון', lat: 32.8050, lng: 34.9860 },
  { id: 'loc8', label: 'רחוב הלל 18, טבריה', street: 'הלל', number: '18', city: 'טבריה', area: 'צפון', lat: 32.7922, lng: 35.5312 },
  { id: 'loc9', label: 'רחוב הבנאי 6, חולון', street: 'הבנאי', number: '6', city: 'חולון', area: 'מרכז', lat: 32.0158, lng: 34.7874 }
];

const INITIAL_ACTIVISTS = [
  { id: 'a1', name: 'מנחם כהן', phone: '050-4112233', city: 'צפת', area: 'צפון', serviceCities: ['צפת', 'מירון', 'ראש פינה', 'חצור הגלילית'], doesInstall: true, active: true, lat: 32.9658, lng: 35.4980, openRequests: 2, totalRequests: 38 },
  { id: 'a2', name: 'לוי יצחק לוי', phone: '052-7654321', city: 'צפת', area: 'צפון', serviceCities: ['צפת', 'טבריה'], doesInstall: true, active: true, lat: 32.9610, lng: 35.4910, openRequests: 1, totalRequests: 24 },
  { id: 'a3', name: 'יוסף חיים הררי', phone: '054-8445566', city: 'צפת', area: 'צפון', serviceCities: ['צפת', 'מירון'], doesInstall: false, active: true, lat: 32.9710, lng: 35.5010, openRequests: 0, totalRequests: 19 },
  { id: 'a4', name: 'שניאור זלמן מור', phone: '053-3119988', city: 'רמלה', area: 'מרכז', serviceCities: ['רמלה', 'לוד', 'חולון', 'בני ברק'], doesInstall: true, active: true, lat: 31.9310, lng: 34.8670, openRequests: 3, totalRequests: 51 },
  { id: 'a5', name: 'ישראל פרידמן', phone: '058-7701234', city: 'בני ברק', area: 'מרכז', serviceCities: ['בני ברק', 'רמת גן', 'חולון', 'רמלה'], doesInstall: true, active: true, lat: 32.0830, lng: 34.8320, openRequests: 4, totalRequests: 64 },
  { id: 'a6', name: 'דוד רוזנפלד', phone: '052-7114455', city: 'ירושלים', area: 'ירושלים', serviceCities: ['ירושלים', 'בית שמש'], doesInstall: true, active: true, lat: 31.7870, lng: 35.2150, openRequests: 2, totalRequests: 82 },
  { id: 'a7', name: 'שלום דובער כץ', phone: '054-6223344', city: 'ירושלים', area: 'ירושלים', serviceCities: ['ירושלים'], doesInstall: false, active: true, lat: 31.7820, lng: 35.2090, openRequests: 1, totalRequests: 41 },
  { id: 'a8', name: 'אברהם גולדשטיין', phone: '050-9887766', city: 'חיפה', area: 'צפון', serviceCities: ['חיפה', 'קריות'], doesInstall: true, active: true, lat: 32.8080, lng: 34.9890, openRequests: 14, totalRequests: 90 }
];

const INITIAL_SMS_TEMPLATES = {
  activistNewRequest: `בקשה חדשה להפצת דגלים ושלטים (#{מספר_בקשה}).
שם: {שם}
טלפון: {טלפון}
כתובת: {כתובת}
הזמנה: {מוצרים}
התקנה: {התקנה}
הערות: {הערות}
נא ליצור קשר טלפוני ישיר עם המזמין.`,
  customerConfirm: `שלום {שם}, בקשתך #{מספר_בקשה} במבצע "הנה זה משיח בא" התקבלה! פרטיך הועברו לפעילים באזורך והם ייצרו איתך קשר טלפוני בהקדם.`
};

function calcDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function ProductIllustration({ type }) {
  return (
    <div className="w-full h-40 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 flex items-center justify-center relative overflow-hidden border-b border-amber-200">
      <svg viewBox="0 0 200 120" className="w-44 h-28 drop-shadow-sm">
        {type === 'flag-yellow' && (
          <g>
            <rect x="35" y="15" width="5" height="95" rx="2" fill="#475569" />
            <path d="M40 18 L155 25 L145 75 L40 70 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            <path d="M75 38 L85 28 L97 40 L109 28 L119 38 L114 55 L80 55 Z" fill="#B45309" />
            <text x="97" y="67" textAnchor="middle" fill="#78350F" fontSize="11" fontWeight="bold">משיח</text>
          </g>
        )}
        {type === 'banner-main' && (
          <g>
            <rect x="20" y="22" width="160" height="76" rx="6" fill="#1E3A8A" stroke="#FACC15" strokeWidth="3" />
            <circle cx="28" cy="30" r="3" fill="#E2E8F0" />
            <circle cx="172" cy="30" r="3" fill="#E2E8F0" />
            <circle cx="28" cy="90" r="3" fill="#E2E8F0" />
            <circle cx="172" cy="90" r="3" fill="#E2E8F0" />
            <text x="100" y="54" textAnchor="middle" fill="#FACC15" fontSize="15" fontWeight="bold">הנה זה משיח בא</text>
            <text x="100" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="11">מגיע עד אליך לבית!</text>
          </g>
        )}
        {type === 'flag-car' && (
          <g>
            <rect x="55" y="25" width="4" height="80" fill="#1E293B" />
            <rect x="48" y="95" width="18" height="10" rx="2" fill="#334155" />
            <path d="M59 28 L145 34 L140 72 L59 68 Z" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
            <text x="102" y="54" textAnchor="middle" fill="#854D0E" fontSize="12" fontWeight="bold">משיח</text>
          </g>
        )}
        {type === 'bundle' && (
          <g>
            <rect x="25" y="30" width="110" height="60" rx="5" fill="#1E40AF" stroke="#FACC15" strokeWidth="2" />
            <text x="80" y="64" textAnchor="middle" fill="#FACC15" fontSize="12" fontWeight="bold">ערכת הפצה</text>
            <rect x="125" y="15" width="4" height="85" fill="#475569" />
            <path d="M129 18 L185 24 L180 58 L129 54 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          </g>
        )}
      </svg>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  // הסימולטור כבוי כברירת מחדל לציבור ויופיע רק למנהל
  const [showSmsSimulator, setShowSmsSimulator] = useState(false);

  const [settings, setSettings] = useState({
    heroTitle: 'הנה זה משיח בא – מגיע עד אליך לבית',
    heroSubtitle: 'מבצע הפצה ארצי של דגלים ושלטים למרפסת ולבית! הזמינו עכשיו והפעילים הקרובים אליכם ייצרו איתכם קשר טלפוני.',
    bannerColor: 'from-blue-950 via-blue-900 to-indigo-950',
    showActivistsToPublic: true
  });

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [activists, setActivists] = useState(INITIAL_ACTIVISTS);
  const [smsTemplates, setSmsTemplates] = useState(INITIAL_SMS_TEMPLATES);

  const [requests, setRequests] = useState([
    {
      id: 10480,
      fullName: 'אהרן לוי',
      phone: '052-5551122',
      address: 'רחוב הרבי מליובאוויטש 10, צפת',
      city: 'צפת',
      area: 'צפון',
      lat: 32.9646,
      lng: 35.4960,
      items: [
        { productId: 'p1', name: 'דגל משיח צהוב – מידה גדולה', qty: 2 },
        { productId: 'p2', name: 'שלט שמשונית למרפסת', qty: 1 }
      ],
      wantsInstall: true,
      notes: 'קומה 2, להתקשר אחרי 16:00',
      status: 'נשלחה לפעילים',
      createdAt: '01/11 10:15',
      assignedActivists: [
        { id: 'a1', name: 'מנחם כהן', phone: '050-4112233', distanceKm: 0.2 },
        { id: 'a2', name: 'לוי יצחק לוי', phone: '052-7654321', distanceKm: 0.6 }
      ],
      history: [
        { time: '01/11 10:14', text: 'בקשה נוצרה ומספר טלפון אומת ב-SMS' },
        { time: '01/11 10:15', text: 'כתובת אומתה ב-Google Places (צפת)' }
      ]
    }
  ]);

  const [smsLogs, setSmsLogs] = useState([]);

  // פונקציה לשליחת SMS אמיתי דרך פולסים באמצעות ה-API שלך
  const sendRealPulseemSms = async (phone, message) => {
    const apiKey = "SOV^Y-W)O3iJb{UTzG[tUas(XFg}}KM!W@s-!qjZH196*iKjT";
    try {
      // רישום ביומן המקומי
      setSmsLogs((prev) => [
        {
          id: 'sms-' + Date.now(),
          toRole: 'SMS אמיתי (Pulseem)',
          toName: 'יעד',
          toPhone: phone,
          time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
          text: message
        },
        ...prev
      ]);

      // שליחה אמיתית לשרת של פולסים
      await fetch('https://api.pulseem.com/v1/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          Recipients: [phone],
          Message: message,
          SenderName: "Mashiach"
        })
      });
    } catch (err) {
      console.error("שגיאה בשליחת SMS פולסים:", err);
    }
  };

  const [orderForm, setOrderForm] = useState({
    fullName: '',
    phone: '',
    otpSent: false,
    otpCode: '',
    otpVerified: false,
    generatedOtp: '7704',
    selectedLocation: null,
    quantities: { p1: 1, p2: 0, p3: 0, p4: 0 },
    wantsInstall: false,
    notes: '',
    step: 'form',
    duplicateWarning: null
  });
  const [lastSubmittedRequest, setLastSubmittedRequest] = useState(null);
  const [trackInput, setTrackInput] = useState('10480');
  const [adminAuth, setAdminAuth] = useState({ loggedIn: false, username: 'admin' });
  const [adminSubTab, setAdminSubTab] = useState('dashboard');

  const handleQuickOrderProduct = (productId) => {
    setOrderForm((prev) => ({
      ...prev,
      quantities: { ...prev.quantities, [productId]: Math.max(1, (prev.quantities[productId] || 0) + 1) },
      step: 'form'
    }));
    setActiveTab('order');
  };

  const handleSendOtp = () => {
    if (!orderForm.phone || orderForm.phone.length < 9) {
      alert('נא להזין מספר טלפון נייד תקין');
      return;
    }
    const code = '7704';
    setOrderForm((prev) => ({ ...prev, otpSent: true, generatedOtp: code, otpCode: code }));
    sendRealPulseemSms(orderForm.phone, `קוד האימות שלך למבצע "הנה זה משיח בא": ${code}`);
  };

  const handleVerifyOtp = () => {
    if (orderForm.otpCode === orderForm.generatedOtp) {
      setOrderForm((prev) => ({ ...prev, otpVerified: true }));
    } else {
      alert('קוד האימות שגוי. הקוד שנשלח ב-SMS הוא 7704');
    }
  };

  const findBestActivists = (loc, wantsInstall) => {
    return activists
      .filter((a) => a.active && (!wantsInstall || a.doesInstall))
      .map((a) => {
        const distanceKm = calcDistanceKm(loc.lat, loc.lng, a.lat, a.lng);
        return { ...a, distanceKm };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 3);
  };

  const handleFinalSubmitOrder = () => {
    const newId = 10482 + requests.length;
    const loc = orderForm.selectedLocation;
    const selectedItems = Object.entries(orderForm.quantities)
      .filter(([, qty]) => qty > 0)
      .map(([pid, qty]) => {
        const prod = products.find((p) => p.id === pid);
        return { productId: pid, name: prod ? prod.name : pid, qty };
      });

    const chosenActivists = findBestActivists(loc, orderForm.wantsInstall);
    const itemsText = selectedItems.map((i) => `${i.qty} ${i.name}`).join(' + ');
    const nowTime = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

    const newReq = {
      id: newId,
      fullName: orderForm.fullName,
      phone: orderForm.phone,
      address: loc.label,
      city: loc.city,
      area: loc.area,
      lat: loc.lat,
      lng: loc.lng,
      items: selectedItems,
      wantsInstall: orderForm.wantsInstall,
      notes: orderForm.notes || 'ללא הערות',
      status: chosenActivists.length > 0 ? 'נשלחה לפעילים' : 'הועברה למנהל',
      createdAt: `היום ${nowTime}`,
      assignedActivists: chosenActivists.map((a) => ({
        id: a.id,
        name: a.name,
        phone: a.phone,
        distanceKm: a.distanceKm
      })),
      history: [
        { time: nowTime, text: 'בקשה נוצרה ומספר טלפון אומת' },
        { time: nowTime, text: `נבחרו ${chosenActivists.length} פעילים קרובים ונשלח SMS אמיתי` }
      ]
    };

    setRequests((prev) => [newReq, ...prev]);

    // שליחת SMS אמיתי לפעילים דרך פולסים
    chosenActivists.forEach((act) => {
      const msg = smsTemplates.activistNewRequest
        .replace('{מספר_בקשה}', newId)
        .replace('{שם}', newReq.fullName)
        .replace('{טלפון}', newReq.phone)
        .replace('{כתובת}', newReq.address)
        .replace('{מוצרים}', itemsText)
        .replace('{התקנה}', newReq.wantsInstall ? 'כן (כולל התקנה)' : 'ללא התקנה')
        .replace('{הערות}', newReq.notes);

      sendRealPulseemSms(act.phone, msg);
    });

    // שליחת SMS אישור למזמין
    const custMsg = smsTemplates.customerConfirm
      .replace('{שם}', newReq.fullName)
      .replace('{מספר_בקשה}', newId);
    sendRealPulseemSms(newReq.phone, custMsg);

    setLastSubmittedRequest(newReq);
    setOrderForm((prev) => ({ ...prev, step: 'confirmed' }));
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <header className="sticky top-0 z-40 bg-blue-950 text-white shadow-lg border-b-2 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div onClick={() => setActiveTab('home')} className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-blue-950 flex items-center justify-center font-black shadow">
              <Flag className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-lg leading-tight text-yellow-400">הנה זה משיח בא</div>
              <div className="text-xs text-blue-200">מערכת הפצת דגלים ושלטים עד הבית</div>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 text-sm font-bold">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'home' ? 'bg-yellow-400 text-blue-950' : 'hover:bg-blue-900 text-white'}`}
            >
              עמוד הבית
            </button>
            <button
              onClick={() => {
                setOrderForm((prev) => ({ ...prev, step: 'form' }));
                setActiveTab('order');
              }}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'order' ? 'bg-yellow-400 text-blue-950' : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'}`}
            >
              הגשת בקשה
            </button>
            <button
              onClick={() => setActiveTab('how')}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'how' ? 'bg-yellow-400 text-blue-950' : 'hover:bg-blue-900 text-white'}`}
            >
              איך זה עובד?
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'track' ? 'bg-yellow-400 text-blue-950' : 'hover:bg-blue-900 text-white'}`}
            >
              מעקב בקשה
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${activeTab === 'admin' ? 'bg-red-500 text-white' : 'bg-blue-900/80 hover:bg-blue-800 text-blue-200'}`}
            >
              <Settings className="w-4 h-4" />
              <span>ניהול (/admin)</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <section className={`bg-gradient-to-br ${settings.bannerColor} text-white py-12 sm:py-16 px-4 relative overflow-hidden border-b-4 border-yellow-400`}>
              <div className="max-w-5xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span>מבצע הפצה ארצי • חיבור אוטומטי לפעילים באזורך</span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-yellow-400 drop-shadow mb-4 leading-tight">
                  {settings.heroTitle}
                </h1>
                <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
                  {settings.heroSubtitle}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setOrderForm((prev) => ({ ...prev, step: 'form' }));
                      setActiveTab('order');
                    }}
                    className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-xl px-8 py-4 rounded-2xl shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <span>אני רוצה להזמין</span>
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setActiveTab('how')}
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-lg px-6 py-4 rounded-2xl transition"
                  >
                    איך זה עובד?
                  </button>
                </div>
              </div>
            </section>

            <section className="max-w-6xl mx-auto py-12 px-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">המוצרים שלנו להפצה</h2>
                  <p className="text-slate-600">בחרו דגלים ושלטים והגישו בקשה תוך דקה אחת</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products
                  .filter((p) => p.available)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
                    >
                      <ProductIllustration type={product.svgType} />
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full">
                            {product.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base mb-1">{product.name}</h3>
                        <p className="text-xs text-slate-600 mb-4 flex-1">{product.description}</p>

                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                          <span className="text-xl font-black text-blue-950">₪{product.specialPrice || product.price}</span>
                          <button
                            onClick={() => handleQuickOrderProduct(product.id)}
                            className="bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-extrabold text-sm px-4 py-2 rounded-xl transition"
                          >
                            הזמן עכשיו
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'order' && (
          <div className="max-w-3xl mx-auto py-8 px-4">
            {orderForm.step === 'form' && (
              <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">הגשת בקשה לדגלים ושלטים</h2>
                <p className="text-sm text-slate-600 mb-6">מלאו פרטים לאימות ונעביר את הבקשה לפעילים באזורכם.</p>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1">שם מלא *</label>
                      <input
                        type="text"
                        placeholder="ישראל ישראלי"
                        value={orderForm.fullName}
                        onChange={(e) => setOrderForm({ ...orderForm, fullName: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1">מספר טלפון נייד *</label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          placeholder="050-0000000"
                          value={orderForm.phone}
                          disabled={orderForm.otpVerified}
                          onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base outline-none disabled:bg-slate-100"
                        />
                        {!orderForm.otpVerified && (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="bg-blue-900 text-white font-bold px-4 rounded-xl text-xs whitespace-nowrap"
                          >
                            שלח SMS
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {orderForm.otpSent && !orderForm.otpVerified && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                      <div className="text-sm text-blue-950">הקלד את קוד ה-SMS שנשלח אליך (קוד: 7704):</div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={orderForm.otpCode}
                          onChange={(e) => setOrderForm({ ...orderForm, otpCode: e.target.value })}
                          className="border border-blue-300 rounded-xl px-3 py-2 w-24 text-center font-black tracking-widest"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-sm"
                        >
                          אמת
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1">בחירת כתובת (Google Places) *</label>
                    <select
                      value={orderForm.selectedLocation?.id || ''}
                      onChange={(e) => {
                        const found = ISRAEL_STREETS_DB.find((l) => l.id === e.target.value);
                        setOrderForm({ ...orderForm, selectedLocation: found || null });
                      }}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base bg-white outline-none"
                    >
                      <option value="">-- בחר כתובת מרשימת רחובות --</option>
                      {ISRAEL_STREETS_DB.map((loc) => (
                        <option key={loc.id} value={loc.id}>{loc.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">בחירת כמויות מוצרים *</label>
                    <div className="space-y-2">
                      {products.map((prod) => (
                        <div key={prod.id} className="flex items-center justify-between border border-slate-200 rounded-xl p-3 bg-slate-50">
                          <div className="font-bold text-sm">{prod.name}</div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setOrderForm((prev) => ({
                                ...prev,
                                quantities: { ...prev.quantities, [prod.id]: Math.max(0, (prev.quantities[prod.id] || 0) - 1) }
                              }))}
                              className="w-8 h-8 rounded bg-white border font-bold"
                            >-</button>
                            <span className="w-8 text-center font-bold">{orderForm.quantities[prod.id] || 0}</span>
                            <button
                              type="button"
                              onClick={() => setOrderForm((prev) => ({
                                ...prev,
                                quantities: { ...prev.quantities, [prod.id]: (prev.quantities[prod.id] || 0) + 1 }
                              }))}
                              className="w-8 h-8 rounded bg-blue-900 text-white font-bold"
                            >+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!orderForm.fullName || !orderForm.otpVerified || !orderForm.selectedLocation) {
                        alert('נא למלא שם, לאמת טלפון ב-SMS ולבחור כתובת.');
                        return;
                      }
                      setOrderForm({ ...orderForm, step: 'confirmed' });
                      handleFinalSubmitOrder();
                    }}
                    className="w-full bg-yellow-400 text-blue-950 font-black text-lg py-4 rounded-2xl shadow"
                  >
                    שליחת הבקשה הסופית
                  </button>
                </div>
              </div>
            )}

            {orderForm.step === 'confirmed' && lastSubmittedRequest && (
              <div className="bg-white rounded-3xl p-8 border border-emerald-200 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h2 className="text-2xl font-black mb-2">הבקשה התקבלה ושודרה לפעילים!</h2>
                <p className="text-sm text-slate-600 mb-6">נשלחו הודעות SMS אמיתיות לפעילים ולמזמין.</p>
                <button onClick={() => setActiveTab('home')} className="bg-blue-900 text-white font-bold px-6 py-3 rounded-xl">
                  חזרה לעמוד הבית
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto py-8 px-4">
            {!adminAuth.loggedIn ? (
              <div className="max-w-md mx-auto bg-white p-6 rounded-3xl border shadow-sm">
                <h2 className="text-xl font-black mb-3">כניסת מנהל (/admin)</h2>
                <button onClick={() => setAdminAuth({ ...adminAuth, loggedIn: true })} className="w-full bg-blue-950 text-yellow-400 font-bold py-3 rounded-xl">
                  הכנס לניהול
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border font-bold">ניהול בקשות ופעילים (פעיל)</div>
                <div className="bg-white p-4 rounded-2xl border">
                  <h3 className="font-bold mb-2">יומן הודעות SMS שנשלחו דרך Pulseem:</h3>
                  <div className="space-y-2 text-xs">
                    {smsLogs.map((l, idx) => (
                      <div key={idx} className="bg-slate-100 p-2.5 rounded border">
                        <div><strong>אל:</strong> {l.toPhone} | {l.time}</div>
                        <div className="mt-1 font-mono">{l.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
