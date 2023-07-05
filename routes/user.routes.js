const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const auth = require('../middleware/auth')
router.get('/users', async (req,res) =>{
    res.send('User data give a successfully...')
})

router.post('/user_create',userController.userCreate)
router.post('/login',userController.userLogin);
router.put('/userUpdate',userController.userUpdate);
router.delete('/userDelete',userController.userDelete);
router.get('/userDataget',userController.UserDataget);
router.post('/resetPsw',userController.resetPSW)
module.exports = router;