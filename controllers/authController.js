const userModel = require("../models/userModel")
const { hashPassword, comparePassword } = require("./../utils/authUtils")
const JWT = require("jsonwebtoken")


//Register Controller
const registerController =async (req, res) => {
 try {
     const {name,email,password,phone,address, answer} = req.body;

     //Validations
     if(!name){
        return res.send({error: "Name is Required"})
     }
     if(!email){
        return res.send({error: "Email is Required"})
     }
     if(!password){
        return res.send({error: "Password is Required"})
     }
     if(!phone){
        return res.send({error: "Phone Number is Required"})
     }
     if(!address){
        return res.send({error: "Address is Required"})
     }
     if(!answer){
      return res.send({error: "Answer is Required"})
   }

     //check existing user
     const existingUser = await userModel.findOne({email})
     if(existingUser){
         return res.status(200).send({
            success: true,
            message: "Already Registered"
         })
     }
       //regsiter user
       const hashedPassword = await hashPassword(password)
       //save user in db
       const user = await new userModel({name,email,address,phone,password:hashedPassword, answer}).save()

       res.status(201).send({
        message: "User Registered Successfully",
        success: true,
        user
       })


 } catch (error) {
    console.log(error)
    res.status(500).send({
        success: false,
        message: "Error in Registration",
        error
    })
 }
}


// Login User
const loginController = async (req, res) => {
 try {
    const {email, password} = req.body;

    //validation
    if(!email || !password) {
        return res.status(404).send({
            success: false,
            message: "Invalid email or password"
        })
    }
//Check user
   const user = await userModel.findOne({email})
   if(!user){
    return res.status(404).send({
        success: false,
        message: "User not found"
    })
   }

   //match the password
    const match = await comparePassword(password, user.password)
    if(!match){
        return res.status(404).send({
            success: false,
            message: "Password Invalid"
        })
    }

   //create a jwt Token
   const token = await JWT.sign({_id: user._id}, process.env.JWT, {expiresIn: "5d",});

   res.status(200).send({
    success: true,
    message: "Login Successfully",
    user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
    },
token
  })
 } catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "Error in Login",
        error
    });
 }
}


// Forgot Password Controller

 const forgotPasswordController = async (req, res) => {
    try {
      const { email, answer, newPassword } = req.body;
      if (!email) {
        res.status(400).send({ message: "Emai is required" });
      }
      if (!answer) {
        res.status(400).send({ message: "answer is required" });
      }
      if (!newPassword) {
        res.status(400).send({ message: "New Password is required" });
      }
      //check
      const user = await userModel.findOne({ email, answer });
      //validation
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Wrong Email Or Answer",
        });
      }
      const hashed = await hashPassword(newPassword);
      await userModel.findByIdAndUpdate(user._id, { password: hashed });
      res.status(200).send({
        success: true,
        message: "Password Reset Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  };


//Test Controller
const testController = async (req, res) => {
    try {
         res.status(200).send({
            success: true,
            message: "Protected Route"
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: "Error",
            error
        })
    }
}




module.exports = {registerController , loginController,forgotPasswordController, testController}