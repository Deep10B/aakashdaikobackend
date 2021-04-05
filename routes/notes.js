import express from 'express';
const router = express.Router();

import Note from '../Models/Note.js'
import denv from 'dotenv';
import { verifyUser } from '../controllers/auth.js';
import Category from '../Models/Category.js';

const dotenv = denv.config();


//@route GET notes/note
//@desc note post route
router.route("/note")
        .get(verifyUser, (req, res, next) => {
            Note.find()
                .then((note) => {
                    if (note == null) throw new Error("No note yet.");
                    res.json(note);
                }).catch(next);
        })

        .post(verifyUser,  (req, res, next) =>{
            const user = req.user;

            let note = new Note({
                ...req.body, user: user.id
            });
            note.save()
            .then((note)=>{
                note.populate("category").execPopulate()
                    .then(async note => {
                        const category = note.category;
                        category.notes.push(note.id);
                        user.notes.push(note.id);

                        await category.save();
                        await user.save();
                        
                        res.json(note);
                            
                    });
            }).catch(next);

        })

        .put((req, res, next) => {
            res.statusCode = 405;
            res.json({ message: "Method not allowed" });
        })

        .delete( verifyUser, (req, res, next) => {
            Note.deleteMany({ user: req.user._id })
                .then(response => {
                    res.json(response);
                })
                .catch(next);
        })
        router.route('/mynote/')
        .get(verifyUser,(req, res, next) => {
            Note.find({user: req.user.id})
              .then(notes => {
                if (notes == null) throw new Error("Note has been removed.");
                res.json(notes);
              })
              .catch(next);
          })

        //for specific note
        router.route('/mynote/:id')
            .put(verifyUser,(req,res,next) =>{
                let updatedNote={
                    title:req.body.title,
                    body: req.body.body,
                    image: req.body.image,
                    category: req.body.category
                };
                Note.findByIdAndUpdate({_id:req.params.id}, updatedNote)
                .then((oldResult) =>{
                    Note.findOne({_id:req.params.id})
                        .then((note) =>{
                            res.json({
                                success:true,
                                msg:`Note updated successfully!!`,
                                result:{
                                    _id: note._id,
                                    title:note.title,
                                    body:note.body,
                                    image: note.image,
                                    category:note.category
                                }
                            })
                        })
                        .catch(e => next(e))
                }).catch(e => next(e))
            })
            .delete(verifyUser,(req, res, next) => {
                    Note.findById(req.params.id)
                    .then(note => {
                        console.log(note)
                        Category.findById({_id: note.category})
                    .then(category => {
                    category.notes = category.notes.filter((note) => {
                        return note !== req.params.id
                    })
                    category.save()
                    .then((updatedcategory) => {{
                        console.log(updatedcategory)
                    }}).catch(next)
                
                        Note.deleteOne({ _id: req.params.id})
                            .then(result =>{
                                res.json(result)
                        })
                    .catch(next)       
                            })
                    
                    })})
            //for search
            router.route('/search',(req,res) =>{
                let note = notes.title
                const results = note.filter(title=>
                    new RegExp(`^${req.query.q}`).test(title));
                    res.json(results)
            })



export default router;