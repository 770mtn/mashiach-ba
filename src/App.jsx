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
  customerConfirm: `שלום {שם}, בקשתך #{מספר_בקשה} במבצע "הנה זה משיח בא" התקבלה! פרטיך הועברו לפעילים באזורך והם ייצרו איתך קשר טלפוני בהקדם.`,
  customerFollowup5Days: `שלום {שם}, לפני 5 ימי עסקים ביקשת לקבל דגלים ושלטים (בקשה #{מספר_בקשה}). אנו רוצים לוודא שאחד הפעילים כבר יצר איתך קשר. האם יצרו איתך קשר?`,
  adminUnansweredAlert: `🚨 התראת מנהל: בקשה #{מספר_בקשה} של {שם} ({טלפון}, {כתובת}) סומנה כ"לא נוצר קשר" לאחר 5 ימי עסקים! לטיפולך המיידי.`
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
  const [showSmsSimulator, setShowSmsSimulator] = useState(true);

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

  const findBestActivists = (loc, wantsInstall, isUrgent = false) => {
    const maxCount = isUrgent ? 5 : 3;
    const candidates = activists
      .filter((a) => a.active)
      .filter((a) => (!wantsInstall ? true : a.doesInstall))
      .map((a) => {
        const distanceKm = calcDistanceKm(loc.lat, loc.lng, a.lat, a.lng);
        const servesCity = a.serviceCities.includes(loc.city);
        const score = distanceKm + a.openRequests * 1.2 - (servesCity ? 5 : 0);
        return { ...a, distanceKm, servesCity, score };
      })
      .sort((a, b) => a.score - b.score);

    return candidates.slice(0, maxCount);
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

  const cityStats = useMemo(() => {
    const cities = ['צפת', 'ירושלים', 'חיפה', 'רמלה', 'בני ברק'];
    return cities.map((c) => {
      const cityReqs = requests.filter((r) => r.city === c);
      const cityActs = activists.filter((a) => a.active && a.serviceCities.includes(c));
      const unanswered = cityReqs.filter((r) => r.status === 'לא נוצר קשר').length;
      const done = cityReqs.filter((r) => r.status === 'בוצעה').length;
      return {
        city: c,
        totalRequests: cityReqs.length + (c === 'חיפה' ? 46 : c === 'צפת' ? 118 : c === 'ירושלים' ? 208 : 30),
        completed: done + (c === 'חיפה' ? 38 : c === 'צפת' ? 105 : c === 'ירושלים' ? 194 : 28),
        unanswered: unanswered + (c === 'חיפה' ? 8 : c === 'צפת' ? 3 : 2),
        activeActivists: cityActs.length
      };
    });
  }, [requests, activists]);

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
              {requests.some((r) => r.status === 'לא נוצר קשר') && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              )}
            </button>
          </nav>

          <button
            onClick={() => setShowSmsSimulator(!showSmsSimulator)}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{showSmsSimulator ? 'הסתר סימולטור SMS' : 'פתח סימולטור SMS'} ({smsLogs.length})</span>
          </button>
        </div>
      </header>

      {showSmsSimulator && (
        <div className="bg-slate-900 text-slate-100 border-b border-slate-700 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>סימולטור מערכת SMS בזמן אמת (מותאם לפעילים עם טלפונים כשרים ללא אינטרנט + מעקב 5 ימי עסקים):</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => simulate5BusinessDays(requests[0]?.id)}
                  className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
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

            <section className="bg-amber-50 border-b border-amber-200 py-4 px-4">
              <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm font-bold text-amber-950">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span>איתור אוטומטי של 3 הפעילים הקרובים לביתך</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-600" />
                  <span>אפשרות להזמנה כולל התקנה במרפסת</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5 text-amber-600" />
                  <span>תיאום טלפוני ישיר ומהיר מול הפעיל</span>
                </div>
              </div>
            </section>

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
                      <ProductIllustration type={product.svgType} />
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

                {orderForm.duplicateWarning && (
                  <div className="mb-6 bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 text-sm">
                    <div className="font-bold text-amber-950 flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
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
                      <CheckCircle2 className="w-5 h-5" />
                      <span>מספר הטלפון אומת בהצלחה ב-SMS!</span>
                    </div>
                  )}

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
                        <MapPin className="w-4 h-4 text-blue-700" />
                        <span>
                          קואורדינטות GPS אומתו: {orderForm.selectedLocation.lat}, {orderForm.selectedLocation.lng} ({orderForm.selectedLocation.city})
                        </span>
                      </div>
                    )}
                  </div>

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
                        <Package className="w-4 h-4" />
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
                        <Wrench className="w-4 h-4" />
                        <span>כולל התקנה בבית/מרפסת</span>
                      </button>
                    </div>
                  </div>

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

            {orderForm.step === 'confirmed' && lastSubmittedRequest && (
              <div className="bg-white rounded-3xl shadow-md border border-emerald-200 p-6 sm:p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
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

                {settings.showActivistsToPublic && lastSubmittedRequest.assignedActivists.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-right mb-6">
                    <h3 className="font-bold text-blue-950 text-sm mb-2 flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-blue-700" />
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

        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto py-8 px-4">
            {!adminAuth.loggedIn ? (
              <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-blue-950 font-black text-xl mb-2">
                  <Lock className="w-6 h-6" />
                  <span>כניסת מנהל מערכת (/admin)</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  לחצו על כפתור הכניסה כדי להיכנס לממשק הניהול המלא.
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
                          <Icon className="w-4 h-4" />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {adminSubTab === 'dashboard' && (
                  <div className="space-y-6">
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
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
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
