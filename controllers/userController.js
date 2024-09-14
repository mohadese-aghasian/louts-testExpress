const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/authMiddleware');
const db = require("../models/index");
const {  where, Op, Sequelize } = require('sequelize');
const Joi = require("joi");
const path = require('path');
const sharp = require('sharp');
const exp = require('constants');
// const Sequelize=require(Sequelize);



exports.login=async(req, res)=>{

    const user = await db.Users.findOne({ where: { username:req.body.username } });

    if (!user) {
        return res.status(401).json({ message: 'Invalid username' });
    }
    
    if(!(req.body.password===user.password)){
        return res.status(401).json({ message: 'Invalid password' });
    }
    // if(!(await bcrypt.compare(req.body.password, user.password))){
    //     return res.status(401).json({ message: 'Invalid password' });
    // }
    try{
        const token = jwt.sign({ userId: user.id }, 'lotus_secret', { expiresIn: '1h' });
        // Store token in the database
        await db.UserTokens.create({token:token, user_id:user.id});
        res.status(200).json({ token });
    }catch(err){
        res.status(500).json({message:err});
    }
};

exports.logout= async(req, res)=>{
    const token = req.headers.authorization.split(' ')[1];
    try{
    await userToken.destroy({where:{token:token}});
    res.status(200).json({ message: 'Logged out successfully' });
    }catch(err){
        res.status.json({message:err});
    }
};

exports.register=async(req, res)=>{
    const { username, password , email} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await db.Users.create({ username, password: hashedPassword,email:email });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }   
}