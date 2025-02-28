const {body , validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "your_jwt_secret"

const fetchuser = (req, res, next)=>{
    //get the user from the jwt token and id to req object
    const token = req.header('auth-token');
    if(!token) {
        return res.status(401).send({error : " please authenticate using valid token"})
    }
    try{

        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    }
    catch(error){
        return res.status(401).send({error : " internal server error"})

    }
}

module.exports = fetchuser;