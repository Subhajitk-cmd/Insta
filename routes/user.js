


const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get('/user/:id', requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .then(posts => {
          res.json({ user, posts });
        })
        .catch(err => {
          return res.status(422).json({ error: err.message }); // Handle the error properly
        });
    })
    .catch(err => {
      return res.status(404).json({ error: "User not found" });
    });
});



// router.put('/follow',requireLogin,(req,res)=>{
//     User.findByIdAndUpdate(req.body.followId,{
//         $push:{followers:req.user._id}
//     },{new:true
//     },(err,result)=>{
//         if(err){
//             return res.status(422).json({error:err})
//         }
//         User.findByIdAndUpdate(req.user._id,{
//             $push:{following:req.body.followId}
//         },{new:true}).then(result=>{
//             res.json(result)
//         }).catch(err=>{
//             return res.status(422).json({error:err})
//         })
//     })
// })
router.put('/follow', requireLogin, async (req, res) => {
    try {
      const userToFollow = await User.findByIdAndUpdate(
        req.body.followId,
        { $push: { followers: req.user._id } },
        { new: true }
      );
  
      const currentUser = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { following: req.body.followId } },
        { new: true }
        //select("-password")
      ).select("-password");;
  
      res.json(currentUser);
    } catch (err) {
      res.status(422).json({ error: err.message });
    }
  });
  
// router.put('/unfollow',requireLogin,(req,res)=>{
//     User.findByIdAndUpdate(req.body.unfollowId,{
//         $pull:{followers:req.user._id}
//     },{new:true
//     },(err,result)=>{
//         if(err){
//             return res.status(422).json({error:err})
//         }
//         User.findByIdAndUpdate(req.user._id,{
//             $pull:{following:req.body.unfollowId}
//         },{new:true}).then(result=>{
//             res.json(result)
//         }).catch(err=>{
//             return res.status(422).json({error:err})
//         })
//     })
// })

// router.put('/unfollow', requireLogin, async (req, res) => {
//     try {
//       const userToUnFollow = await User.findByIdAndUpdate(
//         req.body.unfollowId,
//         { $push: { followers: req.user._id } },
//         { new: true }
//       );
  
//       const currentUser = await User.findByIdAndUpdate(
//         req.user._id,
//         { $push: { following: req.body.unfollowId } },
//         { new: true }
//         //select("-password")
//       );
  
//       res.json(currentUser);
//     } catch (err) {
//       res.status(422).json({ error: err.message });
//     }
//   });


router.put('/unfollow', requireLogin, async (req, res) => {
    try {
  
      const unfollowedUser = await User.findByIdAndUpdate(
        req.body.unfollowId,
        { $pull: { followers: req.user._id } },
        { new: true }
      );
  
  
      const currentUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: req.body.unfollowId } },
        { new: true }
      ).select("-password");
  
      res.json(currentUser);
    } catch (err) {
      res.status(422).json({ error: err.message });
    }
  });

//   router.put('/updatepic',requireLogin,(req,res)=>{
//     User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
//         (err,result)=>{
//          if(err){
//              return res.status(422).json({error:"pic canot post"})
//          }
//          res.json(result)
//     })
// })

router.put('/updatepic', requireLogin, async (req, res) => {
  try {
      const result = await User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true });
      res.json(result);
  } catch (err) {
      res.status(422).json({ error: "pic cannot be updated" });
  }
});
router.post('/search-users',(req,res)=>{
  let userPattern = new RegExp("^"+req.body.query)
  User.find({email:{$regex:userPattern}})
  .select("_id name")
  .then(user=>{
    res.json({user});
  }).catch(err => {
    console.error(err);
  })
})




module.exports = router;
