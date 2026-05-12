import express from 'express'
import User from '../schema/UserSchema.js'
import jwt from 'jsonwebtoken'
import { UserMiddleware } from '../middleware/UserMiddleware.js'
import { AdminMiddleware } from '../middleware/AdminMiddleware.js'

const router = express.Router()

router.post('/register', async(req, res)=> {
  const {fullname, email, password} = req.body
  try{

    const user = await User.create({
      fullname: fullname,
      email: email,
      password: password
    })
    
    return res.status(201).json({
      message: 'Account created successfully',
    })

  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal Error'})
  }
})

router.post('/login', async(req, res)=> {
  const {email, password} = req.body
  try{

    const user = await User.findOne({email: email})

    if(!user) return res.status(404).json({message: 'Invalid Email Address'})

    const verifyPassword = await user.comparePassword(password)

    if(!verifyPassword) return res.status(401).json({message: 'Incorrect Password'})
    
    const token = jwt.sign(
      {userId: user._id, role: user.role},
      process.env.JWT_TOKEN,
      {expiresIn: '1day'}
    )
    
    return res.status(200).json({
      userId: user._id,
      token: token,
      role: user.role,
      message: 'Login successfully',
    })

  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal Error'})
  }
})

router.get('/current/user', UserMiddleware, async(req, res)=> {

  try{

    const currentUser = await User.findById(req.userId).select('-password')

    if(!currentUser) return res.status(404).json({message: 'User not found'})
    
    return res.status(200).json(currentUser)

  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal Error'})
  }
})

router.get('/users', UserMiddleware, AdminMiddleware, async(_req, res)=> {

  try{

    const users = await User.find({role: 'user'}).select('-password')

    if(!users) return res.status(404).json({message: 'User not found'})
    
    return res.status(200).json(users)

  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal Error'})
  }
})

router.delete('/delete/user', UserMiddleware, AdminMiddleware, async(req, res)=> {
  const {userId} = req.body
  try{

    const users = await User.findByIdAndDelete(userId)

    if(!users) return res.status(404).json({message: 'User not found'})
    
    return res.status(200).json({message: 'Deleted'})

  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal Error'})
  }
})

router.put('/update-profile', UserMiddleware, async(req, res)=> {
  const {email, tel, address, taxId} = req.body
  try{

    const users = await User.findById(req.userId)

    if(!users) return res.status(404).json({message: 'User not found'})
    
    users.email = email
    users.tel = tel
    users.address = address
    users.taxId = taxId

    await users.save()
    
    return res.status(200).json({message: 'Profile Updated'})

  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal Error'})
  }
})

export default router