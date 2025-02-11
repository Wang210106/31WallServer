const express = require('express');
const router = express.Router();
const postModel = require('../models/postModel'); 

router.post('/', (req, res) => {
    const post = req.body;

    postModel.createPost(post, (err, result) => {
        if(err){
            return result.status(400).json({ message: "Created defeated" })
        }

        res.json(result)
    })
})

router.get('/all', (req, res) => {
    postModel.getPostsList((error, posts) => {
        if (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.json(posts);
    });
})

router.delete('/', (req, res) => {
    const postId = parseInt(req.query.postId, 10); 
   
    if (isNaN(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
   
    postModel.deletePost(postId, (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
   
      res.json({ message: 'Post deleted successfully', deletedPostId: postId });
    });
});

router.get('/', (req, res) => {
    const postId = parseInt(req.query.postid, 10); 
   
    if (isNaN(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    postModel.findPostByPostId(postId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "not found" });
        }
       
        res.json({ message: 'Post deleted successfully', result });
    })
})

router.get('/userid', (req, res) => {
    const userId = parseInt(req.query.userid, 10); 
   
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    postModel.findPostsByUserId(userId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "not found" });
        }
    
        res.json(result);
    })
})

module.exports = router;