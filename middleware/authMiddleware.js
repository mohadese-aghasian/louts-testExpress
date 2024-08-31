const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');    
const db = require("../models/index");

const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(req.headers);

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, 'lotus_secret');

            // verify the token exists in your database
            const result = await db.UserTokens.findOne({where:{token:token}});
            if (!result) {
                return res.status(401).json({ message: 'Token not found in database' });
            }
            console.log("decoded****: ",decoded);
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