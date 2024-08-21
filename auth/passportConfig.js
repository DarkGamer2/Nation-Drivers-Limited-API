const Admin=require("../models/Admin");
const bcrypt=require("bcrypt");

const localStrategy = require("passport-local").Strategy;

module.exports=function(passport){
    passport.use(
        new localStrategy((adminUserName,adminPassword,done)=>{
            Admin.findOne({adminUserName:adminUserName},(err,admin)=>{
                if(err) throw err;

                if(!admin){
                    return done(null,false);
                }

                bcrypt.compare(adminPassword,admin.adminPassword,(err,isMatch)=>{
                    if(err) throw err;

                    if(isMatch===true){
                        return done(null,true);
                    }
                    else{
                        return done(null,false);
                    }
                })
            })
        })
    )

    passport.serializeUser((admin,cb)=>{
        cb(null,admin.id);
    })

    passport.deserializeUser((id,cb)=>{
        Admin.findById({_id:id},(err,admin)=>{
            cb(err,admin);
        })
    })
}