import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Navigation,
  Car,
  Calendar,
  Clock,
  Plus,
  Check,
  X,
  ChevronDown,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Package,
  FileText,
} from "lucide-react";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

// ── Time slots (value = jo DB mein save hoga, startHour = 24h format) ──
const TIME_SLOTS = [
  { value: "09 AM - 11 AM", startHour: 9 },
  { value: "11 AM - 01 PM", startHour: 11 },
  { value: "01 PM - 03 PM", startHour: 13 },
  { value: "03 PM - 05 PM", startHour: 15 },
  { value: "05 PM - 07 PM", startHour: 17 },
  { value: "07 PM - 09 PM", startHour: 19 },
];

const getToday = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

// Agar booking date aaj ki hai, to jo slot start ho chuka hai wo disabled
const isSlotPast = (slot, date) => {
  if (!date || date !== getToday()) return false;
  return slot.startHour <= new Date().getHours();
};

const blank = {
  customerName: "",
  customerNumber: "",
  email: "",
  cityId: "",
  addressType: "full_address",
  fullAddress: "",
  latitude: null,
  longitude: null,
  locationLabel: "",
  locationLocality: "",
  packageId: null,
  carTypeId: "",
  bookingDate: "",
  bookingTime: "",
  addonIds: [],
  notes: "",
};

function LocationMapPreview({ latitude, longitude, locality, label, onClear }) {
  if (!latitude || !longitude) return null;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.005},${latitude - 0.004},${longitude + 0.005},${latitude + 0.004}&layer=mapnik&marker=${latitude},${longitude}`;
  const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
  return (
    <div style={s.locCard}>
      <div style={s.locMapWrap}>
        <iframe src={mapUrl} title="Your location" style={s.locMap} scrolling="no" />
        <div style={s.locPinWrap}>
          <MapPin size={32} color="#e53e3e" fill="#e53e3e" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
        </div>
      </div>
      <div style={s.locInfo}>
        <div style={s.locIconWrap}><MapPin size={18} color="#1a3c8f" /></div>
        <div style={s.locText}>
          <p style={s.locLocality}>{locality || "Your current location"}</p>
          <p style={s.locCoords}>{label || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`}</p>
          <a href={mapsLink} target="_blank" rel="noopener noreferrer" style={s.locOpen}>Open in Maps →</a>
        </div>
        <button style={s.locClear} onClick={onClear} title="Remove location"><X size={14} /></button>
      </div>
    </div>
  );
}

function SectionHead({ icon: Icon, title, done }) {
  return (
    <div style={s.secHead}>
      <div style={{ ...s.secIcon, ...(done ? s.secIconDone : {}) }}>
        {done ? <Check size={14} strokeWidth={3} /> : <Icon size={14} />}
      </div>
      <span style={s.secTitle}>{title}</span>
      {done && <span style={s.secDonePill}>Complete</span>}
    </div>
  );
}

function Field({ label, required, optional, hint, error, children }) {
  return (
    <div style={s.field}>
      <label style={s.label}>
        {label}
        {required && <span style={s.req}> *</span>}
        {optional && <span style={s.opt}> (optional)</span>}
      </label>
      {children}
      {hint && !error && <span style={s.hint}>{hint}</span>}
      {error && (
        <span style={s.errMsg} data-err>
          <AlertCircle size={12} style={{ flexShrink: 0 }} /> {error}
        </span>
      )}
    </div>
  );
}

export default function BookingForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const preselectedPkg = location.state?.selectedPackage || null;

  const [form, setForm] = useState({ ...blank, packageId: preselectedPkg?.id || null });
  const [pkgDetails, setPkgDetails] = useState(null);
  const [pkgLoading, setPkgLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [carTypes, setCarTypes] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");
  const [submitting, setSub] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [addonOpen, setAddonOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [c, t, a] = await Promise.all([
          fetch(`${API_BASE}/service-cities/active`).then((r) => r.json()),
          fetch(`${API_BASE}/car-types/active`).then((r) => r.json()),
          fetch(`${API_BASE}/addons/active`).then((r) => r.json()),
        ]);
        if (c.success) setCities(c.data);
        if (t.success) setCarTypes(t.data);
        if (a.success) setAddons(a.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!preselectedPkg?.id) return;
    setPkgLoading(true);
    fetch(`${API_BASE}/packages/user/${preselectedPkg.id}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setPkgDetails(d.data); })
      .catch(() => {})
      .finally(() => setPkgLoading(false));
  }, [preselectedPkg?.id]);

  const pkg = pkgDetails || preselectedPkg;
  const pkgPrice = pkg ? Number(pkg.price) : 0;

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  // Date change hone par agar selected slot ab past ho gaya to clear kar do
  const handleDateChange = (date) => {
    setForm((p) => {
      const slot = TIME_SLOTS.find((t) => t.value === p.bookingTime);
      const clearTime = slot && isSlotPast(slot, date);
      return { ...p, bookingDate: date, bookingTime: clearTime ? "" : p.bookingTime };
    });
    setErrors((p) => ({ ...p, bookingDate: undefined }));
  };

  const toggleAddon = (id) =>
    setForm((p) => ({
      ...p,
      addonIds: p.addonIds.includes(id)
        ? p.addonIds.filter((a) => a !== id)
        : [...p.addonIds, id],
    }));

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Your browser doesn't support location sharing.");
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        set("latitude", latitude);
        set("longitude", longitude);
        setErrors((p) => ({ ...p, location: undefined }));
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const d = await r.json();
          const a = d.address || {};
          const locality = [
            a.suburb || a.neighbourhood || a.village || a.town,
            a.city || a.county,
          ].filter(Boolean).join(", ");
          const shortLabel = [a.road, a.suburb || a.neighbourhood, a.city || a.town, a.postcode]
            .filter(Boolean).join(", ");
          set("locationLocality", locality || d.display_name?.split(",")[0] || "Current Location");
          set("locationLabel", shortLabel || d.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        } catch {
          set("locationLocality", "Current Location");
          set("locationLabel", `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) setLocError("Location access denied. Please allow location permission.");
        else if (err.code === 2) setLocError("Location unavailable. Try manual address.");
        else setLocError("Location request timed out. Please try again.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const clearLocation = () => {
    set("latitude", null);
    set("longitude", null);
    set("locationLabel", "");
    set("locationLocality", "");
  };

  const selectedCar = carTypes.find((c) => String(c.id) === String(form.carTypeId));
  const selectedAddons = addons.filter((a) => form.addonIds.includes(a.id));

  const validate = () => {
    const e = {};
    if (!form.customerName.trim())                                       e.customerName   = "Full name is required";
    if (!/^[0-9+\-\s]{7,15}$/.test(form.customerNumber.trim()))         e.customerNumber = "Enter a valid mobile number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))  e.email          = "Enter a valid email address";
    if (!form.cityId)                                                    e.cityId         = "Please select your city";
    if (form.addressType === "full_address" && !form.fullAddress.trim()) e.fullAddress    = "Please enter your address";
    if (form.addressType === "current_location" && !form.latitude)       e.location       = "Please capture your location first";
    if (!form.carTypeId)                                                 e.carTypeId      = "Please select your car type";
    if (!form.bookingDate)                                               e.bookingDate    = "Please select a date";
    if (!form.bookingTime)                                               e.bookingTime    = "Please select a time slot";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      document.querySelector("[data-err]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSub(true);
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName:   form.customerName,
          customerNumber: form.customerNumber,
          email:          form.email || undefined,
          cityId:         form.cityId,
          packageId:      form.packageId || undefined,
          addressType:    form.addressType,
          fullAddress:    form.addressType === "full_address" ? form.fullAddress : undefined,
          latitude:       form.addressType === "current_location" ? form.latitude  : undefined,
          longitude:      form.addressType === "current_location" ? form.longitude : undefined,
          carTypeId:      form.carTypeId,
          bookingDate:    form.bookingDate,
          bookingTime:    form.bookingTime,
          addonIds:       form.addonIds,
          notes:          form.notes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrors((p) => ({ ...p, _server: data.message || "Booking failed. Please try again." }));
      }
    } catch {
      setErrors((p) => ({ ...p, _server: "Unable to connect. Check your internet and try again." }));
    } finally {
      setSub(false);
    }
  };

  const today = getToday();
  const sec1Done = !!(form.customerName && form.customerNumber);
  const sec2Done = !!(form.cityId && (form.addressType === "full_address" ? form.fullAddress : form.latitude));
  const sec3Done = !!form.carTypeId;
  const sec4Done = !!(form.bookingDate && form.bookingTime);

  const addonTotal = selectedAddons.reduce((s, a) => s + Number(a.price), 0);
  const total = pkgPrice + addonTotal;

  if (submitted) {
    return (
      <div style={s.wrap}>
        <style>{cssRaw}</style>
        <div style={s.page}>
          <div style={s.successCard}>
            <div style={s.successIconWrap}>
              <CheckCircle2 size={56} color="#1a7f4b" />
            </div>
            <h2 style={s.successTitle}>Booking Confirmed!</h2>
            <p style={s.successMsg}>
              Thank you, <strong>{form.customerName || "there"}</strong>! Your booking has been received.
              Our team will contact you at <strong>{form.customerNumber}</strong> to confirm the slot.
            </p>
            {pkg && (
              <div style={s.successPkg}>
                <div style={s.successPkgLeft}>
                  <Package size={16} color="#1a3c8f" />
                  <span style={s.successPkgName}>{pkg.name}</span>
                </div>
                <span style={s.successPkgPrice}>₹{pkgPrice.toFixed(0)}</span>
              </div>
            )}
            <button className="btn-primary" style={s.successBtn} onClick={() => navigate(-2)}>
              <ArrowLeft size={16} /> Browse More Packages
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.wrap}>
      <style>{cssRaw}</style>

      <div style={s.page}>
        <button className="back-btn" onClick={() => navigate(-1)} style={s.backBtn}>
          <ArrowLeft size={16} /> Back to Packages
        </button>

        {pkg && (
          <div style={s.pkgBanner}>
            {pkgLoading ? (
              <div style={s.pkgLoading}>
                <Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} color="#1a3c8f" />
                <span style={{ fontSize: 13, color: "#6b7280" }}>Loading package details…</span>
              </div>
            ) : (
              <>
                <div style={s.pkgBannerTop}>
                  <div style={s.pkgIconBox}>
                    <Package size={22} color="#1a3c8f" />
                  </div>
                  <div style={s.pkgBannerBody}>
                    <span style={s.pkgBadge}>Selected Package</span>
                    <h3 style={s.pkgName}>{pkg.name}</h3>
                    {pkg.description && <p style={s.pkgDesc}>{pkg.description}</p>}
                  </div>
                  <div style={s.pkgPriceBox}>
                    <span style={s.pkgPriceLabel}>Price</span>
                    <span style={s.pkgPriceVal}>₹{pkgPrice.toFixed(0)}</span>
                  </div>
                </div>
                {pkg.features?.length > 0 && (
                  <div style={s.pkgFeats}>
                    {pkg.features.slice(0, 6).map((f, i) => (
                      <span key={i} style={s.pkgFeatPill}>
                        <Check size={11} strokeWidth={3} color="#1a7f4b" /> {f}
                      </span>
                    ))}
                    {pkg.features.length > 6 && (
                      <span style={{ ...s.pkgFeatPill, background: "#eef3ff", color: "#1a3c8f" }}>
                        +{pkg.features.length - 6} more
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <form style={s.card} onSubmit={handleSubmit} noValidate>
          <div style={s.formHeader}>
            <h2 style={s.formTitle}>{pkg ? "Complete Your Booking" : "Book a Car Wash"}</h2>
            <p style={s.formSubtitle}>Fill in your details — we'll come right to your doorstep.</p>
          </div>

          {errors._server && (
            <div style={s.alertErr}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              {errors._server}
            </div>
          )}

          {loading ? (
            <div style={s.loadingState}>
              <Loader2 size={22} style={{ animation: "spin 0.8s linear infinite" }} color="#1a3c8f" />
              <span>Loading options…</span>
            </div>
          ) : (
            <>
              {/* SECTION 1 — Contact */}
              <SectionHead icon={User} title="Contact Details" done={sec1Done} />

              <div style={s.row}>
                <Field label="Full Name" required error={errors.customerName}>
                  <div style={s.inputWrap}>
                    <User size={15} color="#9ca3af" style={s.inputIcon} />
                    <input
                      className={`bkf-input${errors.customerName ? " err" : ""}`}
                      style={s.inputWithIcon}
                      type="text"
                      value={form.customerName}
                      onChange={(e) => set("customerName", e.target.value)}
                      placeholder="Rahul Sharma"
                      autoComplete="name"
                    />
                  </div>
                </Field>

                <Field label="Mobile Number" required error={errors.customerNumber}>
                  <div style={s.inputWrap}>
                    <span style={s.prefix}>+91</span>
                    <input
                      className={`bkf-input prefixed${errors.customerNumber ? " err" : ""}`}
                      style={s.inputPrefixed}
                      type="tel"
                      value={form.customerNumber}
                      onChange={(e) => set("customerNumber", e.target.value)}
                      placeholder="9876543210"
                      autoComplete="tel"
                      maxLength={10}
                    />
                  </div>
                </Field>
              </div>

              <Field label="Email Address" optional hint="Booking confirmation will be sent here" error={errors.email}>
                <div style={s.inputWrap}>
                  <Mail size={15} color="#9ca3af" style={s.inputIcon} />
                  <input
                    className={`bkf-input${errors.email ? " err" : ""}`}
                    style={s.inputWithIcon}
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </Field>

              <div style={s.divider} />

              {/* SECTION 2 — Location */}
              <SectionHead icon={MapPin} title="Service Location" done={sec2Done} />

              <Field label="District / City" required error={errors.cityId}>
                <div style={s.selectWrap}>
                  <MapPin size={15} color="#9ca3af" style={s.inputIcon} />
                  <select
                    className={`bkf-select${errors.cityId ? " err" : ""}`}
                    style={s.select}
                    value={form.cityId}
                    onChange={(e) => set("cityId", e.target.value)}
                  >
                    <option value="">Select your city</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} color="#9ca3af" style={s.selectArrow} />
                </div>
              </Field>

              <Field label="Service Address" required error={errors.fullAddress || errors.location}>
                <div style={s.addrToggle}>
                  <button
                    type="button"
                    className={`addr-tab${form.addressType === "full_address" ? " active" : ""}`}
                    onClick={() => set("addressType", "full_address")}
                  >
                    <FileText size={13} /> Type Address
                  </button>
                  <button
                    type="button"
                    className={`addr-tab${form.addressType === "current_location" ? " active" : ""}`}
                    onClick={() => set("addressType", "current_location")}
                  >
                    <Navigation size={13} /> Use My Location
                  </button>
                </div>

                {form.addressType === "full_address" ? (
                  <textarea
                    className={`bkf-textarea${errors.fullAddress ? " err" : ""}`}
                    rows={3}
                    value={form.fullAddress}
                    onChange={(e) => set("fullAddress", e.target.value)}
                    placeholder="House / Flat No., Street, Landmark, Pincode"
                  />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {!form.latitude ? (
                      <div style={s.locPrompt}>
                        <div style={s.locPromptIcon}>
                          <Navigation size={22} color="#1a3c8f" />
                        </div>
                        <div style={s.locPromptText}>
                          <strong style={{ fontSize: 13, color: "#0f2454" }}>Share your current location</strong>
                          <span style={{ fontSize: 12, color: "#6b7280" }}>We'll pinpoint your exact address</span>
                        </div>
                        <button
                          type="button"
                          className="btn-primary"
                          style={s.locBtn}
                          onClick={captureLocation}
                          disabled={locating}
                        >
                          {locating ? (
                            <><Loader2 size={14} style={{ animation: "spin 0.7s linear infinite" }} /> Locating…</>
                          ) : (
                            <><Navigation size={14} /> Share Location</>
                          )}
                        </button>
                      </div>
                    ) : (
                      <LocationMapPreview
                        latitude={form.latitude}
                        longitude={form.longitude}
                        locality={form.locationLocality}
                        label={form.locationLabel}
                        onClear={clearLocation}
                      />
                    )}
                    {locError && (
                      <div style={s.locErrBox}>
                        <AlertCircle size={14} style={{ flexShrink: 0 }} /> {locError}
                      </div>
                    )}
                  </div>
                )}
              </Field>

              <div style={s.divider} />

              {/* SECTION 3 — Car Type */}
              <SectionHead icon={Car} title="Your Car" done={sec3Done} />

              <Field label="Car Type" required error={errors.carTypeId}>
                <div style={s.selectWrap}>
                  <Car size={15} color="#9ca3af" style={s.inputIcon} />
                  <select
                    className={`bkf-select${errors.carTypeId ? " err" : ""}`}
                    style={s.select}
                    value={form.carTypeId}
                    onChange={(e) => set("carTypeId", e.target.value)}
                  >
                    <option value="">Select your car type</option>
                    {carTypes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} color="#9ca3af" style={s.selectArrow} />
                </div>
              </Field>

              <div style={s.divider} />

              {/* SECTION 4 — Date & Time */}
              <SectionHead icon={Calendar} title="Date & Time" done={sec4Done} />

              <Field label="Booking Date" required error={errors.bookingDate}>
                <div style={s.inputWrap}>
                  <Calendar size={15} color="#9ca3af" style={s.inputIcon} />
                  <input
                    className={`bkf-input${errors.bookingDate ? " err" : ""}`}
                    style={s.inputWithIcon}
                    type="date"
                    min={today}
                    value={form.bookingDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                  />
                </div>
              </Field>

              <Field label="Preferred Time" required error={errors.bookingTime}>
                <div style={s.slotGrid}>
                  {TIME_SLOTS.map((slot) => {
                    const past = isSlotPast(slot, form.bookingDate);
                    const active = form.bookingTime === slot.value;
                    return (
                      <button
                        key={slot.value}
                        type="button"
                        disabled={past}
                        className={`slot-pill${active ? " active" : ""}${errors.bookingTime ? " err" : ""}`}
                        onClick={() => set("bookingTime", slot.value)}
                      >
                        {slot.value}
                      </button>
                    );
                  })}
                </div>
                {form.bookingDate === today && (
                  <span style={s.hint}>Aaj ke liye jo slots nikal chuke hain wo disabled hain.</span>
                )}
              </Field>

              <div style={s.divider} />

              {/* SECTION 5 — Add-ons */}
              {addons.length > 0 && (
                <>
                  <SectionHead icon={Sparkles} title="Add-on Services" done={false} />
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: -12, marginBottom: 14 }}>
                    Enhance your wash with optional services
                  </p>

                  <Field label="Select Add-ons" optional>
                    <button
                      type="button"
                      style={addonOpen ? { ...s.addonTrigger, ...s.addonTriggerOpen } : s.addonTrigger}
                      onClick={() => setAddonOpen((o) => !o)}
                    >
                      <Sparkles size={15} color="#9ca3af" style={{ flexShrink: 0 }} />
                      <span style={s.addonTriggerText}>
                        {form.addonIds.length === 0
                          ? "Choose add-on services"
                          : `${form.addonIds.length} add-on${form.addonIds.length > 1 ? "s" : ""} selected`}
                      </span>
                      {form.addonIds.length > 0 && (
                        <span style={s.addonCountBadge}>{form.addonIds.length}</span>
                      )}
                      <ChevronDown
                        size={15}
                        color="#9ca3af"
                        style={{
                          flexShrink: 0,
                          marginLeft: "auto",
                          transition: "transform 0.2s",
                          transform: addonOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </button>

                    {addonOpen && (
                      <div style={s.addonPanel}>
                        {addons.map((a) => {
                          const checked = form.addonIds.includes(a.id);
                          return (
                            <label
                              key={a.id}
                              style={checked ? { ...s.addonRow, ...s.addonRowChecked } : s.addonRow}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleAddon(a.id)}
                                style={{ display: "none" }}
                              />
                              <div style={checked ? { ...s.addonRowCheck, ...s.addonRowCheckDone } : s.addonRowCheck}>
                                {checked
                                  ? <Check size={11} strokeWidth={3} color="#fff" />
                                  : <Plus size={11} color="#9ca3af" />}
                              </div>
                              <div style={s.addonRowInfo}>
                                <span style={s.addonRowName}>{a.name}</span>
                                {a.description && (
                                  <span style={s.addonRowDesc}>{a.description}</span>
                                )}
                              </div>
                              <span style={s.addonRowPrice}>+₹{Number(a.price).toFixed(0)}</span>
                            </label>
                          );
                        })}

                        <div style={s.addonPanelFooter}>
                          <button
                            type="button"
                            className="btn-primary"
                            style={s.addonDoneBtn}
                            onClick={() => setAddonOpen(false)}
                          >
                            <Check size={14} strokeWidth={3} />
                            {form.addonIds.length === 0
                              ? "Skip Add-ons"
                              : `Confirm ${form.addonIds.length} Add-on${form.addonIds.length > 1 ? "s" : ""}`}
                          </button>
                        </div>
                      </div>
                    )}

                    {!addonOpen && form.addonIds.length > 0 && (
                      <div style={s.addonPills}>
                        {selectedAddons.map((a) => (
                          <span key={a.id} style={s.addonPill}>
                            <Check size={10} strokeWidth={3} color="#1a7f4b" />
                            {a.name}
                            <button
                              type="button"
                              style={s.addonPillRemove}
                              onClick={() => toggleAddon(a.id)}
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </Field>

                  <div style={s.divider} />
                </>
              )}

              {/* Notes */}
              <Field label="Special Instructions" optional>
                <textarea
                  className="bkf-textarea"
                  rows={2}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="e.g. Ring the bell twice / Park at gate 2 / Allergic to strong fragrances"
                />
              </Field>

              {/* Price Summary */}
              <div style={s.priceSummary}>
                <p style={s.summaryTitle}>Order Summary</p>

                {pkg && (
                  <div style={s.summaryRow}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Package size={13} color="#6b7280" /> {pkg.name}
                    </span>
                    <span>₹{pkgPrice.toFixed(0)}</span>
                  </div>
                )}

                {selectedCar && (
                  <div style={s.summaryRow}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Car size={13} color="#6b7280" /> {selectedCar.name}
                    </span>
                    <span style={{ color: "#6b7280" }}>—</span>
                  </div>
                )}

                {form.bookingTime && (
                  <div style={s.summaryRow}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Clock size={13} color="#6b7280" /> {form.bookingTime}
                    </span>
                    <span style={{ color: "#6b7280" }}>—</span>
                  </div>
                )}

                {selectedAddons.map((a) => (
                  <div key={a.id} style={{ ...s.summaryRow, color: "#6b7280" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Sparkles size={13} color="#9ca3af" /> {a.name}
                    </span>
                    <span>+₹{Number(a.price).toFixed(0)}</span>
                  </div>
                ))}

                <div style={s.summaryTotal}>
                  <span>Estimated Total</span>
                  <strong style={s.summaryTotalAmt}>₹{total.toFixed(0)}</strong>
                </div>

                <p style={s.summaryNote}>
                  💳 Payment is collected on-site after service completion.
                </p>
              </div>

              {/* Submit */}
              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? (
                  <><Loader2 size={18} style={{ animation: "spin 0.7s linear infinite" }} /> Confirming your booking…</>
                ) : (
                  <>Confirm Booking <Check size={18} strokeWidth={3} /></>
                )}
              </button>

              <p style={s.formFooter}>
                By confirming, you agree to be contacted by our team on the number provided.
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const navy  = "#1a3c8f";
const navyD = "#0f2454";
const green = "#1a7f4b";
const sky   = "#eef3ff";

const s = {
  wrap: { background: "#f0f4fb", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", color: "#1a1a2e" },
  page: { maxWidth: 600, margin: "0 auto", padding: "0 16px 80px" },

  backBtn: { background: "none", border: "none", color: navy, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "20px 0 10px", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" },

  pkgBanner: { background: "#fff", borderWidth: "1.5px", borderStyle: "solid", borderColor: sky, borderRadius: 16, padding: "18px 20px", marginBottom: 14, boxShadow: "0 2px 16px rgba(26,60,143,0.08)" },
  pkgLoading: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 0" },
  pkgBannerTop: { display: "flex", alignItems: "flex-start", gap: 14 },
  pkgIconBox: { width: 44, height: 44, borderRadius: 10, background: sky, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  pkgBannerBody: { flex: 1, minWidth: 0 },
  pkgBadge: { display: "inline-block", fontSize: 9, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: navy, background: sky, padding: "2px 8px", borderRadius: 10, marginBottom: 5 },
  pkgName: { margin: "0 0 3px", fontSize: 16, fontWeight: 800, color: navyD },
  pkgDesc: { margin: 0, fontSize: 12, color: "#6b7280", lineHeight: 1.5 },
  pkgPriceBox: { display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 },
  pkgPriceLabel: { fontSize: 9, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" },
  pkgPriceVal: { fontSize: 24, fontWeight: 900, color: navy, lineHeight: 1.1 },
  pkgFeats: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 },
  pkgFeatPill: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, background: "#e4f7ed", color: green, padding: "3px 10px", borderRadius: 20 },

  card: { background: "#fff", borderRadius: 18, padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" },
  formHeader: { marginBottom: 24 },
  formTitle: { margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: navyD },
  formSubtitle: { margin: 0, color: "#6b7280", fontSize: 13, lineHeight: 1.5 },

  loadingState: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "48px 0", color: "#6b7280", fontSize: 14 },

  alertErr: { display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 10, marginBottom: 18, fontSize: 13, background: "#fdecea", color: "#b3261e", borderWidth: 1, borderStyle: "solid", borderColor: "#f5c2be" },

  secHead: { display: "flex", alignItems: "center", gap: 10, margin: "24px 0 16px" },
  secIcon: { width: 28, height: 28, borderRadius: "50%", background: sky, color: navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  secIconDone: { background: "#e4f7ed", color: green },
  secTitle: { fontSize: 13, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px", flex: 1 },
  secDonePill: { fontSize: 10, fontWeight: 700, color: green, background: "#e4f7ed", padding: "2px 8px", borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.5px" },

  divider: { borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: "#e8ecf5", margin: "8px 0" },

  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  field: { marginBottom: 16, display: "flex", flexDirection: "column" },
  label: { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7, display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" },
  req: { color: "#d1372c", fontWeight: 700 },
  opt: { fontWeight: 400, color: "#9ca3af", fontSize: 12 },
  hint: { fontSize: 11, color: "#9ca3af", marginTop: 6 },
  errMsg: { display: "flex", alignItems: "center", gap: 4, color: "#d1372c", fontSize: 12, fontWeight: 500, marginTop: 5 },

  inputWrap: { display: "flex", alignItems: "center", position: "relative" },
  inputIcon: { position: "absolute", left: 12, pointerEvents: "none" },
  inputWithIcon: { paddingLeft: 36 },
  prefix: { background: "#f4f6fb", color: "#374151", fontSize: 13, fontWeight: 700, padding: "11px 10px 11px 13px", borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 0, borderBottomRightRadius: 0, flexShrink: 0, borderWidth: "1.5px", borderStyle: "solid", borderColor: "#d1d9e6", borderRightWidth: "1px" },
  inputPrefixed: { borderRadius: "0 10px 10px 0", borderLeft: "none" },

  // Time slot grid
  slotGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },

  selectWrap: { position: "relative", display: "flex", alignItems: "center" },
  select: { paddingLeft: 36, paddingRight: 32, appearance: "none", cursor: "pointer", width: "100%" },
  selectArrow: { position: "absolute", right: 12, pointerEvents: "none" },

  addrToggle: { display: "flex", gap: 8, marginBottom: 12 },

  locPrompt: { display: "flex", alignItems: "center", gap: 12, background: sky, borderRadius: 12, padding: "14px 16px", borderWidth: "1.5px", borderStyle: "dashed", borderColor: "rgba(26,60,143,0.25)" },
  locPromptIcon: { width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(26,60,143,0.1)" },
  locPromptText: { flex: 1, display: "flex", flexDirection: "column", gap: 2 },
  locBtn: { display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 20, background: navy, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 },
  locErrBox: { display: "flex", alignItems: "flex-start", gap: 8, background: "#fdecea", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#b3261e" },
  locCard: { borderRadius: 14, overflow: "hidden", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#d1d9e6", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" },
  locMapWrap: { position: "relative", height: 180, overflow: "hidden", background: "#e5e8f0" },
  locMap: { width: "100%", height: "100%", border: "none", display: "block", pointerEvents: "none" },
  locPinWrap: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -80%)", pointerEvents: "none" },
  locInfo: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#fff" },
  locIconWrap: { flexShrink: 0 },
  locText: { flex: 1, minWidth: 0 },
  locLocality: { margin: "0 0 1px", fontSize: 13, fontWeight: 700, color: navyD, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  locCoords: { margin: "0 0 4px", fontSize: 11, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  locOpen: { fontSize: 11, fontWeight: 600, color: navy, textDecoration: "none" },
  locClear: { width: 28, height: 28, borderRadius: "50%", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#e5e7eb", background: "#f9fafb", color: "#6b7280", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },

  addonTrigger: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: "#d1d9e6",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: "11px 13px",
    background: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 14,
    color: "#6b7280",
    transition: "border-color .15s, box-shadow .15s",
    textAlign: "left",
  },
  addonTriggerOpen: {
    borderColor: navy,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    boxShadow: `0 0 0 3px rgba(26,60,143,0.1)`,
  },
  addonTriggerText: { flex: 1, fontSize: 14 },
  addonCountBadge: { background: navy, color: "#fff", fontSize: 11, fontWeight: 800, borderRadius: 20, padding: "1px 7px", flexShrink: 0 },

  addonPanel: {
    borderTopWidth: 0,
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: navy,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    background: "#fff",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(26,60,143,0.1)",
  },

  addonRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", cursor: "pointer", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "#f0f2f8", transition: "background .12s", background: "#fff" },
  addonRowChecked: { background: "#f0fdf5" },
  addonRowCheck: { width: 22, height: 22, borderRadius: "50%", flexShrink: 0, borderWidth: "1.5px", borderStyle: "solid", borderColor: "#d1d9e6", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" },
  addonRowCheckDone: { background: green, borderColor: green },
  addonRowInfo: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 },
  addonRowName: { fontSize: 13, fontWeight: 700, color: navyD },
  addonRowDesc: { fontSize: 11, color: "#6b7280", lineHeight: 1.4 },
  addonRowPrice: { fontSize: 13, fontWeight: 700, color: navy, flexShrink: 0 },
  addonPanelFooter: { padding: "10px 14px", background: sky, display: "flex", justifyContent: "flex-end" },
  addonDoneBtn: { display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, background: navy, color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit" },

  addonPills: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 },
  addonPill: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: green, background: "#e4f7ed", borderRadius: 20, padding: "4px 10px" },
  addonPillRemove: { background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", color: "#6b7280", marginLeft: 2 },

  priceSummary: { background: sky, borderRadius: 14, padding: "16px 18px", margin: "16px 0 20px", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(26,60,143,0.12)" },
  summaryTitle: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#6b7280", margin: "0 0 12px" },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "#374151", padding: "4px 0" },
  summaryTotal: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: "rgba(26,60,143,0.15)", fontSize: 14, fontWeight: 600, color: "#374151" },
  summaryTotalAmt: { fontSize: 24, fontWeight: 900, color: navy },
  summaryNote: { margin: "10px 0 0", fontSize: 11.5, color: "#6b7280", lineHeight: 1.5 },

  formFooter: { textAlign: "center", fontSize: 11.5, color: "#9ca3af", margin: "12px 0 0" },

  successCard: { background: "#fff", borderRadius: 20, padding: "48px 28px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", marginTop: 32 },
  successIconWrap: { marginBottom: 16 },
  successTitle: { margin: "0 0 10px", fontSize: 26, fontWeight: 900, color: navyD },
  successMsg: { color: "#6b7280", fontSize: 14, lineHeight: 1.65, margin: "0 0 24px" },
  successPkg: { display: "flex", alignItems: "center", justifyContent: "space-between", background: sky, borderRadius: 12, padding: "14px 18px", marginBottom: 28 },
  successPkgLeft: { display: "flex", alignItems: "center", gap: 8 },
  successPkgName: { fontWeight: 700, color: navyD, fontSize: 15 },
  successPkgPrice: { fontSize: 20, fontWeight: 900, color: navy },
  successBtn: { display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", fontSize: 15, fontWeight: 700 },
};

const cssRaw = `
  *, *::before, *::after { box-sizing: border-box; }

  .bkf-input, .bkf-select, .bkf-textarea {
    border: 1.5px solid #d1d9e6;
    border-radius: 10px;
    padding: 11px 13px;
    font-size: 14px;
    outline: none;
    font-family: inherit;
    color: #1a1a2e;
    background: #fff;
    transition: border-color .15s, box-shadow .15s;
    width: 100%;
    display: block;
  }
  .bkf-input:focus, .bkf-select:focus, .bkf-textarea:focus {
    border-color: #1a3c8f;
    box-shadow: 0 0 0 3px rgba(26,60,143,0.1);
  }
  .bkf-input.err, .bkf-select.err, .bkf-textarea.err {
    border-color: #d1372c;
    box-shadow: 0 0 0 2px rgba(209,55,44,0.1);
  }
  .bkf-select { appearance: none; cursor: pointer; }

  .bkf-input.prefixed {
    border-radius: 0 10px 10px 0;
    border-left: none;
  }
  .bkf-input.prefixed:focus {
    border-left: none;
    box-shadow: none;
  }

  /* ── Time slot pills ── */
  .slot-pill {
    padding: 12px 10px;
    border-radius: 999px;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    font-size: 13.5px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    font-family: inherit;
    text-align: center;
    white-space: nowrap;
    transition: all .15s;
  }
  .slot-pill:hover:not(:disabled):not(.active) {
    border-color: #1a3c8f;
    color: #1a3c8f;
    background: #f7f9ff;
  }
  .slot-pill.active {
    background: #1a3c8f;
    border-color: #1a3c8f;
    color: #fff;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(26,60,143,0.25);
  }
  .slot-pill.err:not(.active) { border-color: #d1372c; }
  .slot-pill:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: #f4f6fb;
    text-decoration: line-through;
  }

  .addr-tab {
    flex: 1; padding: 10px 12px;
    border-radius: 10px; border: 1.5px solid #d1d9e6;
    background: #fff; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: inherit;
    transition: all .15s; color: #374151;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .addr-tab.active {
    background: #1a3c8f; border-color: #1a3c8f; color: #fff;
    box-shadow: 0 2px 8px rgba(26,60,143,0.25);
  }
  .addr-tab:not(.active):hover { border-color: #1a3c8f; color: #1a3c8f; }

  .back-btn:hover { opacity: 0.65; }
  .btn-primary {
    background: #1a3c8f; color: #fff; border: none; border-radius: 10px;
    cursor: pointer; font-family: inherit; font-weight: 700;
    transition: background .15s, transform .1s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-primary:hover:not(:disabled) { background: #0f2454; }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  .btn-submit {
    width: 100%; padding: 15px;
    border: none; border-radius: 12px;
    background: #1a3c8f; color: #fff;
    font-size: 16px; font-weight: 800;
    cursor: pointer; font-family: inherit;
    box-shadow: 0 4px 16px rgba(26,60,143,0.32);
    transition: background .15s, transform .12s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    letter-spacing: 0.2px;
  }
  .btn-submit:hover:not(:disabled) {
    background: #0f2454; transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(26,60,143,0.36);
  }
  .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 480px) {
    .bkf-row { grid-template-columns: 1fr !important; }
    .addr-tab { font-size: 12px; padding: 9px 8px; }
    .slot-pill { font-size: 12.5px; padding: 11px 6px; }
  }
`;