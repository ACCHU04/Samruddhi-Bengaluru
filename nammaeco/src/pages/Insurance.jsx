import React from 'react';
import { ShieldCheck, Heart, UserCheck, Umbrella, ArrowRight, ExternalLink } from 'lucide-react';

const STRINGS = {
  kn: {
    title: 'ವಿಮೆ ಮತ್ತು ಸುರಕ್ಷತೆ',
    sub: 'ನಿಮ್ಮ ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬದ ಭವಿಷ್ಯಕ್ಕಾಗಿ ಅತ್ಯುತ್ತಮ ವಿಮೆ ಯೋಜನೆಗಳು.',
    hero: 'Mitra ಜೊತೆ ಸುರಕ್ಷಿತರಾಗಿರಿ',
    tip: '💡 ಸಲಹೆ: PM-SBY ವಿಮೆ ಕೇವಲ ₹20/ವರ್ಷಕ್ಕೆ ₹2 ಲಕ್ಷದ ಅಪಘಾತ ವಿಮೆ ನೀಡುತ್ತದೆ.'
  },
  en: {
    title: 'Insurance & Protection',
    sub: 'Secure your family\'s future with the right insurance policies.',
    hero: 'Stay Protected with Mitra',
    tip: '💡 Tip: PM-SBY gives ₹2 Lakh accident cover for just ₹20/year.'
  }
};

const POLICIES = [
  {
    id: 'pmsby',
    name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    type: 'Accident Insurance',
    benefit: '₹2 Lakh Cover for accidental death/disability',
    cost: '₹20 per year',
    link: 'https://www.jansuraksha.gov.in/Forms-PMSBY.aspx',
    icon: <Umbrella size={24} className="text-blue-500" />
  },
  {
    id: 'pmjjby',
    name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
    type: 'Life Insurance',
    benefit: '₹2 Lakh Life cover for any cause of death',
    cost: '₹436 per year',
    link: 'https://www.jansuraksha.gov.in/Forms-PMJJBY.aspx',
    icon: <ShieldCheck size={24} className="text-green-500" />
  },
  {
    id: 'ayushman',
    name: 'Ayushman Bharat (PM-JAY)',
    type: 'Health Insurance',
    benefit: '₹5 Lakh per family for hospitalisation',
    cost: 'Free for eligible workers',
    link: 'https://pmjay.gov.in/',
    icon: <Heart size={24} className="text-red-500" />
  },
  {
    id: 'pmsym',
    name: 'PM Shram Yogi Maan-dhan (PM-SYM)',
    type: 'Pension Scheme',
    benefit: '₹3,000 monthly pension after age 60',
    cost: '₹55 - ₹200 monthly contribution',
    link: 'https://maandhan.in/shramyogi',
    icon: <UserCheck size={24} className="text-purple-500" />
  }
];

export default function Insurance({ lang = 'kn' }) {
  const S = STRINGS[lang] || STRINGS.en;

  return (
    <div className="insurance-page">
      <div className="hero-banner" style={{ padding: '1.75rem 2rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)' }}>
        <div className="hero-badge" style={{ marginBottom: '0.75rem', display: 'inline-flex', background: 'rgba(255,255,255,0.2)' }}>🛡️ Family Protection</div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white' }}>{S.title}</h1>
        <p style={{ opacity: 0.9, fontSize: '0.9rem', color: 'white' }}>{S.sub}</p>
      </div>

      <div className="card-amber" style={{ marginBottom: '1.5rem', border: '1px dashed #b45309' }}>
        <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{S.tip}</p>
      </div>

      <div className="policy-grid" style={{ display: 'grid', gap: '1rem' }}>
        {POLICIES.map((p) => (
          <div key={p.id} className="scheme-card-full" style={{ borderLeft: '4px solid var(--green)' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--border-soft)', borderRadius: 12, height: 'fit-content' }}>
                {p.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{p.type}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{p.name}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                  <div>Benefit: <strong>{p.benefit}</strong></div>
                  <div>Cost: <strong>{p.cost}</strong></div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a 
                    href={`https://wa.me/15551593431?text=Help me apply for ${p.name}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-primary" 
                    style={{ flex: 1, textDecoration: 'none', textAlign: 'center', fontSize: '0.85rem' }}
                  >
                    Ask Mitra to Apply
                  </a>
                  <a 
                    href={p.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-ghost" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                  >
                    Details <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem' }}>
        <Umbrella size={40} style={{ color: 'var(--green)', marginBottom: '1rem' }} />
        <h3>Not sure which one is right for you?</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Chat with Mitra to get a personalized insurance recommendation based on your work and family size.
        </p>
        <a 
          href="https://wa.me/15551593431?text=Suggest a suitable insurance for me. I am an informal worker." 
          target="_blank" 
          rel="noreferrer" 
          className="btn-whatsapp"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Talk to Mitra <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}
