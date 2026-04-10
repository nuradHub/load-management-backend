import mongoose from 'mongoose'

export const connectDB = async ()=> {
  try{
    await mongoose.connect(process.env.MONGODB_STRING, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    })
    console.log('connected to mongodb ✅')
  }catch(err){
    console.log(err.message)
    process.exit(1)
  }
}