import { useState } from "react";
import { FileText, ShieldCheck, CreditCard, XCircle, AlertTriangle, Scale, Mail, Phone } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  .tc-page {
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    background: #f7f9fc;
    color: #33415c;
    padding-bottom: 60px;
  }

  /* ---- Hero ---- */
  .tc-hero {
    background: linear-gradient(135deg, #0f1f4b 0%, #1a3a7a 100%);
    padding: 64px 20px 56px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .tc-hero::before {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: #2a7de1;
    opacity: 0.12;
    top: -120px; right: -80px;
  }
  .tc-hero-eyebrow {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    color: #5badff;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .tc-hero h1 {
    font-size: clamp(26px, 5vw, 42px);
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 12px;
    letter-spacing: -0.5px;
  }
  .tc-hero p {
    font-size: 14px;
    color: #a8c4e8;
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.6;
  }
  .tc-hero-updated {
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
  .tc-container {
    max-width: 880px;
    margin: -30px auto 0;
    padding: 0 20px;
    position: relative;
    z-index: 2;
  }

  .tc-card {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(15,31,75,0.08);
    padding: 32px 28px;
    margin-bottom: 20px;
  }

  /* ---- Table of contents ---- */
  .tc-toc-title {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #0f1f4b;
    margin: 0 0 14px;
  }
  .tc-toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 20px;
  }
  .tc-toc-list a {
    font-size: 13px;
    color: #2a7de1;
    text-decoration: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .tc-toc-list a:hover { text-decoration: underline; }
  .tc-toc-num {
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
  .tc-section {
    scroll-margin-top: 90px;
  }
  .tc-section-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }
  .tc-section-icon {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: #eaf1ff;
    color: #2a7de1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .tc-section h2 {
    font-size: 19px;
    font-weight: 800;
    color: #0f1f4b;
    margin: 0;
    letter-spacing: -0.2px;
  }
  .tc-section-num {
    font-size: 12px;
    font-weight: 700;
    color: #9fb0d4;
    letter-spacing: 0.5px;
  }

  .tc-section p {
    font-size: 14px;
    line-height: 1.75;
    color: #526089;
    margin: 0 0 12px;
  }
  .tc-section h3 {
    font-size: 15px;
    font-weight: 700;
    color: #0f1f4b;
    margin: 18px 0 8px;
  }
  .tc-section ul, .tc-section ol {
    margin: 0 0 14px;
    padding-left: 20px;
  }
  .tc-section li {
    font-size: 14px;
    line-height: 1.7;
    color: #526089;
    margin-bottom: 6px;
  }
  .tc-section strong { color: #0f1f4b; }

  .tc-divider {
    height: 1px;
    background: #eef1f8;
    margin: 28px 0;
  }

  .tc-note {
    background: #fff8ec;
    border: 1px solid #f5deac;
    border-radius: 10px;
    padding: 14px 16px;
    font-size: 13px;
    line-height: 1.6;
    color: #7a5c1e;
    display: flex;
    gap: 10px;
    margin: 14px 0;
  }
  .tc-note svg { flex-shrink: 0; margin-top: 2px; }

  /* ---- Contact box ---- */
  .tc-contact-box {
    background: linear-gradient(120deg, #0f1f4b 0%, #1a3a7a 100%);
    border-radius: 16px;
    padding: 28px;
    text-align: center;
  }
  .tc-contact-box h3 {
    color: #ffffff;
    font-size: 18px;
    font-weight: 800;
    margin: 0 0 8px;
  }
  .tc-contact-box p {
    color: #a8c4e8;
    font-size: 13px;
    margin: 0 0 18px;
    line-height: 1.6;
  }
  .tc-contact-links {
    display: flex;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
  }
  .tc-contact-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: #ffffff;
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 18px;
    border-radius: 50px;
    transition: background 0.2s;
  }
  .tc-contact-link:hover { background: #2a7de1; }

  /* ---- Mobile ---- */
  @media (max-width: 640px) {
    .tc-hero { padding: 48px 16px 60px; }
    .tc-container { margin-top: -40px; padding: 0 14px; }
    .tc-card { padding: 22px 16px; border-radius: 14px; }
    .tc-toc-list { grid-template-columns: 1fr; }
    .tc-section h2 { font-size: 16px; }
    .tc-section-icon { width: 34px; height: 34px; }
    .tc-contact-links { flex-direction: column; align-items: stretch; }
  }
`;

const sections = [
  { id: "acceptance", title: "Acceptance of Terms", icon: <FileText size={17} /> },
  { id: "services", title: "Our Services", icon: <ShieldCheck size={17} /> },
  { id: "booking", title: "Booking, Pricing & Payment", icon: <CreditCard size={17} /> },
  { id: "cancellation", title: "Cancellation & Refund Policy", icon: <XCircle size={17} /> },
  { id: "responsibilities", title: "User Responsibilities", icon: <ShieldCheck size={17} /> },
  { id: "liability", title: "Liability & Damage Claims", icon: <AlertTriangle size={17} /> },
  { id: "conduct", title: "Prohibited Use & Conduct", icon: <XCircle size={17} /> },
  { id: "ip", title: "Intellectual Property", icon: <FileText size={17} /> },
  { id: "privacy", title: "Privacy & Data Use", icon: <ShieldCheck size={17} /> },
  { id: "termination", title: "Suspension & Termination", icon: <AlertTriangle size={17} /> },
  { id: "changes", title: "Changes to These Terms", icon: <FileText size={17} /> },
  { id: "law", title: "Governing Law & Jurisdiction", icon: <Scale size={17} /> },
];

export default function TermsAndConditions() {
  const [lastUpdated] = useState("15 August 2026");

  return (
    <>
      <style>{styles}</style>
      <div className="tc-page">

        {/* Hero */}
        <div className="tc-hero">
          <span className="tc-hero-eyebrow">LEGAL</span>
          <h1>Terms &amp; Conditions</h1>
          <p>
            Please read these Terms & Conditions carefully before booking a Doorstep Car Wash
            service. By booking, browsing, or using our website and mobile services, you agree
            to be bound by the terms outlined below.
          </p>
          <span className="tc-hero-updated">Last Updated: {lastUpdated}</span>
        </div>

        <div className="tc-container">

          {/* Table of Contents */}
          <div className="tc-card">
            <h2 className="tc-toc-title">On This Page</h2>
            <ul className="tc-toc-list">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    <span className="tc-toc-num">{i + 1}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Main content card */}
          <div className="tc-card">

            <div id="acceptance" className="tc-section">
              <div className="tc-section-head">
                <div className="tc-section-icon">{sections[0].icon}</div>
                <div>
                  <div className="tc-section-num">Section 1</div>
                  <h2>Acceptance of Terms</h2>
                </div>
              </div>
              <p>
                These Terms and Conditions ("Terms") govern your access to and use of the
                Doorstep Car Wash website, mobile application, and related booking services
                (collectively, the "Platform" or "Service"). The Service is operated by
                Doorstep Car Wash ("we", "us", "our"), a doorstep vehicle cleaning and
                detailing service provider.
              </p>
              <p>
                By creating an account, making a booking, or otherwise using our Service, you
                confirm that you have read, understood, and agree to be legally bound by these
                Terms, along with our Privacy Policy. If you do not agree with any part of these
                Terms, you must not use our Platform or Services.
              </p>
              <p>
                You must be at least 18 years of age, or the age of legal majority in your
                jurisdiction, to create an account and book a service on our Platform. By using
                the Service, you represent and warrant that you meet this requirement.
              </p>
            </div>

            <div className="tc-divider" />

            <div id="services" className="tc-section">
              <div className="tc-section-head">
                <div className="tc-section-icon">{sections[1].icon}</div>
                <div>
                  <div className="tc-section-num">Section 2</div>
                  <h2>Our Services</h2>
                </div>
              </div>
              <p>
                Doorstep Car Wash provides on-demand, doorstep vehicle cleaning and detailing
                services, including but not limited to Basic Wash, Standard Wash, and Premium
                Detailing packages. Our trained professionals travel to a customer's specified
                location — home, office, or any other accessible address — to perform the
                selected service using professional-grade, eco-friendly cleaning products and
                equipment.
              </p>
              <h3>2.1 Service Availability</h3>
              <p>
                Service availability is subject to your location falling within our operational
                service area, technician availability, weather conditions, and local
                regulations. We reserve the right to decline or reschedule a booking at our
                discretion where these conditions are not met.
              </p>
              <h3>2.2 Water &amp; Power Access</h3>
              <p>
                Certain service packages may require access to a nearby water source and/or
                electrical outlet at the service location. Where such access is not available,
                our technicians carry limited onboard water supply, subject to package terms
                and additional charges as applicable.
              </p>
              <h3>2.3 Service Duration</h3>
              <p>
                Estimated service durations shown on the Platform are indicative only and may
                vary based on vehicle size, condition, and the specific package selected.
              </p>
            </div>

            <div className="tc-divider" />

            <div id="booking" className="tc-section">
              <div className="tc-section-head">
                <div className="tc-section-icon">{sections[2].icon}</div>
                <div>
                  <div className="tc-section-num">Section 3</div>
                  <h2>Booking, Pricing &amp; Payment</h2>
                </div>
              </div>
              <p>
                All bookings made through our website or app are subject to availability and
                acceptance by Doorstep Car Wash. A booking is only confirmed once you receive a
                confirmation notification (via SMS, email, or in-app notification).
              </p>
              <h3>3.1 Pricing</h3>
              <p>
                Prices displayed on the Platform are in Indian Rupees (₹) and are inclusive of
                applicable taxes unless stated otherwise. Prices may vary based on vehicle type,
                selected package, add-on services, and location. We reserve the right to modify
                pricing at any time; however, changes will not affect bookings already
                confirmed.
              </p>
              <h3>3.2 Payment Methods</h3>
              <p>
                We accept payments via cash, UPI, debit/credit cards, and other digital payment
                methods as made available on the Platform from time to time. Payment for
                doorstep services is typically collected upon completion of the service, unless
                prepayment is explicitly required at the time of booking.
              </p>
              <h3>3.3 Additional Charges</h3>
              <ul>
                <li>Heavily soiled vehicles may attract additional charges, communicated before service commencement.</li>
                <li>Add-on services (e.g. interior shampoo, engine bay cleaning, ceramic coating) are charged separately as per the rate card.</li>
                <li>Waiting charges may apply if the technician is delayed access to the vehicle beyond a reasonable time.</li>
              </ul>
            </div>

            <div className="tc-divider" />

            <div id="cancellation" className="tc-section">
              <div className="tc-section-head">
                <div className="tc-section-icon">{sections[3].icon}</div>
                <div>
                  <div className="tc-section-num">Section 4</div>
                  <h2>Cancellation &amp; Refund Policy</h2>
                </div>
              </div>
              <p>
                You may cancel or reschedule a booking free of charge up to 2 hours before the
                scheduled service time through the Platform or by contacting our support team.
              </p>
              <h3>4.1 Late Cancellations</h3>
              <p>
                Cancellations made less than 2 hours before the scheduled slot, or if a
                technician is denied access at the location, may attract a cancellation fee to
                cover technician travel and time costs.
              </p>
              <h3>4.2 Refunds</h3>
              <p>
                Where a service is cancelled by Doorstep Car Wash due to technician
                unavailability, inclement weather, or any operational reason, a full refund will
                be processed to your original payment method within 5–7 business days. Refunds
                for prepaid services affected by customer-side cancellations will be governed by
                the cancellation window described above.
              </p>
              <div className="tc-note">
                <AlertTriangle size={16} />
                <span>
                  If you are dissatisfied with the quality of a completed service, please report
                  the issue within 24 hours via our support channels so we can investigate and
                  arrange a re-wash or resolution where applicable.
                </span>
              </div>
            </div>

            <div className="tc-divider" />

            <div id="responsibilities" className="tc-section">
              <div className="tc-section-head">
                <div className="tc-section-icon">{sections[4].icon}</div>
                <div>
                  <div className="tc-section-num">Section 5</div>
                  <h2>User Responsibilities</h2>
                </div>
              </div>
              <p>By booking a service, you agree to:</p>
              <ul>
                <li>Provide accurate vehicle, contact, and location details at the time of booking.</li>
                <li>Ensure the vehicle is accessible and safely parked at the scheduled time and location.</li>
                <li>Remove or secure valuables, personal belongings, and loose items from the vehicle prior to service.</li>
                <li>Disclose any pre-existing damage, scratches, dents, or mechanical issues before the service begins.</li>
                <li>Be present or ensure an authorised person is available to grant vehicle access and complete a handover inspection.</li>
                <li>Treat our technicians with courtesy and respect at all times.</li>
              </ul>
              <p>
                We are not responsible for the loss, theft, or damage of any personal items left
                inside or on the vehicle at the time of service.
              </p>
            </div>

            <div className="tc-divider" />

            <div id="liability" className="tc-section">
              <div className="tc-section-head">
                <div className="tc-section-icon">{sections[5].icon}</div>
                <div>
                  <div className="tc-section-num">Section 6</div>
                  <h2>Liability &amp; Damage Claims</h2>
                </div>
              </div>
              <p>
                While our technicians are trained to handle vehicles with care, in the rare
                event of accidental damage caused directly by our team during service delivery,
                please report the issue immediately at the time of service completion along with
                supporting photographic evidence.
              </p>
              <h3>6.1 Claim Process</h3>
              <p>
                Verified damage claims will be assessed by our internal quality team within 3–5
                business days. Approved claims will be resolved through repair, replacement, or
                a fair monetary settlement, at our sole discretion.
              </p>
              <h3>6.2 Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by applicable law, Doorstep Car Wash shall not
                be liable for pre-existing damage, wear and tear, damage arising from vehicle
                defects, or indirect, incidental, or consequential losses arising from the use of
                our Service. Our total liability for any claim shall not exceed the amount paid
                for the specific service in question.
              </p>
            </div>

            <div className="tc-divider" />

            <div id="conduct" className="tc-section">
              <div className="tc-section-head">
                <div className="tc-section-icon">{sections[6].icon}</div>
                <div>
                  <div className="tc-section-num">Section 7</div>
                  <h2>Prohibited Use &amp; Conduct</h2>
                </div>
              </div>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Platform for any unlawful, fraudulent, or abusive purpose.</li>
                <li>Provide false vehicle, identity, or location information.</li>
                <li>Harass, threaten, or behave inappropriately toward our staff or technicians.</li>
                <li>Attempt to interfere with, disrupt, or gain unauthorised access to our systems, servers, or networks.</li>
                <li>Copy, reproduce, or resell any part of our Service without prior written consent.</li>
              </ul>
              <p>
                We reserve the right to refuse service, cancel bookings, or suspend accounts that
                violate these conditions.
              </p>
            </div>

            <div className="tc-divider" />

            <div id="ip" className="tc-section">
              <div className="tc-section-head">
                <div className="tc-section-icon">{sections[7].icon}</div>
                <div>
                  <div className="tc-section-num">Section 8</div>
                  <h2>Intellectual Property</h2>
                </div>
              </div>
              <p>
                All content on the Platform, including but not limited to the Doorstep Car Wash
                name, logo, graphics, text, icons, and software, is the property of Doorstep Car
                Wash and is protected by applicable intellectual property laws. You may not
                reproduce, distribute, modify, or create derivative works from any part of the
                Platform without our prior written permission.
              </p>
            </div>

            <div className="tc-divider" />

            <div id="privacy" className="tc-section">
              <div className="tc-section-head">
                <div className="tc-section-icon">{sections[8].icon}</div>
                <div>
                  <div className="tc-section-num">Section 9</div>
                  <h2>Privacy &amp; Data Use</h2>
                </div>
              </div>
              <p>
                Your use of the Platform is also governed by our{" "}
                <a href="/user/privacy" style={{ color: "#2a7de1", fontWeight: 600 }}>
                  Privacy Policy
                </a>
                , which explains how we collect, use, store, and protect your personal
                information, including your name, contact details, address, and payment
                information, to provide and improve our Service.
              </p>
            </div>

            <div className="tc-divider" />

            <div id="termination" className="tc-section">
              <div className="tc-section-head">
                <div className="tc-section-icon">{sections[9].icon}</div>
                <div>
                  <div className="tc-section-num">Section 10</div>
                  <h2>Suspension &amp; Termination</h2>
                </div>
              </div>
              <p>
                We reserve the right to suspend or terminate your account and access to the
                Service, without prior notice, if we reasonably believe you have violated these
                Terms, engaged in fraudulent activity, or posed a risk to our staff, other
                users, or the integrity of our Platform.
              </p>
              <p>
                You may also request deletion of your account at any time through your account
                settings or by contacting our support team.
              </p>
            </div>

            <div className="tc-divider" />

            <div id="changes" className="tc-section">
              <div className="tc-section-head">
                <div className="tc-section-icon">{sections[10].icon}</div>
                <div>
                  <div className="tc-section-num">Section 11</div>
                  <h2>Changes to These Terms</h2>
                </div>
              </div>
              <p>
                We may update or revise these Terms from time to time to reflect changes in our
                services, business practices, or legal requirements. Material changes will be
                notified to you via the Platform or through your registered contact details. The
                "Last Updated" date at the top of this page indicates when these Terms were most
                recently revised. Continued use of the Service after changes take effect
                constitutes your acceptance of the revised Terms.
              </p>
            </div>

            <div className="tc-divider" />

            <div id="law" className="tc-section">
              <div className="tc-section-head">
                <div className="tc-section-icon">{sections[11].icon}</div>
                <div>
                  <div className="tc-section-num">Section 12</div>
                  <h2>Governing Law &amp; Jurisdiction</h2>
                </div>
              </div>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of
                India. Any disputes arising out of or in connection with these Terms or the use
                of our Service shall be subject to the exclusive jurisdiction of the competent
                courts located in Patna, Bihar, India.
              </p>
            </div>

          </div>

          {/* Contact box */}
          <div className="tc-contact-box">
            <h3>Questions About These Terms?</h3>
            <p>
              If anything in this policy is unclear, or you'd like to raise a concern, our
              support team is happy to help.
            </p>
            <div className="tc-contact-links">
              <a href="mailto:support@doorstepcarwash.com" className="tc-contact-link">
                <Mail size={15} /> support@doorstepcarwash.com
              </a>
              <a href="tel:+911234567890" className="tc-contact-link">
                <Phone size={15} /> +91 12345 67890
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}