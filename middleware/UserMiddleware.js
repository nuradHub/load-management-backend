import jwt from 'jsonwebtoken'

export const UserMiddleware = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_TOKEN)

      req.userId = decoded.userId
      req.role = decoded.role

      next()
    }catch (err) {
      console.log(err.message)
      res.status(401).json({message: 'You are not authorized'})
    }

    if(!token){
      res.status(401).json({message: 'You are not authorized'})
    }
  }
}