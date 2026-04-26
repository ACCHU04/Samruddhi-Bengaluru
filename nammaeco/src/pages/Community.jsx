import React, { useState } from 'react';
import { Users, Recycle, Wheat, TrendingUp, MessageCircle, Heart, Star, MapPin, ExternalLink } from 'lucide-react';

const STRINGS = {
  kn: {
    hero: 'ಒಟ್ಟಿಗೆ ಬಲ — Community Features',
    heroSub: 'SHG groups, waste economy workers, CSA farmers — Mitra ಎಲ್ಲರನ್ನು ಒಟ್ಟಿಗೆ ತರ್ತಾನೆ.',
    shgAdd: 'ನಿಮ್ಮ SHG ಗ್ರೂಪ್ Mitra ನಲ್ಲಿ ಸೇರಿಸಿ',
    shgSub: 'Group savings, chit rotation, ಮತ್ತು meeting records digitally track ಮಾಡಿ. LokOS + Account Aggregator ಮೂಲಕ bank loan ಸಿಗ್ತದೆ.',
    wasteTitle: 'Waste Economy — Bengaluru',
    wasteSub: 'Bengaluru ದಿನಕ್ಕೆ 220 tonnes textile waste generate ಮಾಡ್ತದೆ. 140+ women TRF workers ₹12,400/month average ಸಂಪಾದಿಸ್ತಾರೆ.',
    csaTitle: 'CSA — ರೈತರು ನೇರ ಗ್ರಾಹಕರಿಗೆ',
    csaSub: 'APMC mandi middlemen ಬಿಟ್ಟು ನೇರ ನಗರ ಗ್ರಾಹಕರಿಗೆ ಮಾರಿ. ₹3,200/month ಹೆಚ್ಚು ಸಂಪಾದನೆ.',
    benchTitle: 'ಹೆಸರಿಲ್ಲದ, aggregated data. ನಿಮ್ಮ occupation ನಲ್ಲಿ top earners ಏನು differently ಮಾಡ್ತಾರೆ ಅಂತ ತಿಳ್ಕೋಳ್ಳಿ.',
  },
  hi: {
    hero: 'एक साथ मजबूत — Community Features',
    heroSub: 'SHG groups, waste economy workers, CSA farmers — Mitra सबको एक साथ लाता है।',
    shgAdd: 'अपना SHG Group Mitra में जोड़ें',
    shgSub: 'Group savings, chit rotation और meeting records digitally track करें। LokOS + Account Aggregator से bank loan मिलता है।',
    wasteTitle: 'Waste Economy — Bengaluru',
    wasteSub: 'Bengaluru में रोज़ 220 tonnes textile waste होता है। 140+ महिला TRF workers ₹12,400/month कमाती हैं।',
    csaTitle: 'CSA — किसान सीधे उपभोक्ताओं को',
    csaSub: 'APMC mandi middlemen छोड़ें और सीधे बेचें। ₹3,200/month ज़्यादा कमाई।',
    benchTitle: 'गुमनाम, aggregated data। अपने occupation में top earners क्या अलग करते हैं जानें।',
  },
  ta: {
    hero: 'ஒன்றாக வலிமை — Community Features',
    heroSub: 'SHG groups, waste economy workers, CSA farmers — Mitra அனைவரையும் ஒன்றிணைக்கிறார்.',
    shgAdd: 'உங்கள் SHG குழுவை Mitra இல் சேர்க்கவும்',
    shgSub: 'குழு சேமிப்பு, சீட்டு rotation மற்றும் கூட்ட பதிவுகளை digitally track செய்யுங்கள்।',
    wasteTitle: 'கழிவு பொருளாதாரம் — Bengaluru',
    wasteSub: 'Bengaluru தினமும் 220 tonnes textile waste உருவாக்குகிறது। 140+ பெண்கள் ₹12,400/month சம்பாதிக்கிறார்கள்।',
    csaTitle: 'CSA — விவசாயிகள் நேரடியாக நுகர்வோருக்கு',
    csaSub: 'APMC middlemen தவிர்த்து நேரடியாக விற்கவும்। ₹3,200/month கூடுதல் சம்பாதிப்பு।',
    benchTitle: 'அநாமதேய, aggregated data. உங்கள் தொழிலில் top earners என்ன வித்தியாசமாக செய்கிறார்கள் என்று அறியுங்கள்।',
  },
  te: {
    hero: 'కలిసి బలంగా — Community Features',
    heroSub: 'SHG groups, waste economy workers, CSA farmers — Mitra అందరినీ కలుపుతాడు.',
    shgAdd: 'మీ SHG గ్రూప్‌ను Mitra లో నమోదు చేయండి',
    shgSub: 'గ్రూప్ పొదుపు, చిట్ rotation మరియు మీటింగ్ రికార్డులను digitally track చేయండి।',
    wasteTitle: 'వేస్ట్ ఎకానమీ — Bengaluru',
    wasteSub: 'Bengaluru రోజూ 220 tonnes textile waste తయారుచేస్తుంది। 140+ మహిళలు ₹12,400/month సంపాదిస్తున్నారు।',
    csaTitle: 'CSA — రైతులు నేరుగా వినియోగదారులకు',
    csaSub: 'APMC middlemen దాటి నేరుగా అమ్మండి। ₹3,200/month ఎక్కువ సంపాదన।',
    benchTitle: 'అజ్ఞాత, aggregated data. మీ వృత్తిలో top earners ఏమి వేరుగా చేస్తున్నారో తెలుసుకోండి।',
  },
  en: {
    hero: 'Stronger Together',
    heroSub: 'SHG groups, waste economy workers, CSA farmers — Mitra connects all communities.',
    shgAdd: 'Add your SHG group to Mitra',
    shgSub: 'Track group savings, chit rotation, and meeting records digitally. Enables bank loans via LokOS + Account Aggregator.',
    wasteTitle: 'Waste Economy — Bengaluru',
    wasteSub: 'Bengaluru generates 220 tonnes of textile waste daily. 140+ women TRF workers earn ₹12,400/month average.',
    csaTitle: 'CSA — Farmers Direct to Consumers',
    csaSub: 'Skip APMC mandi middlemen and sell direct to urban consumers. Earn ₹3,200/month more on average.',
    benchTitle: 'Anonymous, aggregated data only. Learn what top earners in your occupation do differently.',
  },
};
const T = (lang, key) => (STRINGS[lang] || STRINGS.en)[key];

const TABS = [
  { id: 'shg', label: 'SHG Groups', icon: <Users size={14}/> },
  { id: 'waste', label: 'Waste Economy', icon: <Recycle size={14}/> },
  { id: 'csa', label: 'CSA Farmers', icon: <Wheat size={14}/> },
  { id: 'bench', label: 'Peer Benchmark', icon: <TrendingUp size={14}/> },
];

const SHG_DATA = [
  { name: 'Women Self Help Groups Network', org: 'Sanjeevini - Karnataka State Rural Livelihood Mission', rating: 4.7, location: 'Bangalore', tags: ['Govt Supported', 'Statewide Network'], link: 'https://ksrlm.karnataka.gov.in', type: 'Community' },
  { name: 'Urban Women SHG Federation', org: 'Association for Promoting Social Action (APSA)', rating: 4.6, location: 'Bangalore Slums', tags: ['50000+ women supported', 'Microfinance + Livelihood'], link: 'https://www.aborad.org/en/counterparts/association-for-promoting-social-action-apsa/', type: 'Community' },
  { name: 'Tribal & Rural Women SHGs', org: 'Vanavasi Kalyana', rating: 4.5, location: 'Rajajinagar', tags: ['Livelihood Programs', 'Skill Training'], link: 'https://www.google.com/maps/search/Vanavasi+Kalyana+Rajajinagar+Bangalore', type: 'Community' },
  { name: 'Women Empowerment SHGs', org: 'Adamya Chetana Foundation', rating: 4.5, location: 'Bangalore', tags: ['Skill + Micro Business', 'Support Groups'], link: 'https://adamyachetana.org', type: 'Community' },
  { name: 'Micro Enterprise SHGs', org: 'Nisarga Foundation', rating: 4.4, location: 'Bangalore Rural', tags: ['Savings + Weekly Meetings', 'Entrepreneur Support'], link: 'https://www.google.com/maps/search/Nisarga+Foundation+Bangalore', type: 'Community' },
  { name: 'General Self Help Groups Directory', org: 'FPO India SHG Directory', rating: 4.3, location: 'Online / Bangalore', tags: ['500+ SHGs Listed', 'Multiple Sectors'], link: 'https://fpoindia.com', type: 'Community' },
  { name: 'Urban Support SHG Groups', org: 'Justdial SHG Listings Bangalore', rating: 4.4, location: 'Bangalore', tags: ['Multiple Groups', 'Local Contacts'], link: 'https://www.justdial.com/Bangalore/Self-Help-Groups', type: 'Community' },
  { name: 'Women Microfinance SHGs', org: 'Karnataka Minorities Development Corporation', rating: 4.2, location: 'Bangalore', tags: ['Loan + Subsidy', 'Govt Scheme'], link: 'https://www.google.com/maps/search/Karnataka+Minorities+Development+Corporation+Bangalore', type: 'Community' },
  { name: 'LGBTQ Support SHG', org: 'Good As You', rating: 4.3, location: 'Bangalore', tags: ['Peer Support', 'Community Network'], link: 'https://www.google.com/maps/search/Good+As+You+Bangalore', type: 'Community' },
  { name: 'Youth & Student SHG', org: 'Queer Campus Bangalore', rating: 4.2, location: 'Bangalore', tags: ['Safe Space Groups', 'Community Support'], link: 'https://www.google.com/maps/search/Queer+Campus+Bangalore', type: 'Community' },
];

const WASTE_ORGS = [
  { name: 'Hasiru Dala', focus: 'Waste picker formalization', workers: '15,000+', location: 'All Bengaluru', emoji: '♻️', link: 'https://hasirudala.in', tip: 'They convert waste pickers to formal recycling entrepreneurs with income guarantees.' },
  { name: 'Saahas Zero Waste', focus: 'Corporate waste management & recycling', workers: '500+', location: 'Bengaluru & beyond', emoji: '🌿', link: 'https://saahas.org', tip: 'Partner with apartments who need waste management. They train and certify you.' },
  { name: 'Textile Recovery Facilities (TRF)', focus: '220 tonnes/day textile waste → income', workers: '140+ women', location: 'South Bengaluru', emoji: '👗', link: '#', tip: '20% of Bengaluru textile waste now diverted. Jobs available for sorters and coordinators.' },
];

const CSA_NETWORKS = [
  { name: 'Beejom', focus: 'Organic vegetable CSA boxes', location: 'Peri-urban Bengaluru', buyers: '200+ urban families', emoji: '🥬', link: 'https://beejom.in' },
  { name: 'Buffalo Back Collective', focus: 'Dairy + vegetables direct to consumers', location: 'Bengaluru umland', buyers: '150+ subscribers', emoji: '🐄', link: '#' },
  { name: 'Akshayakalpa Organic', focus: 'Certified organic, subscription model', location: 'Hassan → Bengaluru', buyers: '5,000+ households', emoji: '🌱', link: 'https://akshayakalpa.org' },
];

const BENCHMARKS = [
  { occupation: 'Idli/Vada Vendor', avgProfit: 14200, topTip: 'Top earners buy maida on Tuesdays when wholesale price drops by 8%', ward: 'All', sample: 42 },
  { occupation: 'Vegetable Vendor', avgProfit: 11800, topTip: 'KR Market direct buying saves ₹3,200/month vs local wholesaler', ward: 'All', sample: 67 },
  { occupation: 'Auto Driver', avgProfit: 18500, topTip: 'Airport route + evening corporate zone earns 40% more than random trips', ward: 'All', sample: 89 },
  { occupation: 'Domestic Worker', avgProfit: 9200, topTip: 'Adding ironing/cooking services increases income by 35%', ward: 'All', sample: 55 },
  { occupation: 'Waste Picker (Organized)', avgProfit: 12400, topTip: 'Hasiru Dala members earn 2.3x more than independent pickers', ward: 'All', sample: 28 },
];

function SHGTab({ lang }) {
  return (
    <div>
      <div className="card-amber" style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>👩‍👩‍👧 {T(lang, 'shgAdd')}</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginBottom: '0.9rem' }}>
          {T(lang, 'shgSub')}
        </p>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <a href="https://wa.me/15551593431?text=Register my SHG group" target="_blank" rel="noreferrer" className="btn-whatsapp" style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}>
            💬 Register My SHG
          </a>
          <a href="https://lokos.dord.gov.in" target="_blank" rel="noreferrer" className="btn-secondary btn-sm">
            LokOS Platform ↗
          </a>
        </div>
      </div>

      <div className="section-title">📍 Active SHGs in Bengaluru</div>
      {SHG_DATA.map((shg, i) => (
        <div key={i} className="scheme-card-full" style={{ marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.72rem', background: 'var(--border-soft)', padding: '0.15rem 0.45rem', borderRadius: 99, color: 'var(--muted)', fontWeight: 600 }}>{shg.type}</span>
            <div className="star-row"><Star size={11} fill="#f59e0b" stroke="none"/><span>{shg.rating}</span></div>
          </div>
          <h4 style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{shg.name}</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Supplier: {shg.org}</p>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            {shg.tags.map((tag, j) => (
              <span key={j} style={{ fontSize: '0.72rem', background: '#f0fdf4', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: 6, border: '1px solid #bbf7d0', fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', marginBottom: '0.6rem' }}><MapPin size={13} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> {shg.location}</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {shg.link && (
              <a href={shg.link} target="_blank" rel="noreferrer" className="btn-primary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>Visit <ExternalLink size={14}/></a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function WasteTab({ lang }) {
  return (
    <div>
      <div className="card-green" style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>♻️ {T(lang, 'wasteTitle')}</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginBottom: '0.75rem' }}>
          {T(lang, 'wasteSub')}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a href="https://wa.me/15551593431?text=I am a waste picker looking for work" target="_blank" rel="noreferrer" className="btn-whatsapp" style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}>
            💬 Get Referred
          </a>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { val: '220T', label: 'Textile waste/day', icon: '👗', bg: '#fce7f3', c: '#be185d' },
          { val: '20%', label: 'Now diverted', icon: '♻️', bg: '#d1fae5', c: '#15803d' },
          { val: '140+', label: 'Women employed', icon: '👩', bg: '#fef3c7', c: '#b45309' },
          { val: '₹12.4K', label: 'Avg monthly income', icon: '💰', bg: '#ede9fe', c: '#6d28d9' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon" style={{ background: s.bg, fontSize: '1.3rem' }}>{s.icon}</div>
            <div className="stat-details"><h3 style={{ color: s.c }}>{s.val}</h3><p>{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="section-title">🤝 Connect With</div>
      {WASTE_ORGS.map((org, i) => (
        <div key={i} className="scheme-card-full" style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '2rem' }}>{org.emoji}</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{org.name}</h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>📍 {org.location} · 👷 {org.workers}</div>
              <p style={{ fontSize: '0.83rem', color: 'var(--ink-soft)', marginBottom: '0.5rem' }}>{org.focus}</p>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '0.5rem 0.7rem', fontSize: '0.78rem', color: '#15803d', marginBottom: '0.6rem' }}>
                💡 {org.tip}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {org.link !== '#' && <a href={org.link} target="_blank" rel="noreferrer" className="btn-primary btn-sm" style={{ textDecoration: 'none' }}>Visit ↗</a>}
                <a href={`https://wa.me/15551593431?text=Connect me to ${org.name}`} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">💬 Mitra Connect</a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CSATab({ lang }) {
  return (
    <div>
      <div className="card-green" style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>🌾 {T(lang, 'csaTitle')}</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginBottom: '0.75rem' }}>
          {T(lang, 'csaSub')}
        </p>
        <a href="https://wa.me/15551593431?text=I am a farmer looking to sell direct to consumers" target="_blank" rel="noreferrer" className="btn-whatsapp" style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}>
          💬 Join as Farmer
        </a>
      </div>

      {CSA_NETWORKS.map((csa, i) => (
        <div key={i} className="scheme-card-full" style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '2rem' }}>{csa.emoji}</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{csa.name}</h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>📍 {csa.location} · 🛒 {csa.buyers}</div>
              <p style={{ fontSize: '0.83rem', color: 'var(--ink-soft)', marginBottom: '0.6rem' }}>{csa.focus}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {csa.link !== '#' && <a href={csa.link} target="_blank" rel="noreferrer" className="btn-primary btn-sm" style={{ textDecoration: 'none' }}>Visit ↗</a>}
                <a href={`https://wa.me/15551593431?text=Connect me to ${csa.name} CSA`} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">💬 Connect</a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BenchmarkTab({ lang }) {
  return (
    <div>
      <div className="card-amber" style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>📊 Anonymous Peer Benchmark</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
          {T(lang, 'benchTitle')}
        </p>
      </div>

      {BENCHMARKS.map((b, i) => (
        <div key={i} className="scheme-card-full" style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <h4 style={{ fontWeight: 700 }}>👷 {b.occupation}</h4>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--green)' }}>₹{b.avgProfit.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Avg monthly profit · {b.sample} workers</div>
            </div>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '0.6rem 0.8rem', fontSize: '0.8rem', color: '#15803d', marginBottom: '0.6rem' }}>
            🏆 Top earner insight: {b.topTip}
          </div>
          <a href={`https://wa.me/15551593431?text=How do I earn more as a ${b.occupation}`} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">
            💬 Get Personalised Advice
          </a>
        </div>
      ))}
    </div>
  );
}

export default function Community({ lang = 'kn' }) {
  const [tab, setTab] = useState('shg');

  return (
    <div>
      <div className="hero-banner" style={{ padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
        <div className="hero-badge" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>👥 Community Power</div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          {T(lang, 'hero')}
        </h1>
        <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
          {T(lang, 'heroSub')}
        </p>
      </div>

      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'shg' && <SHGTab lang={lang}/>}
      {tab === 'waste' && <WasteTab lang={lang}/>}
      {tab === 'csa' && <CSATab lang={lang}/>}
      {tab === 'bench' && <BenchmarkTab lang={lang}/>}
    </div>
  );
}
