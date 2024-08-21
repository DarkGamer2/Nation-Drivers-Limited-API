require("dotenv").config();
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

mongoose.connect(process.env.MONGO_URI)

const adminSchema=new Schema({
    adminUserName:{
        type:String,
        required:true,
        trim:true
    },
    adminEmail:{
        type:String,
    },
    adminPassword:{
        type:String,
        required:true,
        trim:true,
        required:[true,"Please enter a password"],
        minlength:[6,"Password must be at least 6 characters"]
        
    }
});


const Admin=mongoose.model("Admin",adminSchema);

module.exports=Admin;