import React, { useState, useEffect, useMemo } from 'react';
import {
  Flag, Shield, MapPin, Phone, User, CheckCircle2, AlertTriangle,
  Clock, Settings, BarChart3, Users, Package, MessageSquare,
  Search, Plus, Edit3, Trash2, Eye, EyeOff, Send, Navigation,
  Wrench, FileText, ChevronLeft, RefreshCw, Lock, Sparkles,
  Check, X, ArrowRight, Bell, Smartphone, HelpCircle, Layers
} from 'lucide-react';

// --- מאגר נתונים התחלתי ---
const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    name: 'דגל המלך המשיח – ענק למרפסת',
    category: 'דגלים',
    description: 'דגל בד איכותי עמיד לשמש ולגשם (150x100 ס"מ) עם טבעות חיזוק לתלייה במרפסת או בחצר.',
    price: 35,
    specialPrice: 25,
    available: true,
    canOrder: true,
    canInstall: true,
    order: 1,
    color: 'from-amber-400 to-yellow-500'
  },
  {
    id: 'p2',
    name: 'דגל משיח לרכב / לחלון',
    category: 'דגלים',
    description: 'דגל עם תפס חזק לחלון הרכב או הבית, הדפסה דו-צדדית בולטת.',
    price: 15,
    specialPrice: 10,
    available: true,
    canOrder: true,
    canInstall: false,
    order: 2,
    color: 'from-yellow-400 to-amber-500'
  },
  {
    id: 'p3',
    name: 'שלט שמשונית ״הנה זה משיח בא״ (2x1 מטר)',
    category: 'שלטים',
    description: 'שלט שמשונית עבה עם טבעות מתכת מסביב, מותאם למעקה מרפסת או גדר חזיתית.',
    price: 60,
    specialPrice: 45,
    available: true,
    canOrder: true,
    canInstall: true,
    order: 3,
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'p4',
    name: 'שלט מואר לדלת / כניסה לבניין',
    category: 'שלטים',
    description: 'שלט קשיח ויוקרתי לקבלת פני משיח בכניסה לבית או לבניין.',
    price: 40,
    specialPrice: null,
    available: true,
    canOrder: true,
    canInstall: true,
    order: 4,
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'p5',
    name: 'ערכת הפצה שכונתית (10 דגלים + שלט + מדבקות)',
    category: 'מוצרים נוספים',
    description: 'ערכה מוזלת לחלוקה לשכנים, לידידים ולבית הכנסת בשכונה.',
    price: 150,
    specialPrice: 110,
    available: true,
    canOrder: true,
    canInstall: true,
    order: 5,
    color: 'from-emerald-500 to-teal-600'
  }
];

const INITIAL_ACTIVISTS = [
  { id: 'a1', name: 'מנחם מענדל כהן', phone: '050-8771122', city: 'צפת', address: 'שכונת כנען, צפת', serviceAreas: ['צפת', 'מירון', 'ראש פינה', 'חצור הגלילית'], lat: 32.9646, lng: 35.4960, doesInstall: true, active: true, openRequestsCount: 2, totalAssigned: 28 },
  { id: 'a2', name: 'יוסף יצחק לוי', phone: '052-7654321', city: 'צפת', address: 'העיר העתיקה, צפת', serviceAreas: ['צפת', 'מירון'], lat: 32.9680, lng: 35.4920, doesInstall: true, active: true, openRequestsCount: 1, totalAssigned: 19 },
  { id: 'a3', name: 'שניאור זלמן פרידמן', phone: '054-5556677', city: 'ראש פינה', address: 'הגליל, ראש פינה', serviceAreas: ['ראש פינה', 'חצור הגלילית', 'צפת', 'טבריה'], lat: 32.9690, lng: 35.5420, doesInstall: false, active: true, openRequestsCount: 0, totalAssigned: 12 },
  { id: 'a4', name: 'לוי יצחק נחשוני', phone: '058-4443322', city: 'ירושלים', address: 'שיכון חב"ד, ירושלים', serviceAreas: ['ירושלים', 'ביתר עילית', 'מבשרת ציון'], lat: 31.7890, lng: 35.2160, doesInstall: true, active: true, openRequestsCount: 3, totalAssigned: 45 },
  { id: 'a5', name: 'דובער הלפרין', phone: '053-3332211', city: 'ירושלים', address: 'רמות, ירושלים', serviceAreas: ['ירושלים', 'גבעת זאב'], lat: 31.8150, lng: 35.1950, doesInstall: true, active: true, openRequestsCount: 1, totalAssigned: 31 },
  { id: 'a6', name: 'ישראל אשכנזי', phone: '050-9998877', city: 'רמלה', address: 'מרכז רמלה', serviceAreas: ['רמלה', 'לוד', 'באר יעקב', 'נס ציונה'], lat: 31.9300, lng: 34.8660, doesInstall: true, active: true, openRequestsCount: 1, totalAssigned: 22 },
  { id: 'a7', name: 'חיים מאיר גורפינקל', phone: '052-4449988', city: 'בני ברק', address: 'רבי עקיבא, בני ברק', serviceAreas: ['בני ברק', 'רמת גן', 'פתח תקווה', 'אלעד'], lat: 32.0840, lng: 34.8350, doesInstall: true, active: true, openRequestsCount: 4, totalAssigned: 39 },
  { id: 'a8', name: 'אברהם רוזנברג', phone: '054-2221199', city: 'חיפה', address: 'הדר, חיפה', serviceAreas: ['חיפה', 'קריות', 'נשר'], lat: 32.8050, lng: 34.9950, doesInstall: false, active: true, openRequestsCount: 8, totalAssigned: 41 }
];

const PLACES_DATABASE = [
  { label: 'רחוב הרבי מליובאוויטש 10, צפת', street: 'הרבי מליובאוויטש', number: '10', city: 'צפת', zip: '13200', lat: 32.9658, lng: 35.4972 },
  { label: 'רחוב ירושלים 45, צפת', street: 'ירושלים', number: '45', city: 'צפת', zip: '13100', lat: 32.9665, lng: 35.4945 },
  { label: 'דרך הרמב"ם 12, מירון', street: 'דרך הרמב"ם', number: '12', city: 'מירון', zip: '13910', lat: 32.9820, lng: 35.4420 },
  { label: 'שדרות הרצל 88, רמלה', street: 'שדרות הרצל', number: '88', city: 'רמלה', zip: '72400', lat: 31.9292, lng: 34.8656 },
  { label: 'רחוב יפו 120, ירושלים', street: 'יפו', number: '120', city: 'ירושלים', zip: '94342', lat: 31.7857, lng: 35.2128 },
  { label: 'רחוב מלכי ישראל 34, ירושלים', street: 'מלכי ישראל', number: '34', city: 'ירושלים', zip: '95501', lat: 31.7910, lng: 35.2140 },
  { label: 'רחוב רבי עקיבא 95, בני ברק', street: 'רבי עקיבא', number: '95', city: 'בני ברק', zip: '51540', lat: 32.0835, lng: 34.8342 },
  { label: 'שדרות הנשיא 50, חיפה', street: 'שדרות הנשיא', number: '50', city: 'חיפה', zip: '34642', lat: 32.8065, lng: 34.9860 },
  { label: 'רחוב הגליל 18, טבריה', street: 'הגליל', number: '18', city: 'טבריה', zip: '14200', lat: 32.7922, lng: 35.5312 },
  { label: 'רחוב החלוץ 22, חצור הגלילית', street: 'החלוץ', number: '22', city: 'חצור הגלילית', zip: '10300', lat: 32.9810, lng: 35.5450 }
];

const INITIAL_REQUESTS = [
  {
    id: '10480',
    fullName: 'אהרן פריד',
    phone: '052-8881234',
    address: 'רחוב הרבי מליובאוויטש 10, צפת',
    city: 'צפת',
    lat: 32.9658,
    lng: 35.4972,
    items: [{ productId: 'p1', name: 'דגל המלך המשיח – ענק למרפסת', qty: 2, price: 25 }, { productId: 'p3', name: 'שלט שמשונית ״הנה זה משיח בא״ (2x1 מטר)', qty: 1, price: 45 }],
    needsInstall: true,
    notes: 'קומה 3, מרפסת פונה לכביש הראשי.',
    status: 'ממתינה למעקב',
    urgent: false,
    createdAt: '27/10/2026 11:20',
    assignedActivists: [
      { id: 'a1', name: 'מנחם מענדל כהן', phone: '050-8771122', distanceKm: '0.2' },
      { id: 'a2', name: 'יוסף יצחק לוי', phone: '052-7654321', distanceKm: '0.6' }
    ],
    history: [
      { time: '27/10 11:20', text: 'בקשה נוצרה על ידי המזמין' },
      { time: '27/10 11:21', text: 'מספר טלפון אומת בקוד SMS' },
      { time: '27/10 11:21', text: 'נבחרו פעילים מתאימים (כולל התקנה) באזור צפת' },
      { time: '27/10 11:21', text: 'נשלח SMS לפעיל מנחם מענדל כהן (050-8771122)' },
      { time: '27/10 11:21', text: 'נשלח SMS לפעיל יוסף יצחק לוי (052-7654321)' }
    ]
  },
  {
    id: '10481',
    fullName: 'שמעון ביטון',
    phone: '054-7774321',
    address: 'שדרות הנשיא 50, חיפה',
    city: 'חיפה',
    lat: 32.8065,
    lng: 34.9860,
    items: [{ productId: 'p1', name: 'דגל המלך המשיח – ענק למרפסת', qty: 3, price: 25 }],
    needsInstall: false,
    notes: 'נא להתקשר אחרי השעה 17:00',
    status: 'לא נוצר קשר',
    urgent: true,
    createdAt: '22/10/2026 09:15',
    assignedActivists: [
      { id: 'a8', name: 'אברהם רוזנברג', phone: '054-2221199', distanceKm: '0.9' }
    ],
    history: [
      { time: '22/10 09:15', text: 'בקשה נוצרה ואומתה ב-SMS' },
      { time: '22/10 09:16', text: 'נשלח SMS לפעיל אברהם רוזנברג' },
      { time: '29/10 10:00', text: 'חלפו 5 ימי עסקים – נשלח SMS מעקב למזמין' },
      { time: '29/10 10:14', text: '🚨 המזמין דיווח: לא יצרו איתי קשר. הועבר להתראת מנהל!' }
    ]
  }
];

const INITIAL_TEMPLATES = {
  activistSms: 'בקשה חדשה להפצת דגלים ושלטים (#{מספר_בקשה}).\nשם: {שם}\nטלפון: {טלפון}\nכתובת: {כתובת}\nהזמנה: {מוצרים}\nהתקנה: {התקנה}\nהערות: {הערות}\nאנא צור קשר טלפוני עם המזמין לתיאום.',
  customerConfirmSms: 'שלום {שם}, בקשתך #{מספר_בקשה} במבצע "הנה זה משיח בא" התקבלה! העברנו את פנייתך ל-3 פעילים באזורך שיצרו איתך קשר טלפוני בהקדם.',
  followup5DaysSms: 'שלום {שם}, לפני 5 ימי עסקים הזמנת דגלים/שלטים (בקשה #{מספר_בקשה}). האם אחד הפעילים כבר יצר איתך קשר?',
  adminAlertSms: '🚨 התראת מנהל: בקשה #{מספר_בקשה} של {שם} ({טלפון}, {כתובת}) לא קיבלה מענה מהפעילים לאחר 5 ימי עסקים!'
};

// חישוב מרחק אווירי בק"מ (Haversine)
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
  return R * c;
}

export default function App() {
  // --- מצב ראשי וניווט ---
  const [view, setView] = useState('home'); // home | order | how | track | admin
  const [adminTab, setAdminTab] = useState('dashboard'); // dashboard | requests | activists | map | products | sms | stats | settings
  const [isAdminLogged, setIsAdminLogged] = useState(true);
  const [showSmsDrawer, setShowSmsDrawer] = useState(false);

  // --- נתוני המערכת (עם שמירה ב-localStorage) ---
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('mashiach_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [activists, setActivists] = useState(() => {
    const saved = localStorage.getItem('mashiach_activists');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVISTS;
  });
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('mashiach_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });
  const [smsTemplates, setSmsTemplates] = useState(() => {
    const saved = localStorage.getItem('mashiach_templates');
    return saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
  });
  const [settings, setSettings] = useState({
    campaignTitle: 'הנה זה משיח בא – מגיע עד אליך לבית',
    campaignSubtitle: 'מבצע הפצה ארצי של דגלים ושלטים לכל בית בישראל! מזמינים באתר, והפעיל הקרוב אליכם מתקשר ומגיע עד הבית.',
    showActivistsToCustomer: true,
    followupBusinessDays: 5,
    defaultActivistsCount: 3,
    urgentActivistsCount: 5
  });

  const [smsLogs, setSmsLogs] = useState([
    {
      id: 'sms-init-1',
      toType: 'פעיל (טלפון כשר)',
      toName: 'מנחם מענדל כהן',
      toPhone: '050-8771122',
      time: '27/10 11:21',
      reqId: '10480',
      body: 'בקשה חדשה להפצת דגלים ושלטים (#10480).\nשם: אהרן פריד\nטלפון: 052-8881234\nכתובת: רחוב הרבי מליובאוויטש 10, צפת\nהזמנה: 2 דגלים + שלט\nהתקנה: כן\nהערות: קומה 3.'
    },
    {
      id: 'sms-init-2',
      toType: 'מעקב מזמין (5 ימי עסקים)',
      toName: 'שמעון ביטון',
      toPhone: '054-7774321',
      time: '29/10 10:00',
      reqId: '10481',
      isFollowupInteractive: true,
      answered: 'no',
      body: 'שלום שמעון ביטון, לפני מספר ימים ביקשת לקבל דגלים ושלטים (#10481). האם אחד הפעילים כבר יצר איתך קשר?'
    }
  ]);

  useEffect(() => {
    localStorage.setItem('mashiach_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('mashiach_activists', JSON.stringify(activists));
  }, [activists]);
  useEffect(() => {
    localStorage.setItem('mashiach_requests', JSON.stringify(requests));
  }, [requests]);
  useEffect(() => {
    localStorage.setItem('mashiach_templates', JSON.stringify(smsTemplates));
  }, [smsTemplates]);

  // --- מצב טופס ההזמנה ---
  const [cart, setCart] = useState({ p1: 1 });
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [duplicateRequestWarning, setDuplicateRequestWarning] = useState(null);

  const [addressQuery, setAddressQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPlaceSuggestions, setShowPlaceSuggestions] = useState(false);
  const [needsInstall, setNeedsInstall] = useState(false);
  const [notes, setNotes] = useState('');
  const [orderStep, setOrderStep] = useState('form'); // form | summary | success
  const [createdOrder, setCreatedOrder] = useState(null);

  // --- מעקב הזמנה ---
  const [trackInput, setTrackInput] = useState('10480');
  const [trackedRequest, setTrackedRequest] = useState(null);

  // --- עריכה בניהול ---
  const [newActivist, setNewActivist] = useState({ name: '', phone: '', city: 'צפת', address: '', serviceAreas: 'צפת, מירון', doesInstall: true });
  const [newProduct, setNewProduct] = useState({ name: '', category: 'דגלים', description: '', price: 30, specialPrice: 20, canInstall: true });
  const [selectedMapActivist, setSelectedMapActivist] = useState(INITIAL_ACTIVISTS[0]);

  // --- פונקציות עזר ---
  const updateCartQty = (productId, delta) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev, [productId]: next };
      if (next === 0) delete updated[productId];
      return updated;
    });
  };

  const quickOrderProduct = (productId) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    setOrderStep('form');
    setView('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendOtpCode = () => {
    const cleanPhone = phone.trim();
    if (cleanPhone.length < 9) {
      alert('נא להזין מספר טלפון תקין (לפחות 9 ספרות)');
      return;
    }
    // בדיקת בקשה כפולה פתוחה
    const existing = requests.find(
      r => r.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, '') && !['בוצעה', 'בוטלה'].includes(r.status)
    );
    if (existing && !duplicateRequestWarning) {
      setDuplicateRequestWarning(existing);
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setEnteredOtp(code); // מילוי אוטומטי לנוחות הדגמה
    setSmsSent(true);

    setSmsLogs(prev => [
      {
        id: 'sms-' + Date.now(),
        toType: 'קוד אימות (OTP)',
        toName: fullName || 'מזמין',
        toPhone: cleanPhone,
        time: 'עכשיו',
        reqId: '-',
        body: `קוד האימות שלך לאתר "הנה זה משיח בא": ${code}`
      },
      ...prev
    ]);
  };

  const verifyOtpCode = () => {
    if (enteredOtp.trim() === generatedOtp) {
      setPhoneVerified(true);
    } else {
      alert('קוד האימות שגוי, נסה שנית.');
    }
  };

  const filteredPlaces = useMemo(() => {
    if (!addressQuery.trim()) return PLACES_DATABASE;
    return PLACES_DATABASE.filter(p => p.label.includes(addressQuery.trim()));
  }, [addressQuery]);

  // אלגוריתם איתור פעילים (מרחק + אזור שירות + זמינות + התקנה + איזון עומסים)
  const findMatchingActivists = (place, reqInstall, isUrgent = false) => {
    const targetCount = isUrgent ? settings.urgentActivistsCount : settings.defaultActivistsCount;

    const candidates = activists.filter(a => {
      if (!a.active) return false;
      if (reqInstall && !a.doesInstall) return false;
      return true;
    });

    const scored = candidates.map(a => {
      const distKm = calcDistanceKm(place.lat, place.lng, a.lat, a.lng);
      const inServiceArea = a.serviceAreas.includes(place.city);
      // שקלול מרחק + עדיפות לאזור שירות + איזון עומס בקשות פתוחות
      const score = distKm - (inServiceArea ? 8 : 0) + a.openRequestsCount * 1.5;
      return {
        ...a,
        distanceKm: distKm.toFixed(1),
        inServiceArea,
        score
      };
    });

    scored.sort((a, b) => a.score - b.score);
    // סינון פעילים בטווח סביר (עד 45 ק"מ או באזור השירות)
    const nearby = scored.filter(a => parseFloat(a.distanceKm) <= 45 || a.inServiceArea);
    return nearby.slice(0, targetCount);
  };

  const formatTemplate = (tpl, data) => {
    return tpl
      .replace(/{שם}/g, data.fullName)
      .replace(/{טלפון}/g, data.phone)
      .replace(/{כתובת}/g, data.address)
      .replace(/{מספר_בקשה}/g, data.id)
      .replace(/{מוצרים}/g, data.itemsText)
      .replace(/{התקנה}/g, data.needsInstall ? 'כן (כולל התקנה)' : 'ללא התקנה')
      .replace(/{הערות}/g, data.notes || 'אין');
  };

  const submitOrder = () => {
    const newId = (10482 + requests.length).toString();
    const orderItems = Object.entries(cart)
      .map(([pid, qty]) => {
        const prod = products.find(p => p.id === pid);
        if (!prod || qty <= 0) return null;
        return {
          productId: pid,
          name: prod.name,
          qty,
          price: prod.specialPrice || prod.price
        };
      })
      .filter(Boolean);

    const itemsText = orderItems.map(i => `${i.qty} x ${i.name}`).join(', ');
    const matchedActivists = findMatchingActivists(selectedPlace, needsInstall, false);

    const nowStr = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    const historyLog = [
      { time: `היום ${nowStr}`, text: 'בקשה נוצרה על ידי המזמין באתר' },
      { time: `היום ${nowStr}`, text: `מספר טלפון (${phone}) אומת בקוד SMS` },
      { time: `היום ${nowStr}`, text: `כתובת אומתה ב-Google Maps (${selectedPlace.label})` }
    ];

    const newSmsEntries = [];

    // הודעת אישור למזמין
    newSmsEntries.push({
      id: 'sms-cust-' + Date.now(),
      toType: 'אישור למזמין',
      toName: fullName,
      toPhone: phone,
      time: `היום ${nowStr}`,
      reqId: newId,
      body: formatTemplate(smsTemplates.customerConfirmSms, {
        id: newId,
        fullName,
        phone,
        address: selectedPlace.label,
        itemsText,
        needsInstall,
        notes
      })
    });

    if (matchedActivists.length === 0) {
      historyLog.push({
        time: `היום ${nowStr}`,
        text: '⚠️ לא נמצאו פעילים זמינים באזור – נשלחה התראה למנהל המערכת'
      });
      newSmsEntries.push({
        id: 'sms-admin-noact-' + Date.now(),
        toType: 'התראת מנהל',
        toName: 'מנהל מערכת',
        toPhone: '050-0000000',
        time: `היום ${nowStr}`,
        reqId: newId,
        body: `⚠️ בקשה חדשה #${newId} ב${selectedPlace.city} (${selectedPlace.label}) ללא פעילים זמינים באזור. נדרש טיפול ידני.`
      });
    } else {
      historyLog.push({
        time: `היום ${nowStr}`,
        text: `אותרו ${matchedActivists.length} פעילים מתאימים באזור ${selectedPlace.city}`
      });

      if (matchedActivists.length === 1) {
        historyLog.push({
          time: `היום ${nowStr}`,
          text: '⚠️ נמצא פעיל בודד באזור – נשלחה גם התראת גיבוי למנהל'
        });
      }

      matchedActivists.forEach(act => {
        historyLog.push({
          time: `היום ${nowStr}`,
          text: `נשלח SMS לפעיל ${act.name} (${act.phone}) – מרחק ${act.distanceKm} ק"מ`
        });
        newSmsEntries.push({
          id: `sms-act-${act.id}-${Date.now()}`,
          toType: 'פעיל (טלפון כשר)',
          toName: act.name,
          toPhone: act.phone,
          time: `היום ${nowStr}`,
          reqId: newId,
          body: formatTemplate(smsTemplates.activistSms, {
            id: newId,
            fullName,
            phone,
            address: selectedPlace.label,
            itemsText,
            needsInstall,
            notes
          })
        });
      });
    }

    const newReqObj = {
      id: newId,
      fullName,
      phone,
      address: selectedPlace.label,
      city: selectedPlace.city,
      lat: selectedPlace.lat,
      lng: selectedPlace.lng,
      items: orderItems,
      needsInstall,
      notes,
      status: matchedActivists.length > 0 ? 'נשלחה לפעילים' : 'הועברה למנהל',
      urgent: false,
      createdAt: `01/11/2026 ${nowStr}`,
      assignedActivists: matchedActivists.map(a => ({
        id: a.id,
        name: a.name,
        phone: a.phone,
        distanceKm: a.distanceKm
      })),
      history: historyLog
    };

    setRequests(prev => [newReqObj, ...prev]);
    setSmsLogs(prev => [...newSmsEntries, ...prev]);
    setCreatedOrder(newReqObj);
    setOrderStep('success');
    setShowSmsDrawer(true);
  };

  // סימולציית חלוף 5 ימי עסקים ושליחת SMS מעקב למזמין
  const trigger5BusinessDaysFollowup = (req) => {
    const itemsText = req.items.map(i => `${i.qty} x ${i.name}`).join(', ');
    const body = formatTemplate(smsTemplates.followup5DaysSms, {
      id: req.id,
      fullName: req.fullName,
      phone: req.phone,
      address: req.address,
      itemsText,
      needsInstall: req.needsInstall,
      notes: req.notes
    });

    setSmsLogs(prev => [
      {
        id: 'sms-followup-' + Date.now(),
        toType: 'מעקב מזמין (5 ימי עסקים)',
        toName: req.fullName,
        toPhone: req.phone,
        time: '+5 ימי עסקים',
        reqId: req.id,
        isFollowupInteractive: true,
        answered: null,
        body
      },
      ...prev
    ]);

    setRequests(prev =>
      prev.map(r =>
        r.id === req.id
          ? {
              ...r,
              status: 'ממתינה למעקב',
              history: [
                ...r.history,
                { time: '+5 ימי עסקים', text: 'נשלח SMS מעקב אוטומטי למזמין לבדיקת יצירת קשר' }
              ]
            }
          : r
      )
    );
    setShowSmsDrawer(true);
  };

  // תגובת המזמין ל-SMS המעקב ("כן" או "לא")
  const handleCustomerFollowupReply = (smsId, reqId, didContact) => {
    setSmsLogs(prev => prev.map(s => (s.id === smsId ? { ...s, answered: didContact ? 'yes' : 'no' } : s)));

    const targetReq = requests.find(r => r.id === reqId);
    if (!targetReq) return;

    if (didContact) {
      setRequests(prev =>
        prev.map(r =>
          r.id === reqId
            ? {
                ...r,
                status: 'נוצר קשר',
                history: [
                  ...r.history,
                  { time: 'מעקב מזמין', text: '✅ המזמין אישר: אחד הפעילים יצר איתי קשר!' }
                ]
              }
            : r
        )
      );
    } else {
      // לא נוצר קשר -> התראה מיידית למנהל
      setRequests(prev =>
        prev.map(r =>
          r.id === reqId
            ? {
                ...r,
                status: 'לא נוצר קשר',
                urgent: true,
                history: [
                  ...r.history,
                  { time: 'מעקב מזמין', text: '🚨 המזמין דיווח: אף פעיל לא יצר קשר! הועבר להתראת מנהל.' }
                ]
              }
            : r
        )
      );

      const activistsList = targetReq.assignedActivists.map((a, idx) => `פעיל ${idx + 1}: ${a.name} (${a.phone})`).join(' | ');
      setSmsLogs(prev => [
        {
          id: 'sms-alert-admin-' + Date.now(),
          toType: '🚨 התראת מנהל דחופה',
          toName: 'מנהל המערכת',
          toPhone: '050-0000000',
          time: 'מיידי',
          reqId: targetReq.id,
          body: `🚨 בקשה שלא קיבלה מענה (#${targetReq.id})\nשם: ${targetReq.fullName} (${targetReq.phone})\nכתובת: ${targetReq.address}\nהבקשה נשלחה אל: ${activistsList}\nהמזמין דיווח שאף אחד מהם לא יצר קשר!`
        },
        ...prev
      ]);
    }
  };

  // סטטיסטיקות ערים והמלצות גיוס פעילים
  const cityStats = useMemo(() => {
    const cities = ['צפת', 'ירושלים', 'חיפה', 'רמלה', 'בני ברק'];
    return cities.map(city => {
      const cityReqs = requests.filter(r => r.city === city);
      const cityActs = activists.filter(a => a.active && (a.city === city || a.serviceAreas.includes(city)));
      const unanswered = cityReqs.filter(r => r.status === 'לא נוצר קשר').length;
      const completed = cityReqs.filter(r => r.status === 'בוצעה' || r.status === 'נוצר קשר').length;
      // העשרת דמו להמחשת המלצות גיוס
      const demoTotal = city === 'צפת' ? 120 + cityReqs.length : city === 'ירושלים' ? 210 + cityReqs.length : city === 'חיפה' ? 47 + cityReqs.length : 35 + cityReqs.length;
      const demoDone = city === 'צפת' ? 105 + completed : city === 'ירושלים' ? 194 + completed : city === 'חיפה' ? 32 + completed : 31 + completed;
      const demoUnanswered = city === 'חיפה' ? 15 + unanswered : 4 + unanswered;

      return {
        city,
        totalRequests: demoTotal,
        completed: demoDone,
        unanswered: demoUnanswered,
        activeActivists: cityActs.length,
        needsRecruitment: cityActs.length <= 1 || demoTotal / Math.max(1, cityActs.length) > 40
      };
    });
  }, [requests, activists]);

  // איור SVG נקי לחלוטין לסינון רימון/נטפרי עבור כל מוצר
  const renderProductIllustration = (product) => {
    const isFlag = product.category === 'דגלים';
    return (
      <div className={`w-full h-44 bg-gradient-to-br ${product.color} rounded-t-2xl flex flex-col items-center justify-center p-4 text-white relative overflow-hidden`}>
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-black/10 rounded-full" />
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl mb-2 border border-white/30 shadow-inner">
          {isFlag ? <Flag className="w-10 h-10 text-white" /> : <Sparkles className="w-10 h-10 text-yellow-200" />}
        </div>
        <span className="font-black text-lg tracking-wide text-center drop-shadow">
          {isFlag ? 'דגל המלך המשיח' : 'שלט הנה זה משיח בא'}
        </span>
        <span className="text-xs bg-black/25 px-3 py-0.5 rounded-full mt-1 font-medium">
          עמיד לתנאי חוץ • נבדק ומאושר
        </span>
      </div>
    );
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* סרגל עליון - ניווט + סימולטור SMS + כניסת מנהל */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div
            onClick={() => setView('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <Flag className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <div className="font-black text-lg text-slate-900 leading-tight">הנה זה משיח בא</div>
              <div className="text-xs text-amber-700 font-semibold">מערכת הפצת דגלים ושלטים עד הבית</div>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <button
              onClick={() => setView('home')}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition ${
                view === 'home' ? 'bg-amber-100 text-amber-900' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              עמוד הבית
            </button>
            <button
              onClick={() => {
                setOrderStep('form');
                setView('order');
              }}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition ${
                view === 'order' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-amber-400/20 text-amber-900 hover:bg-amber-400/40'
              }`}
            >
              הגשת בקשה
            </button>
            <button
              onClick={() => setView('how')}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition ${
                view === 'how' ? 'bg-amber-100 text-amber-900' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              איך זה עובד?
            </button>
            <button
              onClick={() => {
                setTrackedRequest(requests[0] || null);
                setView('track');
              }}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition ${
                view === 'track' ? 'bg-amber-100 text-amber-900' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              מעקב בקשה
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

            <button
              onClick={() => setShowSmsDrawer(!showSmsDrawer)}
              className="relative px-3 py-2 rounded-lg text-xs sm:text-sm font-bold bg-indigo-50 text-indigo-800 hover:bg-indigo-100 flex items-center gap-1.5 border border-indigo-200"
              title="צפה בהודעות SMS שנשלחות לטלפונים הכשרים של הפעילים ולמזמינים"
            >
              <Smartphone className="w-4 h-4" />
              <span>סימולטור SMS ({smsLogs.length})</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </button>

            <button
              onClick={() => setView('admin')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                view === 'admin'
                  ? 'bg-slate-900 text-amber-400 shadow'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>ניהול (/admin)</span>
              {requests.filter(r => r.status === 'לא נוצר קשר').length > 0 && (
                <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {requests.filter(r => r.status === 'לא נוצר קשר').length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* מגירת סימולטור ה-SMS לטלפונים כשרים ומעקב 5 ימי עסקים */}
      {showSmsDrawer && (
        <div className="bg-slate-900 text-white border-b-4 border-amber-400 shadow-2xl">
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-base">
                  מוקד הודעות SMS יוצאות (לפעילים בטלפונים כשרים ללא אינטרנט + אימות ומעקב מזמינים)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {requests[0] && (
                  <button
                    onClick={() => trigger5BusinessDaysFollowup(requests[0])}
                    className="text-xs bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg hover:bg-amber-300 flex items-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    הרץ סימולציית +5 ימי עסקים (בקשה #{requests[0].id})
                  </button>
                )}
                <button
                  onClick={() => setShowSmsDrawer(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
              {smsLogs.map(sms => (
                <div
                  key={sms.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                      <span>{sms.toType}</span>
                      <span className="text-slate-400 font-normal">{sms.time}</span>
                    </div>
                    <div className="text-slate-300 mb-2">
                      אל: <strong>{sms.toName}</strong> ({sms.toPhone})
                    </div>
                    <pre className="whitespace-pre-wrap font-sans bg-slate-900/90 p-2.5 rounded-lg text-slate-100 border border-slate-700/80 leading-relaxed">
                      {sms.body}
                    </pre>
                  </div>

                  {sms.isFollowupInteractive && (
                    <div className="mt-2 pt-2 border-t border-slate-700">
                      <div className="text-amber-300 font-bold mb-1.5">
                        סימולציית תשובת המזמין בהודעה חוזרת:
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCustomerFollowupReply(sms.id, sms.reqId, true)}
                          className={`flex-1 py-1.5 rounded font-bold transition ${
                            sms.answered === 'yes'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                          }`}
                        >
                          [כן, יצרו איתי קשר]
                        </button>
                        <button
                          onClick={() => handleCustomerFollowupReply(sms.id, sms.reqId, false)}
                          className={`flex-1 py-1.5 rounded font-bold transition ${
                            sms.answered === 'no'
                              ? 'bg-red-600 text-white'
                              : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                          }`}
                        >
                          [לא יצרו איתי קשר]
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 1. עמוד הבית ==================== */}
      {view === 'home' && (
        <main className="flex-1">
          {/* אזור המודעה המרכזית של הקמפיין */}
          <section className="relative bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-12 sm:py-16 px-4 overflow-hidden border-b-8 border-amber-400">
            <div className="max-w-5xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/50 text-amber-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                <Sparkles className="w-4 h-4" />
                <span>מבצע הפצה ארצי • מותאם לכל שכונה ועיר בישראל</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 drop-shadow">
                {settings.campaignTitle}
              </h1>

              <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto mb-8 leading-relaxed">
                {settings.campaignSubtitle}
              </p>

              {/* כרזת הקמפיין הגרפית */}
              <div className="max-w-3xl mx-auto bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-white/20 mb-8">
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest bg-slate-950 text-amber-400 inline-block px-4 py-1 rounded-full mb-3">
                  המודעה המרכזית • ברוכים הבאים מלך המשיח
                </div>
                <div className="text-2xl sm:text-4xl font-black mb-2">
                  מזמינים דגל או שלט למרפסת בלחיצת כפתור!
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-800 mb-6">
                  המערכת מאתרת אוטומטית את 3 הפעילים הקרובים ביותר לביתכם ושולחת אליהם את ההזמנה לטיפול ומסירה אישית (אפשרות להתקנה מלאה).
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setOrderStep('form');
                      setView('order');
                    }}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-950 text-amber-400 font-black text-xl shadow-xl hover:bg-slate-800 transition flex items-center justify-center gap-2"
                  >
                    <span>אני רוצה להזמין</span>
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setView('how')}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/90 text-slate-900 font-bold text-base hover:bg-white transition"
                  >
                    איך זה עובד?
                  </button>
                </div>
              </div>

              {/* שלושת עקרונות המערכת */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-right">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
                  <div className="font-bold text-amber-300 mb-1 flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> 1. איתור גיאוגרפי חכם
                  </div>
                  <p className="text-xs text-slate-300">
                    בחירת כתובת מאומתת וחישוב מרחק אוטומטי לפעילים באזור השירות שלך.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
                  <div className="font-bold text-amber-300 mb-1 flex items-center gap-2">
                    <Phone className="w-5 h-5" /> 2. מותאם לטלפונים כשרים
                  </div>
                  <p className="text-xs text-slate-300">
                    הפעילים מקבלים SMS נקי עם פרטי ההזמנה ומתקשרים אליך ישירות לתיאום.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
                  <div className="font-bold text-amber-300 mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> 3. מעקב ובקרה עד המסירה
                  </div>
                  <p className="text-xs text-slate-300">
                    בדיקה אוטומטית לאחר 5 ימי עסקים לוודא שנוצר קשר והמוצרים הגיעו אליך.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* אזור "המוצרים שלנו" */}
          <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900">המוצרים שלנו להפצה</h2>
                <p className="text-slate-600 mt-1">
                  בחרו את הדגלים והשלטים שתרצו לבית או למרפסת – ניתן להזמין מספר מוצרים יחד וכולל התקנה.
                </p>
              </div>
              <button
                onClick={() => {
                  setOrderStep('form');
                  setView('order');
                }}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow flex items-center gap-2 self-start"
              >
                <span>הגשת בקשה מרוכזת</span>
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products
                .filter(p => p.available && p.canOrder)
                .sort((a, b) => a.order - b.order)
                .map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-slate-200 flex flex-col overflow-hidden"
                  >
                    {renderProductIllustration(product)}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                            {product.category}
                          </span>
                          {product.canInstall && (
                            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <Wrench className="w-3 h-3" /> אפשרות להתקנה
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-lg text-slate-900 mb-2">{product.name}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          {product.specialPrice ? (
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-slate-900">
                                ₪{product.specialPrice}
                              </span>
                              <span className="text-sm text-slate-400 line-through">
                                ₪{product.price}
                              </span>
                            </div>
                          ) : (
                            <span className="text-2xl font-black text-slate-900">₪{product.price}</span>
                          )}
                          <div className="text-[11px] text-slate-500">דמי השתתפות סמליים</div>
                        </div>

                        <button
                          onClick={() => quickOrderProduct(product.id)}
                          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-sm transition flex items-center gap-1.5"
                        >
                          <span>הזמן עכשיו</span>
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </main>
      )}

      {/* ==================== 2. טופס הזמנה והגשת בקשה ==================== */}
      {view === 'order' && (
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
          {orderStep === 'form' && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 sm:p-8 border-b-4 border-amber-400">
                <h1 className="text-2xl sm:text-3xl font-black text-amber-400 mb-1">
                  טופס הזמנת דגלים ושלטים עד הבית
                </h1>
                <p className="text-slate-300 text-sm">
                  מלאו את הפרטים בקצרה – המערכת תאמת את המספר ותעביר את הבקשה ל-3 הפעילים הקרובים אליכם.
                </p>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                {/* שלב א: בחירת מוצרים וכמויות */}
                <div>
                  <h2 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-sm font-black">1</span>
                    בחירת מוצרים וכמויות
                  </h2>
                  <div className="space-y-3">
                    {products
                      .filter(p => p.available && p.canOrder)
                      .map(prod => {
                        const qty = cart[prod.id] || 0;
                        return (
                          <div
                            key={prod.id}
                            className={`p-4 rounded-2xl border-2 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              qty > 0 ? 'border-amber-400 bg-amber-50/40' : 'border-slate-200 bg-white'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-slate-900">{prod.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                מחיר יחידה: ₪{prod.specialPrice || prod.price}
                                {prod.canInstall && ' • תומך בהתקנה'}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => updateCartQty(prod.id, -1)}
                                className="w-9 h-9 rounded-xl bg-slate-200 hover:bg-slate-300 font-black text-lg flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-black text-lg">{qty}</span>
                              <button
                                type="button"
                                onClick={() => updateCartQty(prod.id, 1)}
                                className="w-9 h-9 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* שלב ב: פרטי מזמין + אימות SMS + מניעת כפילויות */}
                <div>
                  <h2 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-sm font-black">2</span>
                    פרטי המזמין ואימות מספר טלפון (SMS)
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        שם מלא <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="לדוגמה: ישראל ישראלי"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        מספר טלפון נייד <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={phone}
                          disabled={phoneVerified}
                          onChange={e => {
                            setPhone(e.target.value);
                            setDuplicateRequestWarning(null);
                          }}
                          placeholder="050-0000000"
                          className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 outline-none disabled:bg-slate-100"
                        />
                        {!phoneVerified && (
                          <button
                            type="button"
                            onClick={sendOtpCode}
                            className="px-4 py-3 rounded-xl bg-slate-900 text-amber-400 font-bold text-sm hover:bg-slate-800 whitespace-nowrap"
                          >
                            שלח קוד SMS
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* התראת מניעת בקשות כפולות */}
                  {duplicateRequestWarning && (
                    <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 mb-4">
                      <div className="font-black text-amber-900 flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        כבר קיימת בקשה פתוחה עבור מספר הטלפון הזה (#{duplicateRequestWarning.id})
                      </div>
                      <p className="text-xs text-amber-800 mb-3">
                        סטטוס הבקשה הקיימת: <strong>{duplicateRequestWarning.status}</strong> בכתובת {duplicateRequestWarning.address}.
                      </p>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setTrackedRequest(duplicateRequestWarning);
                            setView('track');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                        >
                          מעבר לבקשה הקיימת
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDuplicateRequestWarning(null);
                            const code = Math.floor(1000 + Math.random() * 9000).toString();
                            setGeneratedOtp(code);
                            setEnteredOtp(code);
                            setSmsSent(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white border border-amber-400 text-amber-900 font-bold text-xs"
                        >
                          שלח בכל זאת בקשה חדשה
                        </button>
                      </div>
                    </div>
                  )}

                  {smsSent && !phoneVerified && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-sm text-indigo-950">
                        שלחנו קוד אימות ב-SMS למספר <strong>{phone}</strong> (קוד הדגמה הוזן אוטומטית: <strong>{generatedOtp}</strong>)
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          value={enteredOtp}
                          onChange={e => setEnteredOtp(e.target.value)}
                          placeholder="קוד 4 ספרות"
                          className="w-28 px-3 py-2 rounded-lg border border-indigo-300 text-center font-black tracking-widest"
                        />
                        <button
                          type="button"
                          onClick={verifyOtpCode}
                          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700"
                        >
                          אמת מספר
                        </button>
                      </div>
                    </div>
                  )}

                  {phoneVerified && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        מספר הטלפון {phone} אומת בהצלחה ב-SMS!
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneVerified(false);
                          setSmsSent(false);
                        }}
                        className="text-xs underline text-emerald-700"
                      >
                        החלף מספר
                      </button>
                    </div>
                  )}
                </div>

                {/* שלב ג: כתובת מאומתת Google Places */}
                <div className="relative">
                  <h2 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-sm font-black">3</span>
                    כתובת מלאה (חיפוש Google Maps לאיתור הפעילים הקרובים)
                  </h2>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    הקלד רחוב ועיר ובחר מתוך הרשימה <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={addressQuery}
                      onFocus={() => setShowPlaceSuggestions(true)}
                      onChange={e => {
                        setAddressQuery(e.target.value);
                        setSelectedPlace(null);
                        setShowPlaceSuggestions(true);
                      }}
                      placeholder="התחל להקליד... (למשל: הרבי מליובאוויטש צפת, יפו ירושלים, הרצל רמלה)"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 outline-none"
                    />
                    {showPlaceSuggestions && (
                      <div className="absolute z-20 w-full mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-56 overflow-y-auto">
                        <div className="px-3 py-1.5 bg-slate-100 text-[11px] font-bold text-slate-500 flex items-center justify-between">
                          <span>תוצאות מאומתות (Google Places עם קואורדינטות GPS)</span>
                          <button
                            type="button"
                            onClick={() => setShowPlaceSuggestions(false)}
                            className="text-slate-600"
                          >
                            סגור
                          </button>
                        </div>
                        {filteredPlaces.map(place => (
                          <button
                            key={place.label}
                            type="button"
                            onClick={() => {
                              setSelectedPlace(place);
                              setAddressQuery(place.label);
                              setShowPlaceSuggestions(false);
                            }}
                            className="w-full text-right px-4 py-2.5 hover:bg-amber-50 flex items-center justify-between border-b border-slate-100 last:border-0"
                          >
                            <span className="font-medium text-sm text-slate-800 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                              {place.label}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              GPS: {place.lat.toFixed(3)}, {place.lng.toFixed(3)}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedPlace && (
                    <div className="mt-2 bg-slate-100 px-3.5 py-2 rounded-xl text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
                      <span>
                        <strong>כתובת מאומתת:</strong> רחוב {selectedPlace.street} {selectedPlace.number}, {selectedPlace.city} (מיקוד {selectedPlace.zip})
                      </span>
                      <span className="text-emerald-700 font-bold">
                        ✓ מיקום GPS נשמר לאיתור פעילים
                      </span>
                    </div>
                  )}
                </div>

                {/* שלב ד: התקנה והערות */}
                <div>
                  <h2 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-sm font-black">4</span>
                    התקנה והערות לפעיל
                  </h2>

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      האם אתה מעוניין בהתקנה?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setNeedsInstall(false)}
                        className={`p-3.5 rounded-xl border-2 font-bold text-sm transition ${
                          !needsInstall
                            ? 'border-slate-900 bg-slate-900 text-amber-400'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        ללא התקנה (מסירה בלבד)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNeedsInstall(true)}
                        className={`p-3.5 rounded-xl border-2 font-bold text-sm transition flex items-center justify-center gap-2 ${
                          needsInstall
                            ? 'border-amber-500 bg-amber-400 text-slate-950'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <Wrench className="w-4 h-4" />
                        כולל התקנה בבית/במרפסת
                      </button>
                    </div>
                    {needsInstall && (
                      <p className="text-xs text-amber-800 mt-1.5 font-medium">
                        * בבחירת "כולל התקנה", המערכת תסנן ותבחר אך ורק פעילים שמוגדרים כמבצעי התקנות באזורך.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      הערות / פרטים נוספים (קומה, מיקום התקנה, שעות נוחות ליצירת קשר)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="לדוגמה: קומה 3, מעקה סורגים במרפסת חזיתית, נוח להתקשר בשעות הערב..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* כפתור מעבר לסיכום */}
                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      if (Object.keys(cart).length === 0) {
                        alert('נא לבחור לפחות מוצר אחד להזמנה.');
                        return;
                      }
                      if (!fullName.trim()) {
                        alert('נא להזין שם מלא.');
                        return;
                      }
                      if (!phoneVerified) {
                        alert('חובה לאמת את מספר הטלפון באמצעות קוד ה-SMS לפני המשך.');
                        return;
                      }
                      if (!selectedPlace) {
                        alert('חובה לבחור כתובת מאומתת מתוך רשימת הכתובות.');
                        return;
                      }
                      setOrderStep('summary');
                    }}
                    className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-lg shadow-lg transition"
                  >
                    המשך לסיכום ואישור הבקשה
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* מסך 14: סיכום לפני שליחה */}
          {orderStep === 'summary' && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-2">סיכום הבקשה לפני שליחה</h2>
              <p className="text-sm text-slate-600 mb-6">
                אנא ודאו שכל הפרטים מדויקים לפני העברת הבקשה לפעילים באזורכם:
              </p>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-sm mb-6">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">שם המזמין:</span>
                  <span className="font-bold">{fullName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">טלפון מאומת:</span>
                  <span className="font-bold text-emerald-700">{phone} (מאומת SMS)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">כתובת:</span>
                  <span className="font-bold">{selectedPlace?.label}</span>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <div className="text-slate-500 mb-1">מוצרים וכמויות:</div>
                  <ul className="space-y-1">
                    {Object.entries(cart).map(([pid, qty]) => {
                      const prod = products.find(p => p.id === pid);
                      if (!prod) return null;
                      return (
                        <li key={pid} className="font-bold flex justify-between">
                          <span>• {prod.name} (כמות: {qty})</span>
                          <span>₪{(prod.specialPrice || prod.price) * qty}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">התקנה:</span>
                  <span className="font-bold">{needsInstall ? 'כולל התקנה' : 'ללא התקנה'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">הערות:</span>
                  <span className="font-bold">{notes || 'אין הערות נוספות'}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={submitOrder}
                  className="flex-1 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-lg shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span>שליחת הבקשה</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderStep('form')}
                  className="px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
                >
                  חזרה לעריכת פרטים
                </button>
              </div>
            </div>
          )}

          {/* מסך 15 + 31: אישור שליחת הבקשה + מפת/רשימת פעילים בקרבת המזמין (עם הגנת פרטיות) */}
          {orderStep === 'success' && createdOrder && (
            <div className="bg-white rounded-3xl shadow-xl border-2 border-emerald-500 p-6 sm:p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="inline-block bg-amber-100 text-amber-950 font-black px-4 py-1 rounded-full text-sm mb-2">
                בקשה #{createdOrder.id}
              </div>

              <h2 className="text-3xl font-black text-slate-900 mb-2">
                הבקשה התקבלה בהצלחה!
              </h2>
              <p className="text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
                תודה על הרצון להשתתף בהפצת בשורת הגאולה.
                {createdOrder.assignedActivists.length > 0
                  ? ' איתרנו את הפעילים הקרובים אליך והעברנו אליהם כעת ב-SMS את פרטי הבקשה. אחד הפעילים ייצור איתך קשר טלפוני בהקדם.'
                  : ' הבקשה התקבלה. אנו מחפשים פעיל שיוכל לסייע באזור שלך והעברנו התראה למוקד הארצי.'}
              </p>

              {/* סעיף 31 + 50: הצגת פעילים באזור המזמין ללא חשיפת כתובת פרטית או טלפון */}
              {settings.showActivistsToCustomer && createdOrder.assignedActivists.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-right mb-6">
                  <div className="font-black text-slate-900 text-sm mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-amber-600" />
                      פעילים באזור שלך שקיבלו כעת את פנייתך ב-SMS:
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      פרטיות הפעילים מוגנת • מיקום משוער בלבד
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {createdOrder.assignedActivists.map((act, idx) => (
                      <div
                        key={act.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-full bg-amber-400/20 text-amber-900 font-black flex items-center justify-center text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-800">פעיל באזור שלך</div>
                          <div className="text-xs text-emerald-700 font-semibold">
                            כ־{act.distanceKm} ק"מ ממך
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    setTrackedRequest(createdOrder);
                    setView('track');
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-900 text-amber-400 font-bold text-sm"
                >
                  מעבר לעמוד מעקב אחר בקשה #{createdOrder.id}
                </button>
                <button
                  onClick={() => setView('home')}
                  className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm"
                >
                  חזרה לעמוד הבית
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ==================== 3. עמוד "איך זה עובד?" ==================== */}
      {view === 'how' && (
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
              איך המערכת עובדת?
            </h1>
            <p className="text-slate-600">
              תהליך פשוט, מהיר ואוטומטי שמחבר ביניכם לבין הפעילים בשטח ב-5 צעדים:
            </p>
          </div>

          <div className="space-y-4">
            {[
              { num: '1', title: 'אתם בוחרים מה תרצו', desc: 'בוחרים מתוך קטלוג הדגלים, השלטים וערכות ההפצה את המוצרים והכמויות לבית או למרפסת.' },
              { num: '2', title: 'ממלאים פרטים ומאמתים ב-SMS', desc: 'מזינים שם, מאמתים את מספר הטלפון בקוד קצר ובוחרים כתובת מדויקת מתוך Google Maps.' },
              { num: '3', title: 'אנו מוצאים פעילים באזור שלכם', desc: 'המערכת מחשבת מרחק, אזור שירות, זמינות והאם נדרשת התקנה – ובוחרת את 3 הפעילים המתאימים ביותר.' },
              { num: '4', title: 'הפעילים יוצרים איתכם קשר טלפוני', desc: 'הפעילים מקבלים SMS ישיר לטלפון הכשר שלהם ומתקשרים אליכם לתיאום הגעה.' },
              { num: '5', title: 'הדגלים והשלטים מגיעים אליכם לבית', desc: 'הפעיל מגיע עם המוצרים (ומבצע התקנה במידה וביקשתם). לאחר 5 ימי עסקים המערכת מוודאת מולכם שהכל טופל!' }
            ].map(step => (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shrink-0 shadow">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => {
                setOrderStep('form');
                setView('order');
              }}
              className="px-8 py-4 rounded-2xl bg-slate-900 text-amber-400 font-black text-lg shadow-lg"
            >
              אני רוצה להזמין עכשיו
            </button>
          </div>
        </main>
      )}

      {/* ==================== 4. עמוד מעקב בקשה למזמין ==================== */}
      {view === 'track' && (
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">
            <h1 className="text-2xl font-black text-slate-900 mb-2">בדיקת סטטוס בקשה</h1>
            <p className="text-sm text-slate-600 mb-6">
              הזינו את מספר הבקשה שקיבלתם בסיום ההזמנה (לדוגמה: 10480 או 10481):
            </p>

            <div className="flex gap-2 mb-8">
              <input
                type="text"
                value={trackInput}
                onChange={e => setTrackInput(e.target.value)}
                placeholder="מספר בקשה (למשל 10480)"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 font-bold"
              />
              <button
                onClick={() => {
                  const found = requests.find(r => r.id === trackInput.trim().replace('#', ''));
                  setTrackedRequest(found || null);
                }}
                className="px-6 py-3 rounded-xl bg-slate-900 text-amber-400 font-bold"
              >
                חפש בקשה
              </button>
            </div>

            {trackedRequest ? (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                  <div>
                    <span className="text-xs text-slate-500">מספר בקשה</span>
                    <div className="text-xl font-black text-slate-900">#{trackedRequest.id}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900">
                    {trackedRequest.status}
                  </span>
                </div>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex items-center gap-3">
                    <span>🟢</span>
                    <span className="font-bold">הבקשה התקבלה ואומתה במערכת</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{trackedRequest.assignedActivists.length > 0 ? '🟢' : '🟡'}</span>
                    <span className="font-bold">
                      פעילים באזור ({trackedRequest.city}) עודכנו ב-SMS
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>
                      {['נוצר קשר', 'ההזמנה בטיפול', 'בוצעה'].includes(trackedRequest.status)
                        ? '🟢'
                        : '🟡'}
                    </span>
                    <span className="font-bold">
                      {['נוצר קשר', 'ההזמנה בטיפול', 'בוצעה'].includes(trackedRequest.status)
                        ? 'נוצר קשר עם המזמין'
                        : 'ממתינים ליצירת קשר ואישור מהמזמין'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{trackedRequest.status === 'בוצעה' ? '🟢' : '⚪'}</span>
                    <span className="font-bold">
                      {trackedRequest.status === 'בוצעה'
                        ? 'ההזמנה סופקה ובוצעה בהצלחה!'
                        : 'ההזמנה טרם סומנה כבוצעה'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  * מטעמי פרטיות הפעילים, פרטי הקשר האישיים של הפעילים אינם מוצגים בדף הציבורי. הפעילים באזורך מתקשרים ישירות למספר שהזנת.
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm">
                לא נמצאה בקשה עם המספר שהוזן.
              </div>
            )}
          </div>
        </main>
      )}

      {/* ==================== 5. מערכת ניהול (/admin) ==================== */}
      {view === 'admin' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
          <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> אזור ניהול מאובטח (/admin) • הרשאת מנהל ראשי
              </div>
              <h1 className="text-2xl font-black mt-0.5">
                מרכז בקרה ארצי – הנה זה משיח בא
              </h1>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'requests', label: `בקשות (${requests.length})`, icon: FileText },
                { id: 'activists', label: `פעילים (${activists.length})`, icon: Users },
                { id: 'map', label: 'מפת פעילים', icon: MapPin },
                { id: 'products', label: 'ניהול מוצרים', icon: Package },
                { id: 'sms', label: 'נוסחי SMS ותזמון', icon: MessageSquare },
                { id: 'stats', label: 'סטטיסטיקות וגיוס', icon: Sparkles }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                      adminTab === tab.id
                        ? 'bg-amber-400 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* לשונית 1: Dashboard */}
          {adminTab === 'dashboard' && (
            <div className="space-y-6">
              {/* התראות חירום למנהל על בקשות שלא קיבלו מענה */}
              {requests
                .filter(r => r.status === 'לא נוצר קשר' || r.status === 'הועברה למנהל')
                .map(alertReq => (
                  <div
                    key={alertReq.id}
                    className="bg-red-50 border-2 border-red-500 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-red-700 font-black text-lg flex items-center gap-2">
                        <span>🚨 בקשה שלא קיבלה מענה – דורשת התערבות מנהל (#{alertReq.id})</span>
                      </div>
                      <p className="text-sm text-red-900 mt-1">
                        <strong>מזמין:</strong> {alertReq.fullName} ({alertReq.phone}) |{' '}
                        <strong>כתובת:</strong> {alertReq.address} |{' '}
                        <strong>התקנה:</strong> {alertReq.needsInstall ? 'כן' : 'לא'}
                      </p>
                      <div className="text-xs text-red-800 mt-1">
                        נשלחה אל:{' '}
                        {alertReq.assignedActivists.length > 0
                          ? alertReq.assignedActivists.map(a => `${a.name} (${a.phone})`).join(' , ')
                          : 'לא נמצאו פעילים באזור'}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => trigger5BusinessDaysFollowup(alertReq)}
                        className="px-3 py-2 rounded-xl bg-white border border-red-300 text-red-800 font-bold text-xs"
                      >
                        שלח SMS תזכורת חוזר
                      </button>
                      <button
                        onClick={() => {
                          setRequests(prev =>
                            prev.map(r =>
                              r.id === alertReq.id
                                ? {
                                    ...r,
                                    status: 'בוצעה',
                                    history: [...r.history, { time: 'מנהל', text: 'טופל ידנית על ידי המנהל וסומן כבוצע' }]
                                  }
                                : r
                            )
                          );
                        }}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
                      >
                        סמן כטופל ידנית
                      </button>
                    </div>
                  </div>
                ))}

              {/* כרטיסי מדדים ב-Dashboard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { label: 'בקשות היום', val: requests.length, color: 'bg-blue-50 text-blue-900' },
                  { label: 'בקשות פתוחות', val: requests.filter(r => r.status !== 'בוצעה').length, color: 'bg-amber-50 text-amber-900' },
                  { label: 'בטיפול / מעקב', val: requests.filter(r => ['נשלחה לפעילים', 'ממתינה למעקב', 'נוצר קשר'].includes(r.status)).length, color: 'bg-indigo-50 text-indigo-900' },
                  { label: 'בקשות שהושלמו', val: 312 + requests.filter(r => r.status === 'בוצעה').length, color: 'bg-emerald-50 text-emerald-900' },
                  { label: 'ללא מענה 🚨', val: requests.filter(r => r.status === 'לא נוצר קשר').length, color: 'bg-red-50 text-red-900' },
                  { label: 'סה"כ פעילים', val: activists.length, color: 'bg-slate-100 text-slate-900' },
                  { label: 'פעילים זמינים', val: activists.filter(a => a.active).length, color: 'bg-teal-50 text-teal-900' }
                ].map(card => (
                  <div key={card.label} className={`${card.color} p-4 rounded-2xl border border-black/5`}>
                    <div className="text-xs font-bold opacity-75">{card.label}</div>
                    <div className="text-2xl font-black mt-1">{card.val}</div>
                  </div>
                ))}
              </div>

              {/* בקשות אחרונות וניהול מהיר */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-lg">בקשות אחרונות במערכת</h3>
                  <button
                    onClick={() => setAdminTab('requests')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    לכל הבקשות והיסטוריית הפעולות ←
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-xs">
                        <th className="py-2">#</th>
                        <th className="py-2">מזמין</th>
                        <th className="py-2">כתובת</th>
                        <th className="py-2">התקנה</th>
                        <th className="py-2">פעילים ששובצו</th>
                        <th className="py-2">סטטוס</th>
                        <th className="py-2">פעולות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map(req => (
                        <tr key={req.id} className="border-b border-slate-100">
                          <td className="py-3 font-black">#{req.id}</td>
                          <td className="py-3">
                            <div className="font-bold">{req.fullName}</div>
                            <div className="text-xs text-slate-500">{req.phone}</div>
                          </td>
                          <td className="py-3 text-xs">{req.address}</td>
                          <td className="py-3 text-xs font-bold">
                            {req.needsInstall ? 'כולל התקנה 🔧' : 'ללא'}
                          </td>
                          <td className="py-3 text-xs">
                            {req.assignedActivists.map(a => a.name).join(', ') || 'אין'}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                req.status === 'לא נוצר קשר'
                                  ? 'bg-red-100 text-red-800'
                                  : req.status === 'בוצעה'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => trigger5BusinessDaysFollowup(req)}
                              className="text-xs bg-slate-900 text-amber-400 px-2.5 py-1 rounded-lg font-bold"
                            >
                              שלח SMS מעקב (5 ימים)
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* לשונית 2: ניהול בקשות מלא + היסטוריית פעולות + דחיפות */}
          {adminTab === 'requests' && (
            <div className="space-y-4">
              {requests.map(req => (
                <div
                  key={req.id}
                  className={`bg-white rounded-2xl p-5 border-2 shadow-sm ${
                    req.urgent ? 'border-red-400' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black bg-slate-900 text-amber-400 px-3 py-1 rounded-xl">
                        #{req.id}
                      </span>
                      {req.urgent && (
                        <span className="bg-red-100 text-red-800 text-xs font-black px-2.5 py-1 rounded-full">
                          🚨 דחופה (נשלחת לעד 5 פעילים)
                        </span>
                      )}
                      <div>
                        <div className="font-black text-slate-900">
                          {req.fullName} • {req.phone}
                        </div>
                        <div className="text-xs text-slate-500">
                          {req.address} | תאריך: {req.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={req.status}
                        onChange={e => {
                          const newSt = e.target.value;
                          setRequests(prev =>
                            prev.map(r =>
                              r.id === req.id
                                ? {
                                    ...r,
                                    status: newSt,
                                    history: [
                                      ...r.history,
                                      { time: 'עדכון מנהל', text: `סטטוס שונה אל: ${newSt}` }
                                    ]
                                  }
                                : r
                            )
                          );
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50"
                      >
                        {[
                          'חדשה',
                          'נשלחה לפעילים',
                          'ממתינה למעקב',
                          'נוצר קשר',
                          'ההזמנה בטיפול',
                          'בוצעה',
                          'לא נוצר קשר',
                          'הועברה למנהל',
                          'בוטלה'
                        ].map(st => (
                          <option key={st} value={st}>
                            סטטוס: {st}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => {
                          setRequests(prev =>
                            prev.map(r =>
                              r.id === req.id
                                ? {
                                    ...r,
                                    urgent: !r.urgent,
                                    history: [
                                      ...r.history,
                                      {
                                        time: 'מנהל',
                                        text: !r.urgent
                                          ? 'סומנה כבקשה דחופה 🚨 (הפצה לעד 5 פעילים)'
                                          : 'הוסר סימון דחיפות'
                                      }
                                    ]
                                  }
                                : r
                            )
                          );
                        }}
                        className="px-3 py-1.5 rounded-xl border border-red-300 text-red-700 text-xs font-bold hover:bg-red-50"
                      >
                        {req.urgent ? 'בטל דחיפות' : 'סמן 🚨 דחופה'}
                      </button>

                      <button
                        onClick={() => trigger5BusinessDaysFollowup(req)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                      >
                        שלח SMS מעקב למזמין
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl">
                      <div className="font-bold text-slate-700 mb-1.5">מוצרים והתקנה:</div>
                      {req.items.map((it, idx) => (
                        <div key={idx} className="font-semibold">
                          • {it.qty} x {it.name}
                        </div>
                      ))}
                      <div className="mt-2 font-bold text-indigo-800">
                        התקנה: {req.needsInstall ? 'כולל התקנה' : 'ללא התקנה'}
                      </div>
                      {req.notes && <div className="mt-1 text-slate-600">הערות: {req.notes}</div>}
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl">
                      <div className="font-bold text-slate-700 mb-1.5">
                        פעילים שאליהם נשלח SMS ({req.assignedActivists.length}):
                      </div>
                      {req.assignedActivists.map((a, idx) => (
                        <div key={idx} className="flex justify-between py-0.5">
                          <span className="font-semibold">
                            {idx + 1}. {a.name} ({a.phone})
                          </span>
                          <span className="text-slate-500">{a.distanceKm} ק"מ</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl">
                      <div className="font-bold text-slate-700 mb-1.5">היסטוריית מעקב מלאה (Audit Log):</div>
                      <div className="space-y-1 max-h-28 overflow-y-auto">
                        {req.history.map((h, i) => (
                          <div key={i} className="text-[11px] text-slate-600">
                            <strong className="text-slate-800">{h.time}:</strong> {h.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* לשונית 3: ניהול פעילים ואזורי שירות */}
          {adminTab === 'activists' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 border border-slate-200">
                <h3 className="font-black text-base mb-3">הוספת פעיל חדש למאגר (מקבל SMS לטלפון כשר)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <input
                    type="text"
                    placeholder="שם מלא"
                    value={newActivist.name}
                    onChange={e => setNewActivist({ ...newActivist, name: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="טלפון כשר/נייד"
                    value={newActivist.phone}
                    onChange={e => setNewActivist({ ...newActivist, phone: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="עיר מגורים"
                    value={newActivist.city}
                    onChange={e => setNewActivist({ ...newActivist, city: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="אזורי שירות (מופרדים בפסיק)"
                    value={newActivist.serviceAreas}
                    onChange={e => setNewActivist({ ...newActivist, serviceAreas: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={newActivist.doesInstall}
                        onChange={e => setNewActivist({ ...newActivist, doesInstall: e.target.checked })}
                      />
                      מתקין
                    </label>
                    <button
                      onClick={() => {
                        if (!newActivist.name || !newActivist.phone) return;
                        setActivists(prev => [
                          ...prev,
                          {
                            id: 'a' + (prev.length + 1),
                            name: newActivist.name,
                            phone: newActivist.phone,
                            city: newActivist.city,
                            address: newActivist.city,
                            serviceAreas: newActivist.serviceAreas.split(',').map(s => s.trim()),
                            lat: 32.965,
                            lng: 35.495,
                            doesInstall: newActivist.doesInstall,
                            active: true,
                            openRequestsCount: 0,
                            totalAssigned: 0
                          }
                        ]);
                        setNewActivist({ name: '', phone: '', city: 'צפת', address: '', serviceAreas: 'צפת, מירון', doesInstall: true });
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-900 text-amber-400 font-bold text-xs"
                    >
                      + הוסף פעיל
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activists.map(act => (
                  <div
                    key={act.id}
                    className={`bg-white rounded-2xl p-4 border transition flex items-center justify-between ${
                      act.active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-black text-base flex items-center gap-2">
                        <span>{act.name}</span>
                        <span className="text-xs font-bold text-slate-500">({act.phone})</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        <strong>עיר:</strong> {act.city} | <strong>אזורי שירות:</strong>{' '}
                        {act.serviceAreas.join(', ')}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            act.doesInstall
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {act.doesInstall ? '🔧 מבצע התקנות' : 'ללא התקנות'}
                        </span>
                        <span className="text-slate-500">
                          בקשות פתוחות: <strong>{act.openRequestsCount}</strong> | סה"כ טופלו:{' '}
                          <strong>{act.totalAssigned}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setActivists(prev =>
                            prev.map(a => (a.id === act.id ? { ...a, active: !a.active } : a))
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                          act.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {act.active ? 'פעיל (זמין)' : 'לא פעיל (חופשה)'}
                      </button>
                      <button
                        onClick={() => {
                          setActivists(prev =>
                            prev.map(a =>
                              a.id === act.id ? { ...a, doesInstall: !a.doesInstall } : a
                            )
                          );
                        }}
                        className="text-[11px] text-slate-500 underline"
                      >
                        שנה סטטוס התקנות
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* לשונית 4: מפה אינטראקטיבית למנהל (סעיף 30) */}
          {adminTab === 'map' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gradient-to-b from-sky-100 to-emerald-50 rounded-3xl p-6 border-2 border-slate-200 relative min-h-[420px] flex flex-col justify-between overflow-hidden">
                <div classהקוד המלא של `src/App.jsx` להעתקה והדבקה ישירה לתוך הקובץ ב-GitHub:

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Flag, ShieldCheck, MapPin, Phone, User, CheckCircle2, AlertTriangle,
  Truck, Wrench, Search, Settings, BarChart3, Users, Package, MessageSquare,
  Clock, ArrowRight, Plus, Trash2, Edit3, Eye, EyeOff, Lock, Bell,
  ChevronLeft, Check, X, Sparkles, Navigation, RefreshCw, Send, FileText
} from 'lucide-react';

// --- נתוני התחלה (מוצרים, ערים ופעילים) ---
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
  customerConfirm: `שלום {שם}, בקשתך #{מספר_בקשה} במבצע "הנה זה משיח בא" התקבלה! פרטיך הועברו לפעילים באזורך והם ייצרו איתך קשר טלפוני בהקדם.`,
  customerFollowup5Days: `שלום {שם}, לפני 5 ימי עסקים ביקשת לקבל דגלים ושלטים (בקשה #{מספר_בקשה}). אנו רוצים לוודא שאחד הפעילים כבר יצר איתך קשר. האם יצרו איתך קשר?`,
  adminUnansweredAlert: `🚨 התראת מנהל: בקשה #{מספר_בקשה} של {שם} ({טלפון}, {כתובת}) סומנה כ"לא נוצר קשר" לאחר 5 ימי עסקים! לטיפולך המיידי.`
};

// חישוב מרחק אווירי בק"מ (Haversine)
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

// איור וקטורי נקי (מותאם לרימון ונטפרי ב-100%)
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
  // לשוניות ראשיות: 'home' | 'order' | 'how' | 'track' | 'admin'
  const [activeTab, setActiveTab] = useState('home');
  const [showSmsSimulator, setShowSmsSimulator] = useState(true);

  // הגדרות קמפיין וניהול תוכן
  const [settings, setSettings] = useState({
    heroTitle: 'הנה זה משיח בא – מגיע עד אליך לבית',
    heroSubtitle: 'מבצע הפצה ארצי של דגלים ושלטים למרפסת ולבית! הזמינו עכשיו והפעילים הקרובים אליכם ייצרו איתכם קשר טלפוני.',
    bannerColor: 'from-blue-950 via-blue-900 to-indigo-950',
    showActivistsToPublic: true,
    followupBusinessDays: 5
  });

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [activists, setActivists] = useState(INITIAL_ACTIVISTS);
  const [smsTemplates, setSmsTemplates] = useState(INITIAL_SMS_TEMPLATES);

  // בקשות במערכת
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
      items: [{ productId: 'p1', name: 'דגל משיח צהוב – מידה גדולה', qty: 2 }, { productId: 'p2', name: 'שלט שמשונית למרפסת', qty: 1 }],
      wantsInstall: true,
      notes: 'קומה 2, להתקשר אחרי 16:00',
      urgent: false,
      status: 'נשלחה לפעילים',
      createdAt: '01/11 10:15',
      daysElapsed: 2,
      assignedActivists: [
        { id: 'a1', name: 'מנחם כהן', phone: '050-4112233', distanceKm: 0.2 },
        { id: 'a2', name: 'לוי יצחק לוי', phone: '052-7654321', distanceKm: 0.6 }
      ],
      history: [
        { time: '01/11 10:14', text: 'בקשה נוצרה ומספר טלפון אומת ב-SMS' },
        { time: '01/11 10:15', text: 'כתובת אומתה ב-Google Places (צפת)' },
        { time: '01/11 10:15', text: 'נבחרו פעילים מבצעי התקנות ונשלח SMS לטלפונים הכשרים' }
      ]
    },
    {
      id: 10481,
      fullName: 'מאיר ביטון',
      phone: '054-9998877',
      address: 'שדרות הנשיא 30, חיפה',
      city: 'חיפה',
      area: 'צפון',
      lat: 32.8050,
      lng: 34.9860,
      items: [{ productId: 'p2', name: 'שלט שמשונית למרפסת', qty: 1 }],
      wantsInstall: true,
      notes: 'מרפסת חזיתית לרחוב הראשי',
      urgent: true,
      status: 'לא נוצר קשר',
      createdAt: '25/10 14:20',
      daysElapsed: 5,
      assignedActivists: [
        { id: 'a8', name: 'אברהם גולדשטיין', phone: '050-9887766', distanceKm: 0.4 }
      ],
      history: [
        { time: '25/10 14:20', text: 'בקשה נוצרה ונשלחה לפעיל בחיפה' },
        { time: '01/11 09:00', text: 'עברו 5 ימי עסקים – נשלח SMS מעקב למזמין' },
        { time: '01/11 09:12', text: '🚨 המזמין דיווח: לא יצרו איתי קשר! הועבר להתראת מנהל' }
      ]
    }
  ]);

  // יומן הודעות SMS (לטלפונים כשרים של פעילים + מזמינים + מנהל)
  const [smsLogs, setSmsLogs] = useState([
    {
      id: 'sms-init-1',
      toRole: 'פעיל (טלפון כשר)',
      toName: 'מנחם כהן',
      toPhone: '050-4112233',
      time: '10:15',
      requestId: 10480,
      text: 'בקשה חדשה להפצת דגלים ושלטים (#10480).\nשם: אהרן לוי\nטלפון: 052-5551122\nכתובת: רחוב הרבי מליובאוויטש 10, צפת\nהזמנה: 2 דגל משיח צהוב + 1 שלט שמשונית\nהתקנה: כן\nהערות: קומה 2.',
      interactiveType: null
    },
    {
      id: 'sms-init-2',
      toRole: 'מנהל מערכת',
      toName: 'מוקד ניהול',
      toPhone: '050-0000000',
      time: '09:12',
      requestId: 10481,
      text: '🚨 בקשה שלא קיבלה מענה (#10481)!\nשם: מאיר ביטון (054-9998877)\nכתובת: שדרות הנשיא 30, חיפה\nהמזמין דיווח שלא יצרו איתו קשר לאחר 5 ימי עסקים.',
      interactiveType: null
    }
  ]);

  // --- State של טופס ההזמנה ---
  const [orderForm, setOrderForm] = useState({
    fullName: '',
    phone: '',
    otpSent: false,
    otpCode: '',
    otpVerified: false,
    generatedOtp: '7704',
    addressSearch: '',
    selectedLocation: null,
    quantities: { p1: 1, p2: 0, p3: 0, p4: 0 },
    wantsInstall: false,
    notes: '',
    step: 'form', // 'form' | 'summary' | 'confirmed'
    duplicateWarning: null
  });
  const [lastSubmittedRequest, setLastSubmittedRequest] = useState(null);

  // --- State של מעקב הזמנה ---
  const [trackInput, setTrackInput] = useState('10480');

  // --- State של כניסת מנהל ---
  const [adminAuth, setAdminAuth] = useState({ loggedIn: false, username: 'admin', password: '' });
  const [adminSubTab, setAdminSubTab] = useState('dashboard'); // 'dashboard' | 'requests' | 'map' | 'activists' | 'products' | 'sms'

  // הוספת מוצר לטופס בלחיצה מהקטלוג
  const handleQuickOrderProduct = (productId) => {
    setOrderForm((prev) => ({
      ...prev,
      quantities: { ...prev.quantities, [productId]: Math.max(1, (prev.quantities[productId] || 0) + 1) },
      step: 'form'
    }));
    setActiveTab('order');
  };

  // שליחת קוד אימות SMS
  const handleSendOtp = () => {
    if (!orderForm.phone || orderForm.phone.length < 9) {
      alert('נא להזין מספר טלפון נייד תקין');
      return;
    }
    // בדיקת בקשה כפולה מאותו טלפון
    const existingOpen = requests.find(
      (r) => r.phone.replace(/\D/g, '') === orderForm.phone.replace(/\D/g, '') && !['בוצעה', 'בוטלה'].includes(r.status)
    );
    if (existingOpen && !orderForm.duplicateWarning) {
      setOrderForm((prev) => ({ ...prev, duplicateWarning: existingOpen }));
      return;
    }

    const code = '7704';
    setOrderForm((prev) => ({ ...prev, otpSent: true, generatedOtp: code, otpCode: code }));
    setSmsLogs((prev) => [
      {
        id: 'sms-' + Date.now(),
        toRole: 'אימות מזמין',
        toName: orderForm.fullName || 'מזמין',
        toPhone: orderForm.phone,
        time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        requestId: '-',
        text: `קוד האימות שלך למבצע "הנה זה משיח בא": ${code}`,
        interactiveType: null
      },
      ...prev
    ]);
  };

  const handleVerifyOtp = () => {
    if (orderForm.otpCode === orderForm.generatedOtp) {
      setOrderForm((prev) => ({ ...prev, otpVerified: true }));
    } else {
      alert('קוד האימות שגוי. הקוד שנשלח בסימולטור הוא 7704');
    }
  };

  // אלגוריתם איתור 3 הפעילים המתאימים ביותר
  const findBestActivists = (loc, wantsInstall, isUrgent = false) => {
    const maxCount = isUrgent ? 5 : 3;
    const candidates = activists
      .filter((a) => a.active)
      .filter((a) => (!wantsInstall ? true : a.doesInstall))
      .map((a) => {
        const distanceKm = calcDistanceKm(loc.lat, loc.lng, a.lat, a.lng);
        const servesCity = a.serviceCities.includes(loc.city);
        // שקלול מרחק + העדפת אזור שירות + חלוקת עומס
        const score = distanceKm + a.openRequests * 1.2 - (servesCity ? 5 : 0);
        return { ...a, distanceKm, servesCity, score };
      })
      .sort((a, b) => a.score - b.score);

    return candidates.slice(0, maxCount);
  };

  // שליחת הבקשה הסופית
  const handleFinalSubmitOrder = () => {
    const newId = 10482 + requests.length;
    const loc = orderForm.selectedLocation;
    const selectedItems = Object.entries(orderForm.quantities)
      .filter(([, qty]) => qty > 0)
      .map(([pid, qty]) => {
        const prod = products.find((p) => p.id === pid);
        return { productId: pid, name: prod ? prod.name : pid, qty };
      });

    const chosenActivists = findBestActivists(loc, orderForm.wantsInstall, false);
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
      urgent: false,
      status: chosenActivists.length > 0 ? 'נשלחה לפעילים' : 'הועברה למנהל',
      createdAt: `היום ${nowTime}`,
      daysElapsed: 0,
      assignedActivists: chosenActivists.map((a) => ({
        id: a.id,
        name: a.name,
        phone: a.phone,
        distanceKm: a.distanceKm
      })),
      history: [
        { time: nowTime, text: 'בקשה נוצרה על ידי המזמין' },
        { time: nowTime, text: 'מספר טלפון אומת בקוד SMS' },
        { time: nowTime, text: `כתובת אומתה (${loc.label}) וחושבו קואורדינטות GPS` },
        chosenActivists.length > 0
          ? { time: nowTime, text: `נבחרו ${chosenActivists.length} פעילים קרובים ונשלח אליהם SMS לטלפון כשר` }
          : { time: nowTime, text: 'אזור ללא פעילים זמינים – הועברה התראה למנהל' }
      ]
    };

    setRequests((prev) => [newReq, ...prev]);

    // בניית הודעות SMS לפעילים (ללא קישור, מותאם לטלפון כשר)
    const newLogs = [];
    chosenActivists.forEach((act) => {
      const msg = smsTemplates.activistNewRequest
        .replace('{מספר_בקשה}', newId)
        .replace('{שם}', newReq.fullName)
        .replace('{טלפון}', newReq.phone)
        .replace('{כתובת}', newReq.address)
        .replace('{מוצרים}', itemsText)
        .replace('{התקנה}', newReq.wantsInstall ? 'כן (כולל התקנה)' : 'ללא התקנה')
        .replace('{הערות}', newReq.notes);

      newLogs.push({
        id: `sms-act-${newId}-${act.id}`,
        toRole: 'פעיל (טלפון כשר)',
        toName: act.name,
        toPhone: act.phone,
        time: nowTime,
        requestId: newId,
        text: msg,
        interactiveType: null
      });
    });

    // הודעת אישור למזמין
    newLogs.push({
      id: `sms-cust-${newId}`,
      toRole: 'מזמין',
      toName: newReq.fullName,
      toPhone: newReq.phone,
      time: nowTime,
      requestId: newId,
      text: smsTemplates.customerConfirm
        .replace('{שם}', newReq.fullName)
        .replace('{מספר_בקשה}', newId),
      interactiveType: null
    });

    if (chosenActivists.length <= 1) {
      newLogs.push({
        id: `sms-adm-low-${newId}`,
        toRole: 'מנהל מערכת',
        toName: 'מוקד ניהול',
        toPhone: '050-0000000',
        time: nowTime,
        requestId: newId,
        text: `⚠️ שים לב: לבקשה #${newId} באזור ${loc.city} נמצא רק ${chosenActivists.length} פעיל זמין.`,
        interactiveType: null
      });
    }

    setSmsLogs((prev) => [...newLogs, ...prev]);
    setLastSubmittedRequest(newReq);
    setOrderForm((prev) => ({ ...prev, step: 'confirmed' }));
  };

  // סימולציית מעבר 5 ימי עסקים ושליחת SMS מעקב למזמין
  const simulate5BusinessDays = (reqId) => {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;
    const nowTime = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              daysElapsed: 5,
              status: 'ממתינה למעקב',
              history: [
                ...r.history,
                { time: `עברו 5 ימי עסקים (${nowTime})`, text: 'נשלח SMS מעקב אוטומטי למזמין לבדיקת יצירת קשר' }
              ]
            }
          : r
      )
    );

    const followupText = smsTemplates.customerFollowup5Days
      .replace('{שם}', req.fullName)
      .replace('{מספר_בקשה}', req.id);

    setSmsLogs((prev) => [
      {
        id: `sms-followup-${req.id}-${Date.now()}`,
        toRole: 'מעקב מזמין (5 ימי עסקים)',
        toName: req.fullName,
        toPhone: req.phone,
        time: nowTime,
        requestId: req.id,
        text: followupText,
        interactiveType: 'contact_check'
      },
      ...prev
    ]);
  };

  // תגובת המזמין ל-SMS המעקב ("כן יצרו קשר" / "לא יצרו קשר")
  const handleCustomerFollowupReply = (reqId, didContact) => {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;
    const nowTime = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

    if (didContact) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === reqId
            ? {
                ...r,
                status: 'נוצר קשר',
                history: [
                  ...r.history,
                  { time: nowTime, text: '🟢 המזמין אישר: אחד הפעילים יצר איתי קשר' }
                ]
              }
            : r
        )
      );
      setSmsLogs((prev) => [
        {
          id: `sms-done-check-${req.id}-${Date.now()}`,
          toRole: 'מעקב ביצוע למזמין',
          toName: req.fullName,
          toPhone: req.phone,
          time: nowTime,
          requestId: req.id,
          text: `שמחים לשמוע! האם ההזמנה (#${req.id}) כבר סופקה ובוצעה במלואה?`,
          interactiveType: 'completion_check'
        },
        ...prev
      ]);
    } else {
      // לא נוצר קשר -> התראת חירום למנהל
      setRequests((prev) =>
        prev.map((r) =>
          r.id === reqId
            ? {
                ...r,
                status: 'לא נוצר קשר',
                history: [
                  ...r.history,
                  { time: nowTime, text: '🚨 המזמין דיווח: לא יצרו קשר! הבקשה הועברה להתראת מנהל' }
                ]
              }
            : r
        )
      );

      const activistsList = req.assignedActivists.map((a) => `${a.name} (${a.phone})`).join(', ');
      setSmsLogs((prev) => [
        {
          id: `sms-admin-alert-${req.id}-${Date.now()}`,
          toRole: 'מנהל מערכת',
          toName: 'התראת חירום למנהל',
          toPhone: '050-0000000',
          time: nowTime,
          requestId: req.id,
          text: `🚨 בקשה שלא קיבלה מענה (#${req.id})!\nשם: ${req.fullName} | טלפון: ${req.phone}\nכתובת: ${req.address}\nנשלחה ל: ${activistsList}\nהמזמין דיווח שאף פעיל לא יצר קשר.`,
          interactiveType: null
        },
        ...prev
      ]);
    }
  };

  const handleCustomerCompletionReply = (reqId, isCompleted) => {
    const nowTime = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: isCompleted ? 'בוצעה' : 'ההזמנה בטיפול',
              history: [
                ...r.history,
                {
                  time: nowTime,
                  text: isCompleted ? '✅ המזמין דיווח: ההזמנה סופקה ובוצעה בהצלחה!' : 'המזמין דיווח: בתיאום מול הפעיל, טרם סופק'
                }
              ]
            }
          : r
      )
    );
  };

  // סטטיסטיקות ערים והמלצות גיוס פעילים
  const cityStats = useMemo(() => {
    const cities = ['צפת', 'ירושלים', 'חיפה', 'רמלה', 'בני ברק'];
    return cities.map((c) => {
      const cityReqs = requests.filter((r) => r.city === c);
      const cityActs = activists.filter((a) => a.active && a.serviceCities.includes(c));
      const unanswered = cityReqs.filter((r) => r.status === 'לא נוצר קשר').length;
      const done = cityReqs.filter((r) => r.status === 'בוצעה').length;
      const needsRecruitment = cityActs.length <= 1 || unanswered > 0;
      return {
        city: c,
        totalRequests: cityReqs.length + (c === 'חיפה' ? 46 : c === 'צפת' ? 118 : c === 'ירושלים' ? 208 : 30),
        completed: done + (c === 'חיפה' ? 38 : c === 'צפת' ? 105 : c === 'ירושלים' ? 194 : 28),
        unanswered: unanswered + (c === 'חיפה' ? 8 : c === 'צפת' ? 3 : 2),
        activeActivists: cityActs.length,
        needsRecruitment
      };
    });
  }, [requests, activists]);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* סרגל עליון (ניווט + כפתור סימולטור SMS) */}
      <header className="sticky top-0 z-40 bg-blue-950 text-white shadow-lg border-b-2 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-blue-950 flex items-center justify-center font-black shadow">
              <Flag className="w-6 h-6"/>
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
              <Settings className="w-4 h-4"/>
              <span>ניהול (/admin)</span>
              {requests.some((r) => r.status === 'לא נוצר קשר') && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              )}
            </button>
          </nav>

          <button
            onClick={() => setShowSmsSimulator(!showSmsSimulator)}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow"
          >
            <MessageSquare className="w-4 h-4"/>
            <span>{showSmsSimulator ? 'הסתר סימולטור SMS' : 'פתח סימולטור SMS'} ({smsLogs.length})</span>
          </button>
        </div>
      </header>

      {/* סימולטור SMS חי (מציג איך הפעילים עם הטלפונים הכשרים והמזמינים מקבלים SMS) */}
      {showSmsSimulator && (
        <div className="bg-slate-900 text-slate-100 border-b border-slate-700 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Sparkles className="w-4 h-4"/>
                <span>סימולטור מערכת SMS בזמן אמת (מותאם לפעילים עם טלפונים כשרים ללא אינטרנט + מעקב 5 ימי עסקים):</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => simulate5BusinessDays(requests[0]?.id)}
                  className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5"/>
                  <span>הרץ +5 ימי עסקים לבקשה #{requests[0]?.id}</span>
                </button>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {smsLogs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="min-w-[290px] max-w-[320px] bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs flex-shrink-0"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-bold text-yellow-400">{log.toRole}</span>
                    <span>{log.time}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mb-1.5">
                    נמען: <strong>{log.toName}</strong> ({log.toPhone})
                  </div>
                  <pre className="whitespace-pre-wrap font-sans bg-slate-950/70 p-2 rounded border border-slate-700 text-slate-200 leading-relaxed">
                    {log.text}
                  </pre>

                  {log.interactiveType === 'contact_check' && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleCustomerFollowupReply(log.requestId, true)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1 px-2 rounded text-[11px]"
                      >
                        [כן, יצרו איתי קשר]
                      </button>
                      <button
                        onClick={() => handleCustomerFollowupReply(log.requestId, false)}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded text-[11px]"
                      >
                        [לא יצרו איתי קשר]
                      </button>
                    </div>
                  )}

                  {log.interactiveType === 'completion_check' && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleCustomerCompletionReply(log.requestId, true)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1 px-2 rounded text-[11px]"
                      >
                        [כן, ההזמנה בוצעה]
                      </button>
                      <button
                        onClick={() => handleCustomerCompletionReply(log.requestId, false)}
                        className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-1 px-2 rounded text-[11px]"
                      >
                        [עדיין לא]
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* תוכן העמודים */}
      <main className="flex-1">
        {/* ================= 1. עמוד הבית ================= */}
        {activeTab === 'home' && (
          <div>
            {/* אזור המודעה המרכזית (Hero) */}
            <section className={`bg-gradient-to-br ${settings.bannerColor} text-white py-12 sm:py-16 px-4 relative overflow-hidden border-b-4 border-yellow-400`}>
              <div className="max-w-5xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                  <Sparkles className="w-4 h-4"/>
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
                    <ChevronLeft className="w-6 h-6"/>
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

            {/* סרט יתרונות קצר */}
            <section className="bg-amber-50 border-b border-amber-200 py-4 px-4">
              <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm font-bold text-amber-950">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600"/>
                  <span>איתור אוטומטי של 3 הפעילים הקרובים לביתך</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-600"/>
                  <span>אפשרות להזמנה כולל התקנה במרפסת</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5 text-amber-600"/>
                  <span>תיאום טלפוני ישיר ומהיר מול הפעיל</span>
                </div>
              </div>
            </section>

            {/* אזור המוצרים שלנו */}
            <section className="max-w-6xl mx-auto py-12 px-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">המוצרים שלנו להפצה</h2>
                  <p className="text-slate-600">בחרו דגלים ושלטים והגישו בקשה תוך דקה אחת</p>
                </div>
                <button
                  onClick={() => setActiveTab('order')}
                  className="bg-blue-900 hover:bg-blue-800 text-yellow-400 font-bold px-5 py-2.5 rounded-xl self-start sm:self-auto"
                >
                  מעבר לטופס הזמנה מרוכז
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products
                  .filter((p) => p.available)
                  .sort((a, b) => a.order - b.order)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
                    >
                      <ProductIllustration type="{product.svgType}"/>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full">
                            {product.category}
                          </span>
                          {product.allowInstall && (
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              אפשרות להתקנה
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-base mb-1">{product.name}</h3>
                        <p className="text-xs text-slate-600 mb-4 flex-1">{product.description}</p>

                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                          <div>
                            {product.specialPrice ? (
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-black text-blue-950">₪{product.specialPrice}</span>
                                <span className="text-xs text-slate-400 line-through">₪{product.price}</span>
                              </div>
                            ) : (
                              <span className="text-xl font-black text-blue-950">₪{product.price}</span>
                            )}
                          </div>
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

        {/* ================= 2. טופס הגשת בקשה ================= */}
        {activeTab === 'order' && (
          <div className="max-w-3xl mx-auto py-8 px-4">
            {orderForm.step === 'form' && (
              <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8">
                <div className="mb-6 border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full">
                    טופס הזמנה מהיר (Mobile First)
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                    הגשת בקשה לדגלים ושלטים
                  </h2>
                  <p className="text-sm text-slate-600">
                    מלאו את הפרטים ונעביר את הבקשה ל-3 הפעילים הקרובים ביותר אליכם.
                  </p>
                </div>

                {/* התראת בקשה כפולה */}
                {orderForm.duplicateWarning && (
                  <div className="mb-6 bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 text-sm">
                    <div className="font-bold text-amber-950 flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-5 h-5 text-amber-600"/>
                      <span>כבר קיימת בקשה פתוחה עבור מספר הטלפון הזה (#{orderForm.duplicateWarning.id})</span>
                    </div>
                    <p className="text-amber-800 mb-3">
                      סטטוס הבקשה הקיימת: <strong>{orderForm.duplicateWarning.status}</strong>. האם ברצונך לצפות בה או לשלוח בכל זאת בקשה חדשה?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setTrackInput(String(orderForm.duplicateWarning.id));
                          setActiveTab('track');
                        }}
                        className="bg-amber-600 text-white font-bold px-4 py-1.5 rounded-lg text-xs"
                      >
                        מעבר לבקשה הקיימת
                      </button>
                      <button
                        onClick={() => setOrderForm((prev) => ({ ...prev, duplicateWarning: null, otpSent: true }))}
                        className="bg-white border border-amber-400 text-amber-900 font-bold px-4 py-1.5 rounded-lg text-xs"
                      >
                        שלח בקשה חדשה בכל זאת
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* 1. שם וטלפון + אימות SMS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1">שם מלא *</label>
                      <input
                        type="text"
                        placeholder="לדוגמה: ישראל ישראלי"
                        value={orderForm.fullName}
                        onChange={(e) => setOrderForm({ ...orderForm, fullName: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-600 outline-none"
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
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-slate-100"
                        />
                        {!orderForm.otpVerified && (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 rounded-xl text-xs whitespace-nowrap"
                          >
                            שלח קוד SMS
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* תיבת הזנת קוד SMS */}
                  {orderForm.otpSent && !orderForm.otpVerified && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-sm text-blue-950">
                        שלחנו קוד אימות לנייד שלך (בסימולטור הקוד הוזן אוטומטית: <strong>7704</strong>)
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          value={orderForm.otpCode}
                          onChange={(e) => setOrderForm({ ...orderForm, otpCode: e.target.value })}
                          className="border border-blue-300 rounded-xl px-3 py-2 w-28 text-center font-black tracking-widest"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-sm"
                        >
                          אמת מספר
                        </button>
                      </div>
                    </div>
                  )}

                  {orderForm.otpVerified && (
                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl text-sm font-bold">
                      <CheckCircle2 className="w-5 h-5"/>
                      <span>מספר הטלפון אומת בהצלחה ב-SMS!</span>
                    </div>
                  )}

                  {/* 2. בחירת כתובת מאומתת (Google Places) */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1">
                      כתובת מלאה (חיפוש Google Maps / Places) *
                    </label>
                    <p className="text-xs text-slate-500 mb-2">
                      יש לבחור כתובת מתוך הרשימה כדי שהמערכת תאתר אוטומטית את הפעילים הקרובים לפי GPS:
                    </p>
                    <select
                      value={orderForm.selectedLocation?.id || ''}
                      onChange={(e) => {
                        const found = ISRAEL_STREETS_DB.find((l) => l.id === e.target.value);
                        setOrderForm({ ...orderForm, selectedLocation: found || null });
                      }}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      <option value="">-- הקלידו / בחרו רחוב ומספר בית מתוך Google Places --</option>
                      {ISRAEL_STREETS_DB.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.label} (אזור {loc.area})
                        </option>
                      ))}
                    </select>
                    {orderForm.selectedLocation && (
                      <div className="mt-2 text-xs text-slate-600 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-700"/>
                        <span>
                          קואורדינטות GPS אומתו: {orderForm.selectedLocation.lat}, {orderForm.selectedLocation.lng} ({orderForm.selectedLocation.city})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 3. בחירת מוצרים וכמויות */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">בחירת דגלים ושלטים *</label>
                    <div className="space-y-2.5">
                      {products
                        .filter((p) => p.available && p.canOrder)
                        .map((prod) => (
                          <div
                            key={prod.id}
                            className="flex items-center justify-between border border-slate-200 rounded-xl p-3 bg-slate-50/60"
                          >
                            <div>
                              <div className="font-bold text-sm text-slate-900">{prod.name}</div>
                              <div className="text-xs text-slate-500">
                                מחיר מיוחד: ₪{prod.specialPrice || prod.price}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setOrderForm((prev) => ({
                                    ...prev,
                                    quantities: {
                                      ...prev.quantities,
                                      [prod.id]: Math.max(0, (prev.quantities[prod.id] || 0) - 1)
                                    }
                                  }))
                                }
                                className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-lg flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-black text-base">
                                {orderForm.quantities[prod.id] || 0}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setOrderForm((prev) => ({
                                    ...prev,
                                    quantities: {
                                      ...prev.quantities,
                                      [prod.id]: (prev.quantities[prod.id] || 0) + 1
                                    }
                                  }))
                                }
                                className="w-8 h-8 rounded-lg bg-blue-900 text-white font-bold text-lg flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* 4. האם מעוניין בהתקנה */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">האם אתה מעוניין בהתקנה?</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setOrderForm({ ...orderForm, wantsInstall: false })}
                        className={`p-3.5 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition ${
                          !orderForm.wantsInstall
                            ? 'border-blue-900 bg-blue-50 text-blue-950'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        <Package className="w-4 h-4"/>
                        <span>ללא התקנה (מסירה בלבד)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderForm({ ...orderForm, wantsInstall: true })}
                        className={`p-3.5 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition ${
                          orderForm.wantsInstall
                            ? 'border-blue-900 bg-blue-50 text-blue-950'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        <Wrench className="w-4 h-4"/>
                        <span>כולל התקנה בבית/מרפסת</span>
                      </button>
                    </div>
                  </div>

                  {/* 5. הערות */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1">
                      הערות / פרטים נוספים לפעיל
                    </label>
                    <textarea
                      rows={2}
                      placeholder="קומה, מיקום התקנה מבוקש, שעות נוחות ליצירת קשר..."
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const hasItems = Object.values(orderForm.quantities).some((q) => q > 0);
                      if (!orderForm.fullName || !orderForm.otpVerified || !orderForm.selectedLocation || !hasItems) {
                        alert('נא למלא שם, לאמת מספר טלפון ב-SMS, לבחור כתובת מרשימת Google Places ולבחור לפחות מוצר אחד.');
                        return;
                      }
                      setOrderForm({ ...orderForm, step: 'summary' });
                    }}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-lg py-4 rounded-2xl shadow-md transition"
                  >
                    המשך לסיכום הבקשה
                  </button>
                </div>
              </div>
            )}

            {/* שלב סיכום לפני שליחה */}
            {orderForm.step === 'summary' && (
              <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-4">סיכום הבקשה לפני שליחה</h2>
                <div className="bg-slate-50 rounded-2xl p-4 space-y-3 text-sm border border-slate-200 mb-6">
                  <div><strong>שם מלא:</strong> {orderForm.fullName}</div>
                  <div><strong>טלפון מאומת:</strong> {orderForm.phone}</div>
                  <div><strong>כתובת:</strong> {orderForm.selectedLocation?.label}</div>
                  <div>
                    <strong>מוצרים שנבחרו:</strong>
                    <ul className="list-disc list-inside mt-1 text-slate-700">
                      {Object.entries(orderForm.quantities)
                        .filter(([, q]) => q > 0)
                        .map(([pid, q]) => {
                          const prod = products.find((p) => p.id === pid);
                          return <li key={pid}>{prod?.name} – כמות: {q}</li>;
                        })}
                    </ul>
                  </div>
                  <div><strong>התקנה:</strong> {orderForm.wantsInstall ? 'כולל התקנה' : 'ללא התקנה'}</div>
                  <div><strong>הערות:</strong> {orderForm.notes || 'ללא הערות'}</div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleFinalSubmitOrder}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg py-4 rounded-2xl shadow-lg"
                  >
                    שליחת הבקשה
                  </button>
                  <button
                    onClick={() => setOrderForm({ ...orderForm, step: 'form' })}
                    className="px-6 py-4 rounded-2xl border border-slate-300 font-bold text-slate-700"
                  >
                    חזרה לעריכה
                  </button>
                </div>
              </div>
            )}

            {/* שלב אישור שליחת הבקשה */}
            {orderForm.step === 'confirmed' && lastSubmittedRequest && (
              <div className="bg-white rounded-3xl shadow-md border border-emerald-200 p-6 sm:p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10"/>
                </div>
                <div className="inline-block bg-blue-950 text-yellow-400 font-black px-4 py-1 rounded-full text-sm mb-3">
                  בקשה #{lastSubmittedRequest.id}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                  הבקשה התקבלה בהצלחה!
                </h2>
                <p className="text-slate-600 max-w-lg mx-auto mb-6">
                  תודה על הרצון להשתתף בהפצת בשורת הגאולה. איתרנו את הפעילים הקרובים אליך והעברנו אליהם ב-SMS את פרטי הבקשה כדי שיתקשרו אליך.
                </p>

                {/* הצגת מרחק משוער של פעילים באזור (שמירה על פרטיות הפעילים) */}
                {settings.showActivistsToPublic && lastSubmittedRequest.assignedActivists.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-right mb-6">
                    <h3 className="font-bold text-blue-950 text-sm mb-2 flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-blue-700"/>
                      <span>פעילים באזור שלך שקיבלו כעת הודעת SMS (ללא חשיפת פרטים אישיים):</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {lastSubmittedRequest.assignedActivists.map((act, idx) => (
                        <div key={act.id} className="bg-white p-3 rounded-xl border border-blue-100 text-xs">
                          <div className="font-bold text-slate-800">פעיל #{idx + 1} באזור {lastSubmittedRequest.city}</div>
                          <div className="text-emerald-700 font-semibold mt-0.5">
                            מרחק משוער: כ־{act.distanceKm} ק"מ ממך
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      setTrackInput(String(lastSubmittedRequest.id));
                      setActiveTab('track');
                    }}
                    className="bg-blue-900 text-white font-bold px-6 py-3 rounded-xl"
                  >
                    מעקב אחר בקשה #{lastSubmittedRequest.id}
                  </button>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="border border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl"
                  >
                    חזרה לעמוד הבית
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 3. עמוד "איך זה עובד?" ================= */}
        {activeTab === 'how' && (
          <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 mb-2">איך המערכת עובדת?</h2>
              <p className="text-slate-600">תהליך פשוט ומהיר שמחבר אותך לפעילים בשטח ללא שום סיבוך</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {[
                { step: 1, title: 'בוחרים מה תרצו', desc: 'דגלים, שלטים למרפסת או ערכת הפצה משפחתית.' },
                { step: 2, title: 'ממלאים פרטים', desc: 'אימות SMS מהיר ובחירת כתובת מדויקת.' },
                { step: 3, title: 'איתור פעילים באזור', desc: 'המערכת מאתרת אוטומטית את 3 הפעילים הקרובים אליכם.' },
                { step: 4, title: 'הפעילים מתקשרים', desc: 'הפעילים מקבלים SMS לטלפון הכשר ומתקשרים לתאם.' },
                { step: 5, title: 'מגיע עד הבית!', desc: 'הדגלים והשלטים מגיעים אליכם (כולל אפשרות התקנה).' }
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-2xl p-5 border border-slate-200 text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-yellow-400 text-blue-950 font-black text-lg flex items-center justify-center mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. עמוד מעקב בקשה ================= */}
        {activeTab === 'track' && (
          <div className="max-w-xl mx-auto py-12 px-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-2">מעקב סטטוס בקשה</h2>
              <p className="text-sm text-slate-600 mb-4">הזינו את מספר הבקשה שקיבלתם בסיום ההזמנה:</p>
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  placeholder="לדוגמה: 10480"
                  className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 font-bold"
                />
              </div>

              {(() => {
                const found = requests.find((r) => String(r.id) === trackInput.replace('#', '').trim());
                if (!found) {
                  return <div className="text-sm text-slate-500">לא נמצאה בקשה במספר זה. נסו למשל: 10480 או 10481</div>;
                }
                return (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-black text-base text-blue-950">בקשה #{found.id}</span>
                      <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
                        {found.status}
                      </span>
                    </div>
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2">
                        <span>🟢</span>
                        <span>הבקשה התקבלה ואומתה במערכת</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🟢</span>
                        <span>פעילים באזור {found.city} עודכנו ב-SMS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{['נוצר קשר', 'בוצעה'].includes(found.status) ? '🟢' : '🟡'}</span>
                        <span>
                          {['נוצר קשר', 'בוצעה'].includes(found.status)
                            ? 'נוצר קשר טלפוני עם המזמין'
                            : 'ממתינים ליצירת קשר / אישור מהמזמין'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{found.status === 'בוצעה' ? '🟢' : '⚪'}</span>
                        <span>
                          {found.status === 'בוצעה' ? 'ההזמנה סופקה ובוצעה!' : 'ההזמנה טרם סומנה כבוצעה'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ================= 5. מערכת ניהול (/admin) ================= */}
        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto py-8 px-4">
            {!adminAuth.loggedIn ? (
              <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-blue-950 font-black text-xl mb-2">
                  <Lock className="w-6 h-6"/>
                  <span>כניסת מנהל מערכת (/admin)</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  הדגמה פתוחה: לחצו על כפתור הכניסה כדי להיכנס לממשק הניהול המלא.
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={adminAuth.username}
                    onChange={(e) => setAdminAuth({ ...adminAuth, username: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm"
                    placeholder="שם משתמש"
                  />
                  <input
                    type="password"
                    value="••••••••"
                    readOnly
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-slate-50"
                  />
                  <button
                    onClick={() => setAdminAuth({ ...adminAuth, loggedIn: true })}
                    className="w-full bg-blue-950 hover:bg-blue-900 text-yellow-400 font-black py-3 rounded-xl"
                  >
                    כניסה למערכת הניהול
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* תפריט פנימי למנהל */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'dashboard', label: 'Dashboard וסטטיסטיקות', icon: BarChart3 },
                      { id: 'requests', label: `ניהול בקשות (${requests.length})`, icon: FileText },
                      { id: 'map', label: 'מפת פעילים ארצית', icon: MapPin },
                      { id: 'activists', label: `ניהול פעילים (${activists.length})`, icon: Users },
                      { id: 'products', label: 'ניהול מוצרים ומודעה', icon: Package },
                      { id: 'sms', label: 'תבניות SMS וימי עסקים', icon: MessageSquare }
                    ].map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setAdminSubTab(t.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                            adminSubTab === t.id
                              ? 'bg-blue-950 text-yellow-400'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <Icon className="w-4 h-4"/>
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* תת-מסך: Dashboard */}
                {adminSubTab === 'dashboard' && (
                  <div className="space-y-6">
                    {/* התראות חירום על בקשות ללא מענה */}
                    {requests
                      .filter((r) => r.status === 'לא נוצר קשר')
                      .map((unanswered) => (
                        <div
                          key={unanswered.id}
                          className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="font-black text-red-900 flex items-center gap-2">
                              <span>🚨 בקשה שלא קיבלה מענה – בקשה #{unanswered.id}</span>
                            </div>
                            <p className="text-xs text-red-800 mt-1">
                              מזמין: <strong>{unanswered.fullName}</strong> ({unanswered.phone}) | כתובת: {unanswered.address}
                            </p>
                            <p className="text-xs text-red-700">
                              נשלחה לפעילים: {unanswered.assignedActivists.map((a) => `${a.name} (${a.phone})`).join(', ')} – המזמין דיווח שאף אחד מהם לא יצר קשר.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setRequests((prev) =>
                                prev.map((r) => (r.id === unanswered.id ? { ...r, status: 'בטיפול מנהל' } : r))
                              );
                            }}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl whitespace-nowrap"
                          >
                            סמן כ"בטיפול מנהל"
                          </button>
                        </div>
                      ))}

                    {/* כרטיסי מדדים */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                      {[
                        { label: 'בקשות פתוחות', val: requests.length, color: 'text-blue-900' },
                        { label: 'נשלחו לפעילים', val: requests.filter((r) => r.status === 'נשלחה לפעילים').length, color: 'text-indigo-700' },
                        { label: 'נוצר קשר', val: requests.filter((r) => r.status === 'נוצר קשר').length, color: 'text-emerald-700' },
                        { label: 'לא קיבלו מענה', val: requests.filter((r) => r.status === 'לא נוצר קשר').length, color: 'text-red-600' },
                        { label: 'סה"כ פעילים', val: activists.length, color: 'text-slate-800' },
                        { label: 'פעילים זמינים', val: activists.filter((a) => a.active).length, color: 'text-emerald-600' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200">
                          <div className="text-xs text-slate-500 font-semibold">{stat.label}</div>
                          <div className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.val}</div>
                        </div>
                      ))}
                    </div>

                    {/* טבלת סטטיסטיקות לפי עיר + המלצות גיוס פעילים */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
                        <h3 className="font-black text-base text-slate-900 mb-3">סטטיסטיקות הפצה לפי עיר</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-right">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-500 text-xs">
                                <th className="pb-2">עיר</th>
                                <th className="pb-2">בקשות</th>
                                <th className="pb-2">בוצעו</th>
                                <th className="pb-2">ללא מענה</th>
                                <th className="pb-2">פעילים זמינים</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {cityStats.map((cs) => (
                                <tr key={cs.city}>
                                  <td className="py-2.5 font-bold">{cs.city}</td>
                                  <td className="py-2.5">{cs.totalRequests}</td>
                                  <td className="py-2.5 text-emerald-700 font-semibold">{cs.completed}</td>
                                  <td className="py-2.5 text-red-600 font-semibold">{cs.unanswered}</td>
                                  <td className="py-2.5">{cs.activeActivists}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-amber-50 rounded-2xl border border-amber-300 p-5">
                        <h3 className="font-black text-base text-amber-950 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-600"/>
                          <span>המלצות מערכת לגיוס פעילים</span>
                        </h3>
                        <p className="text-xs text-amber-800 mb-3">
                          המערכת מזהה אוטומטית ערים עם עומס בקשות גבוה ביחס למספר הפעילים:
                        </p>
                        <div className="space-y-2.5">
                          <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs">
                            <div className="font-bold text-red-700">⚠️ מחסור בפעילים באזור חיפה</div>
                            <div className="text-slate-600 mt-0.5">47 בקשות בחודש האחרון • פעיל 1 בלבד במאגר</div>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs">
                            <div className="font-bold text-amber-800">⚠️ מומלץ לתגבר מתקינים ברמלה</div>
                            <div className="text-slate-600 mt-0.5">82% מהבקשות דורשות התקנה במרפסת</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* תת-מסך: ניהול בקשות */}
                {adminSubTab === 'requests' && (
                  <div className="space-y-4">
                    {requests.map((req) => (
                      <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-lg text-blue-950">בקשה #{req.id}</span>
                            {req.urgent && (
                              <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                                🚨 דחופה (עד 5 פעילים)
                              </span>
                            )}
                            <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full">
                              סטטוס: {req.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => simulate5BusinessDays(req.id)}
                              className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-lg"
                            >
                              שלח SMS מעקב (5 ימי עסקים)
                            </button>
                            <select
                              value={req.status}
                              onChange={(e) =>
                                setRequests((prev) =>
                                  prev.map((r) => (r.id === req.id ? { ...r, status: e.target.value } : r))
                                )
                              }
                              className="border border-slate-300 rounded-lg text-xs px-2.5 py-1.5 font-bold"
                            >
                              <option>חדשה</option>
                              <option>נשלחה לפעילים</option>
                              <option>ממתינה למעקב</option>
                              <option>נוצר קשר</option>
                              <option>ההזמנה בטיפול</option>
                              <option>בוצעה</option>
                              <option>לא נוצר קשר</option>
                              <option>הועברה למנהל</option>
                              <option>בוטלה</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div>
                            <div className="font-bold text-slate-800 mb-1">פרטי המזמין:</div>
                            <div>שם: {req.fullName}</div>
                            <div>טלפון: {req.phone}</div>
                            <div>כתובת: {req.address}</div>
                            <div>התקנה: {req.wantsInstall ? 'כן (כולל התקנה)' : 'ללא התקנה'}</div>
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 mb-1">פעילים שקיבלו SMS לטלפון כשר:</div>
                            {req.assignedActivists.map((a) => (
                              <div key={a.id} className="mb-1">
                                • {a.name} ({a.phone}) – {a.distanceKm} ק"מ
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 mb-1">היסטוריית מעקב מלאה:</div>
                            <div className="space-y-1 text-slate-600">
                              {req.history.map((h, i) => (
                                <div key={i}>
                                  <span className="font-semibold text-slate-800">{h.time}:</span> {h.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* תת-מסך: מפת פעילים אינטראקטיבית למנהל */}
                {adminSubTab === 'map' && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="font-black text-lg text-slate-900">מפת פריסת פעילים ארצית</h3>
                        <p className="text-xs text-slate-500">לחצו על כל פעיל לצפייה בעומס הבקשות ובאזורי השירות שלו</p>
                      </div>
                      <label className="flex items-center gap-2 text-xs font-bold bg-slate-100 px-3 py-2 rounded-xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.showActivistsToPublic}
                          onChange={(e) => setSettings({ ...settings, showActivistsToPublic: e.target.checked })}
                        />
                        <span>הצגת מרחק פעילים למזמינים (ללא כתובת מדויקת)</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {activists.map((act) => (
                        <div
                          key={act.id}
                          className={`p-4 rounded-2xl border ${
                            act.active ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-100 opacity-70'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-sm text-slate-900">{act.name}</span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${act.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-300 text-slate-700'}`}>
                              {act.active ? 'פעיל' : 'לא פעיל'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 space-y-1">
                            <div>טלפון כשר: <strong>{act.phone}</strong></div>
                            <div>עיר בסיס: {act.city} ({act.area})</div>
                            <div>אזורי שירות: {act.serviceCities.join(', ')}</div>
                            <div>מבצע התקנות: {act.doesInstall ? '✅ כן' : '❌ לא'}</div>
                            <div className="pt-1 border-t border-slate-200 flex justify-between font-bold text-slate-800">
                              <span>פתוחות: {act.openRequests}</span>
                              <span>סה"כ טופלו: {act.totalRequests}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* תת-מסך: ניהול פעילים */}
                {adminSubTab === 'activists' && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <h3 className="font-black text-lg text-slate-900 mb-4">ניהול מאגר פעילים וזמינות</h3>
                    <div className="space-y-2.5">
                      {activists.map((act) => (
                        <div
                          key={act.id}
                          className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 text-sm"
                        >
                          <div>
                            <span className="font-bold">{act.name}</span> • <span>{act.phone}</span> •{' '}
                            <span className="text-slate-500">אזורי שירות: {act.serviceCities.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={act.doesInstall}
                                onChange={(e) =>
                                  setActivists((prev) =>
                                    prev.map((a) => (a.id === act.id ? { ...a, doesInstall: e.target.checked } : a))
                                  )
                                }
                              />
                              <span>מבצע התקנות</span>
                            </label>
                            <button
                              onClick={() =>
                                setActivists((prev) =>
                                  prev.map((a) => (a.id === act.id ? { ...a, active: !a.active } : a))
                                )
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                act.active ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-800'
                              }`}
                            >
                              {act.active ? 'פעיל (זמין ל-SMS)' : 'כבוי (בחופשה)'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* תת-מסך: ניהול מוצרים ותוכן מודעה */}
                {adminSubTab === 'products' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                      <h3 className="font-black text-base text-slate-900 mb-3">עריכת המודעה הראשית של הקמפיין</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="block font-bold mb-1">כותרת ראשית:</label>
                          <input
                            type="text"
                            value={settings.heroTitle}
                            onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                            className="w-full border border-slate-300 rounded-xl px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">תת-כותרת:</label>
                          <input
                            type="text"
                            value={settings.heroSubtitle}
                            onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                            className="w-full border border-slate-300 rounded-xl px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                      <h3 className="font-black text-base text-slate-900 mb-3">ניהול מוצרים ומחירים</h3>
                      <div className="space-y-2.5">
                        {products.map((p) => (
                          <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-3 border border-slate-200 rounded-xl text-sm">
                            <div className="font-bold">{p.name}</div>
                            <div className="flex items-center gap-3">
                              <span>מחיר מיוחד: ₪{p.specialPrice}</span>
                              <button
                                onClick={() =>
                                  setProducts((prev) =>
                                    prev.map((item) => (item.id === p.id ? { ...item, available: !item.available } : item))
                                  )
                                }
                                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                  p.available ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {p.available ? 'מוצג באתר' : 'מוסתר'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* תת-מסך: תבניות SMS */}
                {adminSubTab === 'sms' && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <h3 className="font-black text-base text-slate-900">
                      עריכת נוסחי הודעות ה-SMS (משתנים דינמיים: {'{שם}'}, {'{טלפון}'}, {'{כתובת}'}, {'{מספר_בקשה}'}, {'{מוצרים}'})
                    </h3>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        נוסח SMS לפעיל בטלפון כשר (נשלח אוטומטית ל-3 הפעילים הקרובים):
                      </label>
                      <textarea
                        rows={5}
                        value={smsTemplates.activistNewRequest}
                        onChange={(e) => setSmsTemplates({ ...smsTemplates, activistNewRequest: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-3 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        נוסח SMS מעקב למזמין אחרי 5 ימי עסקים:
                      </label>
                      <textarea
                        rows={3}
                        value={smsTemplates.customerFollowup5Days}
                        onChange={(e) => setSmsTemplates({ ...smsTemplates, customerFollowup5Days: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-3 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* פוטר */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 px-4 border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-yellow-400">הנה זה משיח בא – מגיע עד אליך לבית</strong> • מערכת הפצה ארצית אוטומטית
          </div>
          <div>מותאם לגלישה בטוחה בסינון רימון ונטפרי • Mobile First</div>
        </div>
      </footer>
    </div>
  );
}
