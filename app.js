import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import cors from "cors"; 

const app = express();
dotenv.config();
app.use(express.json());

app.use("/api/user", router); 
app.use("/api/post", postRouter);
app.use(cors());    

mongoose.connect(process.env.MONGO_URI, {
})
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error(err));

app.get('/', (req, res) => {
    res.send('Hello from Express.js has been deployed on Cloud Run in Region Asia-SouthEast2-Jakarta!');
});