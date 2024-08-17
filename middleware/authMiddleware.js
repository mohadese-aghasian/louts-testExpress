const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'userblogdb',
    password: 'postgres76555432',
    port: 5432,
});

const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("** auth Header:");
    console.log(authHeader);
    console.log(req.headers);

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, 'lotus_secret');

            // verify the token exists in your database
            const result = await pool.query('SELECT * FROM user_tokens WHERE token = $1', [token]);
            if (result.rows.length === 0) {
                return res.status(401).json({ message: 'Token not found in database' });
            }
            console.log(decoded);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Authorization header missing' });
    }
};

module.exports = authenticateJWT;