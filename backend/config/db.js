const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/userAuth",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
).then(()=>{
    console.log("mongodb connected");
})
.catch((err)=>{
    console.log("error in connecting");
    
})