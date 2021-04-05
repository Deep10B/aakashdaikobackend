
import express from 'express';
import Category from '../Models/Category.js' 
import { verifyUser } from '../controllers/auth.js';
import Note from '../Models/Note.js';
const router = express.Router();

router.route("/category")
        .get( verifyUser, (req, res, next) => {
            Category.find()
                .then((cat) => {
                    if (cat == null) throw new Error("No category yet.");
                    // console.log(cat);
                    res.json(cat);
                }).catch(next)
        })

        .post( verifyUser, (req,res, next) => {
            const user = req.user;
            let category = new Category({
                ...req.body, user: user.id
            });

            category.save()
            .then(result => {
                user.categories.push(result.id);
                user.save()
                    .then(() => {
                        res.status(201).json(result);
                    });
            });

        })

        //for specific category added by specific user
        router.route('/mycategories')
            .get(verifyUser,(req, res, next) =>{
                Category.find({ user: req.user._id})
                    .populate({
                        path: 'user'
                    })
                    .then((category) =>{
                        if (category==null) throw new Error("No category yet");
                          res.json(category);
                    
                    })
            })

        //for specific category
            router.route('/mycategories/:id')
            .get(verifyUser,(req, res, next) => {
                Category.findById(req.params.id)
                    .populate('note')
                    .then(category => {
                        res.json(category)
                    }).catch(next)
            })


            .put(verifyUser,(req, res, next) => {
                Category.findOneAndUpdate(
                    {user: req.user._id, _id:req.params.id},
                     { $set: req.body }, 
                     { new: true })
                    .then(updatedCategory => {
                        if(updatedCategory ==null) throw new Error("Sorry, category update failed.")
                        res.json(updatedCategory)
                    }).catch(next)
            })
            .delete(verifyUser,(req,res,next)=>{
                
                Category.findById(req.params.id)
                .then(category => {
                    category.populate("user").execPopulate()
                    .then(category => {
                        let user = category.user;
                        user.categories = user.categories.filter(catID => catID != category.id);
                        user.notes = user.notes.filter(noteID => !category.notes.includes(noteID));
                        user.save()
                        .then(() => {
                            Note.deleteMany({ _id: { $in: category.notes } })
                            .then(() => {
                                category.remove()
                                .then(cat => {
                                    res.send(cat);
                                }).catch(e => next(e))
                            }).catch(e => next(e));
                        }).catch(e => next(e));
                    })
                    .catch(e => next(e));
                }).catch(e => next(e));
            })

        const CategoryValidate =  (req,res) => {
            const  {category}=req.body
            Category.findOne({category}).exec((err,category) =>{
                if(category){
                    return res.status(400).json({
                        error: 'This category name is already in list'
                    })
                }
            })
            }
export default router;














