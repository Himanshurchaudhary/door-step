import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Database, Eye, Share2, Cookie, ShieldCheck,
  UserCheck, Baby, RefreshCw, Mail, Phone, MapPin
} from "lucide-react";

const SITE = "https://doorsstep.in"; // <- apna exact domain check kar lena
const PAGE_PATH = "/privacy";
const PAGE_TITLE = "Privacy Policy | Doorstep Car Wash";
const PAGE_DESC =
  "Read how Doorstep Car Wash collects, uses, shares and protects your personal information when you book a car, bike or cycle wash in Ahmedabad and Gandhinagar.";
const LAST_UPDATED = "3 October 2026";
const LAST_UPDATED_ISO = "2026-10-03";
const PHONE_DISPLAY = "+91 9898249789";
const PHONE_TEL = "+919898249789";
const EMAIL = "doorstepcarwash99@gmail.com";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  .pp-page { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background: #f7f9fc; color: #33415c; padding-bottom: 60px; }

  /* Hero */
  .pp-hero { background: linear-gradient(135deg, #0f1f4b 0%, #1a3a7a 100%); padding: 64px 20px 56px; text-align: center; position: relative; overflow: hidden; }
  .pp-hero::before { content: ''; position: absolute; width: 300px; height: 300px; border-radius: 50%; background: #2a7de1; opacity: 0.12; top: -120px; left: -80px; }
  .pp-hero-eyebrow { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 3px; color: #5badff; text-transform: uppercase; margin-bottom: 12px; }
  .pp-hero h1 { font-size: clamp(26px, 5vw, 42px); font-weight: 800; color: #ffffff; margin: 0 0 12px; letter-spacing: -0.5px; }
  .pp-hero p { font-size: 14px; color: #a8c4e8; max-width: 560px; margin: 0 auto; line-height: 1.6; }
  .pp-hero-updated { display: inline-block; margin-top: 18px; font-size: 12px; font-weight: 600; color: #0f1f4b; background: #ffffff; padding: 6px 16px; border-radius: 50px; }

  /* Layout */
  .pp-container { max-width: 880px; margin: -30px auto 0; padding: 0 20px; position: relative; z-index: 2; }
  .pp-card { background: #ffffff; border-radius: 16px; box-shadow: 0 8px 30px rgba(15,31,75,0.08); padding: 32px 28px; margin-bottom: 20px; }
  .pp-crumb { max-width: 880px; margin: 0 auto; padding: 14px 20px 0; font-size: 12px; color: #a8c4e8; position: absolute; left: 0; right: 0; top: 0; }

  /* Table of contents */
  .pp-toc-title { font-size: 13px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #0f1f4b; margin: 0 0 14px; }
  .pp-toc-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; }
  .pp-toc-list a { font-size: 13px; color: #2a7de1; text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 6px; }
  .pp-toc-list a:hover { text-decoration: underline; }
  .pp-toc-num { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; border-radius: 5px; background: #eaf1ff; color: #2a7de1; font-size: 10px; font-weight: 800; flex-shrink: 0; }

  /* Section */
  .pp-section { scroll-margin-top: 90px; }
  .pp-section-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .pp-section-icon { width: 38px; height: 38px; border-radius: 10px; background: #eaf1ff; color: #2a7de1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pp-section h2 { font-size: 19px; font-weight: 800; color: #0f1f4b; margin: 0; letter-spacing: -0.2px; }
  .pp-section-num { font-size: 12px; font-weight: 700; color: #8a9bc2; letter-spacing: 0.5px; }
  .pp-section p { font-size: 14px; line-height: 1.75; color: #526089; margin: 0 0 12px; }
  .pp-section h3 { font-size: 15px; font-weight: 700; color: #0f1f4b; margin: 18px 0 8px; }
  .pp-section ul { margin: 0 0 14px; padding-left: 20px; }
  .pp-section li { font-size: 14px; line-height: 1.7; color: #526089; margin-bottom: 6px; }
  .pp-section strong { color: #0f1f4b; }
  .pp-section a, .pp-link { color: #2a7de1; font-weight: 600; }
  .pp-divider { height: 1px; background: #eef1f8; margin: 28px 0; }

  /* Data table */
  .pp-table-wrap { overflow-x: auto; margin: 14px 0 18px; border: 1px solid #eef1f8; border-radius: 10px; }
  .pp-table { width: 100%; border-collapse: collapse; min-width: 480px; }
  .pp-table th { background: #f4f7fc; text-align: left; font-size: 11px; font-weight: 800; letter-spacing: 0.4px; text-transform: uppercase; color: #526089; padding: 10px 14px; border-bottom: 1px solid #eef1f8; }
  .pp-table td { font-size: 13px; color: #33415c; padding: 12px 14px; border-bottom: 1px solid #f4f7fc; line-height: 1.5; }
  .pp-table tr:last-child td { border-bottom: none; }

  .pp-note { background: #eef7f0; border: 1px solid #bfe3c8; border-radius: 10px; padding: 14px 16px; font-size: 13px; line-height: 1.6; color: #1f5c33; display: flex; gap: 10px; margin: 14px 0; }
  .pp-note svg { flex-shrink: 0; margin-top: 2px; }

  /* Rights grid */
  .pp-rights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 14px 0 12px; }
  .pp-right-item { display: flex; gap: 10px; align-items: flex-start; background: #f7f9fc; border: 1px solid #eef1f8; border-radius: 10px; padding: 12px 14px; }
  .pp-right-icon { width: 26px; height: 26px; border-radius: 7px; background: #eaf1ff; color: #2a7de1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pp-right-item strong { display: block; font-size: 13px; color: #0f1f4b; margin-bottom: 2px; }
  .pp-right-item span { font-size: 12.5px; color: #6b7ba0; line-height: 1.5; }

  /* Contact box */
  .pp-contact-box { background: linear-gradient(120deg, #0f1f4b 0%, #1a3a7a 100%); border-radius: 16px; padding: 28px; text-align: center; }
  .pp-contact-box h2 { color: #ffffff; font-size: 18px; font-weight: 800; margin: 0 0 8px; }
  .pp-contact-box p { color: #a8c4e8; font-size: 13px; margin: 0 0 18px; line-height: 1.6; }
  .pp-contact-links { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }
  .pp-contact-link { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 50px; transition: background 0.2s; }
  .pp-contact-link:hover { background: #2a7de1; }
  .pp-contact-link:focus-visible, .pp-toc-list a:focus-visible { outline: 3px solid #5badff; outline-offset: 2px; }

  @media (max-width: 640px) {
    .pp-hero { padding: 48px 16px 60px; }
    .pp-container { margin-top: -40px; padding: 0 14px; }
    .pp-card { padding: 22px 16px; border-radius: 14px; }
    .pp-toc-list { grid-template-columns: 1fr; }
    .pp-section h2 { font-size: 16px; }
    .pp-section-icon { width: 34px; height: 34px; }
    .pp-rights-grid { grid-template-columns: 1fr; }
    .pp-contact-links { flex-direction: column; align-items: stretch; }
  }
`;

const sections = [
  { id: "overview", title: "Overview", icon: <Eye size={17} /> },
  { id: "data-we-collect", title: "Information We Collect", icon: <Database size={17} /> },
  { id: "how-we-use", title: "How We Use Your Data", icon: <RefreshCw size={17} /> },
  { id: "sharing", title: "Sharing With Third Parties", icon: <Share2 size={17} /> },
  { id: "cookies", title: "Cookies & Tracking", icon: <Cookie size={17} /> },
  { id: "security", title: "Data Security", icon: <ShieldCheck size={17} /> },
  { id: "retention", title: "Data Retention", icon: <Database size={17} /> },
  { id: "rights", title: "Your Rights & Choices", icon: <UserCheck size={17} /> },
  { id: "children", title: "Children's Privacy", icon: <Baby size={17} /> },
  { id: "changes", title: "Changes to This Policy", icon: <RefreshCw size={17} /> },
  { id: "contact", title: "Contact & Grievances", icon: <Mail size={17} /> },
];

const buildSchema = () => [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: PAGE_TITLE,
    url: `${SITE}${PAGE_PATH}`,
    description: PAGE_DESC,
    dateModified: LAST_UPDATED_ISO,
    isPartOf: { "@type": "WebSite", name: "Doorstep Car Wash", url: SITE },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${SITE}${PAGE_PATH}` },
    ],
  },
];

function Section({ idx, children }) {
  const s = sections[idx];
  return (
    <>
      {idx > 0 && <div className="pp-divider" />}
      <section id={s.id} className="pp-section" aria-labelledby={`${s.id}-h`}>
        <div className="pp-section-head">
          <div className="pp-section-icon" aria-hidden="true">{s.icon}</div>
          <div>
            <div className="pp-section-num">Section {idx + 1}</div>
            <h2 id={`${s.id}-h`}>{s.title}</h2>
          </div>
        </div>
        {children}
      </section>
    </>
  );
}

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESC} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE}${PAGE_PATH}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESC} />
        <meta property="og:url" content={`${SITE}${PAGE_PATH}`} />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESC} />
        <script type="application/ld+json">{JSON.stringify(buildSchema())}</script>
      </Helmet>

      <style>{styles}</style>
      <main className="pp-page">

        {/* Hero */}
        <header className="pp-hero">
          <span className="pp-hero-eyebrow">LEGAL</span>
          <h1>Privacy Policy</h1>
          <p>
            Your privacy matters to us. This Privacy Policy explains what personal information
            Doorstep Car Wash collects, how we use it, who we share it with, and the choices and
            rights you have over your data.
          </p>
          <span className="pp-hero-updated">Last Updated: {LAST_UPDATED}</span>
        </header>

        <div className="pp-container">

          {/* Table of Contents */}
          <nav className="pp-card" aria-label="Privacy policy contents">
            <p className="pp-toc-title">On This Page</p>
            <ul className="pp-toc-list">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    <span className="pp-toc-num">{i + 1}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main content */}
          <div className="pp-card">

            <Section idx={0}>
              <p>
                This Privacy Policy applies to the Doorstep Car Wash website, mobile
                application, and related booking services (collectively, the "Platform"),
                operated by Doorstep Car Wash ("we", "us", "our"). We provide doorstep car, bike
                and bicycle cleaning in Ahmedabad and Gandhinagar. This policy describes how we
                collect, use, disclose, and protect your personal information when you visit our
                website, create an account, book a service, or otherwise interact with us.
              </p>
              <p>
                By using our Platform, you consent to the data practices described in this
                policy. If you do not agree, please do not use our services. This policy should be
                read together with our <Link to="/term">Terms &amp; Conditions</Link>.
              </p>
            </Section>

            <Section idx={1}>
              <p>We collect information in the following ways:</p>

              <h3>2.1 Information You Provide</h3>
              <div className="pp-table-wrap">
                <table className="pp-table">
                  <thead>
                    <tr><th>Category</th><th>Examples</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Account details</td><td>Name, email address, phone number, password</td></tr>
                    <tr><td>Booking details</td><td>Vehicle type, service address, preferred date and time, package selected</td></tr>
                    <tr><td>Payment information</td><td>Billing details and payment references, processed securely via our payment partners</td></tr>
                    <tr><td>Communications</td><td>Messages, feedback, support requests, reviews and ratings</td></tr>
                  </tbody>
                </table>
              </div>

              <h3>2.2 Information Collected Automatically</h3>
              <ul>
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Location data, when you grant permission, to confirm service availability in your area</li>
                <li>Usage data such as pages visited, features used, and time spent on the Platform</li>
                <li>Log data collected via cookies and similar technologies (see Section 5)</li>
              </ul>

              <h3>2.3 Information From Third Parties</h3>
              <p>
                If you sign up or log in through a third-party service (for example, Google), we may
                receive basic profile information such as your name and email address, as permitted
                by that provider's privacy settings.
              </p>
            </Section>

            <Section idx={2}>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Create and manage your account, and process your bookings</li>
                <li>Assign a team member and coordinate service at your location</li>
                <li>Process payments and send booking confirmations, receipts, and invoices</li>
                <li>Communicate with you about your bookings, offers, and customer support</li>
                <li>Improve our Platform, services, and overall customer experience</li>
                <li>Detect, prevent, and address fraud, abuse, or security issues</li>
                <li>Comply with legal obligations and enforce our Terms &amp; Conditions</li>
              </ul>
              <p>
                We process your data based on your consent, to perform our contract with you (that
                is, delivering the service you booked), to comply with the law, and for our
                legitimate business interests.
              </p>
            </Section>

            <Section idx={3}>
              <p>
                We do not sell your personal information. We share it only in the following
                circumstances:
              </p>
              <ul>
                <li><strong>Service team:</strong> your name, contact number, and service address are shared with the team member assigned to your booking.</li>
                <li><strong>Payment processors:</strong> trusted third-party payment gateways process your transactions; we do not store full card details on our servers.</li>
                <li><strong>Service providers:</strong> vendors who help with hosting, analytics, SMS or email delivery, and customer support, under confidentiality obligations.</li>
                <li><strong>Legal requirements:</strong> where required by applicable law, regulation, legal process, or a valid government request.</li>
                <li><strong>Business transfers:</strong> in connection with a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
              </ul>
            </Section>

            <Section idx={4}>
              <p>
                We use cookies and similar technologies to operate and improve our Platform. They
                help us:
              </p>
              <ul>
                <li>Keep you logged in and remember your preferences</li>
                <li>Understand how visitors use our website (analytics)</li>
                <li>Measure the effectiveness of our promotions and offers</li>
              </ul>
              <p>
                You can control or disable cookies through your browser settings; however,
                disabling some cookies may affect how the Platform works.
              </p>
            </Section>

            <Section idx={5}>
              <p>
                We use reasonable technical and organisational safeguards, such as encryption in
                transit, access controls, and secure servers, to protect your personal information
                from unauthorised access, alteration, disclosure, or destruction.
              </p>
              <div className="pp-note">
                <ShieldCheck size={16} aria-hidden="true" />
                <span>
                  No method of transmission over the internet or electronic storage is 100% secure.
                  We cannot guarantee absolute security, but we continuously review and improve our
                  safeguards.
                </span>
              </div>
            </Section>

            <Section idx={6}>
              <p>
                We keep your personal information for as long as your account is active, or as
                needed to provide services, comply with legal obligations, resolve disputes, and
                enforce our agreements. When information is no longer required, we securely delete
                or anonymise it.
              </p>
            </Section>

            <Section idx={7}>
              <p>
                Under applicable Indian law, including the Digital Personal Data Protection Act,
                2023, you may have the right to:
              </p>
              <div className="pp-rights-grid">
                <div className="pp-right-item">
                  <div className="pp-right-icon" aria-hidden="true"><Eye size={14} /></div>
                  <div><strong>Access</strong><span>Request a summary of the personal data we hold about you</span></div>
                </div>
                <div className="pp-right-item">
                  <div className="pp-right-icon" aria-hidden="true"><RefreshCw size={14} /></div>
                  <div><strong>Correction</strong><span>Ask us to correct inaccurate or incomplete data</span></div>
                </div>
                <div className="pp-right-item">
                  <div className="pp-right-icon" aria-hidden="true"><Database size={14} /></div>
                  <div><strong>Deletion</strong><span>Request deletion of your account and associated data</span></div>
                </div>
                <div className="pp-right-item">
                  <div className="pp-right-icon" aria-hidden="true"><ShieldCheck size={14} /></div>
                  <div><strong>Withdraw consent</strong><span>Opt out of marketing communications at any time</span></div>
                </div>
              </div>
              <p>
                To exercise any of these rights, contact us using the details in{" "}
                <a href="#contact">Section 11</a>, or visit our{" "}
                <Link to="/user/deleteaccount">Delete Account</Link> page to permanently remove
                your account.
              </p>
            </Section>

            <Section idx={8}>
              <p>
                Our services are not directed to individuals under the age of 18. We do not
                knowingly collect personal information from children. If we learn that we have
                collected data from a minor, we will take steps to delete it promptly.
              </p>
            </Section>

            <Section idx={9}>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our
                practices, technology, or legal requirements. The "Last Updated" date at the top of
                this page shows when it was most recently revised. Please review this page
                periodically.
              </p>
            </Section>

            <Section idx={10}>
              <p>
                For questions, data requests, or complaints about how we handle your personal
                information, contact us:
              </p>
              <ul>
                <li><strong>Business:</strong> Doorstep Car Wash</li>
                <li>
                  <strong>Address:</strong> D/705 7th Floor Om Shanti Gold Plus, Beside Om Shanti
                  Nagar 2, Lambh Vatva Road, Narol, Ahmedabad, Gujarat, 382405
                </li>
                <li><strong>Phone:</strong> <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></li>
                <li><strong>Email:</strong> <a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
                <li><strong>Hours:</strong> Mon to Sun, 8:00 AM to 8:00 PM</li>
              </ul>
            </Section>

          </div>

          {/* Contact box */}
          <aside className="pp-contact-box" aria-label="Contact us about your data">
            <h2>Questions About Your Data?</h2>
            <p>
              If you have any questions, concerns, or requests about this Privacy Policy or your
              personal data, reach out to us anytime.
            </p>
            <div className="pp-contact-links">
              <a href={`mailto:${EMAIL}`} className="pp-contact-link">
                <Mail size={15} aria-hidden="true" /> {EMAIL}
              </a>
              <a href={`tel:${PHONE_TEL}`} className="pp-contact-link">
                <Phone size={15} aria-hidden="true" /> {PHONE_DISPLAY}
              </a>
              <a
                href="https://maps.google.com/?q=Door+Step+Car+Wash,Narol,Ahmedabad,Gujarat,382405"
                target="_blank"
                rel="noopener noreferrer"
                className="pp-contact-link"
              >
                <MapPin size={15} aria-hidden="true" /> View on Map
              </a>
            </div>
          </aside>

        </div>
      </main>
    </>
  );
}