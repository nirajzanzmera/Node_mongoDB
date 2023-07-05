const User = require('../model/user.model');
const Order = require('../model/Order.model');
const config = require('../config/config')
const user_session = require('../model/user_session.model')
const Validator = require('validatorjs')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// User data create

async function userCreate(req, res) {

    try {
        let { name, email, password } = req.body;
        let validation = new Validator(req.body, {
            name: 'required',
            email: 'required|email',
            password: 'required',
        });
        if (validation.fails()) {
            const key = Object.keys(validation.errors.all())[0];
            const error = validation.errors.first(key)
            return res.send(error)
        }
        //User exist
        const isExist = await User.findOne({ email: email })
        if (isExist) {
            return res.status(401).send({
                status: false,
                msg: "User is already exist"
            })
        }
        // encrypting password
        let hashPass = bcrypt.hashSync(password, 10);

        const user = { name: name, email: email, password: hashPass };
        const userCreate = await User.create(user)
        const userjson = userCreate.toJSON();
        // Token genrate
        var token = await jwt.sign({email,id:userCreate.id},config.token_key);
        await user_session.create({user_id:userCreate.id,token})
        userjson.token=token;
        return res.send({
            status: true,
            msg: "User is sucessfully Signup.... ",
            data: userjson
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({
            status: false,
            msg: error
        })
    }
}
// User Login 
async function userLogin(req, res) {
    try {
        let { email, password } = req.body;
        let validation = new Validator(req.body, {
            email: 'required|email',
            password: 'required'
        });
        if (validation.fails()) {
            const key = Object.keys(validation.errors.all())[0];
            const error = validation.errors.first(key)
            return res.send(error)
        }
        const object = await User.findOne({ email: email })
       
        if (!object) {
                return res.status(200).send({
                    status: false,
                    msg: "user not exist"
                })
            }
        if(!(await bcrypt.compare(password,object.password))){
            return res.json({
              status:false,
              message:"User email and password is not valid!"
            })
          }
        
        const object1 = await User.findOne({email:email})
        const jsondata = object1.toJSON();
        var token = await jwt.sign({id:object.id,email:object.email},config.token_key);    
        await user_session.create({user_id:object.id,token})
        jsondata.token=token;
         return res.status(200).send({
            status:true,
            msg:"user successfully login",
            data:jsondata
         })
    
    } catch (error) {
        console.log(error)
        res.send({
            status: 404,
            msg: error
        })
    }
}

// User update
async function userUpdate(req,res){
    try {
        let validation = new Validator(req.body, {
            name: 'required',
            password: 'required',
        });
        if (validation.fails()) {
            const key = Object.keys(validation.errors.all())[0];
            const error = validation.errors.first(key)
            return res.send(error)
        }
        var id = req.query._id;
        var {name,password} = req.body;
        if(password){
            password = await bcrypt.hash(req.body.password, 10)
        }
        var user ={
            name:name
        }
      await User.findByIdAndUpdate(id,user);
      const userUpdate =await User.findOne({_id:id})
      
        res.status(200).json({ success: true, userUpdate});

       
 } catch (error) {
        console.log(error);
        res.json({
            status: false,
            massage: error,
        })
    }
}

// Delete User
async function userDelete(req,res){
    try {
        var id = req.query._id;
      
       const user = await User.findByIdAndDelete(id);
       if(!user){
        return res.status(401).send({
            status:false,
            msg:"User is not found.."
        })
       }
       return res.status(201).send({
        status:true,
        msg:"User Sucessfully Delete..."
       })
    } catch (error) {
        console.log(error);
        res.json({
            status: false,
            massage: error,
        })
    }
}
// All user data are find
async function UserDataget(req,res){
    try {
        // var id = req.query._id;
      
       const user = await User.find();
       if(!user){
        return res.status(401).send({
            status:false,
            msg:"User is not exit.."
        })
       }
       return res.status(201).send({
        status:true,
        msg:"User data  Sucessfully Get..",
        data:user
       })
    } catch (error) {
        console.log(error);
        res.json({
            status: false,
            massage: error,
          
        })
    }
}

// User Password reset
async function resetPSW(req,res){
    try {
        var id = req.query._id;
        let {password,newpsw,cpsw} = req.body;
        let validation = new Validator(req.body, {
            password: 'required',
            newpsw:'required',
            cpsw:'required'
        });
        if (validation.fails()) {
            const key = Object.keys(validation.errors.all())[0];
            const error = validation.errors.first(key)
            return res.send(error)
        }
        const data = await User.findOne({_id:id});
        if(data){
            if(newpsw == cpsw){
                if(password,data.password){
                    var npswhash = bcrypt.hashSync(newpsw,10);
                   await User.findOneAndUpdate({_id:id},{password:npswhash});
                }else{
                    res.status(401).send({
                        status:false,
                        msg:"Given Password is wrong.."
                    })
                }
            }else{
                res.status(401).send({
                    status:false,
                    msg:"Confirm password and newpassword not match"
                })
            }
        }
        const data1 = await User.findOne({_id:id});
        res.status(201).send({
            status:true,
            msg:"Password successfully changed",
            data:data1
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            status: false,
            massage: error
        })
    }
}

module.exports = {
    userCreate,
    userLogin,
    userUpdate,
    userDelete,
    UserDataget,
    resetPSW
}