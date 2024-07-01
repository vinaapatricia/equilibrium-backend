import User from '../models/user.js';
import bcrypt from 'bcrypt';

export const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }if (!users){
        return res.status(404).json({ message: 'No users found' });
    }
    return res.status(200).json({users});
};

export const register = async (req, res, next) => {
    const {username, email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email})
    }catch(err){
        return res.status(500).json({ message: err.message });
    }if (existingUser) {
        return res.status(400).json({ message: 'User already exists!  Login Instead' });
    }

    let existingUsername;
    try {
        existingUsername = await User.findOne({ username });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists, Choose the other one!' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = new User({
        username, 
        email, 
        password: hashedPassword,
        blogs : [],
    });

    try{
        await user.save();
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
    return res.status(201).json({user})
};

export const login = async (req, res, next) => {
    const {email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = bcrypt.compareSync(password, existingUser.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Wrong Password' });
    }
    return res.status(200).json({ message: 'Login Successful' });
}