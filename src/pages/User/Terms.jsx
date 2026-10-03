import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FileText, ShieldCheck, CreditCard, XCircle, AlertTriangle, Scale, Mail, Phone, MapPin } from "lucide-react";

const SITE = "https://doorsstep.in"; // <- apna exact domain check kar lena
const PAGE_PATH = "/term";
const PAGE_TITLE = "Terms & Conditions | Doorstep Car Wash";
const PAGE_DESC =
  "Read the Terms & Conditions for booking Doorstep Car Wash services in Ahmedabad and Gandhinagar, including pricing, payment, cancellation, refunds and liability.";
const LAST_UPDATED = "3 October 2026";
const LAST_UPDATED_ISO = "2026-10-03";
const PHONE_DISPLAY = "+91 9898249789";
const PHONE_TEL = "+919898249789";
const EMAIL = "doorstepcarwash99@gmail.com";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  .tc-page { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background: #f7f9fc; color: #33415c; padding-bottom: 60px; }

  /* Hero */
  .tc-hero { background: linear-gradient(135deg, #0f1f4b 0%, #1a3a7a 100%); padding: 64px 20px 56px; text-align: center; position: relative; overflow: hidden; }
  .tc-hero::before { content: ''; position: absolute; width: 300px; height: 300px; border-radius: 50%; background: #2a7de1; opacity: 0.12; top: -120px; right: -80px; }
  .tc-hero-eyebrow { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 3px; color: #5badff; text-transform: uppercase; margin-bottom: 12px; }
  .tc-hero h1 { font-size: clamp(26px, 5vw, 42px); font-weight: 800; color: #ffffff; margin: 0 0 12px; letter-spacing: -0.5px; }
  .tc-hero p { font-size: 14px; color: #a8c4e8; max-width: 560px; margin: 0 auto; line-height: 1.6; }
  .tc-hero-updated { display: inline-block; margin-top: 18px; font-size: 12px; font-weight: 600; color: #0f1f4b; background: #ffffff; padding: 6px 16px; border-radius: 50px; }

  /* Layout */
  .tc-container { max-width: 880px; margin: -30px auto 0; padding: 0 20px; position: relative; z-index: 2; }
  .tc-card { background: #ffffff; border-radius: 16px; box-shadow: 0 8px 30px rgba(15,31,75,0.08); padding: 32px 28px; margin-bottom: 20px; }
  .tc-crumb { max-width: 880px; margin: 0 auto; padding: 14px 20px 0; font-size: 12px; color: #a8c4e8; position: absolute; left: 0; right: 0; top: 0; }

  /* Table of contents */
  .tc-toc-title { font-size: 13px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #0f1f4b; margin: 0 0 14px; }
  .tc-toc-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; }
  .tc-toc-list a { font-size: 13px; color: #2a7de1; text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 6px; }
  .tc-toc-list a:hover { text-decoration: underline; }
  .tc-toc-num { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; border-radius: 5px; background: #eaf1ff; color: #2a7de1; font-size: 10px; font-weight: 800; flex-shrink: 0; }

  /* Section */
  .tc-section { scroll-margin-top: 90px; }
  .tc-section-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .tc-section-icon { width: 38px; height: 38px; border-radius: 10px; background: #eaf1ff; color: #2a7de1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .tc-section h2 { font-size: 19px; font-weight: 800; color: #0f1f4b; margin: 0; letter-spacing: -0.2px; }
  .tc-section-num { font-size: 12px; font-weight: 700; color: #8a9bc2; letter-spacing: 0.5px; }
  .tc-section p { font-size: 14px; line-height: 1.75; color: #526089; margin: 0 0 12px; }
  .tc-section h3 { font-size: 15px; font-weight: 700; color: #0f1f4b; margin: 18px 0 8px; }
  .tc-section ul { margin: 0 0 14px; padding-left: 20px; }
  .tc-section li { font-size: 14px; line-height: 1.7; color: #526089; margin-bottom: 6px; }
  .tc-section strong { color: #0f1f4b; }
  .tc-section a, .tc-link { color: #2a7de1; font-weight: 600; }
  .tc-divider { height: 1px; background: #eef1f8; margin: 28px 0; }

  /* Data table */
  .tc-table-wrap { overflow-x: auto; margin: 14px 0 18px; border: 1px solid #eef1f8; border-radius: 10px; }
  .tc-table { width: 100%; border-collapse: collapse; min-width: 480px; }
  .tc-table th { background: #f4f7fc; text-align: left; font-size: 11px; font-weight: 800; letter-spacing: 0.4px; text-transform: uppercase; color: #526089; padding: 10px 14px; border-bottom: 1px solid #eef1f8; }
  .tc-table td { font-size: 13px; color: #33415c; padding: 12px 14px; border-bottom: 1px solid #f4f7fc; line-height: 1.5; }
  .tc-table tr:last-child td { border-bottom: none; }

  .tc-note { background: #fff8ec; border: 1px solid #f5deac; border-radius: 10px; padding: 14px 16px; font-size: 13px; line-height: 1.6; color: #7a5c1e; display: flex; gap: 10px; margin: 14px 0; }
  .tc-note svg { flex-shrink: 0; margin-top: 2px; }

  /* Rights grid */
  .tc-rights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 14px 0 12px; }
  .tc-right-item { display: flex; gap: 10px; align-items: flex-start; background: #f7f9fc; border: 1px solid #eef1f8; border-radius: 10px; padding: 12px 14px; }
  .tc-right-icon { width: 26px; height: 26px; border-radius: 7px; background: #eaf1ff; color: #2a7de1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .tc-right-item strong { display: block; font-size: 13px; color: #0f1f4b; margin-bottom: 2px; }
  .tc-right-item span { font-size: 12.5px; color: #6b7ba0; line-height: 1.5; }

  /* Contact box */
  .tc-contact-box { background: linear-gradient(120deg, #0f1f4b 0%, #1a3a7a 100%); border-radius: 16px; padding: 28px; text-align: center; }
  .tc-contact-box h2 { color: #ffffff; font-size: 18px; font-weight: 800; margin: 0 0 8px; }
  .tc-contact-box p { color: #a8c4e8; font-size: 13px; margin: 0 0 18px; line-height: 1.6; }
  .tc-contact-links { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }
  .tc-contact-link { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 50px; transition: background 0.2s; }
  .tc-contact-link:hover { background: #2a7de1; }
  .tc-contact-link:focus-visible, .tc-toc-list a:focus-visible { outline: 3px solid #5badff; outline-offset: 2px; }

  @media (max-width: 640px) {
    .tc-hero { padding: 48px 16px 60px; }
    .tc-container { margin-top: -40px; padding: 0 14px; }
    .tc-card { padding: 22px 16px; border-radius: 14px; }
    .tc-toc-list { grid-template-columns: 1fr; }
    .tc-section h2 { font-size: 16px; }
    .tc-section-icon { width: 34px; height: 34px; }
    .tc-rights-grid { grid-template-columns: 1fr; }
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
      { "@type": "ListItem", position: 2, name: "Terms & Conditions", item: `${SITE}${PAGE_PATH}` },
    ],
  },
];

function Section({ idx, children }) {
  const s = sections[idx];
  return (
    <>
      {idx > 0 && <div className="tc-divider" />}
      <section id={s.id} className="tc-section" aria-labelledby={`${s.id}-h`}>
        <div className="tc-section-head">
          <div className="tc-section-icon" aria-hidden="true">{s.icon}</div>
          <div>
            <div className="tc-section-num">Section {idx + 1}</div>
            <h2 id={`${s.id}-h`}>{s.title}</h2>
          </div>
        </div>
        {children}
      </section>
    </>
  );
}

export default function TermsAndConditions() {
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
      <main className="tc-page">

        <header className="tc-hero">
          <span className="tc-hero-eyebrow">LEGAL</span>
          <h1>Terms &amp; Conditions</h1>
          <p>
            Please read these Terms &amp; Conditions carefully before booking a Doorstep Car Wash
            service. By booking, browsing, or using our website and mobile services, you agree to be
            bound by the terms outlined below.
          </p>
          <span className="tc-hero-updated">Last Updated: {LAST_UPDATED}</span>
        </header>

        <div className="tc-container">

          <nav className="tc-card" aria-label="Terms and conditions contents">
            <p className="tc-toc-title">On This Page</p>
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
          </nav>

          <div className="tc-card">

            <Section idx={0}>
              <p>
                These Terms and Conditions ("Terms") govern your access to and use of the Doorstep
                Car Wash website, mobile application, and related booking services (collectively,
                the "Platform" or "Service"). The Service is operated by Doorstep Car Wash ("we",
                "us", "our"), a doorstep vehicle cleaning service provider in Ahmedabad and
                Gandhinagar.
              </p>
              <p>
                By creating an account, making a booking, or otherwise using our Service, you
                confirm that you have read, understood, and agree to be legally bound by these
                Terms, along with our <Link to="/privacy">Privacy Policy</Link>. If you do not agree
                with any part of these Terms, you must not use our Platform or Services.
              </p>
              <p>
                You must be at least 18 years of age, or the age of legal majority in your
                jurisdiction, to create an account and book a service on our Platform. By using the
                Service, you represent and warrant that you meet this requirement.
              </p>
            </Section>

            <Section idx={1}>
              <p>
                Doorstep Car Wash provides on-demand, doorstep cleaning for cars, bikes and
                bicycles. Our packages include the Two Wheeler Wash, Basic Wash, Standard Wash and
                Premium Wash. Our trained professionals travel to a customer's specified location
                (home, society parking, office, or any other accessible address) and perform the
                selected service using professional-grade, car-safe cleaning products and equipment.
                See our <Link to="/packages">packages page</Link> for current details.
              </p>
              <h3>2.1 Service Availability</h3>
              <p>
                Service availability is subject to your location falling within our service area
                (currently Ahmedabad and Gandhinagar), team availability, weather conditions, and
                local regulations. We reserve the right to decline or reschedule a booking where
                these conditions are not met.
              </p>
              <h3>2.2 Water &amp; Power Access</h3>
              <p>
                Some packages may require access to a nearby water source and/or electrical outlet
                at the service location. Please tell us at the time of booking if access is limited,
                so we can plan accordingly.
              </p>
              <h3>2.3 Service Duration</h3>
              <p>
                Estimated service durations shown on the Platform are indicative only and may vary
                based on vehicle size, condition, and the package selected.
              </p>
            </Section>

            <Section idx={2}>
              <p>
                All bookings made through our website or app are subject to availability and
                acceptance by Doorstep Car Wash. A booking is confirmed only once you receive a
                confirmation (via SMS, email, or in-app notification).
              </p>
              <h3>3.1 Pricing</h3>
              <p>
                Prices displayed on the Platform are in Indian Rupees (₹) and are inclusive of
                applicable taxes unless stated otherwise. Prices may vary based on vehicle type,
                selected package, add-on services, and location. We may change prices at any time;
                changes will not affect bookings already confirmed.
              </p>
              <h3>3.2 Payment Methods</h3>
              <p>
                We accept the payment methods made available on the Platform from time to time.
                Payment for doorstep services is typically collected after completion of the
                service, unless prepayment is clearly required at the time of booking.
              </p>
              <h3>3.3 Additional Charges</h3>
              <ul>
                <li>Heavily soiled vehicles may attract additional charges, communicated before the service begins.</li>
                <li>Add-on services are charged separately as per the rate card.</li>
                <li>Waiting charges may apply if our team cannot access the vehicle for a reasonable period after arrival.</li>
              </ul>
            </Section>

            <Section idx={3}>
              <p>
                You may cancel or reschedule a booking free of charge up to 2 hours before the
                scheduled service time, through the Platform or by contacting our support team.
              </p>
              <h3>4.1 Late Cancellations</h3>
              <p>
                Cancellations made less than 2 hours before the scheduled slot, or cases where our
                team is denied access to the vehicle, may attract a cancellation fee to cover
                travel and time costs.
              </p>
              <h3>4.2 Refunds</h3>
              <p>
                Where a service is cancelled by Doorstep Car Wash due to team unavailability,
                inclement weather, or any operational reason, a full refund for any prepaid amount
                will be processed to your original payment method within 5 to 7 business days.
                Refunds for customer-side cancellations follow the cancellation window above.
              </p>
              <div className="tc-note">
                <AlertTriangle size={16} aria-hidden="true" />
                <span>
                  If you are not satisfied with a completed service, please report the issue within
                  24 hours through our support channels so we can investigate and arrange a re-wash
                  or other resolution where applicable.
                </span>
              </div>
            </Section>

            <Section idx={4}>
              <p>By booking a service, you agree to:</p>
              <ul>
                <li>Provide accurate vehicle, contact, and location details at the time of booking.</li>
                <li>Ensure the vehicle is accessible and safely parked at the scheduled time and location.</li>
                <li>Remove or secure valuables, personal belongings, and loose items from the vehicle before the service.</li>
                <li>Tell us about any existing damage, scratches, dents, or mechanical issues before the service begins.</li>
                <li>Be present, or ensure an authorised person is available, to give vehicle access and check the result after the wash.</li>
                <li>Treat our team with courtesy and respect at all times.</li>
              </ul>
              <p>
                We are not responsible for the loss, theft, or damage of any personal items left
                inside or on the vehicle at the time of service.
              </p>
            </Section>

            <Section idx={5}>
              <p>
                Our team is trained to handle vehicles with care. In the rare event of accidental
                damage caused directly by our team during service, please report it immediately at
                the time of service completion, along with supporting photographs.
              </p>
              <h3>6.1 Claim Process</h3>
              <p>
                Verified damage claims will be assessed by our team within 3 to 5 business days.
                Approved claims will be resolved through repair, replacement, or a fair monetary
                settlement, at our discretion.
              </p>
              <h3>6.2 Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by applicable law, Doorstep Car Wash is not liable
                for pre-existing damage, normal wear and tear, damage arising from vehicle defects,
                or indirect, incidental, or consequential losses arising from use of our Service.
                Our total liability for any claim shall not exceed the amount paid for the specific
                service in question.
              </p>
            </Section>

            <Section idx={6}>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Platform for any unlawful, fraudulent, or abusive purpose.</li>
                <li>Provide false vehicle, identity, or location information.</li>
                <li>Harass, threaten, or behave inappropriately toward our staff.</li>
                <li>Attempt to interfere with, disrupt, or gain unauthorised access to our systems, servers, or networks.</li>
                <li>Copy, reproduce, or resell any part of our Service without prior written consent.</li>
              </ul>
              <p>
                We may refuse service, cancel bookings, or suspend accounts that violate these
                conditions.
              </p>
            </Section>

            <Section idx={7}>
              <p>
                All content on the Platform, including the Doorstep Car Wash name, logo, graphics,
                text, icons, and software, is the property of Doorstep Car Wash and is protected by
                applicable intellectual property laws. You may not reproduce, distribute, modify, or
                create derivative works from any part of the Platform without our prior written
                permission.
              </p>
            </Section>

            <Section idx={8}>
              <p>
                Your use of the Platform is also governed by our{" "}
                <Link to="/privacy">Privacy Policy</Link>, which explains how we collect, use,
                store, and protect your personal information, including your name, contact details,
                address, and payment-related information, to provide and improve our Service.
              </p>
            </Section>

            <Section idx={9}>
              <p>
                We may suspend or terminate your account and access to the Service, without prior
                notice, if we reasonably believe you have violated these Terms, engaged in
                fraudulent activity, or posed a risk to our staff, other users, or the integrity of
                our Platform.
              </p>
              <p>
                You may also request deletion of your account at any time through our{" "}
                <Link to="/user/deleteaccount">Delete Account</Link> page or by contacting our
                support team.
              </p>
            </Section>

            <Section idx={10}>
              <p>
                We may update these Terms from time to time to reflect changes in our services,
                business practices, or legal requirements. Material changes will be notified through
                the Platform or your registered contact details. The "Last Updated" date at the top
                of this page shows when these Terms were most recently revised. Continued use of the
                Service after changes take effect means you accept the revised Terms.
              </p>
            </Section>

            <Section idx={11}>
              <p>
                These Terms are governed by and construed in accordance with the laws of India. Any
                disputes arising out of or in connection with these Terms or the use of our Service
                are subject to the exclusive jurisdiction of the competent courts in Ahmedabad,
                Gujarat, India.
              </p>
            </Section>

          </div>

          <aside className="tc-contact-box" aria-label="Contact us about these terms">
            <h2>Questions About These Terms?</h2>
            <p>
              If anything here is unclear, or you would like to raise a concern, our support team is
              happy to help. We are open Mon to Sun, 8:00 AM to 8:00 PM.
            </p>
            <div className="tc-contact-links">
              <a href={`mailto:${EMAIL}`} className="tc-contact-link">
                <Mail size={15} aria-hidden="true" /> {EMAIL}
              </a>
              <a href={`tel:${PHONE_TEL}`} className="tc-contact-link">
                <Phone size={15} aria-hidden="true" /> {PHONE_DISPLAY}
              </a>
              <a
                href="https://maps.google.com/?q=Door+Step+Car+Wash,Narol,Ahmedabad,Gujarat,382405"
                target="_blank"
                rel="noopener noreferrer"
                className="tc-contact-link"
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