const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Protected Routes
const requireSignIn = async (req, res, next) => {
    try {
        const decode =await JWT.verify(req.headers.authorization,
            process.env.JWT);
            req.user = decode;
            next();
    } catch (error) {
        console.log(error);
    }
}
 

// Admin Access
const isAdmin = async (req, res, next) => {
    try {
         const user = await userModel.findById(req.user._id);
         if(user.role !== 1){
            res.status(404).send({
                success: false,
                message: "UnAuthorized Access"
            })
         }else{
            next();
         }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error in Admin Middleware",
            error
        })
    }
}

module.exports = {requireSignIn, isAdmin};