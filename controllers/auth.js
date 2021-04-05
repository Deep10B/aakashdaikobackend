
import User from '../Models/User.js'
//import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import denv from 'dotenv';
import _ from 'lodash';
const dotenv = denv.config();
import expressJwt from 'express-jwt';


//sendinblue
import SGgrid from '@sendgrid/mail';
//import { result } from 'lodash';
//import { restart } from 'nodemon';


SGgrid.setApiKey(process.env.SENDGRID_API_KEY);

const signup =  (req,res) => {
    
    const {firstname, lastname, email, password} = req.body
       User.findOne({email}).exec((err, user) =>{
       if(user){
           return res.status(400).json({
               error: 'Email is already taken'
           });
       }

       const token = jwt.sign({ firstname, lastname, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' });
       const emailData= {
           from: `atm13138@gmail.com`,
           to: email,
           subject: `Account activation link`,                                                                                                                                          
           html: `
           <h1> Please use the following link to activate your accout in MyNote app </h1>
           <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
           <hr/>
           <p> This email may contain sensitive information</p>
           <p>${process.env.CLIENT_URL}</p>
           `
       };

       SGgrid.send(emailData)
       .then(sent =>{
        //console.log('Signup email send', send)   
        return res.json({
            message: `This email has been sent to ${email}. Follow the instruction to activate your account`
        });
       })
       .catch(err=>{
          // console.log('Signup email send error', err) 
           return res.json({
               message: err.message
           });
       });

   })


 };

 const accountActivation = (req, res) =>{
     const{token} = req.body

     if(token){
         jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded){
             if(err){
                 console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR',err );
                 return res.status(401).json({
                     error: 'This link has expired. Please Signup again'
                 });
             }

             const{firstname, lastname, email, password} = jwt.decode(token);
                const user = new User({firstname, lastname, email, password});
                user.save((err,user)=>{
                    if (err){
                        console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err)
                        return res.status(401).json({
                            error: 'Error saving user in database. Try to signup again'
                    
                    
                    });
                }
                return res.json({
                    message: 'Successfully signup. You can now signin'
                });
                });
         });
     }else{
        return res.json({
            message: 'Something went wrong. Please try again.'
        });
     }


 };

 const signin =(req, res) =>{
     const {email, password} = req.body
     //check if user exist
     User.findOne({email}).exec((err, user) =>{
         if(err|| !user){
             return res.status(400).json({
                 error: 'User with that email does not exist. Please signup'
             });
         }

         //authenticate
         if(!user.authenticate(password)){
            return res.status(400).json({
                error: 'Email and password does not match'
            })
         }
         //generate a token and send to the user
         const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
         const {_id, firstname, lastname, email} = user;
        return res.json({
            token,
            user:{_id, firstname, lastname, email}
        });

     });

 };

 const forgotPassword = (req, res) =>{
     const {email} = req.body

     User.findOne({email}, (err, user) => {
         if(err|| !user){
             return res.status(400).json({
                 error: 'User with that email doesnot exist'
             })
         }
         const token = jwt.sign({_id: user._id, firstname: user.firstname }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });
         const emailData= {
             from: `noreply@mynoteapp.com`,
             to: email,
             subject: `Password Reset Link`,                                                                                                                                          
             html: `
             <h1> Please use the following link to reset your password in MyNote app </h1>
             <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
             <hr/>
             <p> This email may contain sensitive information</p>
             <p>${process.env.CLIENT_URL}</p>
             `
         };

         return user.updateOne({resetPasswordLink: token}, (err, success) => {
             if (err) {
                 console.log('RESET PASSWORD LINK ERROR', err)
                 return res.status(400).json({
                     error: 'Database connection error on user password forgot request'
                 })
             }else{
                      SGgrid.send(emailData)
         .then(sent =>{
          //console.log('Signup email send', send)   
          return res.json({
              message: `Email has been sent to ${email}. Follow the instruction to reset your account password.`
          });
         })
         .catch(err=>{
            // console.log('Signup email send error', err) 
             return res.json({
                 message: err.message
             });
         });

             }
         })



     })

 };

 const resetPassword = (req, res) =>{
     const {resetPasswordLink, newPassword} = req.body;

     if(resetPasswordLink){
         jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded){
             if(err){
                return res.status(400).json({
                    error: 'Expired link. Please try again'
                });
             }
             User.findOne({resetPasswordLink}, (err, user) =>{
                 if(err|| !user){
                    return res.status(400).json({
                        error: 'Something went wrong. Try later'
                 });
                }
                const updateFields ={
                    password:newPassword,
                    resetPasswordLink: ''
                }
                user = _.extend(user, updateFields)

                user.save((err, result) =>{
                    if(err){
                        return res.status(400).json({
                            error: 'Error updating user reset password'
                        })
                    }
                    res.json({
                        message: `Great! NOw you can login with your new password.`
                    })
                })
             })
         })
     }
};

const requireSignin = expressJwt({
    secret: process.env.JWT_SECRET, //req.user
    algorithms: ['HS256']
})

const verifyUser= (req, res, next) => {

    let authHeader = req.headers.authorization;
    if (!authHeader) {
        let err = new Error("Bearer token is not set!");
        err.status = 401;
        return next(err);
    }
    let token = authHeader.split(' ')[1];
    let data;
    try {
        data = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error('Token could not be verified!');
    }
    User.findById(data._id)
        .then((user) => {
            req.user = user;
            next();
        })
}


export {signup, accountActivation,signin, forgotPassword, resetPassword, verifyUser, requireSignin};