const express = require('express');
const router = express.Router()
const User = require('../models/Users');
const {body , validationResult } = require('express-validator');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

//secure password

const JWT_SECRET = "your_jwt_secret"
//ROUTE 1 : create a user using POST "api/auth/createuser". doesn't require auth
router.post('/createuser',[
    body('email').isEmail(),
    body('name').isLength({min : 3}),
    body('pass').isLength({ min : 5})
] , async (req, res)=>{
    // if there are error return error
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        success = false;
        return res.status(401).json({errors : errors.array()});
    }
    try{

    
    let user = await User.findOne({email : req.body.email});
    if(user){
        success = false
        return res.status(400).json({error : "a user with this email is already existse"})
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.pass, salt);
    user = await User.create({
        name : req.body.name,
        email : req.body.email,
        pass : secPass
    })
    
    // .then(user => res.json(user))
    // .catch((error)=>{
    //     {console.log(error)
    //         res.json({error : "please enter unqiue value for email", message : error.message})
    //     }
    // })
    
    const data = {
        user : {
            id : user.id
        }
    }
    const success = true
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({success, authtoken})
}
catch(error){
    console.error(error.message)
    res.status(500).json({error : "internal server error", errorm : error.message})
}

})

//ROUTE 2 : authenticate a user /api/auth/login no login required

router.post('/login',[
    body('email', 'enter a valid email').isEmail(),
    body('pass', 'password can not be blank').exists()
] , async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const {email , pass} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            success = false
            return res.status(400).json({success, error : "user not found"})
        }
      
        const passwordcompare = await bcrypt.compare(pass, user.pass)
        if(!passwordcompare){
            success = false
            return res.status(400).json({ success, error : "please try to login with valid credentails"})
        }
        const data = {
            user : {
                id : user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({success, authtoken})

    } catch(error){
        console.error(error.message)
        res.status(500).json({error : "internal server error", errorm : error.message})
    }
    

})

//ROUTE 2 : GET loggedin user details using POST mehod  "api/auth/getuser" . login required

router.post('/getuser',fetchuser, async (req, res)=>{
try{
    userId = req.user.id;
    const user = await User.findById(userId).select("-pass")
    res.send(user)
} catch(error){
        console.error(error.message)
        res.status(500).json({error : "internal server error", errorm : error.message})
    }
})

module.exports = router