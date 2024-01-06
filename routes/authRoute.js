const express = require('express');
const { registerController, loginController,forgotPasswordController, testController } = require('../controllers/authController');
const {requireSignIn, isAdmin} = require('../middlewares/authMiddleware');

const router = express.Router();


//Routes

//1.Register Route
router.post('/register', registerController);

//2.Login Route
router.post('/login', loginController);

//3.Forgot Password Route
router.post('/forgot-password', forgotPasswordController);

//4. Test Route
router.get('/test',requireSignIn, isAdmin, testController)

//5. protected user route
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ok: true});
});

//6. protected admin route
router.get('/admin-auth', requireSignIn,isAdmin, (req, res) => {
    res.status(200).send({ok: true});
});




module.exports = router;
