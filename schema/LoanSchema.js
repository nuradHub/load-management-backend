import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sn: {
    type: String
  },
  borrower: {
    type: String,
    required: true 
  },
  loanDetails: {
    type: String,
    required: true 
  },
  amount: {
    type: Number,
    required: true 
  },
  approvedAmount: {
    type: Number,
    default: 0
  },
  creditScore: {
    type: Number,
    default: 0
  },
  status:{
    type: String,
    default: 'pending'
  },
  accountName: {
    type: String,
    required: true 
  },
  bank: {
    type: String,
    required: true 
  },
  accountNumber: {
    type: String,
    required: true 
  },
  rrrNumber: {
    type: String,
    default: ""
  },
  repaymentDate: {
    type: Date
  },
  paymentNotes:{
    type: String,
    default: ""
  },
  rejectionReason: {
    type: String,
    default: ""
  },
}, {timestamps: true})

const Loan = mongoose.model('Loan', LoanSchema)
export default Loan