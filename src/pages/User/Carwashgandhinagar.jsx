import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

/* Route:  <Route path="/car-wash-in-gandhinagar" element={<CarWashGandhinagar />} /> */

const SITE = "https://doorsstep.in"; // <- apna exact domain check kar lena
const PHONE = "+919898249789";

const packages = [
  { name: "Two Wheeler Wash", price: 299, desc: "Foam wash, chain and wheel cleaning, dry and shine for bikes and scooters." },
  { name: "Basic Car Wash", price: 399, desc: "Exterior foam wash, tyre cleaning and dry finish. Ideal for weekly upkeep." },
  { name: "Standard Car Wash", price: 499, desc: "Exterior wash plus interior vacuuming and dashboard wipe-down.", popular: true },
  { name: "Premium Car Wash", price: 799, desc: "Complete exterior and interior care with polish for a showroom shine." },
];

const areas = [
  "Sector 1 to 10", "Sector 11 to 20", "Sector 21 to 30", "Sector 7", "Sector 11", "Sector 16",
  "Sector 21", "Sector 24", "Sector 26", "Infocity", "GIFT City", "Kudasan", "Sargasan",
  "Raysan", "Randesan", "Koba", "Adalaj", "Pethapur", "Vavol", "Gandhinagar Capital Area",
];

const steps = [
  { t: "Book online", d: "Choose a package, pick a date and time slot, and enter your sector or society address." },
  { t: "We reach you", d: "Our verified team arrives at your home, apartment parking or office with all equipment." },
  { t: "Wash & detail", d: "Your vehicle is cleaned using water-efficient, car-safe products." },
  { t: "Pay & relax", d: "Check the finish, pay, and get your time back. No driving, no waiting." },
];

const why = [
  ["We come to you", "Sector houses, society parking, offices or campuses. No need to visit a service station."],
  ["Trained, verified staff", "Every team member is background-checked and trained in safe washing methods."],
  ["Water-efficient methods", "Foam and microfibre techniques use far less water than a traditional hose wash."],
  ["Clear, fixed pricing", "Prices start at ₹299 and are shown upfront. No hidden charges."],
  ["Cars, bikes and cycles", "One booking for every vehicle in your family."],
  ["Open 7 days", "Mon to Sun, 8:00 AM to 8:00 PM, including weekends and holidays."],
];

const faqs = [
  ["How much does a car wash cost in Gandhinagar?",
   "At Doorstep Car Wash, prices start at ₹299 for a two wheeler, ₹399 for a basic car wash, ₹499 for the standard wash and ₹799 for the premium wash."],
  ["Do you provide doorstep car wash in Gandhinagar?",
   "Yes. Our team comes to your home, apartment, office or any preferred location in Gandhinagar with all the equipment needed."],
  ["Which areas of Gandhinagar do you cover?",
   "We serve sectors across Gandhinagar along with Infocity, GIFT City, Kudasan, Sargasan, Raysan, Randesan, Koba, Adalaj and Pethapur. Call us to confirm your exact location."],
  ["Can you wash my car at my office or campus in Gandhinagar?",
   "Yes, if you have permission to park and use the space. Book a slot during working hours and our team will clean your car while you work."],
  ["Does Gandhinagar's tree cover affect my car?",
   "Yes. Gandhinagar is known as a green city, so cars parked under trees collect leaves, sap, pollen and bird droppings. These should be cleaned early to protect the paint."],
  ["Do I need to provide water or electricity?",
   "Our methods are water-efficient. A basic water source or access to parking helps. Tell us at booking if access is limited."],
  ["How long does a car wash take?",
   "A basic or standard wash usually takes 30 to 60 minutes depending on the package and the condition of the vehicle."],
  ["How often should I wash my car in Gandhinagar?",
   "Every 7 to 14 days works well. Wash sooner if your car is parked under trees, after rain, or after long highway drives."],
  ["Is doorstep car wash safe for my car's paint?",
   "Yes. We use pH-balanced car shampoo, clean microfibre cloths and a foam pre-wash that lifts dirt before touching the paint, which reduces swirl marks."],
  ["What is the difference between Basic, Standard and Premium?",
   "Basic covers exterior cleaning. Standard adds interior vacuuming and dashboard cleaning. Premium gives the most complete exterior and interior care with polish."],
  ["Do you wash bikes and scooters in Gandhinagar?",
   "Yes. Our two wheeler wash at ₹299 covers foam wash, wheel and chain cleaning, and a dry finish."],
  ["Can I book a regular weekly or monthly wash?",
   "Yes. Book online each time or call +91 98982 49789 to set up a regular schedule."],
  ["Are your timings flexible?",
   "We work every day from 8:00 AM to 8:00 PM. Choose the slot that suits you while booking."],
  ["What if I am not satisfied with the wash?",
   "Tell our team on the spot or call us right after. We will fix any missed area."],
  ["How can I track my booking?",
   "Use the Track Booking page on our website with your booking details to see its status."],
];

const styles = `
  .cw-page{font-family:'Inter','Segoe UI',Arial,sans-serif;color:#3a4a6a;background:#fff}
  .cw-wrap{max-width:1100px;margin:0 auto;padding:0 20px}
  .cw-sec{padding:76px 0}
  .cw-alt{background:#f5f8ff}
  .cw-h2{font-size:clamp(24px,4vw,36px);font-weight:800;color:#0f1f4b;margin:0 0 12px;letter-spacing:-.4px;line-height:1.2}
  .cw-lead{font-size:16px;line-height:1.8;max-width:760px;margin:0 0 36px}
  .cw-center{text-align:center}.cw-center .cw-lead{margin-left:auto;margin-right:auto}
  .cw-hero{background:linear-gradient(135deg,#0f1f4b 0%,#17357a 100%);color:#fff;padding:80px 0 90px}
  .cw-hero h1{font-size:clamp(30px,5.5vw,52px);font-weight:800;line-height:1.12;margin:0 0 18px;letter-spacing:-.8px;max-width:820px}
  .cw-hero p{font-size:17px;line-height:1.75;color:#cfdcf5;max-width:660px;margin:0 0 30px}
  .cw-btns{display:flex;flex-wrap:wrap;gap:12px}
  .cw-btn{display:inline-block;font-weight:700;font-size:15px;padding:14px 30px;border-radius:50px;text-decoration:none;transition:transform .2s,background .2s}
  .cw-btn:hover{transform:translateY(-2px)}
  .cw-btn-p{background:#2a7de1;color:#fff}.cw-btn-p:hover{background:#1f6bc9}
  .cw-btn-o{border:2px solid #fff;color:#fff}
  .cw-facts{display:flex;flex-wrap:wrap;gap:28px;margin-top:44px;padding-top:26px;border-top:1px solid rgba(255,255,255,.18)}
  .cw-facts div{font-size:13px;color:#a8c4e8}.cw-facts b{display:block;font-size:20px;color:#fff;margin-bottom:2px}
  .cw-crumb{font-size:13px;margin-bottom:18px;color:#a8c4e8}.cw-crumb a{color:#a8c4e8;text-decoration:none}
  .cw-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
  .cw-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .cw-card{background:#fff;border:1px solid #dfe7f6;border-radius:16px;padding:26px 22px;position:relative}
  .cw-card h3{font-size:17px;color:#0f1f4b;margin:0 0 8px;font-weight:700}
  .cw-card p{font-size:14px;line-height:1.65;margin:0}
  .cw-price{font-size:30px;font-weight:800;color:#0f1f4b;margin:6px 0 10px}
  .cw-pop{border:2px solid #2a7de1}
  .cw-tag{position:absolute;top:-12px;left:20px;background:#2a7de1;color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:50px}
  .cw-step{border-left:4px solid #2a7de1;background:#fff;border-radius:12px;padding:18px 20px}
  .cw-step h3{margin:0 0 6px;font-size:16px;color:#0f1f4b}.cw-step p{margin:0;font-size:14px;line-height:1.6}
  .cw-chips{display:flex;flex-wrap:wrap;gap:10px}
  .cw-chip{background:#fff;border:1px solid #cfdcf5;color:#0f1f4b;font-size:14px;font-weight:600;padding:8px 16px;border-radius:50px}
  .cw-text p{font-size:15.5px;line-height:1.85;max-width:820px;margin:0 0 16px}
  .cw-text strong{color:#0f1f4b}
  .cw-text h3{font-size:19px;color:#0f1f4b;margin:30px 0 10px;font-weight:700}
  .cw-text ul{max-width:820px;padding-left:20px;margin:0 0 16px}.cw-text li{font-size:15.5px;line-height:1.8;margin-bottom:6px}
  .cw-scroll{overflow-x:auto;max-width:900px}
  .cw-table{width:100%;border-collapse:collapse;font-size:14.5px;background:#fff;border-radius:12px;overflow:hidden}
  .cw-table th{background:#0f1f4b;color:#fff;text-align:left;padding:14px 16px}
  .cw-table td{padding:13px 16px;border-bottom:1px solid #e3eaf7;line-height:1.55}
  .cw-faq{max-width:820px;margin:0 auto}
  .cw-q{border:1px solid #dfe7f6;border-radius:12px;margin-bottom:12px;background:#fff;overflow:hidden}
  .cw-q button{all:unset;box-sizing:border-box;width:100%;cursor:pointer;padding:18px 20px;font-weight:700;color:#0f1f4b;font-size:15.5px;display:flex;justify-content:space-between;gap:16px}
  .cw-q button:focus-visible{outline:3px solid #2a7de1;outline-offset:-3px}
  .cw-a{padding:0 20px 18px;font-size:14.5px;line-height:1.75}
  .cw-cta{background:#0f1f4b;color:#fff;text-align:center;padding:70px 20px}
  .cw-cta h2{color:#fff;font-size:clamp(24px,4vw,34px);margin:0 0 12px;font-weight:800}
  .cw-cta p{color:#cfdcf5;margin:0 auto 26px;max-width:560px;line-height:1.7}
  @media(max-width:900px){.cw-grid4{grid-template-columns:repeat(2,1fr)}.cw-grid3{grid-template-columns:1fr 1fr}}
  @media(max-width:560px){.cw-sec{padding:54px 0}.cw-grid4,.cw-grid3{grid-template-columns:1fr}.cw-btn{width:100%;text-align:center;box-sizing:border-box}.cw-hero{padding:56px 0 64px}}
`;

const PAGE_PATH = "/car-wash-in-gandhinagar";
const PAGE_TITLE = "Car Wash in Gandhinagar | Doorstep Car & Bike Wash from ₹299 | Doorstep Car Wash";
const PAGE_DESC =
  "Book doorstep car wash in Gandhinagar from ₹299. Professional car, bike and cycle cleaning at your home or office in all sectors, Infocity, GIFT City, Kudasan, Sargasan & more. Open 8 AM to 8 PM.";

// Business-level LocalBusiness schema already lives in index.html,
// so here we only describe this page's service, breadcrumbs and FAQs.
const buildSchema = () => [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Doorstep Car Wash in Gandhinagar",
    serviceType: "Car wash at home",
    provider: { "@type": "LocalBusiness", name: "Doorstep Car Wash", url: SITE, telephone: PHONE },
    areaServed: { "@type": "City", name: "Gandhinagar" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Car Wash Packages",
      itemListElement: packages.map((p) => ({
        "@type": "Offer",
        priceCurrency: "INR",
        price: String(p.price),
        itemOffered: { "@type": "Service", name: p.name, description: p.desc },
      })),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Car Wash in Gandhinagar", item: `${SITE}${PAGE_PATH}` },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
];

export default function CarWashGandhinagar() {
  const [open, setOpen] = useState(0);

  return (
    <main className="cw-page">
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

      <header className="cw-hero">
        <div className="cw-wrap">
          <nav className="cw-crumb" aria-label="Breadcrumb">
            <a href="/">Home</a> / <a href="/car-wash-in-ahmedabad">Car Wash in Ahmedabad</a> / Gandhinagar
          </nav>
          <h1>Car Wash in Gandhinagar, Done at Your Doorstep</h1>
          <p>
            Looking for a reliable car wash in Gandhinagar? Doorstep Car Wash sends trained professionals to your
            house, apartment, office or campus to clean your car, bike or cycle. Packages start at ₹299.
          </p>
          <div className="cw-btns">
            <a className="cw-btn cw-btn-p" href="/packages">Book Now</a>
            <a className="cw-btn cw-btn-o" href={`tel:${PHONE}`}>Call +91 98982 49789</a>
          </div>
          <div className="cw-facts">
            <div><b>₹299</b>Starting price</div>
            <div><b>8 AM – 8 PM</b>Open all 7 days</div>
            <div><b>All sectors + Infocity, GIFT City</b>Service areas</div>
          </div>
        </div>
      </header>

      <section className="cw-sec" id="packages">
        <div className="cw-wrap cw-center">
          <h2 className="cw-h2">Car Wash Packages and Prices in Gandhinagar</h2>
          <p className="cw-lead">Simple, fixed pricing for every vehicle. Choose the package that fits your car.</p>
          <div className="cw-grid4" style={{ textAlign: "left" }}>
            {packages.map((p) => (
              <article key={p.name} className={`cw-card${p.popular ? " cw-pop" : ""}`}>
                {p.popular && <span className="cw-tag">Most popular</span>}
                <h3>{p.name}</h3>
                <div className="cw-price">₹{p.price}</div>
                <p>{p.desc}</p>
                <a href="/packages" style={{ display: "inline-block", marginTop: 14, color: "#2a7de1", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                  View details →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cw-sec cw-alt">
        <div className="cw-wrap cw-text">
          <h2 className="cw-h2">Why Gandhinagar Car Owners Choose a Doorstep Car Wash</h2>
          <p>
            Gandhinagar is a planned, green city with wide roads and tree-lined sectors. It is a lovely place to live,
            but it also means your car collects leaves, pollen, sap and bird droppings, along with the usual dust from
            construction and highway travel. <strong>A doorstep car wash in Gandhinagar</strong> saves you the trip to a
            service station: our team arrives at your <strong>sector home, apartment parking or office</strong> at the time
            you choose and finishes the job while you get on with your day.
          </p>
          <p>
            Many Gandhinagar residents commute daily to Ahmedabad, Infocity or GIFT City, or work in government offices
            in the capital complex. Between long drives and busy schedules, finding time to wash the car is hard. Booking
            a wash at your doorstep, or at your workplace during office hours, turns it into a task that takes you a minute.
          </p>
          <p>
            We use car-safe shampoos, microfibre cloths and water-efficient techniques, so your paint stays scratch-free
            and water is not wasted. We also offer <strong>bike wash and cycle wash at home</strong>, so every vehicle in
            your family is covered.
          </p>

          <h3>What is included in our car wash</h3>
          <ul>
            <li><strong>Foam pre-wash:</strong> loosens dust and grit so it can be rinsed off without scratching the paint.</li>
            <li><strong>Hand wash:</strong> body, bonnet, roof, doors and boot washed with clean microfibre mitts.</li>
            <li><strong>Wheel and tyre cleaning:</strong> brake dust and mud removed from rims and tyre walls.</li>
            <li><strong>Glass cleaning:</strong> streak-free windscreen, side windows and mirrors.</li>
            <li><strong>Dry and finish:</strong> soft microfibre drying to avoid water spots.</li>
            <li><strong>Interior vacuuming (Standard and Premium):</strong> seats, mats, carpets and boot cleaned of dust and crumbs.</li>
            <li><strong>Dashboard and door panel wipe (Standard and Premium):</strong> plastic and vinyl surfaces cleaned and refreshed.</li>
            <li><strong>Polish and shine (Premium):</strong> extra gloss for a deeper, showroom-style finish.</li>
          </ul>

          <h3>Cleaning cars parked under trees</h3>
          <p>
            Gandhinagar's many trees give welcome shade, but they also drop sticky sap, flowers, seeds and leaves, and attract
            birds. Sap and droppings are the two biggest paint threats because they harden in the sun and can leave marks
            on the clear coat. Our foam pre-wash softens these deposits before they are wiped away, and we pay extra attention
            to the roof, bonnet and windscreen where most of it lands.
          </p>

          <h3>Exterior car wash</h3>
          <p>
            A proper exterior wash is about more than looks. Layers of dirt act like sandpaper when wiped dry. Our foam-first
            method lifts dirt before any cloth touches the paint, which helps keep the surface smooth and glossy for longer.
          </p>

          <h3>Interior car cleaning and vacuuming</h3>
          <p>
            Dust enters through AC vents and open doors and settles on seats, carpets and the dashboard. A clean interior makes every drive
            more comfortable, reduces allergens and removes stale smells. With our Standard and Premium packages, our team vacuums seats,
            floor mats and boot space, and wipes the dashboard, centre console and door panels. If you have pet hair, spills
            or stains, tell us when booking.
          </p>

          <h3>Two wheeler and bike wash at home</h3>
          <p>
            Bikes and scooters collect mud and chain grime quickly. Our ₹299 two wheeler wash covers a foam wash, wheel and chain
            cleaning and a dry finish, which is a convenient way to keep your daily commuter neat.
          </p>

          <h3>Eco-friendly and water-efficient washing</h3>
          <p>
            A traditional hose wash can use a large amount of water. Our foam and microfibre techniques are designed to use far
            less, which suits sector houses and societies where water use is a concern. We also avoid harsh chemicals and use products
            made for automotive paint and trim.
          </p>
        </div>
      </section>

      <section className="cw-sec">
        <div className="cw-wrap cw-center">
          <h2 className="cw-h2">Why Book Doorstep Car Wash in Gandhinagar?</h2>
          <p className="cw-lead">Professional cleaning without the hassle of travelling.</p>
          <div className="cw-grid3" style={{ textAlign: "left" }}>
            {why.map(([t, d]) => (
              <div className="cw-card" key={t}><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="cw-sec cw-alt" id="how">
        <div className="cw-wrap">
          <h2 className="cw-h2">How Our Car Wash Service Works</h2>
          <p className="cw-lead">Four simple steps from booking to a clean car.</p>
          <div className="cw-grid4">
            {steps.map((s, i) => (
              <div className="cw-step" key={s.t}><h3>{i + 1}. {s.t}</h3><p>{s.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="cw-sec">
        <div className="cw-wrap">
          <h2 className="cw-h2">Doorstep Car Wash vs Visiting a Service Station</h2>
          <p className="cw-lead">See how a doorstep car wash in Gandhinagar compares with the usual routine.</p>
          <div className="cw-scroll">
            <table className="cw-table">
              <thead><tr><th>Feature</th><th>Doorstep Car Wash</th><th>Service station</th></tr></thead>
              <tbody>
                <tr><td>Travel time</td><td>None. We come to you.</td><td>Drive there and back</td></tr>
                <tr><td>Waiting</td><td>Book a time slot</td><td>Queues, especially on weekends</td></tr>
                <tr><td>Pricing</td><td>Fixed, shown upfront</td><td>Varies, add-ons at the counter</td></tr>
                <tr><td>Water use</td><td>Water-efficient foam method</td><td>Often a high-volume hose wash</td></tr>
                <tr><td>Your car's safety</td><td>Stays at your location</td><td>Handled and moved by staff</td></tr>
                <tr><td>Your time</td><td>Free for work or family</td><td>1 to 2 hours lost</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="cw-sec cw-alt">
        <div className="cw-wrap">
          <h2 className="cw-h2">Car Wash Service Areas in Gandhinagar</h2>
          <p className="cw-lead">
            We provide doorstep car washing across Gandhinagar. Not sure if we cover your location? Call us and we will confirm.
          </p>
          <div className="cw-chips">
            {areas.map((a) => <span className="cw-chip" key={a}>Car wash in {a}</span>)}
          </div>
        </div>
      </section>

      <section className="cw-sec">
        <div className="cw-wrap cw-text">
          <h2 className="cw-h2">Car Wash Near You in Gandhinagar</h2>
          <p>
            <strong>Gandhinagar sectors (Sector 1 to 30):</strong> Whether you live in a government quarter, a row house or
            an apartment, our team can wash your car outside your home. Sectors such as 7, 11, 16, 21, 24 and 26 are popular
            for regular weekly bookings.
          </p>
          <p>
            <strong>Infocity and GIFT City:</strong> If you work in these business districts, book a slot during office hours.
            Your car gets cleaned in the parking area while you work, so it is fresh for your evening commute.
          </p>
          <p>
            <strong>Kudasan, Sargasan, Raysan and Randesan:</strong> These fast-growing residential areas have many apartment
            complexes and townships. We serve society parking and bungalows alike.
          </p>
          <p>
            <strong>Koba, Adalaj and Pethapur:</strong> On the Ahmedabad–Gandhinagar corridor, we can reach your home for
            car, bike and cycle cleaning.
          </p>
          <p>
            Cannot see your area? Call <a href={`tel:${PHONE}`}>+91 98982 49789</a> and we will let you know if we can reach you.
            Also looking in Ahmedabad? See our <a href="/car-wash-in-ahmedabad">car wash in Ahmedabad</a> page.
          </p>
        </div>
      </section>

      <section className="cw-sec cw-alt">
        <div className="cw-wrap cw-text">
          <h2 className="cw-h2">Car Care Tips for Gandhinagar</h2>

          <h3>Summer (March to June)</h3>
          <p>
            Strong sun can fade paint and dry out dashboards and seats. Park in shade where possible, use a sunshade, and wash weekly
            so baked-on dust and sap do not harden.
          </p>

          <h3>Monsoon (July to September)</h3>
          <p>
            Rain brings mud, wet leaves and damp interiors. Wash the wheel arches and underbody often, dry door edges and keep
            floor mats clean to prevent musty smells.
          </p>

          <h3>Winter (November to February)</h3>
          <p>
            Morning dew and dusty air settle on paint. A fortnightly wash and wipe-down keeps the finish glossy, and a regular
            interior clean helps the AC and heater circulate cleaner air.
          </p>

          <h3>Simple habits that protect your car</h3>
          <ul>
            <li>Remove bird droppings and tree sap quickly, as they can mark the paint within hours.</li>
            <li>Never wipe a dusty car with a dry cloth, which can cause fine scratches.</li>
            <li>Vacuum mats and seats every two weeks.</li>
            <li>Check tyre pressure monthly, especially before highway trips.</li>
            <li>Choose a regular wash schedule so dirt never builds up.</li>
          </ul>
        </div>
      </section>

      <section className="cw-sec">
        <div className="cw-wrap">
          <h2 className="cw-h2 cw-center">Car Wash in Gandhinagar: Frequently Asked Questions</h2>
          <div className="cw-faq" style={{ marginTop: 32 }}>
            {faqs.map(([q, a], i) => (
              <div className="cw-q" key={q}>
                <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{q}</span><span aria-hidden="true">{open === i ? "−" : "+"}</span>
                </button>
                {open === i && <div className="cw-a">{a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cw-cta">
        <h2>Book Your Car Wash in Gandhinagar Today</h2>
        <p>Pick a package, choose your time and we will be at your doorstep. Open every day, 8:00 AM to 8:00 PM.</p>
        <div className="cw-btns" style={{ justifyContent: "center" }}>
          <a className="cw-btn cw-btn-p" href="/packages">Book Now</a>
          <a className="cw-btn cw-btn-o" href={`tel:${PHONE}`}>Call Us</a>
        </div>
      </section>
    </main>
  );
}