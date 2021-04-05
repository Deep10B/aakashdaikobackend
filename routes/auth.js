import express from 'express'
const router = express.Router();


//load User Model
 

//import controller
import {signup, accountActivation, signin, forgotPassword, resetPassword} from '../controllers/auth.js';

//import of validators
import { 
    userSignupValidator, userValidationResult, userSigninValidator, forgotPasswordValidator, resetPasswordValidator
    } from '../validator/auth.js';

//@route GET auth/signup
//@desc auth post route
router.post('/signup', userSignupValidator, userValidationResult,  signup);
router.post('/account-activation',  accountActivation);
//router.post('/auth/activate',  signup);
router.post('/signin', userSigninValidator, userValidationResult,  signin);

//forgot reset password
router.put('/forgot-password', forgotPasswordValidator, userValidationResult, forgotPassword);
router.put('/reset-password', resetPasswordValidator, userValidationResult, resetPassword);
//@route 

export default router;