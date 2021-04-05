import express from 'express';
import morgan from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import denv from 'dotenv';
import path from 'path'

const dotenv = denv.config();



//imports routes
import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import categoryRoute from './routes/category.js'
import noteRoute from './routes/notes.js'
import URL from './config/connect.js';
import e from 'express';
import uploadRouter from './routes/upload.js'
import { verifyUser } from './controllers/auth.js';

const app = express();

//DB in config

const db = URL.mongoURL;

//connecting to MongoDB using mongoose
mongoose
.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false})

.then(() => console.log('Connected to dataserver..'))
.catch (err => console.log(err));

// app.get('/', (req, res) => res.send('Hellosdkj world'));


//app middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors()); 
app.use('*/uploads', express.static('public/uploads'))


//uses of routes


app.use('/api', authRoute);
app.use('/api', usersRoute);
app.use('/api', noteRoute);
app.use('/api', categoryRoute);
app.use('/api',verifyUser, uploadRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
