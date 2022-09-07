import mongoose from "mongoose";

const {Schema, model} = mongoose;


const commentsSchema = new Schema(
    {
        from : {type: String, required: true},
        comment : {type: String, required: true}
    },
    {
        timestamps:true,
    }
)

export default model("Comment", commentsSchema);