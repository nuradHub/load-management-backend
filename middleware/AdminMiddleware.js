export const AdminMiddleware = (req, res, next)=> {
  try{
    if(req.role === 'admin'){
      return next()
    }else{
      return res.status(401).json({message: 'Unauthorozed'})
    }
  }catch(err){
    console.log(err.message)
    res.status(401).json({message: 'Unauthorozed'})
  }
}