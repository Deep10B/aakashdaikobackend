// USER MODEL
import mongoose from 'mongoose';
import crypto from 'crypto';

//User schema
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    hashed_password: {
        type: String,
       required: true,
       // trim: true
    },
    salt: String,

    resetPasswordLink:{
        data: String,
    },
    categories: [{type: mongoose.Schema.Types.ObjectId}], 
   
    notes:[{type: mongoose.Schema.Types.ObjectId}],

}, {timestamps: true});



// virtual
userSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });


//methods
userSchema.methods = {
    authenticate: function(plainPassword){
        return this.encryptPassword(plainPassword) === this.hashed_password; //true or false

    },

    encryptPassword: function(password){
        if (!password) return'';
        try {
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex');
        } catch(err) {
            return '';
        }
    },

    makeSalt: function(){
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
};

export default mongoose.model('User', userSchema);