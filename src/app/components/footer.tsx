import React from 'react'

const css = `
  .pl-footer {
    background: #f0f0f0;
    color: #333;
    font-family: sans-serif;
    padding: 56px 48px 32px;
    box-sizing: border-box;
    width: 100%;
  }

  .pl-footer-top {
    display: grid;
    grid-template-columns: 200px repeat(5, 1fr);
    gap: 32px;
    padding-bottom: 40px;
    border-bottom: 1px solid #ddd;
  }

  .pl-footer-brand h2 {
    font-size: 1.6rem;
    font-weight: 800;
    color: #2dd4bf;
    margin: 0 0 20px;
    letter-spacing: -0.5px;
  }

  .pl-follow-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px;
  }

  .pl-socials {
    display: flex;
    gap: 10px;
  }

  .pl-social-icon {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid #ccc;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    cursor: pointer;
    text-decoration: none;
    color: #444;
    transition: border-color 0.2s, color 0.2s;
  }

  .pl-social-icon:hover {
    border-color: #2dd4bf;
    color: #2dd4bf;
  }

  .pl-footer-col h3 {
    font-size: 0.88rem;
    font-weight: 700;
    color: #111;
    margin: 0 0 20px;
  }

  .pl-footer-col ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 13px;
  }

  .pl-footer-col ul li a {
    font-size: 0.88rem;
    color: #555;
    text-decoration: none;
    transition: color 0.15s;
  }

  .pl-footer-col ul li a:hover {
    color: #2dd4bf;
  }

  .pl-footer-bottom {
    padding-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .pl-footer-bottom p {
    font-size: 0.8rem;
    color: #888;
    margin: 0;
  }

  .pl-footer-bottom a {
    font-size: 0.8rem;
    color: #888;
    text-decoration: none;
    transition: color 0.15s;
  }

  .pl-footer-bottom a:hover {
    color: #2dd4bf;
  }

  @media (max-width: 1024px) {
    .pl-footer-top {
      grid-template-columns: repeat(3, 1fr);
    }
    .pl-footer-brand {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 600px) {
    .pl-footer {
      padding: 40px 20px 24px;
    }
    .pl-footer-top {
      grid-template-columns: 1fr 1fr;
      gap: 28px;
    }
    .pl-footer-brand {
      grid-column: 1 / -1;
    }
  }
`

const navColumns = [
  {
    heading: 'Services',
    links: [
      'Sell Phone', 'Sell Television', 'Sell Smart Watch',
      'Sell Smart Speakers', 'Sell DSLR Camera', 'Sell Earbuds',
      'Repair Phone', 'Buy Gadgets', 'Recycle Phone',
      'Find New Phone', 'Partner With Us',
    ],
  },
  {
    heading: 'Company',
    links: [
      'About Us', 'Careers', 'Articles',
      'Press Releases', 'Become PhoneLenz Partner',
      'Become Supersale Partner', 'Corporate Information',
    ],
  },
  {
    heading: 'Sell Device',
    links: [
      'Mobile Phone', 'Laptop', 'Tablet', 'iMac', 'Gaming Consoles',
    ],
  },
  {
    heading: 'Help & Support',
    links: [
      'FAQ', 'Contact Us', 'Warranty Policy', 'Refund Policy',
    ],
  },
  {
    heading: 'More Info',
    links: [
      'Terms & Conditions', 'Privacy Policy', 'Terms of Use',
      'E-Waste Policy', 'Cookie Policy', 'What is Refurbished', 'Device Safety',
    ],
  },
]

const socials = [
  { icon: '𝕏', label: 'Twitter' },
  { icon: 'f', label: 'Facebook' },
  { icon: '◎', label: 'Instagram' },
  { icon: '▶', label: 'YouTube' },
]

export default function Footer() {
  return (
    <>
      <style>{css}</style>
      <footer className="pl-footer">
        <div className="pl-footer-top">

          {/* Brand */}
          <div className="pl-footer-brand">
            <h2>PhoneLenz</h2>
            <p className="pl-follow-label">Follow us on</p>
            <div className="pl-socials">
              {socials.map((s, i) => (
                <a key={i} href="#" className="pl-social-icon" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          {navColumns.map((col, i) => (
            <div key={i} className="pl-footer-col">
              <h3>{col.heading}</h3>
              <ul>
                {col.links.map((link, j) => (
                  <li key={j}><a href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="pl-footer-bottom">
          <p>© {new Date().getFullYear()} PhoneLenz. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </>
  )
}


