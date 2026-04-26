import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { LogIn, Wallet, CreditCard, Download, Loader, Flame, Lock, Unlock, FileText, TrendingUp, ShieldCheck, MessageCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const STRINGS = {
  kn: { title: 'ನನ್ನ ಆರ್ಥಿಕ ಪ್ರೋಫೈಲ್', subtitle: 'Firestore ನಿಂದ ನೇರ ಡೇಟಾ', loginTitle: 'ನಿಮ್ಮ Profile ನೋಡಿ', loginSub: 'WhatsApp ನಂಬರ್ ಹಾಕಿ login ಮಾಡಿ', phonePH: 'Ex: 919876543210', pinPH: 'PIN / Password', loginBtn: 'ಲಾಗಿನ್', profit: 'ಒಟ್ಟು ಲಾಭ', credit: 'Credit Score', streak: 'Streak', unlock: 'ಸಮೃದ್ಧಿ', days: 'ದಿನಗಳು ಟ್ರ್ಯಾಕ್', welcome: 'ಸ್ವಾಗತ', noProfile: 'Profile ಇಲ್ಲ! WhatsApp ನಲ್ಲಿ Mitra ಗೆ Hi ಕಳಿಸಿ.', dbErr: 'Database error. Firebase config ಚೆಕ್ ಮಾಡಿ.' },
  hi: { title: 'मेरी आर्थिक प्रोफ़ाइल', subtitle: 'Firestore से सीधा डेटा', loginTitle: 'अपनी Profile देखें', loginSub: 'WhatsApp नंबर से login करें', phonePH: 'Ex: 919876543210', pinPH: 'PIN / पासवर्ड', loginBtn: 'लॉगिन', profit: 'कुल लाभ', credit: 'Credit Score', streak: 'Streak', unlock: 'Samruddhi', days: 'दिन track', welcome: 'वाపस आपका स्वागत', noProfile: 'कोई profile नहीं मिला! WhatsApp पर Mitra को Hi भेजें.', dbErr: 'Database error. Firebase config जांचें.' },
  ta: { title: 'என் நிதி விவரம்', subtitle: 'Firestore இலிருந்து நேரடி தரவு', loginTitle: 'உங்கள் Profile பார்க்கவும்', loginSub: 'WhatsApp எண் மூலம் உள்நுழுக்கவும்', phonePH: 'Ex: 919876543210', pinPH: 'PIN / கடவுச்சொற்', loginBtn: 'உள்நுழு', profit: 'மொத்த இலாபம்', credit: 'Credit Score', streak: 'Streak', unlock: 'Samruddhi', days: 'நாட்கள் track', welcome: 'மீண்டும் வருக', noProfile: 'ப்ரொஃபைல் இல்லை! WhatsApp இல் Mitraக்கு Hi அனுப்பவும்.', dbErr: 'Database பிழை. Firebase config சரிபார்க்கவும்.' },
  te: { title: 'నా ఆర్థిక ప్రొఫైల్', subtitle: 'Firestore నుండి నేరుగా డేటా', loginTitle: 'మీ Profile చూడండి', loginSub: 'WhatsApp నంబర్తో login చేయండి', phonePH: 'Ex: 919876543210', pinPH: 'PIN / పాస్వర్డ్', loginBtn: 'లాగిన్', profit: 'మొత్తం లాభం', credit: 'Credit Score', streak: 'Streak', unlock: 'Samruddhi', days: 'రోజులు track', welcome: 'తిరిగి స్వాగతం', noProfile: 'ప్రొఫైల్ కనుగొనలేదు! WhatsAppలో Mitraకు Hi పంపండి.', dbErr: 'Database తప్పు. Firebase config సరిచూడండి.' },
  en: { title: 'My Financial Profile', subtitle: 'Live data from Firestore', loginTitle: 'Worker Login', loginSub: 'Access your Mitra profile with your WhatsApp number', phonePH: 'Ex: 919876543210', pinPH: 'PIN / Password', loginBtn: 'View My Data', profit: 'Total Profit', credit: 'Credit Score', streak: 'Streak', unlock: 'Samruddhi', days: 'Days Tracked', welcome: 'Welcome back', noProfile: 'No profile found! Send Hi to Mitra on WhatsApp.', dbErr: 'Database error. Check Firebase config.' },
};

const MOCK_LISTINGS = [
  { id: 1, name: 'Fresh Organic Onions', price: 1200, unit: '50kg', status: 'Active', views: 42 },
  { id: 2, name: 'Bulk Garlic Grade A', price: 800, unit: '10kg', status: 'Pending', views: 12 },
];

const UNLOCK_LEVELS = [
  { days: 0, label: '🔒 Locked', color: '#94a3b8' },
  { days: 30, label: '🌟 Basic', color: '#f59e0b' },
  { days: 60, label: '✅ Supplier', color: '#0ea5e9' },
  { days: 90, label: '🏆 Full', color: '#16a34a' },
];

function getUnlockLabel(days) {
  if (days >= 90) return UNLOCK_LEVELS[3];
  if (days >= 60) return UNLOCK_LEVELS[2];
  if (days >= 30) return UNLOCK_LEVELS[1];
  return UNLOCK_LEVELS[0];
}

export default function Dashboard({ lang = 'kn' }) {
  const S = STRINGS[lang] || STRINGS.en;
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogin = async () => {
    if (phone.length < 10) return;
    setLoading(true);
    try {
      const fp = phone.startsWith('91') ? phone : `91${phone}`;
      const snap = await getDoc(doc(db, 'users', fp));
      
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        const transRef = collection(db, 'users', fp, 'transactions');
        const transSnap = await getDocs(query(transRef, orderBy('date', 'desc')));
        const list = [];
        transSnap.forEach(d => {
          const t = d.data();
          list.push({ ...t, name: t.date?.toDate ? t.date.toDate().toLocaleDateString() : t.date });
        });
        setTransactions(list.length ? list : [{ name: 'Today', income: 0, expense: 0, profit: 0 }]);
        setIsLoggedIn(true);
      } else {
        alert(S.noProfile);
      }
    } catch (err) {
      console.error(err);
      alert(S.dbErr);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-wrap" style={{ minHeight: '80vh', padding: 0 }}>
        <div className="hero-banner" style={{ width: '100%', borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
          <div className="login-card" style={{ animation: 'popIn 0.5s ease both' }}>
            <div className="login-logo">
              <span style={{ fontSize: '1.8rem' }}>🌿</span> {lang === 'kn' ? 'ಸಮೃದ್ಧಿ ಬೆಂಗಳೂರು' : 'Samruddhi Bengaluru'}
              <span className="logo-tag">Worker Portal</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{S.loginTitle}</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>{S.loginSub}</p>
            
            <div className="form-group">
              <label className="form-label">WhatsApp Number</label>
              <input className="form-input" type="tel" placeholder={S.phonePH} value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            
            <div className="form-group">
              <label className="form-label">PIN / Password</label>
              <input className="form-input" type="password" placeholder={S.pinPH} />
            </div>
            
            <button className="btn-primary" onClick={handleLogin} disabled={loading} style={{ marginTop: '0.8rem', padding: '1rem' }}>
              {loading ? <Loader className="animate-spin" size={20}/> : <LogIn size={20}/>} 
              <span style={{ marginLeft: '0.5rem' }}>{S.loginBtn}</span>
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
              Don't have an account?{' '}
              <a href="https://wa.me/15551593431?text=Hi+Mitra" target="_blank" rel="noreferrer" style={{ color: 'var(--green)', fontWeight: 700, textDecoration: 'none' }}>
                Chat with Mitra ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalIncome = transactions.reduce((s, t) => s + t.income, 0);
  const totalExpense = transactions.reduce((s, t) => s + t.expense, 0);
  const netProfit = totalIncome - totalExpense;
  const daysTracked = userData?.totalDaysTracked || 0;
  const creditScore = Math.min(300 + daysTracked * 20, 900);
  const streakCount = userData?.streakCount || 0;
  const unlockLevel = getUnlockLabel(daysTracked);
  const creditPct = Math.min((daysTracked / 90) * 100, 100);
  const showPensionNudge = daysTracked >= 60 && !userData?.pensionEnrolled;

  const TABS = [
    { id: 'overview', label: 'Overview', icon: <Wallet size={14}/> },
    { id: 'chart', label: 'Transactions', icon: <TrendingUp size={14}/> },
    { id: 'listings', label: 'My Listings', icon: <Package size={14}/> },
    { id: 'credit', label: 'Credit Report', icon: <FileText size={14}/> },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Premium Header Banner */}
      <div className="hero-banner" style={{ padding: '2rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="hero-badge" style={{ marginBottom: '0.8rem', display: 'inline-flex' }}>
              <ShieldCheck size={12} /> Verified Mitra Profile
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              {S.welcome}, <span style={{ color: 'var(--amber)' }}>{userData?.name || 'Worker'}</span>
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
              {S.subtitle} · Joined {userData?.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString() : 'recently'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-outline-white btn-sm" style={{ padding: '0.6rem 1rem' }}>
              <Download size={14}/> Export Profile
            </button>
            <button className="btn-whatsapp btn-sm" style={{ padding: '0.6rem 1rem' }}>
              <MessageCircle size={14}/> Support
            </button>
            <button className="btn-ghost btn-sm" onClick={() => { setIsLoggedIn(false); setUserData(null); setPhone(''); }} style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)' }}>
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Pension nudge */}
      {showPensionNudge && (
        <div style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', color: 'white', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>👴 Atal Pension Yojana — ₹42/month → ₹5,000/month at 60</div>
            <div style={{ opacity: 0.85, fontSize: '0.83rem' }}>80% of informal workers want this but haven't enrolled. Takes 30 minutes.</div>
          </div>
          <a href="https://wa.me/15551593431?text=Help me enroll in Atal Pension Yojana" target="_blank" rel="noreferrer" className="btn-whatsapp" style={{ fontSize: '0.82rem', padding: '0.45rem 1rem', flexShrink: 0 }}>
            💬 Enroll Now
          </a>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
        {[
          { val: `₹${netProfit.toLocaleString('en-IN')}`, label: S.profit, icon: <Wallet size={18}/>, cls: 'si-green' },
          { val: `${creditScore}/900`, label: S.credit, icon: <CreditCard size={18}/>, cls: 'si-sky' },
          { val: `${streakCount} 🔥`, label: S.streak, icon: <Flame size={18}/>, cls: 'si-saffron' },
          { val: unlockLevel.label, label: S.unlock, icon: daysTracked >= 30 ? <Unlock size={18}/> : <Lock size={18}/>, cls: 'si-purple' },
        ].map((s, i) => (
          <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="stat-details"><h3>{s.val}</h3><p>{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Credit Progress */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>📈 Credit Journey — {daysTracked}/90 Days</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{Math.round(creditPct)}% complete</span>
        </div>
        <div className="unlock-track" style={{ marginBottom: '0.6rem' }}>
          {[{ d: 0, l: 'Start' }, { d: 30, l: '30d · Market' }, { d: 60, l: '60d · Supplier' }, { d: 90, l: '90d · Loan' }].map((step, i) => (
            <div key={i} className={`unlock-step ${daysTracked >= step.d && step.d > 0 ? 'done' : daysTracked >= step.d ? 'current' : ''}`}>
              {step.l}
            </div>
          ))}
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${creditPct}%` }}/>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          {daysTracked < 90
            ? `${90 - daysTracked} more days to full credit unlock + ₹10,000 loan eligibility`
            : '✅ Full credit access unlocked! You are loan-ready.'}
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="stats-grid">
          {[
            { val: `₹${totalIncome.toLocaleString('en-IN')}`, label: 'Total Income', icon: '💰', bg: '#d1fae5', c: '#15803d' },
            { val: `₹${totalExpense.toLocaleString('en-IN')}`, label: 'Total Expenses', icon: '💸', bg: '#fce7f3', c: '#be185d' },
            { val: daysTracked, label: 'Days Tracked', icon: '📅', bg: '#e0f2fe', c: '#0369a1' },
            { val: streakCount, label: 'Current Streak', icon: '🔥', bg: '#fff7ed', c: '#ea580c' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon" style={{ background: s.bg, fontSize: '1.2rem' }}>{s.icon}</div>
              <div className="stat-details"><h3 style={{ color: s.c }}>{s.val}</h3><p>{s.label}</p></div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="animate-fadeUp">
          <div className="header-flex">
            <h3 style={{ fontWeight: 800 }}>My Uploaded Products</h3>
            <button className="btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => navigate('/marketplace?tab=sell')}>
              <PlusCircle size={14}/> Add New
            </button>
          </div>
          <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {MOCK_LISTINGS.map(item => (
              <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>₹{item.price} per {item.unit}</div>
                  <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.5rem' }}>
                    <span className={`badge ${item.status === 'Active' ? 'badge-green' : 'badge-amber'}`}>{item.status}</span>
                    <span className="badge badge-gray">👁️ {item.views} views</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <button className="btn-secondary btn-sm">Edit</button>
                  <button className="btn-ghost btn-sm" style={{ color: 'var(--rose)', borderColor: 'var(--rose)' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'chart' && (
        <div className="chart-panel">
          <h3>Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transactions} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
              <XAxis dataKey="name" style={{ fontSize: '0.75rem' }}/>
              <YAxis style={{ fontSize: '0.75rem' }}/>
              <Tooltip formatter={v => `₹${v}`}/>
              <Line type="monotone" dataKey="income" name="Income" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }}/>
              <Line type="monotone" dataKey="expense" name="Expense" stroke="#e11d48" strokeWidth={3} dot={{ r: 4 }}/>
              <Line type="monotone" dataKey="profit" name="Profit" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5"/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>Daily Profit</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={transactions}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="name" style={{ fontSize: '0.72rem' }}/>
                <YAxis style={{ fontSize: '0.72rem' }}/>
                <Tooltip formatter={v => `₹${v}`}/>
                <Bar dataKey="profit" name="Profit" fill="#16a34a" radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'credit' && (
        <div className="card">
          <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>📄 Mitra Credit Certificate</h3>
          <div style={{ border: '2px solid var(--green)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Worker Name</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{userData?.name || 'Worker'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Occupation</div>
                <div style={{ fontWeight: 700 }}>{userData?.occupation || 'Street Vendor'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Credit Score</div>
                <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--green)' }}>{creditScore}/900</div>
              </div>
            </div>
            {[
              { label: 'Days Tracked', val: daysTracked },
              { label: 'Total Income Recorded', val: `₹${totalIncome.toLocaleString('en-IN')}` },
              { label: 'Consistency Score', val: `${Math.min(streakCount * 2, 100)}%` },
              { label: 'Loan Readiness', val: daysTracked >= 90 ? '✅ Ready' : `${daysTracked}/90 days` },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: i < 3 ? '1px solid #bbf7d0' : 'none', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--muted)' }}>{r.label}</span>
                <span style={{ fontWeight: 700 }}>{r.val}</span>
              </div>
            ))}
            {daysTracked < 90 && (
              <div style={{ marginTop: '1rem', background: '#fef9c3', border: '1px solid #fde047', borderRadius: 8, padding: '0.7rem 1rem', fontSize: '0.82rem', color: '#713f12' }}>
                💡 {90 - daysTracked} more days to generate your full Digital Existence Certificate — accepted by MFIs.
              </div>
            )}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ width: 'auto' }}><Download size={15}/> Download PDF</button>
            <a href="https://wa.me/15551593431?text=Send my credit certificate" target="_blank" rel="noreferrer" className="btn-ghost">💬 Send via WhatsApp</a>
          </div>
        </div>
      )}
    </div>
  );
}
