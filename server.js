require("dotenv").config();
const express=require('express');
const app = express();
const Student=require("./models/Student");
const nodemailer=require("nodemailer");
const cors=require("cors");
const Admin=require("./models/Admin");
const bcrypt=require("bcrypt");
const passport = require("passport");
const expressSession = require("express-session");
const helmet=require("helmet");
const cookieParser = require("cookie-parser");
//MIDDLEWARE REQUIRED
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressSession({
  resave: false,
  saveUninitialized: true,
  secret: 'secret_code' 
}));

app.use(passport.initialize());
app.use(passport.session());
require("./auth/passportConfig")(passport)

app.use(cookieParser("secret_code"));
app.use(helmet());


//ROUTES
app.post('/api/signup',(req,res,next)=>{
const student=new Student(req.body);

student.save((err,data)=>{
  if(err){
    console.log(err.response.data);
  }
  else{
    var transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
     user: "nodejstester123@outlook.com",
                pass: "Cartownhess53"
  }
});

var mailOptions = {
  from: 'nodejstester123@outlook.com',
  to: 'kameer-hosien@outlook.com',
  subject: `${student.studentFullName} Has Signed Up For The Course!`,
  text:`Hello Mr.Huggins, here are the details of the student that signed up for your defensive
            driving course: \n
            Student Name: ${student.studentFullName}\n
            Student Email: ${student.studentEmail}\n
            Student Phone: ${student.studentPhoneNumber}\n
            Best Regards`,
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
    console.log(data);
  }
})
})

app.post('/api/adminlogin',(req,res,next)=>{
 passport.authenticate("local",(err,admin,info)=>{
  if(err) throw err;
  if(!admin) res.send("No User Exists");

  else{
    req.logIn(admin,err=>{
      if(err) throw err;
      res.send("Successfully logged in");
    })
  }
 })(req,res,next);
})

app.post('/api/adminsignup',(req,res)=>{
 Admin.findOne({adminUserName:req.body.adminUserName},async(err,doc)=>{
  if(err){
    console.log(err);
  }

  if(doc) res.send("User Already Registered");

  if(!doc){
    const hashedPassword=await bcrypt.hash(req.body.adminPassword,10)

    const newAdmin=new Admin({
      adminUserName:req.body.adminUserName,
      adminPassword:hashedPassword,
    })

    await newAdmin.save();
    res.send("User Registered Successfully");
  }
 })
});

app.get("/api/admin",(req,res)=>{
    res.send(req.admin);
})

app.put("/api/admin/resetpassword",async (req,res)=>{
  await Admin.findOneAndUpdate({adminPassword:req.body.adminPassword},req.body.adminPassword).then(()=>{
    Admin.findOne({_id:req.params.id}).then((admin)=>{
      res.send(admin);
    })
  })
})

//DASHBOARD API ROUTING
app.get('/api/admin/dashboard/viewrecords',(req,res)=>{
    Student.find((err,data)=>{
      if(err){
        console.log(err);
      }
      else{
        res.send(data);
      }
    })
});

app.get('/api/admin/dashboard/viewrecords/:id',async (req,res)=>{
await Student.findOne({_id:req.params.id}.then((err,student)=>{
  if(err){
    console.error(err);
  }
  else{
    console.log(`${student._id} retrieved`);
  }
}))
}); 

app.delete('/api/admin/dashboard/viewrecords/:id',async (req,res)=>{
await Student.findByIdAndDelete({_id:req.params.id}).then((err,student)=>{
  if(err){
    console.error(err);
  }
  else{
    res.send("Student Record was deleted successfully");
    console.log(student);
  }
})
});

app.listen(process.env.PORT,()=>{
    console.log(`Listening on port ${process.env.PORT}`);
});