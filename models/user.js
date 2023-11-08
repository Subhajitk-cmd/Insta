const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dvqfzswni/image/upload/f_auto,q_auto/mqgr9e1t81oidzbs96ih"
    },
    followers:[
        {
            type:ObjectId,ref:"User"
        }
    ],
    following:[
        {
            type:ObjectId,ref:"User"
        }
    ]
})

mongoose.model("User",userSchema)



// const mongoose = require('mongoose');
// const userSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     email:{
//         type:String,
//         required:true
//     },
//     password:{
//         type:String,
//         required:true
//     }
// })

// mongoose.model("User",userSchema)