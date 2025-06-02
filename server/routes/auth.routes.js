const express = require('express');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const router = express.Router();
const { User, RefreshToken } = require('../models');
const { hashPassword, matchPassword, hashToken } = require('../utils/utils');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


function generateAccessToken(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, { expiresIn: expiresIn });
}

function generateRefreshToken(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, { expiresIn: expiresIn });
}


// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Incomplete details. Please provide correct name, email and password!" })
        }
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: 'Email already in use' });
        const hashedPassword = hashPassword(password);
        const user = await User.create({ name, email, password: hashedPassword });
        return res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Incomplete details. Please provide correct email and password!' });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const valid = matchPassword(password, user.password);
        if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
        const accessToken = generateAccessToken({ id: user.id, email: user.email }, JWT_SECRET, '15m');
        const refreshToken = generateRefreshToken({ id: user.id, email: user.email }, JWT_REFRESH_SECRET, '15d');
        const hashedRefreshToken = hashToken(refreshToken);
        await RefreshToken.create({ token: hashedRefreshToken, expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), user_id: user.id });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 15 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({ accessToken, user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Token refresh
router.post('/refresh-token', async (req, res) => {
    
    try {

        const oldToken = req.cookies.refreshToken;

        if (!oldToken) return res.status(401).json({ message: 'No refresh token found' });

        let payload;
        try {
            payload = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const hashedOld = hashToken(oldToken);
        // Match old hashed token
        const tokenEntry = await RefreshToken.findOne({
            where: {
                user_id: payload.id,
                token: hashedOld,
                revoked: false,
                expires_at: { [Op.gt]: new Date() }
            }
        });

        if (!tokenEntry) {
            // Reuse or token not found
            await RefreshToken.destroy({ where: { user_id: payload.id } });
            return res.status(403).json({ message: 'Possible token reuse detected. All sessions invalidated.' });
        }

        // Rotate
        const newRefreshToken = generateRefreshToken({ id: payload.id }, JWT_REFRESH_SECRET, '15d');
        const newAccessToken = generateAccessToken({ id: payload.id }, JWT_SECRET, '15m');
        tokenEntry.token = hashToken(newRefreshToken);
        tokenEntry.expires_at = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
        await tokenEntry.save();


        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 15 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ accessToken: newAccessToken });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Logout
router.post('/logout', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: 'No refresh token found' });
        const hashedRefreshToken = hashToken(refreshToken);
        await RefreshToken.destroy({ where: { token: hashedRefreshToken } });
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'Logged out' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;