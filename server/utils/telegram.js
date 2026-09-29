// utils/telegram.js
const escapeHtml = (str = "") =>
  String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

exports.sendBookingAlert = async (b) => {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram not configured, skipping alert");
    return;
  }

  const addons =
    (b.addons || []).map((a) => `${escapeHtml(a.name)} (₹${a.price})`).join(", ") || "None";

  const location =
    b.addressType === "full_address"
      ? escapeHtml(b.fullAddress)
      : `<a href="https://maps.google.com/?q=${b.latitude},${b.longitude}">📍 Open in Maps</a>`;

  const text =
`🚗 <b>NEW BOOKING!</b>

👤 <b>Name:</b> ${escapeHtml(b.customerName)}
📞 <b>Mobile:</b> ${escapeHtml(b.customerNumber)}
${b.email ? `📧 <b>Email:</b> ${escapeHtml(b.email)}\n` : ""}
🏙 <b>City:</b> ${escapeHtml(b.cityName)}
🏠 <b>Address:</b> ${location}

📦 <b>Package:</b> ${escapeHtml(b.packageName || "Not selected")}
🚘 <b>Car:</b> ${escapeHtml(b.carTypeName)}
➕ <b>Add-ons:</b> ${addons}

📅 <b>Date:</b> ${escapeHtml(b.bookingDate)}
⏰ <b>Time:</b> ${escapeHtml(b.bookingTime)}
${b.notes ? `📝 <b>Notes:</b> ${escapeHtml(b.notes)}\n` : ""}
💰 <b>Total:</b> ₹${b.totalPrice}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        disable_notification: false,
      }),
    });
    const data = await res.json();
    if (!data.ok) console.error("Telegram error:", data);
  } catch (err) {
    console.error("Telegram send failed:", err.message);
  }
};