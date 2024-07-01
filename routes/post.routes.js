import express from "express";
import { getAllPosts, createPost, updatePost, getById, deletePost, getByUserId } from "../controllers/post.controller";

const postRouter = express.Router();

postRouter.get('/', getAllPosts);
postRouter.post('/createPost', createPost);
postRouter.put('/update/:id',updatePost);
postRouter.get('/:id',getById);
postRouter.delete('/delete/:id',deletePost);
postRouter.get('/user/:id', getByUserId);

export default postRouter;  