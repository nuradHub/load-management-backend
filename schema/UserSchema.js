import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [5, "Password must be at least 5 characters"]
  },
  tel: {
    type: String
  },
  address: {
    type: String
  },
  taxId: {
    type: String
  },
  role: {
    type: String,
    default: 'user'
  }
}, {timestamps: true})

UserSchema.pre('save', async function () {
  if(!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  
})

UserSchema.methods.comparePassword = async function (currentPassword){
  return await bcrypt.compare(currentPassword, this.password)
}

const User = mongoose.model('User', UserSchema)

export default User