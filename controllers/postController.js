const express = require('express');
const router = express.Router();
const postModel = require('../models/postModel'); 
const likeModel = require('../models/likeModel');
const commentModel = require('../models/commentModel');

router.post('/', (req, res) => {
    const post = req.body;

    if(!post.userid){
        return res.status(400).json({ message: 'No userid' })
    }

    postModel.createPost(post, (err, result) => {
        if(err){
            return res.status(400).json({ message: "Created defeated", result })
        }

        res.json(result)
    })
})
 
router.get('/all', (req, res) => {
    const page = parseInt(req.query.page, 10) || 0; 
 
    postModel.getPostsList(page, (error, posts) => {
        if (error) {
            return res.status(500).json({ message: 'Internal error' });
        }

        res.json(posts);
    });
});

router.delete('/', (req, res) => {
    const postId = parseInt(req.query.postid, 10); 
   
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
       
        res.json({ result });
    })
})

router.get('/tab', (req ,res) => {
    const { tab, page } = req.query; 

    postModel.searchPostByTab({ tab, count: page, }, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "not found" });
        }
    
        res.json(result);
    })
})

router.get('/userid', (req, res) => {
    const userId = parseInt(req.query.userid, 10); 
   
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    postModel.findPostsByUserId(userId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "not found" });
        }
    
        res.json(result);
    })
})

//点赞
router.post('/like', (req, res) => {
    const { userid, postid } = req.body;
 
    if (!userid || !postid) {
        return res.status(400).json({ error: 'userid and postid are required' });
    }
 
    likeModel.isLiked(userid, postid, (err, isLiked) => {
        if (err) {
            console.error('Error checking like:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
 
        if (isLiked) {
            return res.status(400).json({ error: 'User has already liked this post' });
        } else {
            likeModel.createLike({ userid, postid }, (err, result) => {
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

    likeModel.deleteLikes({ userid, postid }, (err, result) => {
        return res.json(result)
    })
})

router.get('/like/all', (req, res) => {
    likeModel.getLikesList((error, likes) => {
        if (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.json(likes);
    });
})

router.get('/like/amount', (req, res) => {
    const postId = req.query.postid

    likeModel.findLikesAmount(postId, (err, result) => {
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

//评论的点赞

router.post('/commentLike', (req, res) => {
    const userid = parseInt(req.query.userid, 10); 
    const commentid = parseInt(req.query.commentid, 10); 

    likeModel.isCommentLiked(userid, commentid, (err, isRes) => {
        if (err) {
            return res.status(500).json({ message: "create wrongly" });
        }

        //已经点赞过
        if (isRes){
            likeModel.deleteCommentLikes({ userid, commentid }, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "delete wrongly" });
                }

                res.json({result : 'delete commentLike successfully'})
            })
        }
        else{
            likeModel.createCommentLike({ userid, commentid }, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "create wrongly" });
                }

                res.json({result : 'create commentLike successfully'})
            })
        }
    })
    
})

//搜索
router.get('/search', (req, res) => {
    const keyWord = req.query.key;

    if (!keyWord)
        return res.status(400).json({ message: 'Keyword Can\'t be Null' });
    
    postModel.search(keyWord, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "err!" });
        }
    
        res.json(result);
    })
})

router.get('/tab', (req, res) => {
    const { tab, page } = req.query;

    if (!tab || !page)
        return res.status(400).json({ message: 'Tab and page Can\'t be Null' });
    
    postModel.searchPostByTab({ tab, count: page, }, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "err!" });
        }
    
        res.json(result);
    })
})

//评论
router.post('/comment', (req, res) => {
    const { userid, postid, comment, anonymous } = req.body;

    if (!userid || !postid) {
        return res.status(400).json({ error: 'user_id and post_id are required' });
    }

    commentModel.createComment({ userid, postid, comment, anonymous }, (err, result) => {
        if (err) {
            console.error('Error creating like:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json(result);
    });
});

router.delete('/comment', (req, res) => {
    const commentid = req.query.commentid;

    commentModel.deleteComments(commentid, (err, result) => {
        return res.json(result)
    })
})

router.get('/comment/all', (req, res) => {
    commentModel.getCommentsList((error, likes) => {
        if (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.json(likes);
    });
})

router.get('/comment/postid', (req, res) => {
    const postId = parseInt(req.query.postid, 10);
    const userId = parseInt(req.query.userid, 10);
 
    if (isNaN(postId)) {
        return res.status(400).json({ message: 'Invalid post ID' });
    }
 
    commentModel.findCommentsByPostId(postId, (err, comments) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
 
        if (comments.length === 0) {
            return res.json({ length: 0, result: [] });
        }
 
        // 创建评论ID到评论对象的映射
        const commentMap = {};
        // 存储没有父评论的顶级评论
        const topLevelComments = [];
 
        // 首先将所有评论存入映射表
        comments.forEach(comment => {
            commentMap[comment.comments_id] = {
                ...comment,
                replies: [] // 初始化回复数组
            };
        });
 
        // 构建评论树结构
        comments.forEach(comment => {
            if (comment.parent_id) {
                // 次级评论
                const parentComment = commentMap[comment.parent_id];
                if (parentComment) {
                    parentComment.replies.push(commentMap[comment.comments_id]);
                } else {
                    // 顶级评论
                    topLevelComments.push(commentMap[comment.comments_id]);
                }
            } else {
                // 顶级评论
                topLevelComments.push(commentMap[comment.comments_id]);
            }
        });
 
        // 处理点赞信息的函数
        const processLikes = (commentArray, callback) => {
            let processed = 0;
            const total = commentArray.length;
            let hasError = false;
 
            if (total === 0) return callback(null, commentArray);
 
            commentArray.forEach((comment, index) => {
                likeModel.findCommentsLikesAmount(comment.comments_id, (err, cres) => {
                    if (hasError) return;
                    if (err) {
                        hasError = true;
                        return callback(err);
                    }
 
                    likeModel.isCommentLiked(userId, comment.comments_id, (err, isRes) => {
                        if (hasError) return;
                        if (err) {
                            hasError = true;
                            return callback(err);
                        }
 
                        // 更新当前评论的点赞数和点赞状态
                        commentArray[index].likes_count = cres[0]['COUNT(*)'];
                        commentArray[index].isLiked = isRes;
 
                        // 如果有回复，递归处理回复的点赞信息
                        if (commentArray[index].replies && commentArray[index].replies.length > 0) {
                            processLikes(commentArray[index].replies, (err) => {
                                if (err) {
                                    hasError = true;
                                    return callback(err);
                                }
 
                                processed++;
                                if (processed === total) {
                                    callback(null, commentArray);
                                }
                            });
                        } else {
                            processed++;
                            if (processed === total) {
                                callback(null, commentArray);
                            }
                        }
                    });
                });
            });
        };
 
        // 处理所有评论及其回复的点赞信息
        processLikes(topLevelComments, (err, processedComments) => {
            if (err) {
                return res.status(500).json({ message: 'Error processing likes' });
            }
 
            res.json({ 
                length: topLevelComments.length, 
                result: topLevelComments 
            });
        });
    });
});

router.get('/comment/userid', (req, res) => {
    const userId = parseInt(req.query.userid, 10); 
   
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    commentModel.findCommentsByUserId(userId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "not found" });
        }
    
        res.json({ length:result.length, result });
    })
})

router.get('/comment/amount', (req, res) => {
    const postId = req.query.postid

    commentModel.findCommentsAmount(postId, (err, result) => {
        if(err){
            return res.status(500).json({ message: 'found failed' })
        }

        res.json(result)
    })
})

module.exports = router;