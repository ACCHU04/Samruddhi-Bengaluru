import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, MapPin, Truck, Lock, Calculator, Store, Zap, PlusCircle, Package, Phone, Clock, ExternalLink } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';

const STRINGS = {
  kn: { title: 'ಸಗಟು ಮಾರ್ಕೆಟ್', sub: 'ಅನೌಪಚಾರಿಕ ಕಾರ್ಮಿಕರಿಗೆ ನೇರ ONDC ಮಾರ್ಕೆಟ್. Zero commission.', cart: 'Cart', source: 'ತೆಗೆದುಕೋ', supplier: 'ಪೂರೈಕೆದಾರ', locked: '🔒 30 ದಿನ track ಮಾಡಿ unlock ಮಾಡು', lockedSub: 'Mitra ನಲ್ಲಿ 30 ದಿನ track ಮಾಡಿದ ನಂತರ full marketplace ತೆರೆಯುತ್ತದೆ' },
  hi: { title: 'थोक बाज़ार', sub: 'अनौपचारिक श्रमिकों के लिए सीधा ONDC बाज़ार. Zero commission.', cart: 'कार्ट', source: 'मंगाएं', supplier: 'आपूर्तिकर्ता', locked: '🔒 30 दिन track करें और unlock करें', lockedSub: 'Mitra पर 30 दिन track करने के बाद marketplace खुलेगा' },
  ta: { title: 'மாறு சந்தை', sub: 'தொழிலாளர்களுக்கு நேரடி ONDC சந்தை. Zero commission.', cart: 'கார்ட்', source: 'வாங்குங்கள்', supplier: 'விதரணையாளர்', locked: '🔒 30 நாட்கள் track செய்து unlock செய்யுங்கள்', lockedSub: 'Mitraவில் 30 நாட்கள் track செய்த பிறகு marketplace திறக்கும்' },
  te: { title: 'దొక్క మార్కెట్', sub: 'అనౌపచారిక కార్మికులకు నేరుగా ONDC మార్కెట్. Zero commission.', cart: 'కార్ట్', source: 'తెప్పించండి', supplier: 'సరఫరాదారు', locked: '🔒 30 రోజులు track చేసి unlock చేయండి', lockedSub: 'Mitraలో 30 రోజులు track చేసిన తర్వాత marketplace తెరుచుకుంటుంది' },
  en: { title: 'Wholesale Market Hub', sub: 'Direct ONDC marketplace for informal workers. Zero commission.', cart: 'Cart', source: 'Source It', supplier: 'Supplier', locked: '🔒 Track 30 days to unlock', lockedSub: 'Record 30 days of earnings on Mitra to unlock the full marketplace' }
};

const MOCK_PRODUCTS = [
  { id: 1, name: { kn: 'ಸಗಟು ತರಕಾರಿಗಳು (ಮಿಶ್ರಿತ)', en: 'Wholesale Vegetables (Mixed)' }, seller: 'APMC Yard', price: 1200, unit: '40kg', location: 'Yeshwanthpur', rating: 4.6, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80', type: 'Produce', ondc: true, phone: '+91 80 2839 7901', bestTime: '4:00 AM – 7:00 AM (Auction)', mapsLink: 'https://www.google.com/maps/search/APMC+Yard+Yeshwanthpur+Bangalore' },
  { id: 2, name: { kn: 'ಸಗಟು ಹಣ್ಣುಗಳು (ಋತುಮಾನದ)', en: 'Wholesale Fruits (Seasonal)' }, seller: 'KR Market', price: 1800, unit: '50kg', location: 'Chickpet', rating: 4.5, image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=300&q=80', type: 'Produce', ondc: true, phone: '+91 80 2670 1122', bestTime: '5:00 AM – 8:00 AM (Fresh Stock)', mapsLink: 'https://www.google.com/maps/search/KR+Market+Chickpet+Bangalore' },
  { id: 3, name: { kn: 'ಸಗಟು ಸಾಮಾನ್ಯ ಉತ್ಪನ್ನಗಳು', en: 'Wholesale General Produce' }, seller: 'Binny Pete', price: 1500, unit: '50kg', location: 'Binny Pete', rating: 4.4, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80', type: 'Produce', ondc: true, phone: '+91 80 2287 3456', bestTime: '5:30 AM – 9:00 AM', mapsLink: 'https://www.google.com/maps/search/Binny+Pete+Market+Bangalore' },
  { id: 4, name: { kn: 'ಸಗಟು ತರಕಾರಿಗಳು ಮತ್ತು ವ್ಯಾಪಾರ', en: 'Wholesale Vegetables & Trading' }, seller: 'Bangalore Market', price: 1000, unit: '35kg', location: 'Chickpet', rating: 4.3, image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=300&q=80', type: 'Produce', ondc: true, phone: '+91 80 2670 4589', bestTime: '6:00 AM – 10:00 AM', mapsLink: 'https://www.google.com/maps/search/Bangalore+City+Market+Chickpet' },
  { id: 5, name: { kn: 'ಸಗಟು ಹೂವುಗಳು (ಮಲ್ಲೇಶ್ವರಂ)', en: 'Wholesale Flowers' }, seller: '11th Cross Flower Market, Malleshwara', price: 700, unit: '20kg', location: 'Malleshwaram', rating: 4.5, image: 'https://images.unsplash.com/photo-1591886105349-16e788647087?auto=format&fit=crop&w=300&q=80', type: 'Produce', ondc: true, phone: '+91 98450 12345', bestTime: '4:00 AM – 6:30 AM (Freshest)', mapsLink: 'https://www.google.com/maps/search/Malleshwaram+Flower+Market+Bangalore' },
  { id: 6, name: { kn: 'ಸಗಟು ಹೂವುಗಳು (ಬೃಹತ್ ಪ್ರಮಾಣ)', en: 'Wholesale Flowers (Large Scale)' }, seller: 'K.R Flower Market', price: 900, unit: '25kg', location: 'KR Market Area', rating: 4.4, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=300&q=80', type: 'Produce', ondc: true, phone: '+91 80 2670 5567', bestTime: '3:30 AM – 6:00 AM (Auction)', mapsLink: 'https://www.google.com/maps/search/KR+Flower+Market+Bangalore' },
  { id: 7, name: { kn: 'ಸಗಟು ಸೊಪ್ಪು ಮತ್ತು ಮಾಂಸ/ಮೀನು', en: 'Wholesale Greens & Meat/Fish Add-ons' }, seller: 'Russell Market, Shivajinagar', price: 600, unit: '15kg', location: 'Shivajinagar', rating: 4.2, image: 'https://images.unsplash.com/photo-1543083477-4f7f44aca17f?auto=format&fit=crop&w=300&q=80', type: 'Produce', ondc: true, phone: '+91 80 2559 1234', bestTime: '6:00 AM – 9:00 AM (Meat/Fish), 5 AM (Greens)', mapsLink: 'https://www.google.com/maps/search/Russell+Market+Shivajinagar+Bangalore' },
  { id: 8, name: { kn: 'ಸಗಟು ತರಕಾರಿ ಹಬ್', en: 'Wholesale Vegetables Hub' }, seller: 'APMC Market Dasanapura', price: 1300, unit: '50kg', location: 'Dasanapura', rating: 4.3, image: 'https://images.unsplash.com/photo-1566385101042-1a000451ecb1?auto=format&fit=crop&w=300&q=80', type: 'Produce', ondc: true, phone: '+91 80 2372 8900', bestTime: '4:00 AM – 8:00 AM (Auction)', mapsLink: 'https://www.google.com/maps/search/APMC+Market+Dasanapura+Bangalore' },
  { id: 9, name: { kn: 'ಸಗಟು ಹೂವುಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಉತ್ಪನ್ನಗಳು', en: 'Wholesale Flowers & Local Produce' }, seller: 'Yelahanka Flower Market', price: 800, unit: '25kg', location: 'Yelahanka', rating: 4.4, image: 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&w=300&q=80', type: 'Produce', ondc: true, phone: '+91 98861 67890', bestTime: '5:00 AM – 7:30 AM', mapsLink: 'https://www.google.com/maps/search/Yelahanka+Flower+Market+Bangalore' },
  { id: 10, name: { kn: 'ಬೀದಿ ಹೂವು ಮತ್ತು ಉತ್ಪನ್ನಗಳ ಮಾರುಕಟ್ಟೆ', en: 'Wholesale Street Flower & Produce Market' }, seller: 'Flower Market (SJP Road)', price: 750, unit: '20kg', location: 'Kalasipalya', rating: 4.3, image: 'https://images.unsplash.com/photo-1526402978125-f1d6df91cbac?auto=format&fit=crop&w=300&q=80', type: 'Produce', ondc: true, phone: '+91 80 2287 9012', bestTime: '4:30 AM – 7:00 AM', mapsLink: 'https://www.google.com/maps/search/Kalasipalya+Flower+Market+Bangalore' },
];

const CATEGORIES = ['All', 'Produce', 'Grains', 'Raw Material', 'Oils'];

// Supplier savings calculator
function SavingsCalculator({ lang }) {
  const [item, setItem] = useState('Onions');
  const [currentPrice, setCurrentPrice] = useState(40);
  const [qty, setQty] = useState(20);
  const [marketName, setMarketName] = useState('KR Market');
  const [marketPrice, setMarketPrice] = useState(28);
  const [autoFare, setAutoFare] = useState(80);

  const savingsPerKg = currentPrice - marketPrice;
  const totalSavings = (savingsPerKg * qty) - autoFare;
  const breakEven = Math.ceil(autoFare / savingsPerKg);

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div className="panel-title"><Calculator size={16} style={{ color: 'var(--green)' }} /> Supplier Savings Calculator</div>
      <p style={{ fontSize: '0.83rem', color: 'var(--muted)', marginBottom: '1rem' }}>
        {lang === 'kn' ? 'ಯಾವುದೇ ಮಾರ್ಕೆಟ್‌ಗೆ ಹೋಗುವುದು ಲಾಭದಾಯಕವೇ? ಇಲ್ಲಿ ಲೆಕ್ಕ ಹಾಕಿ.' : 'Is it worth going to another market? Calculate your savings.'}
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Item Name</label>
          <input className="form-input" value={item} onChange={e => setItem(e.target.value)} placeholder="e.g. Tomatoes" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Your Price (₹/kg)</label>
          <input className="form-input" type="number" value={currentPrice} onChange={e => setCurrentPrice(+e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Quantity (kg)</label>
          <input className="form-input" type="number" value={qty} onChange={e => setQty(+e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Market Name</label>
          <input className="form-input" value={marketName} onChange={e => setMarketName(e.target.value)} placeholder="e.g. APMC Yard" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Market Price (₹/kg)</label>
          <input className="form-input" type="number" value={marketPrice} onChange={e => setMarketPrice(+e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Travel Cost (₹)</label>
          <input className="form-input" type="number" value={autoFare} onChange={e => setAutoFare(+e.target.value)} />
        </div>
      </div>

      <div style={{ background: totalSavings > 0 ? '#f0fdf4' : '#fef2f2', border: `1px solid ${totalSavings > 0 ? '#bbf7d0' : '#fecaca'}`, borderRadius: 'var(--radius)', padding: '1rem', fontSize: '0.85rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>{marketName} price: <strong>₹{marketPrice}/kg</strong></div>
          <div>Your supplier: <strong>₹{currentPrice}/kg</strong></div>
          <div>Travel cost: <strong>₹{autoFare}</strong></div>
          <div>Break-even qty: <strong>{isNaN(breakEven) || breakEven <= 0 ? 'N/A' : `${breakEven}kg`}</strong></div>
        </div>
        <div style={{ fontWeight: 800, fontSize: '1rem', color: totalSavings > 0 ? '#15803d' : '#dc2626' }}>
          {totalSavings > 0
            ? `✅ You save ₹${totalSavings} by going to ${marketName}`
            : `❌ Not worth it — buy ${isNaN(breakEven) || breakEven <= 0 ? 'more' : `${breakEven - qty}kg more`} to break even`}
        </div>
      </div>
    </div>
  );
}

// ONDC info panel
function ONDCPanel({ lang }) {
  return (
    <div>
      <div className="card-green" style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.5rem' }}>🛍️ Sell on ONDC Network</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginBottom: '0.85rem' }}>
          {lang === 'kn'
            ? 'Zomato, Amazon ₹0 commission ಬೇಡ. ONDC ನಲ್ಲಿ ₹1.50/transaction ಮಾತ್ರ. ನಿಮ್ಮ products list ಮಾಡಿ, Bengaluru ತುಂಬಾ ಮಾರಿ.'
            : 'No 25% Zomato/Amazon commission. Just ₹1.50/transaction on ONDC. List your products, sell across Bengaluru.'}
        </p>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <a href="https://wa.me/15551593431?text=Help me list my products on ONDC" target="_blank" rel="noreferrer" className="btn-whatsapp" style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}>
            💬 List via WhatsApp
          </a>
          <button className="btn-primary btn-sm" onClick={() => document.getElementById('upload-form').scrollIntoView({ behavior: 'smooth' })}>
            <PlusCircle size={14}/> Upload Directly
          </button>
        </div>
      </div>

      <div id="upload-form" className="card" style={{ marginBottom: '1.5rem', border: '2px dashed var(--green)' }}>
        <div className="panel-title"><PlusCircle size={16} color="var(--green)"/> Upload New Product (Mock)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input className="form-input" placeholder="e.g. Fresh Flowers" />
          </div>
          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input className="form-input" type="number" placeholder="500" />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input">
              <option>Produce</option>
              <option>Grains</option>
              <option>Raw Material</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Unit</label>
            <input className="form-input" placeholder="e.g. 10kg bundle" />
          </div>
        </div>
        <button className="btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => alert('Product uploaded successfully! (Mock)')}>
          <Package size={16}/> Confirm Upload
        </button>
      </div>

      <div className="section-title">⚡ ONDC vs Traditional Platforms</div>
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
          <thead>
            <tr style={{ background: 'var(--border-soft)' }}>
              {['Feature', 'ONDC', 'Zomato/Amazon', 'Direct Selling'].map(h => (
                <th key={h} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', fontWeight: 700, fontSize: '0.75rem' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Commission', '₹1.50/txn', '20–25%', '0% but no reach'],
              ['Reach', 'All ONDC apps', 'Platform only', 'Hyperlocal only'],
              ['Discovery', 'Cross-platform', 'In-app only', 'Word of mouth'],
              ['Setup cost', 'Free', '₹0 but % taken', 'Free'],
              ['Payout', '2-3 days', '7-14 days', 'Instant'],
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '0.6rem 0.8rem', color: j === 1 ? 'var(--green)' : j === 2 ? 'var(--rose)' : 'var(--ink-soft)', fontWeight: j <= 1 ? 600 : 400 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-title">📱 Top ONDC Seller Apps</div>
      {[
        { name: 'Mystore', desc: 'Best for street vendors — WhatsApp catalog integration', link: 'https://mystore.in' },
        { name: 'UdyamWell', desc: 'MSME focused, free onboarding support', link: 'https://udyamwell.com' },
        { name: 'Paytm Seller', desc: 'Easy KYC, existing Paytm users preferred', link: 'https://business.paytm.com' },
      ].map((app, i) => (
        <div key={i} className="scheme-card-full" style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{app.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{app.desc}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a href={app.link} target="_blank" rel="noreferrer" className="btn-primary btn-sm" style={{ textDecoration: 'none' }}>Open ↗</a>
              <a href={`https://wa.me/15551593431?text=Help me register on ${app.name} ONDC`} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">💬 Help</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Marketplace({ lang = 'kn' }) {
  const S = STRINGS[lang] || STRINGS.en;
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [cat, setCat] = useState('All');
  const [tab, setTab] = useState('browse');
  const [isLocked] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('tab');
    if (t && ['browse', 'calc', 'sell'].includes(t)) setTab(t);
  }, [location]);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'products'), (snap) => {
        if (!snap.empty) setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, () => {});
      return unsub;
    } catch {}
  }, []);

  if (isLocked) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{S.locked}</h2>
        <p style={{ color: 'var(--muted)', maxWidth: 360, margin: '0 auto 1.5rem' }}>{S.lockedSub}</p>
        <a href="https://wa.me/15551593431?text=Hi+Mitra" target="_blank" rel="noreferrer" className="btn-whatsapp" style={{ display: 'inline-flex' }}>
          💬 Start Tracking on WhatsApp
        </a>
      </div>
    );
  }

  const filtered = products.filter(p => cat === 'All' || p.type === cat);

  return (
    <div>
      <div className="hero-banner" style={{ padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="hero-badge" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>🛍️ ONDC Network · Zero Commission</div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>{S.title}</h1>
            <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>{S.sub}</p>
          </div>
          <button className="cart-btn" style={{ alignSelf: 'flex-start', flexShrink: 0 }}>
            <ShoppingCart size={18}/> {S.cart} ({cartCount})
          </button>
        </div>
        <div className="hero-badges" style={{ marginTop: '1rem' }}>
          <span className="hero-badge">✅ ONDC Verified</span>
          <span className="hero-badge">💸 ₹1.50/txn only</span>
          <span className="hero-badge">🚚 Bulk Delivery</span>
          <span className="hero-badge">📦 {products.length} Products</span>
        </div>
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${tab === 'browse' ? 'active' : ''}`} onClick={() => setTab('browse')}><Store size={13}/> Browse</button>
        <button className={`tab-btn ${tab === 'calc' ? 'active' : ''}`} onClick={() => setTab('calc')}><Calculator size={13}/> Savings Calc</button>
        <button className={`tab-btn ${tab === 'sell' ? 'active' : ''}`} onClick={() => setTab('sell')}><Zap size={13}/> Sell on ONDC</button>
      </div>

      {tab === 'browse' && (
        <>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                style={{ padding: '0.3rem 0.8rem', borderRadius: 99, border: `1.5px solid ${cat === c ? 'var(--green)' : 'var(--border)'}`, background: cat === c ? 'var(--green-light)' : 'white', color: cat === c ? 'var(--green)' : 'var(--muted)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                {c}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filtered.map((p, i) => {
              const name = typeof p.name === 'object' ? (p.name[lang] || p.name.en) : p.name;
              return (
                <div key={p.id} className="product-card" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div style={{ position: 'relative' }}>
                    <img src={p.image} alt={name} className="product-image"/>
                    {p.ondc && (
                      <span style={{ position: 'absolute', top: 8, left: 8, background: 'var(--green)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: 99 }}>ONDC</span>
                    )}
                  </div>
                  <div className="product-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.72rem', background: 'var(--border-soft)', padding: '0.15rem 0.45rem', borderRadius: 99, color: 'var(--muted)', fontWeight: 600 }}>{p.type}</span>
                      <div className="star-row"><Star size={11} fill="#f59e0b" stroke="none"/><span>{p.rating}</span></div>
                    </div>
                    <h3>{name}</h3>
                    <p className="seller">{S.supplier}: {p.seller}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.4rem 0 0.5rem' }}>
                      <span className="price">₹{p.price}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>per {p.unit}</span>
                    </div>
                    <p className="location"><MapPin size={13}/> {p.location} <span style={{ marginLeft: '0.5rem', color: 'var(--green)', fontWeight: 600 }}><Truck size={13} style={{ display: 'inline' }}/> Bulk</span></p>
                    {/* Phone & Best Time */}
                    {p.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--ink-soft)', margin: '0.35rem 0' }}>
                        <Phone size={12} style={{ color: 'var(--green)', flexShrink: 0 }} />
                        <a href={`tel:${p.phone.replace(/\s/g, '')}`} style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>{p.phone}</a>
                      </div>
                    )}
                    {p.bestTime && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#b45309', background: '#fffbeb', padding: '0.25rem 0.5rem', borderRadius: 6, margin: '0.25rem 0 0.5rem', border: '1px solid #fde68a' }}>
                        <Clock size={12} style={{ flexShrink: 0 }} />
                        <span style={{ fontWeight: 600 }}>{p.bestTime}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-primary" style={{ flex: 1 }} onClick={() => setCartCount(c => c + 1)}>{S.source}</button>
                      {p.mapsLink && (
                        <a href={p.mapsLink} target="_blank" rel="noreferrer" className="btn-ghost btn-sm" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.2rem' }} title="Open in Maps"><ExternalLink size={14}/></a>
                      )}
                      <a href={`https://wa.me/15551593431?text=Tell me more about ${name} from ${p.seller}`} target="_blank" rel="noreferrer" className="btn-ghost btn-sm" style={{ flexShrink: 0 }}>💬</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'calc' && <SavingsCalculator lang={lang}/>}
      {tab === 'sell' && <ONDCPanel lang={lang}/>}
    </div>
  );
}
