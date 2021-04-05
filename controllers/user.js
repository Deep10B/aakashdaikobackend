import User from '../Models/User.js';



const read =(req, res) =>{
const userId = req.params.id
User.findById(userId).exec((err, user) =>{
    if(err || !user) {
        return res.status(400).json({
            error: 'User not found'
        })
    }
    user.hashed_password = undefined;
    user.salt  = undefined;
    res.json(user)
})
}

const update =(req, res) =>{
    //console.log( 'UPDATE USER -req.user', req.user, 'UPDATE DATA', req.body)
    const {firstname, lastname, password} = req.body;

    User.findOne({_id: req.user._id}, (err,  user) =>{
        if (err || !user){
            return res.status(400).json({
                error: 'User not found'
            })
        }
        if(!firstname){
            return res.status(400).json({
                error: 'First name should not be empty'
            });
        }else{
            user.firstname = firstname
        }

        if(!lastname){
            return res.status(400).json({
                error: 'Last name should not be empty'
            } );
        }else{
            user.lastname = lastname
        }

        
        if(password){
            if(password.length < 6 ){
                return res.status(400).json({
                    error: 'Password should not be less than 6 characters long'
                } )
            }else{
                user.password= password;
            }

        }
        user.save((err, updatedUser) =>{
            if (err){
                return res.status(400).json({
                        error: 'User update failed'
                    } );
            }

            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
    });
};


export {read, update};