const User = require('../models/User');
const jwt = require('jsonwebtoken');
const i18next = require('i18next');

exports.register = async(req,res) =>{
  try{
    const { username, password, role } = req.body;
    const  user = new User({username, password, role});
    await user.save();
    res.status(201).json({message:i18next.t('registrationSuccess')});
  }catch(err){
    console.log('Error during registration',err)
    res.status(500).json({message:i18next.t('registrationFail')});
  }
}

exports.login = async(req,res) =>{
    try {
         const { username, password} = req.body;
         const user = await User.findOne({username});
         if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({ message: i18next.t('authFail') });
         }
         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.json({token});   
    } catch (error) {
        console.log('Error while login',error);
        res.status(500).json({ message: i18next.t('authError') });
    }
}