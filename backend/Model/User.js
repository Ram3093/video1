const mongoose=require("mongoose");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
var userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    cnfmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userSchema.methods.generateAuthToken=async function(){
    try{
await this.save();
    }catch(error){
res.send("the error part"+error);
console.log("the error part"+error);
    }
}

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
        this.cnfmpassword=await bcrypt.hash(this.password,10);
    }
   
   next();
})

module.exports=mongoose.model("User",userSchema);