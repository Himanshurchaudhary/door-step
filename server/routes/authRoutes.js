const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { pool } = require('../config/db.js');

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // DB se admin dhundo
        const [rows] = await pool.query(
            'SELECT * FROM admins WHERE email = ?', [email.trim()]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const admin = rows[0];

        // Password check
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Token banao
        const token = jwt.sign(
            { id: admin.id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id:     admin.id,
                name:   admin.name,
                email:  admin.email,
                role:   admin.role,
                mobile: admin.mobile,
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// ─── POST /api/auth/register-admin ──────────────────────────────────────────
router.post('/register-admin', async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Password hash
        const salt           = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // DB mein insert karo
        const [result] = await pool.query(
            'INSERT INTO admins (name, email, password, mobile, role) VALUES (?, ?, ?, ?, ?)',
            [name, email.trim(), hashedPassword, mobile, 'admin']
        );

        // Token banao
        const token = jwt.sign(
            { id: result.insertId, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id:     result.insertId,
                name,
                email,
                role:   'admin',
                mobile,
            }
        });

    } catch (error) {
        console.error('Register Error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

module.exports = router;