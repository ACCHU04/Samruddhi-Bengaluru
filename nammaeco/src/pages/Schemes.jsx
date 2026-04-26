import React, { useState } from 'react';
import { ExternalLink, CheckCircle, Clock, ChevronDown, ChevronUp, Search } from 'lucide-react';

const STRINGS = {
  kn: {
    title: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    sub: 'Mitra ನಿಮಗೆ qualify ಆಗುವ ೆಲ್ಲ schemes ಹುಡುಕ್ತಾನೆ ಮತ್ತು apply ಮಾಡಲು help ಮಾಡ್ತಾನೆ.',
    search: 'Scheme ಹುಡುಕಿ...',
    ctaTitle: 'ಯಾವ scheme ಸಿಗ್ತದೆ ಗೋತ್ತಿಲ್ಲ?',
    ctaSub: 'Mitra ಗೆ message ಮಾಡಿ — ನಿಮ್ಮ profile ನೋಡಿ auto-match ಮಾಡ್ತಾನೆ',
    ctaBtn: 'ಮಾಡಿಸಿ',
  },
  hi: {
    title: 'सरकारी योजनाएँ',
    sub: 'Mitra आपके लिए हर योजना ढूंढता है और apply करने में help करता है.',
    search: 'योजना ढूंढें...',
    ctaTitle: 'नहीं जानते कोनसी योजना मिलेगी?',
    ctaSub: 'Mitra को message करें — आपकी profile देखकर auto-match करेगा',
    ctaBtn: 'व्यवस्थित करें',
  },
  ta: {
    title: 'அரசு திட்டங்கள்',
    sub: 'Mitra உங்களுக்கு தகுதியான எல்லா திட்டங்களையும் கண்டுபிடித்து apply செய்ய உதவுகிறது.',
    search: 'திட்டம் தேடு...',
    ctaTitle: 'எந்த திட்டம் கிடைக்குமென்று தெரியவில்லையா?',
    ctaSub: 'Mitraக்கு message செய்யுங்கள் — உங்கள் விவரம் பார்த்து auto-match செய்யும்',
    ctaBtn: 'பெறுங்கள்',
  },
  te: {
    title: 'ప్రభుత్వ పథకాలు',
    sub: 'Mitra మీకు అర్హత ఉన్న అన్ని పథకాలు వెతికి apply చేయడానికి help చేస్తాడు.',
    search: 'పథకం వెతుకు...',
    ctaTitle: 'ఎన్ని పథకం అర్హత ఉంటుందో తెలియదా?',
    ctaSub: 'Mitraకు message చేయండి — మీ profile చూసి auto-match చేస్తాడు',
    ctaBtn: 'సరిచేసి',
  },
  en: {
    title: 'Your Schemes',
    sub: 'Mitra finds every scheme you qualify for and helps you apply — in your language.',
    search: 'Search schemes...',
    ctaTitle: "Don't know which scheme you qualify for?",
    ctaSub: 'Message Mitra — auto-matches based on your profile',
    ctaBtn: 'Get Matched',
  },
};

const SCHEMES = [
  {
    id: 1, emoji: '🏦', name: 'PM SVANidhi', kannada: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಸ್ವ-ನಿಧಿ',
    benefit: '₹10,000 working capital loan at 7% interest. No collateral.',
    who: 'Street vendors with or without vending certificate',
    sdg: '8.3', category: 'loan', days: 30, link: 'https://pmsvanidhi.mohua.gov.in',
    steps: ['Visit nearest bank or Common Service Centre', 'Carry Aadhaar + mobile number', 'Fill PM SVANidhi form', 'Loan disbursed in 15-30 days'],
    tip: '72 lakh vendors have already used this nationally. You qualify.'
  },
  {
    id: 2, emoji: '🏥', name: 'Ayushman Bharat', kannada: 'ಆಯುಷ್ಮಾನ್ ಭಾರತ',
    benefit: '₹5 lakh health insurance per family per year. Free hospitalization.',
    who: 'Low-income families — most informal workers qualify',
    sdg: '8.5', category: 'health', days: 0, link: 'https://pmjay.gov.in',
    steps: ['Check eligibility at pmjay.gov.in', 'Carry ration card + Aadhaar', 'Get Ayushman card at empanelled hospital', 'Show card for cashless treatment'],
    tip: 'Karnataka also has Arogya Karnataka on top of this — double coverage.'
  },
  {
    id: 3, emoji: '🏛️', name: 'Arogya Karnataka', kannada: 'ಆರೋಗ್ಯ ಕರ್ನಾಟಕ',
    benefit: '₹1.5 lakh additional health coverage specific to Karnataka residents.',
    who: 'All Karnataka residents with annual income below ₹1.5 lakh',
    sdg: '8.5', category: 'health', days: 0, link: 'https://arogya.karnataka.gov.in',
    steps: ['Visit nearest govt hospital in Karnataka', 'Carry income certificate + Aadhaar', 'Enroll at registration desk'],
    tip: 'Use this alongside Ayushman Bharat for maximum coverage.'
  },
  {
    id: 4, emoji: '💰', name: 'MUDRA Loan (Shishu)', kannada: 'ಮುದ್ರಾ ಲೋನ್',
    benefit: 'Up to ₹50,000 collateral-free business loan for small businesses.',
    who: 'Any small business owner or entrepreneur',
    sdg: '8.3', category: 'loan', days: 90, link: 'https://mudra.org.in',
    steps: ['Contact nearest PSU bank or microfinance lender', 'Prepare simple business plan', 'Carry Aadhaar, PAN, bank statement', 'Loan approved in 7-14 days'],
    tip: 'After 90 days on Mitra, your transaction history strengthens this application.'
  },
  {
    id: 5, emoji: '🏦', name: 'PM Jan Dhan Yojana', kannada: 'ಜನ ಧನ ಯೋಜನೆ',
    benefit: 'Zero-balance bank account + ₹2 lakh accident insurance + RuPay card.',
    who: 'Any Indian citizen without a bank account',
    sdg: '8.10', category: 'banking', days: 0, link: 'https://pmjdy.gov.in',
    steps: ['Visit nearest bank branch', 'Carry Aadhaar + one photo', 'Fill PMJDY account opening form', 'Account opens same day'],
    tip: 'This is the first step. Without a bank account, no other scheme works.'
  },
  {
    id: 6, emoji: '👩', name: 'Karnataka Rajiv Gandhi Gruha Vahini', kannada: 'ರಾಜೀವ್ ಗಾಂಧಿ ಗ್ರಹ ವಾಹಿನಿ',
    benefit: '₹2 lakh loan at subsidized rate specifically for women entrepreneurs.',
    who: 'Women aged 18-55 years in Karnataka',
    sdg: '8.3', category: 'women', days: 0, link: 'https://dwcd.karnataka.gov.in',
    steps: ['Contact District Women and Child Development office', 'Form a group of 5-20 women', 'Submit loan application with group details', 'Training + loan disbursed in 30-45 days'],
    tip: 'Best applied through a Self Help Group. Form a group with neighbours.'
  },
  {
    id: 7, emoji: '👴', name: 'Atal Pension Yojana', kannada: 'ಅಟಲ್ ಪಿಂಚಣಿ ಯೋಜನೆ',
    benefit: 'Guaranteed ₹1,000-₹5,000/month pension at age 60. For ₹42-₹210/month.',
    who: 'Anyone aged 18-40 with a savings bank account',
    sdg: '8.5', category: 'pension', days: 60, link: 'https://npscra.nsdl.co.in',
    steps: ['Open Jan Dhan account first', 'Visit bank with Aadhaar', 'Choose pension amount (₹1k-₹5k)', 'Auto-debit starts monthly'],
    tip: '80% of informal workers want this but don\'t know how. 30 mins to enroll.'
  },
  {
    id: 8, emoji: '🌾', name: 'PM-SYM (Shram Yogi Maan-Dhan)', kannada: 'ಶ್ರಮ ಯೋಗಿ ಮಾನ-ಧನ',
    benefit: '₹3,000/month pension at 60. Govt matches your contribution 1:1.',
    who: 'Unorganised sector workers aged 18-40 earning below ₹15,000/month',
    sdg: '8.5', category: 'pension', days: 0, link: 'https://labour.gov.in',
    steps: ['Visit nearest Common Service Centre (CSC)', 'Carry Aadhaar + savings account + mobile', 'Contribute ₹55-₹200/month based on age', 'Govt adds equal amount every month'],
    tip: 'Government doubles your savings. Best pension deal for informal workers.'
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Schemes', emoji: '📋' },
  { id: 'loan', label: 'Loans', emoji: '💰' },
  { id: 'health', label: 'Health', emoji: '🏥' },
  { id: 'banking', label: 'Banking', emoji: '🏦' },
  { id: 'pension', label: 'Pension', emoji: '👴' },
  { id: 'women', label: 'Women', emoji: '👩' },
];

const SDG_COLORS = { '8.3': '#16a34a', '8.5': '#2563eb', '8.10': '#7c3aed' };
const SDG_LABELS = { '8.3': 'MSME Growth', '8.5': 'Decent Work', '8.10': 'Banking Access' };

function SchemeCard({ scheme, daysTracked }) {
  const [open, setOpen] = useState(false);
  const isUnlocked = daysTracked >= scheme.days;
  const pct = scheme.days > 0 ? Math.min(100, (daysTracked / scheme.days) * 100) : 100;

  return (
    <div className={`scheme-card-full ${isUnlocked ? 'scheme-unlocked' : 'scheme-locked-card'}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div className="scheme-icon-big">{scheme.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1rem' }}>{scheme.name}</h3>
            <span className="badge" style={{ background: SDG_COLORS[scheme.sdg] + '22', color: SDG_COLORS[scheme.sdg] }}>
              SDG {scheme.sdg} · {SDG_LABELS[scheme.sdg]}
            </span>
            {isUnlocked
              ? <span className="badge badge-green"><CheckCircle size={10}/> Eligible</span>
              : <span className="badge badge-gray"><Clock size={10}/> {scheme.days - daysTracked} days left</span>
            }
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{scheme.kannada}</div>
          <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '0.6rem' }}>{scheme.benefit}</p>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>👥 {scheme.who}</div>

          {scheme.days > 0 && !isUnlocked && (
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>
                Track {scheme.days} days to unlock · {daysTracked}/{scheme.days} done
              </div>
              <div className="progress-bar-wrap" style={{ height: 6 }}>
                <div className="progress-bar-fill" style={{ width: `${pct}%`, background: SDG_COLORS[scheme.sdg] }}/>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
            {isUnlocked && (
              <a href={scheme.link} target="_blank" rel="noreferrer" className="btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                Apply Now <ExternalLink size={12}/>
              </a>
            )}
            <button className="btn-secondary btn-sm" onClick={() => setOpen(!open)}>
              {open ? 'Less' : 'How to Apply'} {open ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
            </button>
            <a href={`https://wa.me/15551593431?text=Help me apply for ${scheme.name}`}
              target="_blank" rel="noreferrer" className="btn-ghost btn-sm">
              💬 Mitra Help
            </a>
          </div>
        </div>
      </div>

      {open && (
        <div className="scheme-steps">
          <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.6rem', color: 'var(--ink)' }}>📋 Steps to Apply:</div>
          {scheme.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
              <span style={{ width: 20, height: 20, background: SDG_COLORS[scheme.sdg], color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ color: 'var(--ink-soft)', lineHeight: 1.4 }}>{step}</span>
            </div>
          ))}
          <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 8, padding: '0.6rem 0.8rem', marginTop: '0.75rem', fontSize: '0.78rem', color: '#713f12' }}>
            💡 {scheme.tip}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Schemes({ lang = 'kn' }) {
  const S = STRINGS[lang] || STRINGS.en;
  const [cat, setCat] = useState('all');
  const [daysTracked] = useState(0); // In production, load from Firebase
  const [search, setSearch] = useState('');

  const filtered = SCHEMES.filter(s =>
    (cat === 'all' || s.category === cat) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) ||
     s.benefit.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="hero-banner" style={{ padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
        <div className="hero-badge" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>🏛️ Government Schemes · SDG 8</div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          {S.title}
        </h1>
        <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
          {S.sub}
        </p>
        <div className="hero-badges" style={{ marginTop: '1rem' }}>
          <span className="hero-badge">8 Schemes Available</span>
          <span className="hero-badge">✅ {SCHEMES.filter(s => s.days === 0).length} Instant Eligible</span>
          <span className="hero-badge">📋 SDG 8.3, 8.5, 8.10</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}/>
        <input
          className="form-input"
          style={{ paddingLeft: '2.5rem' }}
          placeholder={S.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category tabs */}
      <div className="tab-bar" style={{ marginBottom: '1.5rem' }}>
        {CATEGORIES.map(c => (
          <button key={c.id} className={`tab-btn ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Scheme cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(s => <SchemeCard key={s.id} scheme={s} daysTracked={daysTracked}/>)}
      </div>

      {/* WhatsApp CTA */}
      <div className="cta-banner" style={{ marginTop: '2rem' }}>
        <div>
          <h3 style={{ fontWeight: 800, marginBottom: '0.3rem' }}>
            {S.ctaTitle}
          </h3>
          <p style={{ opacity: 0.8, fontSize: '0.88rem' }}>
            {S.ctaSub}
          </p>
        </div>
        <a href="https://wa.me/15551593431?text=Match me to government schemes"
          target="_blank" rel="noreferrer" className="btn-whatsapp">
          💬 {S.ctaBtn}
        </a>
      </div>
    </div>
  );
}
