import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import Schemes from './pages/Schemes';
import Community from './pages/Community';
import Home from './pages/Home';
import SupplierMap from './pages/SupplierMap';
import Insurance from './pages/Insurance';
import AuthGateway from './pages/AuthGateway';
import { auth } from './firebase';
import { Leaf, BarChart3, Globe, ShoppingBag, Users, Home as HomeIcon, BookOpen, MapPin, LogOut, Shield } from 'lucide-react';
import { signOut } from 'firebase/auth';
import './index.css';

const LANG_OPTIONS = [
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'en', label: 'English' },
];

function NavBar({ uiLang, setUiLang, onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo">
          <Leaf size={22} /> {uiLang === 'kn' ? 'ಸಮೃದ್ಧಿ ಬೆಂಗಳೂರು' : 'Samruddhi Bengaluru'}
          <span className="logo-tag">by Mitra</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={isActive('/') ? 'nav-active' : ''}><HomeIcon size={15}/><span>Home</span></Link>
          <Link to="/marketplace" className={isActive('/marketplace') ? 'nav-active' : ''}><ShoppingBag size={15}/><span>Market</span></Link>
          <Link to="/map" className={isActive('/map') ? 'nav-active' : ''}><MapPin size={15}/><span>Map</span></Link>
          <Link to="/schemes" className={isActive('/schemes') ? 'nav-active' : ''}><BookOpen size={15}/><span>Schemes</span></Link>
          <Link to="/insurance" className={isActive('/insurance') ? 'nav-active' : ''}><Shield size={15}/><span>Insurance</span></Link>
          <Link to="/community" className={isActive('/community') ? 'nav-active' : ''}><Users size={15}/><span>Community</span></Link>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'nav-active' : ''}><BarChart3 size={15}/><span>Dashboard</span></Link>
          <div className="nav-lang-wrap">
            <Globe size={13}/>
            <select value={uiLang} onChange={e => setUiLang(e.target.value)}>
              {LANG_OPTIONS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
          <button className="btn-logout-small" onClick={onLogout} title="Log Out">
            <LogOut size={15}/>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const [uiLang, setUiLang] = useState('kn');
  const [appUser, setAppUser] = useState(null);

  if (!appUser) {
    return <AuthGateway onAuthSuccess={(user) => setAppUser(user)} initialLang={uiLang} />;
  }

  const handleLogout = async () => {
    await signOut(auth);
    setAppUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        <NavBar uiLang={uiLang} setUiLang={setUiLang} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home lang={uiLang} />} />
            <Route path="/marketplace" element={<Marketplace lang={uiLang} />} />
            <Route path="/map" element={<SupplierMap lang={uiLang} />} />
            <Route path="/schemes" element={<Schemes lang={uiLang} />} />
            <Route path="/insurance" element={<Insurance lang={uiLang} />} />
            <Route path="/community" element={<Community lang={uiLang} />} />
            <Route path="/dashboard" element={<Dashboard lang={uiLang} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
