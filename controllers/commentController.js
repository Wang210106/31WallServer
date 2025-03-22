const express = require('express');
const router = express.Router();
const likeModel = require('../models/likeModel');

//评论的点赞

router.post('/like', (req, res) => {
    const { userid, commentid } = req.body;
 
    if (!userid || !commentid) {
        return res.status(400).json({ error: 'userid and commentid are required' });
    }
 
    likeModel.isCommentLiked(userid, commentid, (err, isLiked) => {
        if (err) {
            console.error('Error checking like:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
 
        if (isLiked) {
            return res.status(400).json({ error: 'User has already liked this comment' });
        } else {
            likeModel.createCommentLike({ userid, commentid }, (err, result) => {
                if (err) {
                    console.error('Error creating like:', err.message);
                    return res.status(500).json({ error: 'Internal server error' });
                }
 
                res.json(result);
            });
        }
    });
});


router.delete('/like', (req, res) => {
    const { userid, postid } = req.query;

    likeModel.deleteCommentLikes({ userid, commentid }, (err, result) => {
        return res.json(result)
    })
})

router.get('/like/amount', (req, res) => {
    const commentId = req.query.commentid

    likeModel.findCommentsLikesAmount(commentId, (err, result) => {
        if(err){
            return res.status(500).json({ message: 'found failed' })
        }

        res.json(result)
    })
})

router.get('/like/postid', (req, res) => {
    const postId = parseInt(req.query.postid, 10); 
   
    if (isNaN(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    likeModel.findLikesByPostId(postId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "not found" });
        }
    
        res.json({ length:result.length, result });
    })
})

router.get('/like/userid', (req, res) => {
    const userId = parseInt(req.query.userid, 10); 
   
    if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    likeModel.findLikesByUserId(userId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "not found" });
        }
    
        res.json({ length:result.length, result });
    })
})

module.exports = router;
