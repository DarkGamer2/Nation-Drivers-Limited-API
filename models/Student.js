require("dotenv").config();
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const bcrypt=require('bcryptjs');

mongoose.connect(process.env.MONGO_URI)
const studentSchema = new Schema({
    studentFullName:String,
    studentEmail:String,
    studentPhoneNumber:String,
    class_date:Date
});

// studentSchema.pre('save', async function(next) {
//     try{
//         const student = this;
//         if(!student.isModified('studentPassword')) next();

//         const salt=await bcrypt.genSalt(10);

//         const hashedPassword=await bcrypt.hash(salt,this.studentPassword);
//         this.studentPassword=hashedPassword;
//         next();
//     }
//    catch(error){
//     return next(error);
//    }
// });

const Student=mongoose.model('Student',studentSchema);

module.exports=Student;