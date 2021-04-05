
//import {check} from 'express-validator';
//import {check, validationResult} from 'express-validator/check/index.js';
///import {check, validationResult} from 'express-validator/check/index.js'

import checkAPIs from 'express-validator';
const { check,validationResult  } = checkAPIs;

const userValidationResult = (req, res, next) =>{
  const result = validationResult(req)
  if(!result.isEmpty()){
    return res.status(422).json({error: result.array()[0].msg
    })
  }
  next();
}

   const userSignupValidator =  [
    check('firstname')
    .trim()
    .not()
    .isEmpty()
    .withMessage('First name is required'),

    check('lastname')
    .trim()
    .not()
    .isEmail()
    .withMessage('Last name is required'),
    
    check('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be valid'),

    check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isLength({min:6})
    .withMessage('Password must be at least 6 characters long ')

];


const userSigninValidator =  [
   check('email')
  .trim()
  .not()
  .isEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Email must be valid'),

  check('password')
  .trim()
  .not()
  .isEmpty()
  .withMessage('Email is required')
  .isLength({min:6})
  .withMessage('Password must be at least 6 characters long ')

];

const forgotPasswordValidator =  [
  check('email')
 .trim()
 .not()
 .isEmpty()
 .isEmail()
 .withMessage('Email must be valid'),

];

const resetPasswordValidator =  [
  check('newPassword')
 .trim()
 .not()
 .isEmpty()
 .isLength({min:6})
 .withMessage('Password should be at least 6 characters'),

];
//export  {userValidationResult, userSignupValidator};

export  {userValidationResult, userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator};


