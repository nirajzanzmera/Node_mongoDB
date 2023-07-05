const User = require('../model/user.model')
const Usersession = require('../model/user_session.model')
// User Auth
async function userAuth(req,res,next){
    const headertoken = req.headers.authorization  ? req.headers.authorization : null;
    const isAuth = await Usersession.findOne({where:{token:headertoken}});
    // console.log(isAuth);
    if(isAuth != null){
      if(isAuth.user_id){
      //  console.log(isAuth.user_id);
        const user = await User.findOne({where:{id:isAuth.user_id}});
        // console.log(user);
          if(!user){
            return res.status(401).json({
              success:false,
              message:"User is not found"
  
            })
          }
          const userjson = user.toJSON();
          req.user =userjson;
          next();
      }
    }else{
      return res.status(401).json({
        success:false,
        message:"Unauthorize user"
  
      })
    }
    
  }
  
  module.exports = {
    userAuth,
    
  };