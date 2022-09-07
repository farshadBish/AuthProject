import  express  from "express";
import createHttpError from "http-errors";
import PostsModel from "./model.js"
import CommentsModel from "../comments/model.js"
import { simpleAutMiddleware } from "../../lib/aut/index.js";

const postsRouter = express.Router();

postsRouter.post("/",async (req,res,next)=> {
    try {
        const newPost = new PostsModel(req.body) //validation
        const { _id } = await newPost.save() // the id
        res.status(201).send({_id}) // when the post is succesfull we get the id 
    } catch (error) {
        next(error)
    }
})
postsRouter.get("/", simpleAutMiddleware, async (req,res,next)=> {
    try {
        const posts = await PostsModel.find()
        res.send(posts)
    } catch (error) {
        next(error)
    }
})
postsRouter.get("/me",simpleAutMiddleware, async(req,res,next) =>{

    try {
        res.send(req.user)
    } catch (error) {
        next(error)
    }
})
postsRouter.put("/me",simpleAutMiddleware, async(req,res,next) =>{

    try {
        const updatedUser = await UsersModel.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    if (updatedUser) {
      res.send(updatedUser)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
    } catch (error) {
        next(error)
    }
})
postsRouter.delete("/me",simpleAutMiddleware, async(req,res,next) =>{

    try {
        await UsersModel.findByIdAndDelete(req.user._id)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})
postsRouter.get("/:postId",simpleAutMiddleware, async (req,res,next)=> {
    try {
        const post = await PostsModel.findById(req.params.postId)
        if(post){
            res.send(post)
        } else {
            next(createHttpError(404, `Post with id ${req.params.postId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})
postsRouter.put("/:postId",simpleAutMiddleware, async (req,res,next)=> {
    try {
        const updatedPost = await PostsModel.findByIdAndUpdate(
            req.params.postId,
            req.body,
            { new:true,runValidators:true}
        )
        if(updatedPost){
            res.send(updatedPost)
        } else {
            next(createHttpError(404, `Post with id ${req.params.postId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})
postsRouter.delete("/:postId", simpleAutMiddleware, async (req,res,next)=> {
    try {
        const deletedPost = await PostsModel.findByIdAndDelete(req.params.postId)
        if (deletedPost){
            res.status(204).send()
        } else {
            next(createHttpError(404, `Post with id ${req.params.postId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

// Comments EndPoint

postsRouter.post("/:postId/comment", async (req,res,next) => {
    try {
        const newComment = new CommentsModel(req.body)

        const updatedPost = await PostsModel.findByIdAndUpdate(
            req.params.postId,
            {$push: { comments : newComment}},
            {new: true , runValidators:true}
        )
        if(updatedPost){
            console.log(updatedPost);
            res.send(updatedPost)
        } else {
            next(createHttpError(404, `Post with id ${req.params.postId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})
postsRouter.get("/:postId/comment", async (req,res,next) => {
    try {
        const post = await PostsModel.findById(req.params.postId)
        if(post){
            res.send(post.comments)
        } else {
            next(createHttpError(404, `Post with id ${req.params.postId} not found!`))
        }
    } catch (error) {
        
    }
})
postsRouter.get("/:postId/comment/:commentId", async (req,res,next) => {
    try {
        const post = await PostsModel.findById(req.params.postId)
        if(post){
            const postedComment = post.comments.filter( aComment => req.params.commentId === aComment._id.toString() )
            if (postedComment){
                res.send(postedComment[0])
            } else {
                next(createHttpError(404, `Comment with id ${req.params.postId} not found!`))
            }
        } else {
            next(createHttpError(404, `Post with id ${req.params.postId} not found!`))
        }
    } catch (error) {
        
    }
})
postsRouter.put("/:postId/comment",(req,res,next) => {
    try {
        
    } catch (error) {
        
    }
})
postsRouter.delete("/:postId/comment",(req,res,next) => {
    try {
        
    } catch (error) {
        
    }
})



export default postsRouter;