import mongoose from "mongoose";

const LoanPlanScehma = new mongoose.Schema(
  {
    loanId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Loan',
      required: true 
    },
    months: { 
      type: Number, 
      required: true 
    },
    interest: { 
      type: Number, 
      required: true 
    },
    penalty: { 
      type: Number, 
      default: 2 
    }
  }, {timestamps: true}
)

const LoanPlan = mongoose.model('LoanPlan', LoanPlanScehma)
export default LoanPlan