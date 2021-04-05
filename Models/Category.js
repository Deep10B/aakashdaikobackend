//Category model
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    category:{
    type: String,
    unique:true,
    required: true

    },
    notes:[{type: mongoose.Schema.Types.ObjectId,
                ref:'Note'
    }],


    user: {
        type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
    },


}, {timestamps: true});

export default mongoose.model('Category',categorySchema);


