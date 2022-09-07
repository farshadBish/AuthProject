import express  from "express";
import listEndpoints from "express-list-endpoints";
import cors from 'cors'
import mongoose from "mongoose";
import postsRouter from "./api/posts/index.js";
import { unauthorizedErrorHandler, forbiddenErrorHandler,notFoundErrorHandler, genericErroHandler  } from "./errorHandlers.js";


const server = express();
const port = process.env.PORT || 3001 



//middlewares 
server.use(cors())
server.use(express.json())

//EndPoints

server.use("/blogPosts", postsRouter)


//ErrorHandlers
server.use(unauthorizedErrorHandler)
server.use(forbiddenErrorHandler)
server.use(notFoundErrorHandler)
server.use(genericErroHandler)

mongoose.connect(process.env.MONGO_CONNECTION_URL)

mongoose.connection.on("connected", ()=>{
    console.log("succesfuly connected to MongoDB");
    server.listen(port,()=>{
        console.table(listEndpoints(server))
        console.log(`server is running on port ${port}`);
    })
})