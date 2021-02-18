const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('../Model/User')


exports.login=async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        const user=await User.findOne({email:email});
        if(user){
            const isMatch=await bcrypt.compare(req.body.password,user.password);
            if(isMatch){
                res.status(200).json({
                    message: "logged in successfully!",           
                })
            }
            else{
                res.status(403).json({
                    error:"incorrect password!"
                })
            }
        }
        else{
            res.status(403).json({
                message:"email does not exist!"
            })
        }
    }

    
       
    catch(err){
        res.status(400).json({
            message:'error fetching user details!'
        })
    }
}
       

exports.signUp=async(req,res,next)=>{
    try{
        const password=req.body.password;
        const cnfmpassword=req.body.cnfmpassword;
        if(password===cnfmpassword){
            const userRegister=new User({
                email:req.body.email,
                password:req.body.password,
                cnfmpassword:req.body.cnfmpassword
            })

            const token= await userRegister.generateAuthToken();
         
           
            const result=await userRegister.save();
            console.log('after save');
            res.status(200).json({
                message: "Successfully registered",
               
            })   
           
        }
        else{
            res.send("password not matching");
        }
    }
    catch(error){
res.status(400).json({message:"in try error"});
    }
}

