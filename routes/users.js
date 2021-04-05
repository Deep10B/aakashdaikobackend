import express from 'express'
const router = express.Router();


//load User Model
 

//import controller
import { requireSignin } from "../controllers/auth.js";
import {read, update} from '../controllers/user.js';



//@route GET auth/signup
//@desc auth post route

router.get('/user/:id', requireSignin, read);

router.put('/user/update', requireSignin, update);


 

export default router;