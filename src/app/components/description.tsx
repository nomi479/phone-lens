import React from 'react';

const sellSteps = [
  { title: 'Get an Instant Quote', desc: "Enter your phone's details and get the best price instantly." },
  { title: 'Free Home Pickup', desc: "We'll come to your doorstep at your convenient time." },
  { title: 'Instant Cash Payment', desc: 'Get paid in cash the moment we pick up your device.' },
];

const buySteps = [
  { title: 'Browse the Store', desc: 'Visit our website or app and go to Buy Phone section.' },
  { title: 'Pick Brand & Model', desc: 'Choose brand, model, and condition (Fair, Good, or Superb).' },
  { title: 'Enter Address & Pay', desc: 'Add delivery address, select payment method, and confirm.' },
  { title: 'Get Delivered', desc: 'Your refreshed phone is delivered safely to your doorstep.' },
];

const sellFeatures = [
  { icon: '💸', label: 'Best Price Assured' },
  { icon: '🏠', label: 'Free Home Pickup' },
  { icon: '⚡', label: 'Instant Cash on Pickup' },
  { icon: '🚀', label: 'Hassle Free' },
];

const buyFeatures = [
  { icon: '✅', label: '32-Point Quality Check' },
  { icon: '🛡️', label: '6-Month Warranty' },
  { icon: '🔄', label: '15-Day Replacement' },
  { icon: '💰', label: 'Half the Price' },
];

const brands = [
  'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo',
  'Nothing', 'Google Pixel', 'Motorola', 'Nokia', 'iQOO', 'Poco', 'Tecno', 'Infinix',
];

const css = `
  .pl-desc-root {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #ffffff;
    color: #1f2937;
    padding: 80px 24px 100px;
    max-width: 1180px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .section-title {
    font-size: clamp(1.4rem, 4vw, 1.85rem);
    font-weight: 700;
    color: #111827;
    margin-bottom: 24px;
    line-height: 1.3;
  }

  .brand-pill {
    transition: all 0.2s ease;
  }
  
  .brand-pill:hover {
    background: #e0f2fe;
    border-color: #0ea5e9;
    transform: translateY(-1px);
  }

  @media (max-width: 640px) {
    .pl-desc-root {
      padding: 50px 16px 70px;
    }
  }
`;

export default function Description() {
  return (
    <>
      <style>{css}</style>
      <div className="pl-desc-root">

        {/* HERO INTRO */}
        <div style={{ marginBottom: '80px', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0ea5e9',
            marginBottom: '16px'
          }}>
            PhoneLenz
          </p>
          <h1 style={{
            fontSize: 'clamp(2rem, 6vw, 2.8rem)',
            color: '#111827',
            margin: '0 0 24px',
            lineHeight: 1.2,
            fontWeight: 800,
          }}>
            Sell Old Phone.<br />Buy Refurbished Smart.
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#4b5563',
            maxWidth: '720px',
            margin: '0 auto',
            lineHeight: 1.75
          }}>
            Get instant cash for your old phone with free pickup and upgrade to a quality refurbished mobile at half the price.
          </p>
        </div>

        <Divider />

        {/* SELL SECTION */}
        <Section label="Sell with PhoneLenz" title="Turn Your Old Phone Into Cash Today">
          <p style={{ 
            fontSize: '1.05rem', 
            color: '#4b5563', 
            lineHeight: 1.75, 
            marginBottom: '40px', 
            maxWidth: '680px' 
          }}>
            Sell your phone in minutes. No hassle, no travel — just instant cash at your doorstep.
          </p>
          <Steps steps={sellSteps} />
          <Pills items={sellFeatures} />
        </Section>

        <Divider />

        {/* BRANDS SECTION */}
        <Section label="Supported Brands" title="We Support All Major Brands">
          <p style={{ 
            fontSize: '1.05rem', 
            color: '#4b5563', 
            lineHeight: 1.75, 
            marginBottom: '32px', 
            maxWidth: '680px' 
          }}>
            Buy or sell almost every popular mobile brand in India.
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center'
          }}>
            {brands.map((brand, i) => (
              <span
                key={i}
                className="brand-pill"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '10px 20px',
                  fontSize: '0.92rem',
                  color: '#374151',
                  cursor: 'default',
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </Section>

        <Divider />

        {/* BUY SECTION */}
        <Section label="Buy with PhoneLenz" title="Upgrade Smart — Buy Refurbished Phones">
          <p style={{ 
            fontSize: '1.05rem', 
            color: '#4b5563', 
            lineHeight: 1.75, 
            marginBottom: '40px', 
            maxWidth: '680px' 
          }}>
            Premium refurbished phones at half the price with full quality assurance.
          </p>
          <Steps steps={buySteps} />
          <Pills items={buyFeatures} />
        </Section>

        <Divider />

        {/* PRIVACY NOTE */}
        <div style={{
          marginTop: '70px',
          padding: '32px 36px',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '20px',
          textAlign: 'center',
        }}>
          <p style={{ 
            fontSize: '1.05rem', 
            color: '#1e40af', 
            lineHeight: 1.75, 
            margin: 0,
            fontWeight: 500
          }}>
            🔒 <strong>Your privacy is our top priority.</strong> Every device is thoroughly cleaned and all personal data is completely wiped before resale.
          </p>
        </div>

      </div>
    </>
  );
}

/* Reusable Components */

function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ margin: '72px 0' }}>
      <p style={{
        fontSize: '0.78rem',
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#0ea5e9',
        marginBottom: '14px'
      }}>
        {label}
      </p>
      <h2 className="section-title">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Steps({ steps }: { steps: { title: string; desc: string }[] }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '32px', 
      marginBottom: '42px' 
    }}>
      {steps.map((step, i) => (
        <div 
          key={i} 
          style={{ 
            display: 'flex', 
            gap: '22px',
            alignItems: 'flex-start'
          }}
        >
          <div style={{ flexShrink: 0, marginTop: '3px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
            }}>
              {i + 1}
            </div>
          </div>

          <div style={{ paddingTop: '4px' }}>
            <p style={{ 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              color: '#111827', 
              margin: '0 0 8px' 
            }}>
              {step.title}
            </p>
            <p style={{ 
              fontSize: '0.97rem', 
              color: '#4b5563', 
              lineHeight: 1.68 
            }}>
              {step.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Pills({ items }: { items: { icon: string; label: string }[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '9px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '9999px',
            padding: '11px 20px',
            fontSize: '0.93rem',
            color: '#374151',
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
}

function Divider() {
  return (
    <div style={{
      height: '1px',
      background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
      margin: '48px 0'
    }} />
  );
}