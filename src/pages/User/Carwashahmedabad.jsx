import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

/* ------------------------------------------------------------------
   Route suggestion:  /car-wash-in-ahmedabad
   <Route path="/car-wash-in-ahmedabad" element={<CarWashAhmedabad />} />
------------------------------------------------------------------- */

const SITE = "https://doorsstep.in"; // <- apna exact domain check kar lena
const PHONE = "+919898249789";

const packages = [
  { name: "Two Wheeler Wash", price: 299, desc: "Foam wash, chain & wheel cleaning, dry and shine for bikes and scooters." },
  { name: "Basic Car Wash", price: 399, desc: "Exterior foam wash, tyre cleaning and dry finish. Ideal for weekly upkeep." },
  { name: "Standard Car Wash", price: 499, desc: "Exterior wash plus interior vacuuming and dashboard wipe-down.", popular: true },
  { name: "Premium Car Wash", price: 799, desc: "Complete exterior and interior care with polish for a showroom shine." },
];

const areas = [
  "Satellite", "Bopal", "SG Highway", "Prahlad Nagar", "Vastrapur", "Thaltej",
  "Bodakdev", "Navrangpura", "Naranpura", "Ghatlodia", "Chandkheda", "Gota",
  "Naroda", "Narol", "Vatva", "Maninagar", "Vejalpur", "Ambawadi",
  "Paldi", "Science City", "South Bopal", "Shela", "Gandhinagar",
];

const steps = [
  { t: "Book online", d: "Choose a package, pick a date and time slot, and enter your address." },
  { t: "We reach you", d: "Our verified team arrives at your home, office or parking with all equipment." },
  { t: "Wash & detail", d: "Your vehicle is cleaned using water-efficient, car-safe products." },
  { t: "Pay & relax", d: "Check the finish, pay, and get your day back. No driving, no queues." },
];

const why = [
  ["We come to you", "Home, society parking, office or basement. No need to visit a service station."],
  ["Trained, verified staff", "Every team member is background-checked and trained in safe washing methods."],
  ["Water-efficient methods", "Foam and microfibre techniques use far less water than a traditional hose wash."],
  ["Clear, fixed pricing", "Prices start at ₹299 and are shown upfront. No hidden charges."],
  ["Cars, bikes and cycles", "One service for every vehicle in your household."],
  ["Open 7 days", "Mon to Sun, 8:00 AM to 8:00 PM, including weekends."],
];

const faqs = [
  ["How much does a car wash cost in Ahmedabad?",
   "At Doorstep Car Wash, prices start at ₹299 for a two wheeler, ₹399 for a basic car wash, ₹499 for the standard wash and ₹799 for the premium wash."],
  ["Do you provide doorstep car wash in Ahmedabad?",
   "Yes. Our team comes to your home, office or any preferred location across Ahmedabad and Gandhinagar with all the equipment needed."],
  ["Which areas of Ahmedabad do you cover?",
   "We serve areas including Satellite, Bopal, SG Highway, Prahlad Nagar, Vastrapur, Thaltej, Naroda, Narol, Maninagar and Gandhinagar. Call us to confirm your locality."],
  ["Do I need to provide water or electricity?",
   "Our methods are water-efficient. If you can share a basic water source or parking access, it helps. Tell us at booking if you have limited access."],
  ["How long does a car wash take?",
   "A basic or standard wash usually takes 30 to 60 minutes depending on the package and the condition of the vehicle."],
  ["How do I book a car wash online?",
   "Click Book Now, select your package, choose a time slot and enter your address. You can track your booking from the Track Booking page."],
  ["Are your timings flexible?",
   "We work every day from 8:00 AM to 8:00 PM. Pick the slot that suits you while booking."],
  ["How often should I wash my car in Ahmedabad?",
   "Once a week is ideal in dusty months (March to June) and every 10 to 14 days otherwise. Wash sooner if there are bird droppings or after rain, as both can stain paint."],
  ["Is doorstep car wash safe for my car's paint?",
   "Yes. We use pH-balanced car shampoo, clean microfibre cloths and a foam pre-wash that lifts dirt before touching the paint, which reduces swirl marks and scratches."],
  ["Can you clean my car in an apartment or society parking?",
   "Yes. Most of our bookings are in societies and apartment basements. We use minimal water and carry our own equipment, so it does not disturb neighbours."],
  ["What is the difference between the Basic, Standard and Premium wash?",
   "Basic covers exterior cleaning. Standard adds interior vacuuming and dashboard cleaning. Premium gives the most complete exterior and interior care with polish for extra shine."],
  ["Do you wash bikes and scooters?",
   "Yes. Our two wheeler wash at ₹299 covers foam wash, wheel and chain cleaning, and a dry finish for bikes and scooters."],
  ["Can I book a regular weekly or monthly wash?",
   "Yes. Book your slot online each time or call us on +91 98982 49789 to set up a regular schedule."],
  ["How do I pay?",
   "You can pay after the service is completed. Contact us for the payment options available at the time of booking."],
  ["What if I am not satisfied with the wash?",
   "Tell our team on the spot or call us right after. We will fix any missed area so you are happy with the result."],
  ["How can I track my booking?",
   "Use the Track Booking page on our website with your booking details to see its current status."],
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

const PAGE_PATH = "/car-wash-in-ahmedabad";
const PAGE_TITLE = "Car Wash in Ahmedabad | Doorstep Car & Bike Wash from ₹299 | Doorstep Car Wash";
const PAGE_DESC =
  "Book doorstep car wash in Ahmedabad from ₹299. Professional car, bike and cycle cleaning at your home or office in Satellite, Bopal, SG Highway, Naroda & more. Open 8 AM to 8 PM.";

// Business-level LocalBusiness schema already lives in index.html,
// so here we only describe this page's service, breadcrumbs and FAQs.
const buildSchema = () => [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Doorstep Car Wash in Ahmedabad",
    serviceType: "Car wash at home",
    provider: { "@type": "LocalBusiness", name: "Doorstep Car Wash", url: SITE, telephone: PHONE },
    areaServed: { "@type": "City", name: "Ahmedabad" },
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
      { "@type": "ListItem", position: 2, name: "Car Wash in Ahmedabad", item: `${SITE}${PAGE_PATH}` },
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

export default function CarWashAhmedabad() {
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

      {/* HERO */}
      <header className="cw-hero">
        <div className="cw-wrap">
          <nav className="cw-crumb" aria-label="Breadcrumb">
            <a href="/">Home</a> / Car Wash in Ahmedabad
          </nav>
          <h1>Car Wash in Ahmedabad, Done at Your Doorstep</h1>
          <p>
            Looking for a reliable car wash in Ahmedabad? Doorstep Car Wash sends trained professionals to your
            home, office or parking spot to clean your car, bike or cycle. Packages start at ₹299.
          </p>
          <div className="cw-btns">
            <a className="cw-btn cw-btn-p" href="/packages">Book Now</a>
            <a className="cw-btn cw-btn-o" href={`tel:${PHONE}`}>Call +91 98982 49789</a>
          </div>
          <div className="cw-facts">
            <div><b>₹299</b>Starting price</div>
            <div><b>8 AM – 8 PM</b>Open all 7 days</div>
            <div><b>Ahmedabad + Gandhinagar</b>Service areas</div>
          </div>
        </div>
      </header>

      {/* PACKAGES */}
      <section className="cw-sec" id="packages">
        <div className="cw-wrap cw-center">
          <h2 className="cw-h2">Car Wash Packages and Prices in Ahmedabad</h2>
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

      {/* LONG-FORM CONTENT */}
      <section className="cw-sec cw-alt">
        <div className="cw-wrap cw-text">
          <h2 className="cw-h2">Why Ahmedabad Car Owners Choose a Doorstep Car Wash</h2>
          <p>
            Ahmedabad's traffic, summer dust and monsoon mud are hard on any vehicle. Driving to a service station,
            waiting in a queue and driving back can take over an hour. <strong>A doorstep car wash in Ahmedabad</strong> removes
            that effort: our team arrives at your <strong>home, society parking or office</strong> at the time you choose and
            finishes the job while you carry on with your day.
          </p>
          <p>
            Dust, bird droppings, tree sap and road grime can dull paint if left for weeks. Regular cleaning protects the
            finish, keeps the interior fresh and helps your car hold its resale value. We use car-safe shampoos, microfibre
            cloths and water-efficient techniques, so your paint stays scratch-free and water is not wasted.
          </p>
          <p>
            Whether you live in Bopal, work on SG Highway, or stay in Naroda or Maninagar, our professionals can reach you.
            We also offer <strong>bike wash and cycle wash at home</strong>, so every vehicle in your family is covered by one
            booking platform.
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

          <h3>Exterior car wash in Ahmedabad</h3>
          <p>
            Your car's exterior faces sun, dust, pollution and rain every day. A proper exterior wash is not just about looks.
            Layers of dirt act like sandpaper when wiped dry, and acidic bird droppings can etch the clear coat within hours.
            Our foam-first method lifts the dirt before any cloth touches the paint, which helps keep the surface smooth and glossy for longer.
          </p>

          <h3>Interior car cleaning and vacuuming</h3>
          <p>
            Ahmedabad's dust enters through AC vents and open doors and settles on seats, carpets and the dashboard. A clean
            interior makes every drive more comfortable, reduces allergens and removes stale smells. With our Standard and
            Premium packages, our team vacuums seats, floor mats and boot space, and wipes the dashboard, centre console and
            door panels. If you have special concerns like pet hair, spills or stains, tell us when booking.
          </p>

          <h3>Two wheeler and bike wash at home</h3>
          <p>
            Bikes and scooters collect mud and chain grime quickly. Our ₹299 two wheeler wash covers a foam wash, wheel and
            chain cleaning and a dry finish. It is a convenient way to keep your daily commuter looking neat without taking
            it to a crowded wash point.
          </p>

          <h3>Eco-friendly and water-efficient washing</h3>
          <p>
            A traditional hose wash can use 100 litres of water or more. Our foam and microfibre techniques are designed to use
            far less water, which suits Ahmedabad societies where water use is a concern. We also avoid harsh chemicals and
            use products made for automotive paint and trim.
          </p>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="cw-sec">
        <div className="cw-wrap">
          <h2 className="cw-h2">Doorstep Car Wash vs Visiting a Service Station</h2>
          <p className="cw-lead">See how a doorstep car wash in Ahmedabad compares with the usual routine.</p>
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

      {/* CAR CARE TIPS */}
      <section className="cw-sec cw-alt">
        <div className="cw-wrap cw-text">
          <h2 className="cw-h2">Car Care Tips for Ahmedabad's Weather</h2>

          <h3>Summer (March to June)</h3>
          <p>
            Temperatures often cross 40°C, and strong sun can fade paint and dry out dashboards and seats. Park in shade or use a
            sunshade, and wash weekly so baked-on dust does not harden. Wipe the dashboard regularly to protect it from cracking.
          </p>

          <h3>Monsoon (July to September)</h3>
          <p>
            Rain brings mud, puddle splash and damp interiors. Wash the underbody and wheel arches often, dry the door edges and keep
            floor mats clean to prevent musty smells. A quick interior vacuum after wet weeks keeps the cabin fresh.
          </p>

          <h3>Winter (November to February)</h3>
          <p>
            Cooler weather means morning dew and dusty air. A fortnightly wash and wipe-down keeps paint glossy, and a regular
            interior clean helps the AC and heater circulate cleaner air.
          </p>

          <h3>Simple habits that protect your car</h3>
          <ul>
            <li>Remove bird droppings quickly, as they can mark the paint within hours.</li>
            <li>Never wipe a dusty car with a dry cloth, which can cause fine scratches.</li>
            <li>Vacuum mats and seats every two weeks.</li>
            <li>Keep tyres clean and check their pressure monthly.</li>
            <li>Choose a regular wash schedule so dirt never builds up.</li>
          </ul>
        </div>
      </section>

      {/* LOCAL CONTENT */}
      <section className="cw-sec">
        <div className="cw-wrap cw-text">
          <h2 className="cw-h2">Car Wash Near You in Ahmedabad</h2>
          <p>
            <strong>West Ahmedabad:</strong> If you live in Satellite, Bodakdev, Thaltej, Vastrapur, Prahlad Nagar or along SG Highway,
            our team can reach your apartment parking or office basement for a quick and tidy wash. Many customers here book regular
            weekly slots before work.
          </p>
          <p>
            <strong>South and East Ahmedabad:</strong> From Narol and Vatva to Maninagar and Paldi, we offer the same professional
            doorstep service, including bike wash for daily commuters.
          </p>
          <p>
            <strong>North Ahmedabad and Gandhinagar:</strong> Residents of Naroda, Chandkheda, Gota, Ghatlodia and Gandhinagar can
            book car, bike and cycle cleaning at their home or society.
          </p>
          <p>
            <strong>Bopal, South Bopal and Shela:</strong> Fast-growing residential areas with many townships. We serve apartment
            parking and bungalows alike.
          </p>
          <p>
            Cannot see your area? Call <a href={`tel:${PHONE}`}>+91 98982 49789</a> and we will let you know if we can reach you.
          </p>
        </div>
      </section>

      {/* WHY US */}
      <section className="cw-sec">
        <div className="cw-wrap cw-center">
          <h2 className="cw-h2">Why Book Doorstep Car Wash?</h2>
          <p className="cw-lead">Professional cleaning without the hassle of travelling.</p>
          <div className="cw-grid3" style={{ textAlign: "left" }}>
            {why.map(([t, d]) => (
              <div className="cw-card" key={t}><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
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

      {/* AREAS */}
      <section className="cw-sec">
        <div className="cw-wrap">
          <h2 className="cw-h2">Car Wash Service Areas in Ahmedabad and Gandhinagar</h2>
          <p className="cw-lead">
            We provide doorstep car washing across Ahmedabad and Gandhinagar. Not sure if we cover your locality? Call us
            and we will confirm.
          </p>
          <div className="cw-chips">
            {areas.map((a) => <span className="cw-chip" key={a}>Car wash in {a}</span>)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="cw-sec cw-alt">
        <div className="cw-wrap">
          <h2 className="cw-h2 cw-center">Car Wash in Ahmedabad: Frequently Asked Questions</h2>
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

      {/* CTA */}
      <section className="cw-cta">
        <h2>Book Your Car Wash in Ahmedabad Today</h2>
        <p>Pick a package, choose your time and we will be at your doorstep. Open every day, 8:00 AM to 8:00 PM.</p>
        <div className="cw-btns" style={{ justifyContent: "center" }}>
          <a className="cw-btn cw-btn-p" href="/packages">Book Now</a>
          <a className="cw-btn cw-btn-o" href={`tel:${PHONE}`}>Call Us</a>
        </div>
      </section>
    </main>
  );
}