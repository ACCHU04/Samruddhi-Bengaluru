// SupplierMap.jsx — Mitra NammaEco Supplier Savings Page
import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, TrendingDown, Package, AlertCircle, Loader } from 'lucide-react';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const BENGALURU_MARKETS = [
  { name: 'KR Market (Krishna Rajendra)', lat: 12.9634, lng: 77.5765, specialty: 'Vegetables, fruits, flowers' },
  { name: 'Yeshwantpur APMC', lat: 13.0275, lng: 77.5548, specialty: 'Grains, wholesale produce' },
  { name: 'Binny Mill Road Market', lat: 12.9756, lng: 77.5720, specialty: 'Vegetables, onions, potatoes' },
  { name: 'Jayanagar Complex Market', lat: 12.9260, lng: 77.5832, specialty: 'Daily vegetables' },
  { name: 'Malleshwaram Market', lat: 13.0030, lng: 77.5650, specialty: 'Vegetables, flowers' },
];

const WHOLESALE_DISCOUNT = {
  vegetables: 0.28, fruits: 0.22, grains: 0.18, spices: 0.25, flowers: 0.30, default: 0.25
};

function detectCategory(item) {
  const l = item.toLowerCase();
  if (/tomato|onion|potato|carrot|cabbage|brinjal|bhindi|palak|sabji|vegetable/.test(l)) return 'vegetables';
  if (/banana|mango|apple|grape|orange|fruit/.test(l)) return 'fruits';
  if (/rice|wheat|dal|pulses|grain/.test(l)) return 'grains';
  if (/chilli|pepper|turmeric|coriander|spice/.test(l)) return 'spices';
  if (/flower|jasmine|rose|marigold/.test(l)) return 'flowers';
  return 'default';
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calcAutoFare(km) { return Math.round((30 + km * 15) * 2); }

const STRINGS = {
  kn: {
    title: 'ಸರಕು ಉಳಿತಾಯ ಮ್ಯಾಪ್', subtitle: 'ಹತ್ತಿರದ ಮಾರ್ಕೆಟ್ ಹುಡುಕಿ, ಹಣ ಉಳಿಸಿ',
    itemLabel: 'ನೀವು ಏನು ಕೊಳ್ಳುತ್ತೀರಿ?', itemPlaceholder: 'ಉದಾ: ಟೊಮೇಟೊ, ಈರುಳ್ಳಿ, ಹೂವು',
    priceLabel: 'ಈಗಿನ ಬೆಲೆ (₹/kg)', calcBtn: 'ಉಳಿತಾಯ ಲೆಕ್ಕ ಮಾಡಿ',
    locating: 'ನಿಮ್ಮ ಲೊಕೇಶನ್ ಹುಡುಕಲಾಗುತ್ತಿದೆ...', noLocation: 'Location ಸಿಗಲಿಲ್ಲ — Bengaluru center ಬಳಸಲಾಗಿದೆ',
    savings: 'ಉಳಿತಾಯ', breakEven: 'Break-even ಪ್ರಮಾಣ', autoFare: 'Auto ಬಾಡಿಗೆ (both ways)',
    directions: 'Directions ತೆಗೆ', worthIt: 'ಈ trip ಲಾಭದಾಯಕ!', notWorth: 'ಈ trip ಲಾಭದಾಯಕವಲ್ಲ',
    markets: 'ಹತ್ತಿರದ ಮಾರ್ಕೆಟ್ಗಳು',
  },
  hi: {
    title: 'सप्लायर बचत मैप', subtitle: 'नज़दीकी मंडी खोजें, पैसे बचाएं',
    itemLabel: 'क्या खरीदते हैं?', itemPlaceholder: 'जैसे: टमाटर, प्याज़, फूल',
    priceLabel: 'मौजूदा दाम (₹/kg)', calcBtn: 'बचत निकालें',
    locating: 'आपकी location ढूंढी जा रही है...', noLocation: 'Location नहीं मिली — Bengaluru center उपयोग किया',
    savings: 'बचत', breakEven: 'Break-even मात्रा', autoFare: 'Auto किराया (आना-जाना)',
    directions: 'रास्ता दिखाएं', worthIt: 'यह trip फ़ायदेमंद है!', notWorth: 'यह trip फ़ायदेमंद नहीं',
    markets: 'नज़दीकी मंडियां',
  },
  ta: {
    title: 'சப்ளையர் சேமிப்பு வரைபடம்', subtitle: 'அருகிலுள்ள சந்தை கண்டறியுங்கள், செலவு குறையுங்கள்',
    itemLabel: 'என்ன வாங்குகிறீர்கள்?', itemPlaceholder: 'எ.கா: தக்காளி, வெங்காயம், மலர்',
    priceLabel: 'தற்போதைய விலை (₹/kg)', calcBtn: 'சேமிப்பு கணக்கிடுங்கள்',
    locating: 'உங்கள் இருப்பிடம் கண்டறியப்படுகிறது...', noLocation: 'இருப்பிடம் கிடைக்கவில்லை — Bengaluru மையம் பயன்படுத்தப்பட்டது',
    savings: 'சேமிப்பு/kg', breakEven: 'Break-even அளவு', autoFare: 'Auto கட்டணம் (இரண்டு வழி)',
    directions: 'வழி காட்டுங்கள்', worthIt: 'இந்த பயணம் லாபகரமானது!', notWorth: 'சிறிய அளவிற்கு பயணம் தேவையில்லை',
    markets: 'அருகிலுள்ள சந்தைகள்',
  },
  te: {
    title: 'సప్లయర్ ఆదా మ్యాప్', subtitle: 'సమీప మార్కెట్ కనుగొనండి, ఖర్చు తగ్గించండి',
    itemLabel: 'మీరు ఏమి కొంటున్నారు?', itemPlaceholder: 'ఉదా: టమాటో, ఉల్లిపాయ, పూలు',
    priceLabel: 'ప్రస్తుత ధర (₹/kg)', calcBtn: 'ఆదా లెక్కించండి',
    locating: 'మీ స్థానం కనుగొంటున్నారు...', noLocation: 'స్థానం దొరకలేదు — Bengaluru మధ్యం ఉపయోగించబడింది',
    savings: 'ఆదా/kg', breakEven: 'Break-even పరిమాణం', autoFare: 'Auto చార్జ్ (రెండు వైపులా)',
    directions: 'దిశలు పొందండి', worthIt: 'ఈ ప్రయాణం లాభదాయకం!', notWorth: 'చిన్న పరిమాణానికి ప్రయాణం అవసరం లేదు',
    markets: 'సమీప మార్కెట్లు',
  },
  en: {
    title: 'Supplier Savings Map', subtitle: 'Find nearby wholesale markets, save on costs',
    itemLabel: 'What are you buying?', itemPlaceholder: 'e.g. tomatoes, onions, flowers',
    priceLabel: 'Your current price (₹/kg)', calcBtn: 'Calculate Savings',
    locating: 'Detecting your location...', noLocation: 'Location unavailable — using Bengaluru centre',
    savings: 'Saving per kg', breakEven: 'Break-even quantity', autoFare: 'Auto fare (both ways)',
    directions: 'Get Directions', worthIt: 'This trip is worth it!', notWorth: 'Not worth it for small quantities',
    markets: 'Nearby Markets',
  }
};

export default function SupplierMap({ lang = 'kn' }) {
  const S = STRINGS[lang] || STRINGS.en;
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);

  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [workerLocation, setWorkerLocation] = useState(null);
  const [locStatus, setLocStatus] = useState('idle');
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [result, setResult] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps JS API
  useEffect(() => {
    if (!MAPS_API_KEY || window.google?.maps) { setMapLoaded(true); return; }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
    // Fixed cleanup: guard against script already removed
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  // Get worker's location
  useEffect(() => {
    setLocStatus('locating');
    if (!navigator.geolocation) {
      setWorkerLocation({ lat: 12.9716, lng: 77.5946 });
      setLocStatus('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => { setWorkerLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocStatus('found'); },
      () => { setWorkerLocation({ lat: 12.9716, lng: 77.5946 }); setLocStatus('denied'); },
      { timeout: 8000 }
    );
  }, []);

  // Compute distances
  useEffect(() => {
    if (!workerLocation) return;
    const withDist = BENGALURU_MARKETS.map(m => ({
      ...m,
      distanceKm: Math.round(haversineKm(workerLocation.lat, workerLocation.lng, m.lat, m.lng) * 10) / 10,
      autoFare: calcAutoFare(haversineKm(workerLocation.lat, workerLocation.lng, m.lat, m.lng))
    })).sort((a, b) => a.distanceKm - b.distanceKm);
    setMarkets(withDist);
    setSelectedMarket(withDist[0]);
  }, [workerLocation]);

  // Init Google Map
  useEffect(() => {
    if (!mapLoaded || !workerLocation || !mapRef.current || !window.google?.maps) return;
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: workerLocation, zoom: 12, mapTypeControl: false, streetViewControl: false,
      styles: [
        { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'simplified' }] }
      ]
    });
    new window.google.maps.Marker({
      position: workerLocation, map: googleMapRef.current, title: 'Your location',
      icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#3b82f6', fillOpacity: 1, strokeColor: 'white', strokeWeight: 3 }
    });
    markersRef.current = markets.map(m => {
      const marker = new window.google.maps.Marker({
        position: { lat: m.lat, lng: m.lng }, map: googleMapRef.current, title: m.name,
        icon: { path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW, scale: 6, fillColor: '#10b981', fillOpacity: 1, strokeColor: 'white', strokeWeight: 2 }
      });
      marker.addListener('click', () => setSelectedMarket(m));
      return { marker, market: m };
    });
  }, [mapLoaded, workerLocation, markets]);

  // Pan map to selected market
  useEffect(() => {
    if (!googleMapRef.current || !selectedMarket) return;
    googleMapRef.current.panTo({ lat: selectedMarket.lat, lng: selectedMarket.lng });
  }, [selectedMarket]);

  function calculate() {
    if (!item || !price || !selectedMarket) return;
    const currentPrice = parseFloat(price);
    const qty = parseFloat(quantity) || 0;
    const category = detectCategory(item);
    const discount = WHOLESALE_DISCOUNT[category];
    const wholesalePrice = Math.round(currentPrice * (1 - discount));
    const savingPerKg = currentPrice - wholesalePrice;
    const { autoFare, distanceKm } = selectedMarket;
    const breakEvenKg = savingPerKg > 0 ? Math.ceil(autoFare / savingPerKg) : 999;
    const tripSaving = qty > 0 ? Math.round(qty * savingPerKg - autoFare) : null;
    const mapsUrl = `https://www.google.com/maps/dir/${workerLocation.lat},${workerLocation.lng}/${selectedMarket.lat},${selectedMarket.lng}`;
    setResult({ currentPrice, wholesalePrice, savingPerKg, discount: Math.round(discount * 100), autoFare, breakEvenKg, tripSaving, distanceKm, mapsUrl, qty, category });
  }

  const isWorth = result && result.qty >= result.breakEvenKg;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 960, margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{S.title}</h2>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0' }}>{S.subtitle}</p>
        {locStatus === 'locating' && (
          <span style={{ fontSize: '0.8rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <Loader size={12} className="animate-spin" /> {S.locating}
          </span>
        )}
        {locStatus === 'denied' && (
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <AlertCircle size={12} /> {S.noLocation}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Calculator */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
              <TrendingDown size={18} color="#10b981" />
              <span style={{ fontWeight: 600, color: '#0f172a' }}>Savings Calculator</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: 4 }}>{S.itemLabel}</label>
                <input value={item} onChange={e => setItem(e.target.value)} placeholder={S.itemPlaceholder}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.95rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: 4 }}>{S.priceLabel}</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="₹ 0"
                    style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.95rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: 4 }}>Quantity (kg)</label>
                  <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g. 10"
                    style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.95rem', boxSizing: 'border-box' }} />
                </div>
              </div>
              <button onClick={calculate} disabled={!item || !price}
                style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: 8, padding: '0.7rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', opacity: (!item || !price) ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                {S.calcBtn}
              </button>
            </div>

            {result && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <div style={{ background: isWorth ? '#f0fdf4' : '#fef9c3', border: `1px solid ${isWorth ? '#86efac' : '#fde047'}`, borderRadius: 10, padding: '0.75rem', marginBottom: '0.75rem', textAlign: 'center', fontWeight: 600, color: isWorth ? '#15803d' : '#854d0e', fontSize: '0.9rem' }}>
                  {isWorth ? `✅ ${S.worthIt} Save ₹${result.tripSaving} on this trip!` : `⚠️ ${S.notWorth} — need ${result.breakEvenKg}kg to break even`}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                  {[
                    { label: 'Your price', val: `₹${result.currentPrice}/kg` },
                    { label: 'Market price', val: `₹${result.wholesalePrice}/kg`, highlight: true },
                    { label: S.savings, val: `₹${result.savingPerKg}/kg (${result.discount}% off)` },
                    { label: S.autoFare, val: `₹${result.autoFare}` },
                    { label: S.breakEven, val: `${result.breakEvenKg} kg` },
                    { label: 'Distance', val: `${result.distanceKm} km` },
                  ].map(({ label, val, highlight }) => (
                    <div key={label} style={{ background: highlight ? '#ecfdf5' : '#f8fafc', borderRadius: 8, padding: '0.5rem 0.75rem' }}>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{label}</div>
                      <div style={{ color: highlight ? '#059669' : '#0f172a', fontWeight: 600 }}>{val}</div>
                    </div>
                  ))}
                </div>
                <a href={result.mapsUrl} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: '0.75rem', background: '#1d4ed8', color: 'white', borderRadius: 8, padding: '0.6rem', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                  <Navigation size={15} /> {S.directions} →
                </a>
              </div>
            )}
          </div>

          {/* Market List */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <MapPin size={18} color="#6366f1" />
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{S.markets}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 300, overflowY: 'auto' }}>
              {markets.map(m => (
                <button key={m.name} onClick={() => setSelectedMarket(m)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem', borderRadius: 10, border: '1px solid',
                  borderColor: selectedMarket?.name === m.name ? '#6366f1' : '#e2e8f0',
                  background: selectedMarket?.name === m.name ? '#eef2ff' : 'white',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{m.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.specialty}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#6366f1' }}>{m.distanceKm} km</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Auto ₹{m.autoFare}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flex: 1, minHeight: 480 }}>
            {MAPS_API_KEY ? (
              <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: 480 }} />
            ) : (
              <iframe
                title="Supplier Markets Map"
                width="100%" height="480"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                src={selectedMarket
                  ? `https://maps.google.com/maps?q=${selectedMarket.lat},${selectedMarket.lng}&z=14&output=embed`
                  : `https://maps.google.com/maps?q=KR+Market+Bengaluru&z=13&output=embed`}
              />
            )}
          </div>

          {selectedMarket && (
            <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{selectedMarket.name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 2 }}>{selectedMarket.specialty}</div>
                </div>
                <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '0.35rem 0.65rem', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#059669', fontSize: '1.1rem' }}>{selectedMarket.distanceKm} km</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>from you</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <a href={`https://www.google.com/maps/dir/${workerLocation?.lat},${workerLocation?.lng}/${selectedMarket.lat},${selectedMarket.lng}`}
                  target="_blank" rel="noreferrer"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#1d4ed8', color: 'white', borderRadius: 8, padding: '0.55rem', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
                  <Navigation size={14} /> Directions
                </a>
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(selectedMarket.name)}/@${selectedMarket.lat},${selectedMarket.lng},15z`}
                  target="_blank" rel="noreferrer"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#f1f5f9', color: '#334155', borderRadius: 8, padding: '0.55rem', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
                  <Package size={14} /> View on Maps
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
