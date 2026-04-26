import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle, TrendingUp, ShieldCheck, Users, Recycle,
  Zap, ArrowRight, Star, MapPin, ChevronRight
} from 'lucide-react';

const STRINGS = {
  kn: {
    hero1: 'ಮಿತ್ರ — ನಿಮ್ಮ WhatsApp',
    hero2: 'ಆರ್ಥಿಕ ಸ್ನೇಹಿತ',
    heroSub: 'Bengaluru\'s 6.3 lakh informal workers ಗೆ credit profile, loan access ಮತ್ತು market access — WhatsApp ಮೂಲಕ, ಉಚಿತ.',
    startBtn: 'WhatsApp ನಲ್ಲಿ ಶುರು ಮಾಡಿ',
    exploreBtn: 'Marketplace ನೋಡಿ',
    stat1: '6.3 ಲಕ್ಷ', stat1l: 'Bengaluru MSMEs',
    stat2: '51 ಲಕ್ಷ', stat2l: 'Jobs Supported',
    stat3: '72 ಲಕ್ಷ', stat3l: 'SVANidhi Users',
    stat4: '₹10,000', stat4l: 'First Loan Amount',
    f1t: 'ದಿನನಿತ್ಯ Tracking', f1d: 'Income ಮತ್ತು expense WhatsApp ನಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    f2t: 'Credit Profile', f2d: '90 ದಿನದ ನಂತರ ಲೋನ್ ರೆಡಿ ಆಗ್ತೀರಾ',
    f3t: 'ಸರ್ಕಾರಿ ಯೋಜನೆ', f3d: 'SVANidhi, Ayushman Bharat auto-match',
    f4t: 'Voice Reply', f4d: 'ಕನ್ನಡ/ಹಿಂದಿ voice ನಲ್ಲಿ ಉತ್ತರ ಕೇಳಿ',
    f5t: 'SHG ಗ್ರೂಪ್', f5d: 'ಮಹಿಳಾ ಉಳಿತಾಯ ಗ್ರೂಪ್ ದಾಖಲೆ',
    f6t: 'ONDC Market', f6d: 'Products ಆನ್‌ಲೈನ್ ಮಾರಿ, zero commission',
    f7t: 'ವಿಮೆ & ಸುರಕ್ಷತೆ', f7d: 'PMSBY, Ayushman Bharat ಯೋಜನೆಗಳು',
    sdgTitle: 'SDG 8 — ಉತ್ತಮ ಕೆಲಸ & ಆರ್ಥಿಕ ಬೆಳವಣಿಗೆ',
    howTitle: 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತೆ',
    step1: 'WhatsApp ನಲ್ಲಿ Hi ಕಳಿಸಿ', step1d: 'Mitra ನಿಮ್ಮ ಭಾಷೆ, ವೃತ್ತಿ ಕೇಳ್ತಾನೆ',
    step2: 'ದಿನನಿತ್ಯ message ಮಾಡಿ', step2d: '"ಇವತ್ತು 800 ಆಯ್ತು, 200 ಖರ್ಚು" — Mitra ಟ್ರ್ಯಾಕ್ ಮಾಡ್ತಾನೆ',
    step3: '30 ದಿನ ನಂತರ', step3d: 'ಸಮೃದ್ಧಿ ಮಾರ್ಕೆಟ್, government schemes unlock',
    step4: '90 ದಿನ ನಂತರ', step4d: 'Credit certificate, ₹10,000 loan ready',
    ctaTitle: 'ಇಂದೇ ಶುರು ಮಾಡಿ',
    ctaSub: 'ಉಚಿತ. ಯಾವ ಆ್ಯಪ್ ಇಲ್ಲ. ಬರೀ WhatsApp.',
  },
  hi: {
    hero1: 'मित्र — आपका WhatsApp',
    hero2: 'आर्थिक दोस्त',
    heroSub: 'Bengaluru के 6.3 लाख अनौपचारिक श्रमिकों को credit profile, loan access और market access — WhatsApp पर, मुफ़्त।',
    startBtn: 'WhatsApp पर शुरू करें',
    exploreBtn: 'Marketplace देखें',
    stat1: '6.3L', stat1l: 'Bengaluru MSMEs',
    stat2: '51L', stat2l: 'नौकरियाँ',
    stat3: '72L', stat3l: 'SVANidhi उपयोगकर्ता',
    stat4: '₹10K', stat4l: 'पहला लोन',
    f1t: 'रोज़ Tracking', f1d: 'WhatsApp पर income और expense track करें',
    f2t: 'Credit Profile', f2d: '90 दिन में loan-ready बनें',
    f3t: 'सरकारी योजनाएँ', f3d: 'SVANidhi, Ayushman Bharat auto-match',
    f4t: 'Voice Reply', f4d: 'हिंदी/कन्नड़ में जवाब सुनें',
    f5t: 'SHG Groups', f5d: 'महिला बचत समूह के डिजिटल रिकॉर्ड',
    f6t: 'ONDC Market', f6d: 'ऑनलाइन बेचें, zero commission',
    sdgTitle: 'SDG 8 — बेहतर काम और आर्थिक विकास',
    howTitle: 'कैसे काम करता है',
    step1: 'WhatsApp पर Hi भेजें', step1d: 'Mitra आपकी भाषा और काम पूछेगा',
    step2: 'रोज़ message करें', step2d: '"आज 800 कमाया, 200 खर्च" — Mitra track करेगा',
    step3: '30 दिन बाद', step3d: 'Samruddhi marketplace + सरकारी schemes unlock',
    step4: '90 दिन बाद', step4d: 'Credit certificate + ₹10,000 loan ready',
    ctaTitle: 'आज ही शुरू करें',
    ctaSub: 'मुफ़्त। कोई app नहीं। बस WhatsApp।',
  },
  ta: {
    hero1: 'மித்ரா — உங்கள் WhatsApp',
    hero2: 'நிதி நண்பர்',
    heroSub: 'Bengaluru\'s 6.3 லட்சம் தொழிலாளர்களுக்கு credit profile, கடன் மற்றும் சந்தை அணுகல் — WhatsApp மூலம், இலவசமாக.',
    startBtn: 'WhatsApp இல் தொடங்கு',
    exploreBtn: 'Marketplace பார்க்கவும்',
    stat1: '6.3L', stat1l: 'Bengaluru MSMEs',
    stat2: '51L', stat2l: 'வேலைகள்',
    stat3: '72L', stat3l: 'SVANidhi பயனர்கள்',
    stat4: '₹10K', stat4l: 'முதல் கடன்',
    f1t: 'தினசரி Tracking', f1d: 'WhatsApp இல் வருமானம் & செலவு track செய்யுங்கள்',
    f2t: 'Credit Profile', f2d: '90 நாட்களில் கடனுக்கு தயாராகுங்கள்',
    f3t: 'அரசு திட்டங்கள்', f3d: 'SVANidhi, Ayushman Bharat auto-match',
    f4t: 'Voice Reply', f4d: 'தமிழ்/கன்னடத்தில் பதில் கேளுங்கள்',
    f5t: 'SHG குழுக்கள்', f5d: 'பெண்கள் சேமிப்பு குழு பதிவுகள்',
    f6t: 'ONDC Market', f6d: 'ஆன்லைனில் விற்கவும், zero commission',
    sdgTitle: 'SDG 8 — சிறந்த வேலை & பொருளாதார வளர்ச்சி',
    howTitle: 'எப்படி செயல்படுகிறது',
    step1: 'WhatsApp இல் Hi அனுப்பவும்', step1d: 'Mitra உங்கள் மொழி, தொழிலைக் கேட்கும்',
    step2: 'தினமும் message செய்யுங்கள்', step2d: '"இன்று 800 சம்பாதித்தேன், 200 செலவு" — Mitra track செய்யும்',
    step3: '30 நாட்களுக்கு பிறகு', step3d: 'Samruddhi marketplace + திட்டங்கள் unlock',
    step4: '90 நாட்களுக்கு பிறகு', step4d: 'Credit certificate + ₹10,000 கடன் ready',
    ctaTitle: 'இன்றே தொடங்குங்கள்',
    ctaSub: 'இலவசம். எந்த app இல்லை. WhatsApp மட்டும்.',
  },
  te: {
    hero1: 'మిత్ర — మీ WhatsApp',
    hero2: 'ఆర్థిక స్నేహితుడు',
    heroSub: 'Bengaluru లోని 6.3 లక్షల కార్మికులకు credit profile, రుణం మరియు మార్కెట్ యాక్సెస్ — WhatsApp ద్వారా, ఉచితంగా.',
    startBtn: 'WhatsApp లో ప్రారంభించండి',
    exploreBtn: 'Marketplace చూడండి',
    stat1: '6.3L', stat1l: 'Bengaluru MSMEs',
    stat2: '51L', stat2l: 'ఉద్యోగాలు',
    stat3: '72L', stat3l: 'SVANidhi వినియోగదారులు',
    stat4: '₹10K', stat4l: 'మొదటి రుణం',
    f1t: 'రోజువారీ Tracking', f1d: 'WhatsApp లో ఆదాయం & ఖర్చు track చేయండి',
    f2t: 'Credit Profile', f2d: '90 రోజుల్లో రుణానికి సిద్ధంగా ఉండండి',
    f3t: 'ప్రభుత్వ పథకాలు', f3d: 'SVANidhi, Ayushman Bharat auto-match',
    f4t: 'Voice Reply', f4d: 'తెలుగు/కన్నడలో సమాధానం వినండి',
    f5t: 'SHG గ్రూపులు', f5d: 'మహిళా పొదుపు సంఘ రికార్డులు',
    f6t: 'ONDC Market', f6d: 'ఆన్‌లైన్‌లో అమ్మండి, zero commission',
    sdgTitle: 'SDG 8 — మంచి పని & ఆర్థిక వృద్ధి',
    howTitle: 'ఎలా పనిచేస్తుంది',
    step1: 'WhatsApp లో Hi పంపండి', step1d: 'Mitra మీ భాష, వృత్తి అడుగుతాడు',
    step2: 'రోజూ message చేయండి', step2d: '"నేడు 800 సంపాదించాను, 200 ఖర్చు" — Mitra track చేస్తాడు',
    step3: '30 రోజుల తర్వాత', step3d: 'Samruddhi marketplace + పథకాలు unlock',
    step4: '90 రోజుల తర్వాత', step4d: 'Credit certificate + ₹10,000 రుణం ready',
    ctaTitle: 'ఈరోజే ప్రారంభించండి',
    ctaSub: 'ఉచితం. ఎటువంటి app లేదు. WhatsApp మాత్రమే.',
  },
  en: {
    hero1: 'Mitra — Your WhatsApp',
    hero2: 'Financial Friend',
    heroSub: "Bengaluru's 6.3 lakh informal workers get credit profile, loan access and market access — on WhatsApp, for free.",
    startBtn: 'Start on WhatsApp',
    exploreBtn: 'Explore Marketplace',
    stat1: '6.3L', stat1l: 'Bengaluru MSMEs',
    stat2: '51L', stat2l: 'Jobs Supported',
    stat3: '72L', stat3l: 'SVANidhi Users',
    stat4: '₹10K', stat4l: 'First Loan Amount',
    f1t: 'Daily Tracking', f1d: 'Track income & expense on WhatsApp',
    f2t: 'Credit Profile', f2d: 'Become loan-ready in 90 days',
    f3t: 'Govt Schemes', f3d: 'SVANidhi, Ayushman Bharat auto-match',
    f4t: 'Voice Reply', f4d: 'Hear your summary in Kannada/Hindi',
    f5t: 'SHG Groups', f5d: "Women's savings group digital records",
    f6t: 'ONDC Market', f6d: 'Sell online with zero commission',
    f7t: 'Insurance', f7d: 'PMSBY, PMJJBY and Health cover',
    sdgTitle: 'SDG 8 — Decent Work & Economic Growth',
    howTitle: 'How It Works',
    step1: 'Send Hi on WhatsApp', step1d: 'Mitra asks your language, occupation',
    step2: 'Message daily', step2d: '"Made 800 today, spent 200" — Mitra tracks it',
    step3: 'After 30 days', step3d: 'Samruddhi marketplace + govt schemes unlock',
    step4: 'After 90 days', step4d: 'Credit certificate + ₹10,000 loan ready',
    ctaTitle: 'Start Today',
    ctaSub: 'Free. No app. Just WhatsApp.',
  }
};
const L = (lang, s) => s[lang] || s['en'];

const FEATURES = (S) => [
  { icon: '📊', color: '#d1fae5', iconColor: '#16a34a', title: S.f1t, desc: S.f1d },
  { icon: '🏆', color: '#fef3c7', iconColor: '#d97706', title: S.f2t, desc: S.f2d },
  { icon: '🏛️', color: '#ede9fe', iconColor: '#7c3aed', title: S.f3t, desc: S.f3d },
  { icon: '🎤', color: '#e0f2fe', iconColor: '#0369a1', title: S.f4t, desc: S.f4d },
  { icon: '👩‍👩‍👧', color: '#fce7f3', iconColor: '#db2777', title: S.f5t, desc: S.f5d },
  { icon: '🛍️', color: '#fff7ed', iconColor: '#ea580c', title: S.f6t, desc: S.f6d },
  { icon: '🛡️', color: '#ecfdf5', iconColor: '#059669', title: S.f7t, desc: S.f7d, link: '/insurance' },
];

const STEPS = (S) => [
  { num: '01', title: S.step1, desc: S.step1d, color: 'var(--green)' },
  { num: '02', title: S.step2, desc: S.step2d, color: 'var(--amber)' },
  { num: '03', title: S.step3, desc: S.step3d, color: '#0ea5e9' },
  { num: '04', title: S.step4, desc: S.step4d, color: '#7c3aed' },
];

export default function Home({ lang = 'kn', isLoggedIn, userData }) {
  const S = STRINGS[lang] || STRINGS.en;
  const features = FEATURES(S);
  const steps = STEPS(S);

  const MOCK_UPLOADS = [
    { id: 1, name: 'Fresh Organic Onions', price: 1200, unit: '50kg', date: '2026-04-24' },
    { id: 2, name: 'Bulk Garlic Grade A', price: 800, unit: '10kg', date: '2026-04-23' },
  ];

  return (
    <div>
      {/* HERO */}
      <div className="hero-banner" style={{ marginBottom: '1.75rem' }}>
        <div className="hero-badge" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
          <Star size={12} fill="currentColor" /> SDG 8 · Bengaluru · 2026
        </div>
        <h1 className="hero-h1">{S.hero1}<br /><span className="hero-accent">{S.hero2}</span></h1>
        <p style={{ opacity: 0.88, maxWidth: 520, fontSize: '0.97rem', margin: '0.9rem 0 1.5rem', lineHeight: 1.6 }}>{S.heroSub}</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a href="https://wa.me/15551593431?text=Hi+Mitra" target="_blank" rel="noreferrer" className="btn-whatsapp">
            <span style={{ fontSize: '1.1rem' }}>💬</span> {S.startBtn}
          </a>
          <Link to="/marketplace" className="btn-outline-white">
            {S.exploreBtn} <ArrowRight size={15} />
          </Link>
        </div>
        <div className="hero-badges" style={{ marginTop: '1.5rem' }}>
          <span className="hero-badge"><span>✅</span> PM SVANidhi</span>
          <span className="hero-badge"><span>🏥</span> Ayushman Bharat</span>
          <span className="hero-badge"><span>🛍️</span> ONDC Network</span>
          <span className="hero-badge"><span>🔐</span> Account Aggregator</span>
        </div>
      </div>

      {/* SDG STRIP */}
      <div className="sdg-strip" style={{ marginBottom: '1.75rem' }}>
        <span style={{ fontWeight: 800, fontSize: '0.8rem', opacity: 0.7 }}>🎯 {S.sdgTitle}</span>
        {[
          { label: 'Target 8.3', sub: 'MSME Formalization' },
          { label: 'Target 8.5', sub: 'Decent Work' },
          { label: 'Target 8.10', sub: 'Universal Banking' },
        ].map(s => (
          <div className="sdg-item" key={s.label}>
            <span className="sdg-dot" />
            <div>
              <div style={{ fontWeight: 800 }}>{s.label}</div>
              <div style={{ opacity: 0.7, fontSize: '0.72rem' }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* STATS */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        {[
          { val: S.stat1, label: S.stat1l, icon: '🏪', bg: '#d1fae5', c: '#15803d' },
          { val: S.stat2, label: S.stat2l, icon: '👷', bg: '#fef3c7', c: '#b45309' },
          { val: S.stat3, label: S.stat3l, icon: '📋', bg: '#ede9fe', c: '#6d28d9' },
          { val: S.stat4, label: S.stat4l, icon: '💰', bg: '#e0f2fe', c: '#0369a1' },
        ].map((s, i) => (
          <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="stat-icon" style={{ background: s.bg, fontSize: '1.4rem', color: s.c }}>{s.icon}</div>
            <div className="stat-details">
              <h3 style={{ color: s.c }}>{s.val}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div className="section-title">✨ Features</div>
      <div className="feature-grid" style={{ marginBottom: '2rem' }}>
        {features.map((f, i) => {
          const content = (
            <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.06}s`, cursor: f.link ? 'pointer' : 'default' }}>
              <div className="feature-icon" style={{ background: f.color, fontSize: '1.4rem' }}>{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          );
          return f.link ? <Link to={f.link} key={i} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</Link> : content;
        })}
      </div>

      {/* HOW IT WORKS */}
      <div className="section-title">⚙️ {S.howTitle}</div>
      <div className="steps-grid" style={{ marginBottom: '2rem' }}>
        {steps.map((st, i) => (
          <div className="step-card" key={i}>
            <div className="step-num" style={{ background: st.color }}>{st.num}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.93rem', marginBottom: '0.25rem' }}>{st.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>{st.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* LOGGED IN SECTION: WHAT I UPLOADED */}
      {isLoggedIn && (
        <div className="animate-fadeUp" style={{ marginTop: '2.5rem' }}>
          <div className="section-title">📦 Your Recent Uploads</div>
          <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {MOCK_UPLOADS.map((item) => (
              <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>₹{item.price} · {item.unit}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--green)', fontWeight: 600, marginTop: '0.4rem' }}>Uploaded on {item.date}</div>
                </div>
                <Link to="/dashboard" className="btn-secondary btn-sm">Manage</Link>
              </div>
            ))}
            <Link to="/marketplace?tab=sell" className="card" style={{ border: '2px dashed var(--green)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--green)' }}>
              <PlusCircle size={24} />
              <span style={{ fontWeight: 700 }}>Upload More</span>
            </Link>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="cta-banner" style={{ marginTop: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>{S.ctaTitle}</h2>
          <p style={{ opacity: 0.8, fontSize: '0.93rem' }}>{S.ctaSub}</p>
        </div>
        <a href="https://wa.me/15551593431?text=Hi+Mitra" target="_blank" rel="noreferrer" className="btn-whatsapp" style={{ flexShrink: 0 }}>
          <span style={{ fontSize: '1.1rem' }}>💬</span> WhatsApp Mitra
        </a>
      </div>
    </div>
  );
}
