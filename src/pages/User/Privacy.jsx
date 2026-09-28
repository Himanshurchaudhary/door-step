import { useState } from "react";
import {
  Database, Eye, Share2, Cookie, ShieldCheck,
  UserCheck, Baby, RefreshCw, Mail, Phone
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  .pp-page {
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    background: #f7f9fc;
    color: #33415c;
    padding-bottom: 60px;
  }

  /* ---- Hero ---- */
  .pp-hero {
    background: linear-gradient(135deg, #0f1f4b 0%, #1a3a7a 100%);
    padding: 64px 20px 56px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .pp-hero::before {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: #2a7de1;
    opacity: 0.12;
    top: -120px; left: -80px;
  }
  .pp-hero-eyebrow {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    color: #5badff;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .pp-hero h1 {
    font-size: clamp(26px, 5vw, 42px);
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 12px;
    letter-spacing: -0.5px;
  }
  .pp-hero p {
    font-size: 14px;
    color: #a8c4e8;
    max-width: 540px;
    margin: 0 auto;
    line-height: 1.6;
  }
  .pp-hero-updated {
    display: inline-block;
    margin-top: 18px;
    font-size: 12px;
    font-weight: 600;
    color: #0f1f4b;
    background: #ffffff;
    padding: 6px 16px;
    border-radius: 50px;
  }

  /* ---- Layout ---- */
  .pp-container {
    max-width: 880px;
    margin: -30px auto 0;
    padding: 0 20px;
    position: relative;
    z-index: 2;
  }

  .pp-card {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(15,31,75,0.08);
    padding: 32px 28px;
    margin-bottom: 20px;
  }

  /* ---- Table of contents ---- */
  .pp-toc-title {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #0f1f4b;
    margin: 0 0 14px;
  }
  .pp-toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 20px;
  }
  .pp-toc-list a {
    font-size: 13px;
    color: #2a7de1;
    text-decoration: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .pp-toc-list a:hover { text-decoration: underline; }
  .pp-toc-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px; height: 18px;
    border-radius: 5px;
    background: #eaf1ff;
    color: #2a7de1;
    font-size: 10px;
    font-weight: 800;
    flex-shrink: 0;
  }

  /* ---- Section ---- */
  .pp-section { scroll-margin-top: 90px; }
  .pp-section-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }
  .pp-section-icon {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: #eaf1ff;
    color: #2a7de1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .pp-section h2 {
    font-size: 19px;
    font-weight: 800;
    color: #0f1f4b;
    margin: 0;
    letter-spacing: -0.2px;
  }
  .pp-section-num {
    font-size: 12px;
    font-weight: 700;
    color: #9fb0d4;
    letter-spacing: 0.5px;
  }

  .pp-section p {
    font-size: 14px;
    line-height: 1.75;
    color: #526089;
    margin: 0 0 12px;
  }
  .pp-section h3 {
    font-size: 15px;
    font-weight: 700;
    color: #0f1f4b;
    margin: 18px 0 8px;
  }
  .pp-section ul, .pp-section ol {
    margin: 0 0 14px;
    padding-left: 20px;
  }
  .pp-section li {
    font-size: 14px;
    line-height: 1.7;
    color: #526089;
    margin-bottom: 6px;
  }
  .pp-section strong { color: #0f1f4b; }

  .pp-divider { height: 1px; background: #eef1f8; margin: 28px 0; }

  /* ---- Data table ---- */
  .pp-table-wrap { overflow-x: auto; margin: 14px 0 18px; border: 1px solid #eef1f8; border-radius: 10px; }
  .pp-table { width: 100%; border-collapse: collapse; min-width: 480px; }
  .pp-table th {
    background: #f4f7fc;
    text-align: left;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: #526089;
    padding: 10px 14px;
    border-bottom: 1px solid #eef1f8;
  }
  .pp-table td {
    font-size: 13px;
    color: #33415c;
    padding: 12px 14px;
    border-bottom: 1px solid #f4f7fc;
    line-height: 1.5;
  }
  .pp-table tr:last-child td { border-bottom: none; }

  .pp-note {
    background: #eef7f0;
    border: 1px solid #bfe3c8;
    border-radius: 10px;
    padding: 14px 16px;
    font-size: 13px;
    line-height: 1.6;
    color: #1f5c33;
    display: flex;
    gap: 10px;
    margin: 14px 0;
  }
  .pp-note svg { flex-shrink: 0; margin-top: 2px; }

  /* ---- Rights grid ---- */
  .pp-rights-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 14px 0 6px;
  }
  .pp-right-item {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    background: #f7f9fc;
    border: 1px solid #eef1f8;
    border-radius: 10px;
    padding: 12px 14px;
  }
  .pp-right-icon {
    width: 26px; height: 26px;
    border-radius: 7px;
    background: #eaf1ff;
    color: #2a7de1;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .pp-right-item div strong {
    display: block;
    font-size: 13px;
    color: #0f1f4b;
    margin-bottom: 2px;
  }
  .pp-right-item div span {
    font-size: 12.5px;
    color: #6b7ba0;
    line-height: 1.5;
  }

  /* ---- Contact box ---- */
  .pp-contact-box {
    background: linear-gradient(120deg, #0f1f4b 0%, #1a3a7a 100%);
    border-radius: 16px;
    padding: 28px;
    text-align: center;
  }
  .pp-contact-box h3 { color: #ffffff; font-size: 18px; font-weight: 800; margin: 0 0 8px; }
  .pp-contact-box p { color: #a8c4e8; font-size: 13px; margin: 0 0 18px; line-height: 1.6; }
  .pp-contact-links { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }
  .pp-contact-link {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: #ffffff; text-decoration: none;
    font-size: 13px; font-weight: 600;
    padding: 10px 18px; border-radius: 50px;
    transition: background 0.2s;
  }
  .pp-contact-link:hover { background: #2a7de1; }

  /* ---- Mobile ---- */
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
];

export default function PrivacyPolicy() {
  const [lastUpdated] = useState("15 August 2026");

  return (
    <>
      <style>{styles}</style>
      <div className="pp-page">

        {/* Hero */}
        <div className="pp-hero">
          <span className="pp-hero-eyebrow">LEGAL</span>
          <h1>Privacy Policy</h1>
          <p>
            Your privacy matters to us. This Privacy Policy explains what personal information
            Doorstep Car Wash collects, how we use it, who we share it with, and the choices and
            rights you have over your data.
          </p>
          <span className="pp-hero-updated">Last Updated: {lastUpdated}</span>
        </div>

        <div className="pp-container">

          {/* Table of Contents */}
          <div className="pp-card">
            <h2 className="pp-toc-title">On This Page</h2>
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
          </div>

          {/* Main content card */}
          <div className="pp-card">

            <div id="overview" className="pp-section">
              <div className="pp-section-head">
                <div className="pp-section-icon">{sections[0].icon}</div>
                <div>
                  <div className="pp-section-num">Section 1</div>
                  <h2>Overview</h2>
                </div>
              </div>
              <p>
                This Privacy Policy applies to the Doorstep Car Wash website, mobile
                application, and related booking services (collectively, the "Platform"),
                operated by Doorstep Car Wash ("we", "us", "our"). It describes how we collect,
                use, disclose, and protect your personal information when you visit our website,
                create an account, book a service, or otherwise interact with us.
              </p>
              <p>
                By using our Platform, you consent to the data practices described in this
                policy. If you do not agree with this policy, please do not use our Services.
                This policy should be read together with our{" "}
                <a href="/user/termcondition" style={{ color: "#2a7de1", fontWeight: 600 }}>
                  Terms &amp; Conditions
                </a>.
              </p>
            </div>

            <div className="pp-divider" />

            <div id="data-we-collect" className="pp-section">
              <div className="pp-section-head">
                <div className="pp-section-icon">{sections[1].icon}</div>
                <div>
                  <div className="pp-section-num">Section 2</div>
                  <h2>Information We Collect</h2>
                </div>
              </div>
              <p>We collect information in the following ways:</p>

              <h3>2.1 Information You Provide</h3>
              <div className="pp-table-wrap">
                <table className="pp-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Examples</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Account details</td>
                      <td>Name, email address, phone number, password</td>
                    </tr>
                    <tr>
                      <td>Booking details</td>
                      <td>Vehicle type, service address, preferred date/time, package selected</td>
                    </tr>
                    <tr>
                      <td>Payment information</td>
                      <td>Billing details, UPI ID, card details (processed securely via our payment partners)</td>
                    </tr>
                    <tr>
                      <td>Communications</td>
                      <td>Messages, feedback, support tickets, reviews and ratings</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>2.2 Information Collected Automatically</h3>
              <ul>
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Location data, when you grant permission, to find nearby service availability</li>
                <li>Usage data such as pages visited, features used, and time spent on the Platform</li>
                <li>Log data collected via cookies and similar tracking technologies (see Section 5)</li>
              </ul>

              <h3>2.3 Information From Third Parties</h3>
              <p>
                If you sign up or log in via a third-party service (e.g. Google), we may receive
                basic profile information such as your name and email address, as permitted by
                that provider's privacy settings.
              </p>
            </div>

            <div className="pp-divider" />

            <div id="how-we-use" className="pp-section">
              <div className="pp-section-head">
                <div className="pp-section-icon">{sections[2].icon}</div>
                <div>
                  <div className="pp-section-num">Section 3</div>
                  <h2>How We Use Your Data</h2>
                </div>
              </div>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Create and manage your account, and process your bookings</li>
                <li>Match you with available technicians and coordinate service delivery</li>
                <li>Process payments and send booking confirmations, receipts, and invoices</li>
                <li>Communicate with you regarding your bookings, offers, and customer support</li>
                <li>Improve our Platform, services, and overall customer experience</li>
                <li>Detect, prevent, and address fraud, abuse, or security issues</li>
                <li>Comply with legal obligations and enforce our Terms &amp; Conditions</li>
              </ul>
              <p>
                We rely on your consent, the necessity to perform our contract with you (i.e.
                delivering the service you booked), and our legitimate business interests as the
                legal bases for this processing.
              </p>
            </div>

            <div className="pp-divider" />

            <div id="sharing" className="pp-section">
              <div className="pp-section-head">
                <div className="pp-section-icon">{sections[3].icon}</div>
                <div>
                  <div className="pp-section-num">Section 4</div>
                  <h2>Sharing With Third Parties</h2>
                </div>
              </div>
              <p>
                We do not sell your personal information. We may share your information only in
                the following circumstances:
              </p>
              <ul>
                <li><strong>Service technicians</strong> — your name, contact number, and service address are shared with the assigned technician to deliver your booked service.</li>
                <li><strong>Payment processors</strong> — trusted third-party payment gateways process your transactions securely; we do not store full card details on our servers.</li>
                <li><strong>Service providers</strong> — vendors who help us with hosting, analytics, SMS/email delivery, and customer support, under confidentiality obligations.</li>
                <li><strong>Legal requirements</strong> — where required to comply with applicable law, regulation, legal process, or a valid governmental request.</li>
                <li><strong>Business transfers</strong> — in connection with a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
              </ul>
            </div>

            <div className="pp-divider" />

            <div id="cookies" className="pp-section">
              <div className="pp-section-head">
                <div className="pp-section-icon">{sections[4].icon}</div>
                <div>
                  <div className="pp-section-num">Section 5</div>
                  <h2>Cookies &amp; Tracking Technologies</h2>
                </div>
              </div>
              <p>
                We use cookies and similar tracking technologies to operate and improve our
                Platform. These help us:
              </p>
              <ul>
                <li>Keep you logged in and remember your preferences</li>
                <li>Understand how visitors use our website (analytics)</li>
                <li>Measure the effectiveness of our promotions and offers</li>
              </ul>
              <p>
                You can control or disable cookies through your browser settings; however,
                disabling certain cookies may affect the functionality of our Platform.
              </p>
            </div>

            <div className="pp-divider" />

            <div id="security" className="pp-section">
              <div className="pp-section-head">
                <div className="pp-section-icon">{sections[5].icon}</div>
                <div>
                  <div className="pp-section-num">Section 6</div>
                  <h2>Data Security</h2>
                </div>
              </div>
              <p>
                We implement industry-standard technical and organisational safeguards —
                including encryption in transit, access controls, and secure servers — to
                protect your personal information from unauthorised access, alteration,
                disclosure, or destruction.
              </p>
              <div className="pp-note">
                <ShieldCheck size={16} />
                <span>
                  While we work hard to protect your data, no method of transmission over the
                  internet or electronic storage is 100% secure. We cannot guarantee absolute
                  security but continuously review and improve our safeguards.
                </span>
              </div>
            </div>

            <div className="pp-divider" />

            <div id="retention" className="pp-section">
              <div className="pp-section-head">
                <div className="pp-section-icon">{sections[6].icon}</div>
                <div>
                  <div className="pp-section-num">Section 7</div>
                  <h2>Data Retention</h2>
                </div>
              </div>
              <p>
                We retain your personal information for as long as your account is active, or as
                needed to provide you services, comply with our legal obligations, resolve
                disputes, and enforce our agreements. When information is no longer required, we
                securely delete or anonymise it.
              </p>
            </div>

            <div className="pp-divider" />

            <div id="rights" className="pp-section">
              <div className="pp-section-head">
                <div className="pp-section-icon">{sections[7].icon}</div>
                <div>
                  <div className="pp-section-num">Section 8</div>
                  <h2>Your Rights &amp; Choices</h2>
                </div>
              </div>
              <p>Depending on your location, you may have the right to:</p>
              <div className="pp-rights-grid">
                <div className="pp-right-item">
                  <div className="pp-right-icon"><Eye size={14} /></div>
                  <div>
                    <strong>Access</strong>
                    <span>Request a copy of the personal data we hold about you</span>
                  </div>
                </div>
                <div className="pp-right-item">
                  <div className="pp-right-icon"><RefreshCw size={14} /></div>
                  <div>
                    <strong>Correction</strong>
                    <span>Ask us to correct inaccurate or incomplete data</span>
                  </div>
                </div>
                <div className="pp-right-item">
                  <div className="pp-right-icon"><Database size={14} /></div>
                  <div>
                    <strong>Deletion</strong>
                    <span>Request deletion of your account and associated data</span>
                  </div>
                </div>
                <div className="pp-right-item">
                  <div className="pp-right-icon"><ShieldCheck size={14} /></div>
                  <div>
                    <strong>Withdraw Consent</strong>
                    <span>Opt out of marketing communications at any time</span>
                  </div>
                </div>
              </div>
              <p>
                To exercise any of these rights, please contact us using the details in Section
                10, or visit our{" "}
                <a href="/user/deleteaccount" style={{ color: "#2a7de1", fontWeight: 600 }}>
                  Delete Account
                </a>{" "}
                page to permanently remove your account.
              </p>
            </div>

            <div className="pp-divider" />

            <div id="children" className="pp-section">
              <div className="pp-section-head">
                <div className="pp-section-icon">{sections[8].icon}</div>
                <div>
                  <div className="pp-section-num">Section 9</div>
                  <h2>Children's Privacy</h2>
                </div>
              </div>
              <p>
                Our Services are not directed to individuals under the age of 18. We do not
                knowingly collect personal information from children. If we become aware that we
                have inadvertently collected data from a minor, we will take steps to delete
                such information promptly.
              </p>
            </div>

            <div className="pp-divider" />

            <div id="changes" className="pp-section">
              <div className="pp-section-head">
                <div className="pp-section-icon">{sections[9].icon}</div>
                <div>
                  <div className="pp-section-num">Section 10</div>
                  <h2>Changes to This Policy</h2>
                </div>
              </div>
              <p>
                We may update this Privacy Policy periodically to reflect changes in our
                practices, technology, legal requirements, or for other operational reasons. The
                "Last Updated" date at the top of this page indicates when this policy was most
                recently revised. We encourage you to review this page periodically to stay
                informed about how we protect your information.
              </p>
            </div>

          </div>

          {/* Contact box */}
          <div className="pp-contact-box">
            <h3>Questions About Your Data?</h3>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or
              your personal data, reach out to us anytime.
            </p>
            <div className="pp-contact-links">
              <a href="mailto:support@doorstepcarwash.com" className="pp-contact-link">
                <Mail size={15} /> support@doorstepcarwash.com
              </a>
              <a href="tel:+911234567890" className="pp-contact-link">
                <Phone size={15} /> +91 12345 67890
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}