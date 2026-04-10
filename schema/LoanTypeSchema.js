import mongoose from "mongoose";

const LoanTypeScehma = new mongoose.Schema(
  {
    loanId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Loan',
      required: true 
    },
    name: { 
      type: String, 
      required: true,
      unique: true 
    },
    description: { 
      type: String 
    }
  }, {timestamps: true}
)

const LoanType = mongoose.model('LoanType', LoanTypeScehma)
export default LoanType