const userSchema = require('../model/userSchema');
const bcrypt=require('bcrypt') 
const ganerateToken=require('../utils/jsonWebTokens')
const asyncErrorHandler=require('../utils/asyncErrorHandler')




const createUser =asyncErrorHandler( async (req, res) => {
    const { name, email, username, password } = req.body;

    const user=await userSchema.findOne({username:username})
    console.log(user);
    // console.log(user.username)   
    if(user)return res.status(400).json({
        message:"user allreday exist"
    })
        const newUser = await userSchema.create({
            name:name,
            email:email,
            username:username,
            password:password
        });
       
        res.status(201).json({
            status: 'success',
            data: {
                newUser
            }
        });
     
})

const userLogin = asyncErrorHandler( async (req, res) => {
    const username=req.body.username;
    const password=req.body.password;
    // console.log(username);
// console.log(password);
 
        const user = await userSchema.findOne({username}).select('+password');
            // console.log("uxdf",user.password);
        if (!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid input'
            });
        }
 
        if (!password || !user.password) {
            return res.status(400).json({
                status: 'fail',   
                message: 'Invalid input '
            });
        } 
        
        const matchPassword = await user.comparePassword(password,user.password)
        // console.log(matchPassword)

        if (!matchPassword) {
            return res.status(401).json({
                status: 'fail',
                message: 'Authentication failed'
               
            });
        }

        const token=ganerateToken(user._id)

        res.status(200).json({
            status: 'success',
            message: 'Authentication successful',
            token,
            data: {
                user
            }
        });

 
});

module.exports = {
    createUser,userLogin
}
