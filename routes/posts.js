const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const tokenVerifier = require('./verifyToken');


//get back all the post
router.get('/', tokenVerifier,  async (req, res) => {
    try{
        const posts = await Post.find();
        res.json(posts);
    }catch(err){
        req.json({message: err});
    }
});


//SUBMITS A POST
router.post('/', async (req, res) => {
    console.log(req.body);
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });

    await post.save()
        .then(data => {
            res.json(data);
        })
        .catch( err => {
            console.log('test', err);
            res.json({message: err});
        });
});

router.get('/:postId',tokenVerifier,  async (req, res) => {
    console.log(req.params.postId);
    try{
        const post  = await Post.findById(req.params.postId);
        res.json(post);    
    }catch(err){
        res.json({message: err});
    }
});

router.delete('/:postId', async (req, res) => {
    try{
        const removedPost = await Post.remove({_id: req.params.postId});
        res.json(removedPost);
    }catch(err){
        res.json({message: err});
    }
});

//update a post
router.patch('/:postId', async (req, res) => {
    try{
        const updatedPost = await Post.updateOne(
            {_id: req.params.postId}, 
            { $set: {title: req.body.title}}
            );
        res.json(updatedPost);
    }catch(err){
        res.json({message: err});
    }
});


module.exports = router;