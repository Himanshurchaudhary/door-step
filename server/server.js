const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/db.js');
require('dotenv').config();

const app = express();

// ── DB connect + table init ───────────────────────────────────────────────────
const Banner = require('./models/Banner');
const Package = require('./models/Package');
const Partner = require('./models/Partner');
const Booking = require('./models/Booking.model.js');



const initDB = async () => {
  try {
    await connectDB();
    await Banner.createTable();
    await Package.createTable();
    await Partner.createTable();
    await Booking.createTable();

  } catch (err) {
    console.error('❌ DB init failed:', err.message);
  }
};

initDB();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ── Routes ────────────────────────────────────────────────────────────────────
const routes = [
  ['/api/auth', './routes/authRoutes.js'],
  ['/api/banners', './routes/bannerRoutes.js'],
  ['/api/packages', './routes/Packageroutes.js'],
  ['/api/addons', './routes/Addon.routes.js'],
  ['/api/partners', './routes/Partnerroutes.js'],
  ['/api/service-cities', './routes/serviceCity.routes.js'],
  ['/api/car-types', './routes/carType.routes.js'],
  ['/api/bookings', './routes/Booking.routes.js'],
  ['/api/customers', './routes/customer.routes.js'],
    ['/api/customer-auth', './routes/customerAuth.routes.js'],
    ['/api/partner-auth', './routes/partnerAuth.routes.js'],






];

for (const [path_, file] of routes) {
  try {
    app.use(path_, require(file));
    console.log(`✅ Loaded: ${file}`);
  } catch (e) {
    console.error(`❌ FAILED: ${file} →`, e.message);
  }
}

// ── Frontend static ───────────────────────────────────────────────────────────
const possiblePaths = [
  path.join(__dirname, '../dist'),
  '/home/u873522560/domains/graminkcart.in/nodejs/dist',
  path.join(__dirname, '../../dist'),
];

let frontendDist = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))) {
    frontendDist = p;
    break;
  }
}

console.log('📁 __dirname:', __dirname);
console.log('📁 frontendDist resolved:', frontendDist);

if (frontendDist) {
  app.use(express.static(frontendDist));
  app.get('/{*path}', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  console.error('❌ dist/index.html not found on any path!');
  app.get('/{*path}', (req, res) => {
    res.status(500).send('Frontend build not found. Please upload dist/ folder.');
  });
}

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));







// {
//   "email": "admin@doorstep.com",
//   "password": "Admin@123"
// }