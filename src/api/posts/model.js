import mongoose from "mongoose";
import bycrypt from "bcrypt"


const { Schema , model } = mongoose


const postsSchema = new Schema(
    {
	    name: { type: String , required:true },
	    email: { type: String , required:true },
	    password:{type: String , required:true},
	    role : {type:String , enum : ["User","Admin"], default : "User"},
		comments : [{ from : String , comment : String }]          
},
{
    timestamps: true,
}
)

postsSchema.pre("save", async function(next){
	const currentUser = this
	const plainPW =  currentUser.password
	if(currentUser.isModified("password")){

		const hash = await bycrypt.hash(plainPW,11)
		currentUser.password = hash
	}
	next()
})

postsSchema.methods.toJSON = function(){
	const currentUser = this
	const user = currentUser.toObject()
	delete user.__v
	return user
}

postsSchema.static("checkCredentials", async function(email,plainPassword) {
	const user = await this.findOne({email})

	if(user){
		console.log("User : ",user);
		const isMatch = await bycrypt.compare(plainPassword,user.password)
		if(isMatch){
			return user
		}else{
			return null
		}
		
	}else{
		return null
	}
})

export default model("Posts",postsSchema)