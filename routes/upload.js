import express from 'express'
import multer from 'multer'
import path from 'path'

//storage
const storage = multer.diskStorage({
    destination: './Public/uploads',
    filename: (req, file, cb)=> {
        let ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext)

    }
});

const imageFilter = (req, file, cb) =>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        let err = new Error('You can upload only image files!');
        err.status = 400;
        return cb(err,false);
    }
    cb(null, true);
}
const upload = multer({
storage: storage,
fileFilter: imageFilter
})
const uploadRouter = express.Router();
uploadRouter.route('/upload')
.post(upload.single('imageFile'), (req, res, next)=>{
    res.json(req.file);
});
export default uploadRouter;
