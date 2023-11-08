const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const requireLogin = require('../middleware/requireLogin')

const Post = mongoose.model("Post")


router.get('/allpost',requireLogin,(req,res) => {
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')

    .then(posts =>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.get('/getsubpost',requireLogin,(req,res) => {
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')

    .then(posts =>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err);
    })
})


router.post('/createpost',requireLogin,(req, res) =>{
    const {title,body,pic} = req.body;
    if(!title || !body || !pic){
        return res.status(422).json({error:"Please add all the fkields"})
    }
   
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err => {
        console.error(err)
    })
})


router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost => {
        res.json({mypost})
    })
    .catch(err => {
        console.log(err)
    })
})


router.put('/like',requireLogin,(req, res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).then((err,result) => {
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req, res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).then((err,result) => {
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})



router.put('/comment', requireLogin, (req, res) => {
    const comment = {
      text: req.body.text,
      postedBy: req.user._id
    };
  
    Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment }
      },
      {
        new: true
      }
    )
      .populate('comments.postedBy', '_id name')
      .populate('postedBy', '_id name')
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(422).json({ error: err.message });
      });
  });
  

//   router.delete('/deletepost/:postId',requireLogin, (req, res) => {
//     Post.findOne({_id:req.params.postId})
//     .populate("postedBy","_id")
//     .then((err,post) => {
//         if(err || !post){
//             return res.status(422).json({ error: err})
//         }
//         if(post.postedBy._id.toString() === req.user._id.toString()){
//               post.remove()
//               .then(result=>{
//                 res.json(result)
//               }).catch(err => {
//                 console.log(err)
//               })
//         }
//     })
//   })

router.delete('/deletepost/:postId', requireLogin, async (req, res) => {
    try {
      const postId = req.params.postId;
      const deletedPost = await Post.findByIdAndDelete(postId);
  
      if (!deletedPost) {
        return res.status(422).json({ error: "Post not found" });
      }
  
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  router.delete('/deletecomment/:postId/:commentId', requireLogin, (req, res) => {
    Post.findById(req.params.postId)
      .populate("comments.postedBy", "_id name")
      .then((post) => {
        if (!post) {
          return res.status(422).json({ message: "Post not found" });
        }

        const commentIndex = post.comments.findIndex(
          (comment) => comment._id.toString() === req.params.commentId.toString()
        );

        if (commentIndex !== -1 && post.comments[commentIndex].postedBy._id.toString() === req.user._id.toString()) {
          post.comments.splice(commentIndex, 1);
          post.save().then((result) => {
            res.json(result);
          }).catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
          });
        } else {
          res.status(422).json({ message: "Comment not found or unauthorized" });
        }
      }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      });
  });

  
  

module.exports = router