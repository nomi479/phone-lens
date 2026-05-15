import React from 'react'

const stats = [
  { icon: '₹', value: '13270.5Cr.', label: 'Cash Given' },
  { icon: '📱', value: '196.6Lac', label: 'Gadgets Encashed' },
]

const testimonials = [
  {
    text: 'Sold off my phone very easily and got the payment on the spot. Best experience so far.',
    name: 'Tarun Singh Verma',
    location: 'Lahore',
    avatar: 'https://i.pravatar.cc/40?img=12',
  },
  {
    text: 'Well trained staff. Overall a positive experience in selling my phone at Cashify.',
    name: 'Karan Sharma',
    location: 'Delhi NCR',
    avatar: 'https://i.pravatar.cc/40?img=15',
  },
  {
    text: 'No complaints, sold my phone very easily here. Definitely worth a try.',
    name: 'Abhiyash',
    location: 'Krachi',
    avatar: 'https://i.pravatar.cc/40?img=20',
  },
  {
    text: 'Payment was very instant and the whole process was quick. Will recommend it.',
    name: 'Vinit Kumar',
    location: 'Multan',
    avatar: 'https://i.pravatar.cc/40?img=25',
  },
]

function Comments() {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Header Section */}
      <div
        style={{
          backgroundColor: '#111',
          color: '#fff',
          padding: '40px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 700, maxWidth: '560px', margin: 0, lineHeight: 1.3 }}>
          Trusted by 176.94 Lac + Happy Users and Major Brands since 2015
        </h1>

        <div style={{ display: 'flex', gap: '16px' }}>
          {/* Cash Given */}
          <div
            style={{
              backgroundColor: '#1e1e1e',
              borderRadius: '12px',
              padding: '20px 24px',
              minWidth: '150px',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '8px' }}>₹</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2dd4bf' }}>13270.5Cr.</div>
            <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '4px' }}>Cash Given</div>
          </div>

          {/* Gadgets Encashed */}
          <div
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '12px',
              padding: '20px 24px',
              minWidth: '150px',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '8px' }}>📱</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2dd4bf' }}>196.6Lac</div>
            <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '4px' }}>Gadgets Encashed</div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
        }}
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '220px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            {/* Quote Mark */}
            <div>
              <div
                style={{
                  fontSize: '2.5rem',
                  color: '#2dd4bf',
                  lineHeight: 1,
                  marginBottom: '16px',
                  fontFamily: 'Georgia, serif',
                }}
              >
                &ldquo;
              </div>
              <p style={{ fontSize: '0.95rem', color: '#333', margin: 0, lineHeight: 1.6 }}>{t.text}</p>
            </div>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
              <img
                src={t.avatar}
                alt={t.name}
                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>{t.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>{t.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Comments