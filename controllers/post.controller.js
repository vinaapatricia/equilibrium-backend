import Blog from '../models/post';
import User from '../models/user';
import mongoose from 'mongoose';


export const getAllPosts = async (req, res, next) =>{
    let blogs;

    try{
        blogs = await Blog.find();
    }catch(err){
        return console.log(err);
    }if (!blogs){
        return res.status(404).json({ message: 'No posts found' });
    }
    return res.status(200).json({blogs})
}

export const createPost = async (req, res, next) => {
    const { title, image, content, user, status } = req.body;

    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch (err) {
        return console.log(err);
    }
    if (!existingUser) {
        return res.status(400).json({ message: 'Unable to find user by this id' });
    }

    const blog = new Blog({
        title,
        image,
        content,
        user,
        status,
    });

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog);
        await existingUser.save({session});
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }
    return res.status(200).json({blog});
    
};

export const updatePost = async (req, res, next) => {
    const {title, content, status, image} = req.body;
    const blogId = req.params.id;
    let blog;

    try {
        blog = await Blog.findByIdAndUpdate(blogId,{
            title,
            content,
            status,
            image,
        })
    } catch (err) {
        return console.log(err);
    } if (!blog){
        return res.status(500).json({ message: 'Unable to Update Post' });
    }
    return res.status(200).json({ blog });
};

export const getById = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    
    try {
        blog = await Blog.findById(id);
        } catch (err) {
        return console.log(err);
    }
    if (!blog) {
        return res.status(404).json({message: 'No posts found'});
    }
    return res.status(200).json({ blog });

}

export const deletePost = async (req, res, next) => { 
    const id = req.params.id;
    let blog;

    try {
        blog = await Blog.findByIdAndDelete(id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
        } catch (err) {
        return console.log(err);
    }
    if (!blog) {
        return res.status(404).json({message: 'No posts found to delete'});
    }
    return res.status(200).json({ message: 'Post deleted successfully' });
}

export const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {   
        userBlogs = await User.findById(userId).populate("blogs");
    } catch(err) {
        return console.log(err);
    }
    if (!userBlogs) {
        return res.status(404).json({ message: 'No Posts found'});
        }
    return res.status(200).json({ blogs: userBlogs });
}
