// NOTES MODEL
import mongoose from 'mongoose';


  //var Item = mongoose.model('Image',ImageSchema);
const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        // required: true,
        trim: true
    },
    body: {
        type: String,
        trim: true
    },
    image: {
        type: String
    },
    
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },

    user: {
        type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'       
    }
}, {
    timestamps: true
});

export default mongoose.model('Note', noteSchema);;