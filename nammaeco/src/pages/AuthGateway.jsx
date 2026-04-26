import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Key, Loader, ShieldCheck, Phone, Globe } from 'lucide-react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AUTH_STRINGS = {
  kn: {
    welcome: 'ಸಮೃದ್ಧಿ ಬೆಂಗಳೂರು ಗೆ ಸ್ವಾಗತ',
    create: 'ನಿಮ್ಮ ಖಾತೆ ರಚಿಸಿ',
    subtitle: 'ಮಾರುಕಟ್ಟೆಯನ್ನು ಪ್ರವೇಶಿಸಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ',
    email: 'ಇಮೇಲ್ ವಿಳಾಸ',
    phone: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    pass: 'ಪಾಸ್‌ವರ್ಡ್',
    confirm: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ',
    loginBtn: 'ಲಾಗಿನ್',
    signupBtn: 'ಸೈನ್ ಅಪ್',
    google: 'Google ಮೂಲಕ ಮುಂದುವರಿಯಿರಿ',
    new: 'ಹೊಸಬರೇ?',
    already: 'ಖಾತೆ ಇದೆಯೇ?',
    join: 'ಈಗಲೇ ಸೇರಿ',
    loginLink: 'ಇಲ್ಲಿ ಲಾಗಿನ್ ಮಾಡಿ',
    brand: 'ಸಮೃದ್ಧಿ ಬೆಂಗಳೂರು'
  },
  en: {
    welcome: 'Welcome to Samruddhi Bengaluru',
    create: 'Create Your Account',
    subtitle: 'Please authenticate to enter the marketplace',
    email: 'Email Address',
    phone: 'Phone Number',
    pass: 'Password',
    confirm: 'Confirm Password',
    loginBtn: 'Enter Mitra',
    signupBtn: 'Sign Up',
    google: 'Continue with Google',
    new: 'New to Samruddhi Bengaluru?',
    already: 'Already have an account?',
    join: 'Join now',
    loginLink: 'Login here',
    brand: 'Samruddhi Bengaluru'
  }
};

export default function AuthGateway({ onAuthSuccess, initialLang = 'kn' }) {
  const [lang, setLang] = useState(initialLang);
  const S = AUTH_STRINGS[lang] || AUTH_STRINGS.en;
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) return alert(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ' : 'Please enter both email and password');
    if (isRegistering && password !== confirmPassword) return alert(lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ!' : 'Passwords do not match!');
    
    setLoading(true);
    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userData = { email, phone, name: email.split('@')[0], createdAt: new Date(), preferredLang: lang };
        await setDoc(doc(db, 'app_users', userCredential.user.uid), userData);
        onAuthSuccess(userData);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        const snap = await getDoc(doc(db, 'app_users', userCredential.user.uid));
        onAuthSuccess(snap.data() || { email });
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const snap = await getDoc(doc(db, 'app_users', user.uid));
      let userData;
      if (!snap.exists()) {
        userData = { name: user.displayName, email: user.email, photo: user.photoURL, createdAt: new Date(), preferredLang: lang };
        await setDoc(doc(db, 'app_users', user.uid), userData);
      } else {
        userData = snap.data();
      }
      onAuthSuccess(userData);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap" style={{ minHeight: '100vh', background: 'var(--green-deep)', position: 'relative' }}>
      {/* Top Language Switcher */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
        <div className="nav-lang-wrap" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
          <Globe size={14}/>
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            <option value="kn" style={{background: 'var(--green-deep)'}}>ಕನ್ನಡ</option>
            <option value="en" style={{background: 'var(--green-deep)'}}>English</option>
          </select>
        </div>
      </div>

      <div className="hero-banner" style={{ width: '100%', maxWidth: '1000px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="login-card" style={{ background: 'white', color: 'var(--ink)' }}>
          <div className="login-logo">
            <span style={{ fontSize: '1.8rem' }}>🌿</span> {S.brand}
            <span className="logo-tag">Premium Access</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{isRegistering ? S.create : S.welcome}</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>{S.subtitle}</p>
          
          <div className="form-group">
            <label className="form-label"><Mail size={12} /> {S.email}</label>
            <input className="form-input" type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label className="form-label"><Phone size={12} /> {S.phone}</label>
              <input className="form-input" type="tel" placeholder="91XXXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label"><Key size={12} /> {S.pass}</label>
            <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label className="form-label"><Key size={12} /> {S.confirm}</label>
              <input className="form-input" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
          )}
          
          <button className="btn-primary" onClick={handleAuth} disabled={loading} style={{ marginTop: '0.5rem', padding: '1rem' }}>
            {loading ? <Loader className="animate-spin" size={20}/> : (isRegistering ? <UserPlus size={20}/> : <LogIn size={20}/>)} 
            <span style={{ marginLeft: '0.5rem' }}>{isRegistering ? S.signupBtn : S.loginBtn}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          </div>

          <button className="btn-secondary" onClick={handleGoogleAuth} disabled={loading} style={{ width: '100%', padding: '0.8rem', gap: '0.75rem' }}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.08 24.08 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            {S.google}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
            {isRegistering ? S.already : S.new}{' '}
            <button onClick={() => setIsRegistering(!isRegistering)} style={{ background: 'none', border: 'none', color: 'var(--green)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
              {isRegistering ? S.loginLink : S.join}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
