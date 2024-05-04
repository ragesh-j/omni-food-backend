const express = require('express');
const router=express.Router();
const Admin=require('../models/adminModel');
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');
const jwtSecret="MySecretCode"
router.post('/login', async (req, res) => {
    console.log(req.body)
    try {
        const { contact, password } = req.body;
        
        const admin = await Admin.findOne({ contact });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
       
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({
            data: admin._id
        }, jwtSecret, {
            expiresIn: '1d'
        })
        
        return res.status(200).json({
             message:"User login successful",
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports=router