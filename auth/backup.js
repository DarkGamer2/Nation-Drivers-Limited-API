const Admin=require("../models/Admin");
const bcrypt=require("bcryptjs");
const localStrategy=require("passport-local").Strategy;

module.exports=function(passport){
    passport.use(
        new localStrategy((adminUserName, adminPassword,done)=>{
        Admin.findOne({username:adminUserName},function(err,admin){
            if(err){
                return done(err);
            }
            else if(!admin){
                return done(null,false);
            }
            else{
                bcrypt.compare(adminPassword,admin.adminPassword,(err,result)=>{
                    if(err){
                        return done(err);
                    }
                    else if(result===true){
                        return done(null,admin);
                    }
                    else{
                        return done(null,false);
                    }
                })
            }
        });
    })
    )
    passport.seralizeUser((admin,cb)=>{
        cb(null,admin.id);
    })

    passport.deseralizeUser((id,cb)=>{
        Admin.findOne({_id:id}, (err,admin)=>{
            const adminInfo=({
                username:admin.username,
                adminPassword:admin.adminPassword
            })
            cb(err,adminInfo);
        })
    });
}