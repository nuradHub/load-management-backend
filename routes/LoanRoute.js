import express from 'express'
import { UserMiddleware } from '../middleware/UserMiddleware.js'
import Loan from '../schema/LoanSchema.js';
import User from '../schema/UserSchema.js';
import { AdminMiddleware } from '../middleware/AdminMiddleware.js';
import GetTransporter from '../utills/GetTransporter.js';
import RejectedLoanHtml from '../utills/RejectedLoanHtml.js';

const router = express.Router()

router.post('/new-loan', UserMiddleware, async (req, res)=> {
  const {borrower, loanDetails, paymentDetails, amount} = req.body;
  try{
    const user = await User.findById(req.userId)

    if(!user) return res.status(404).json({message: 'User not found'})

    const accountName = paymentDetails.split(' ')[0]
    const bank = paymentDetails.split(' ')[1]
    const accountNumber = paymentDetails.split(' ')[2]

    const loan = await Loan.create({
      user: user,
      sn: user._id,
      userId: user._id,
      borrower: borrower,
      loanDetails: loanDetails,
      accountName: accountName,
      bank: bank,
      accountNumber: accountNumber,
      amount: amount
    })

    loan.sn = loan._id

    await loan.save()

    return res.status(201).json(loan)

  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal Error'})
  }
})

router.get('/loan/me', UserMiddleware, async (req, res)=> {
  try{
    const loan = await Loan.find({userId: req.userId})

    if(!loan) return res.status(404).json({message: 'No Active Loan'})

    return res.status(201).json(loan)

  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal Error'})
  }
})

router.post('/new-loan/admin', UserMiddleware, AdminMiddleware, async (req, res)=> {
  const {userId, borrower, loanDetails, paymentDetails, amount} = req.body;
  try{
    const user = await User.findById(userId)

    if(!user) return res.status(404).json({message: 'User not found'})

    const accountName = paymentDetails.split(' ')[0]
    const bank = paymentDetails.split(' ')[1]
    const accountNumber = paymentDetails.split(' ')[2]

    const loan = await Loan.create({
      user: user,
      sn: user._id,
      userId: user._id,
      borrower: borrower,
      loanDetails: loanDetails,
      accountName: accountName,
      bank: bank,
      accountNumber: accountNumber,
      amount: amount
    })

    loan.sn = loan._id

    await loan.save()

    return res.status(201).json(loan)

  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal Error'})
  }
})

router.get('/approved-amount', UserMiddleware, async (req, res) => {
  try {

    const loans = await Loan.find({ userId: req.userId }).select('approvedAmount creditScore')

    if (!loans || loans.length === 0) {
      return res.status(200).json({ 
        approvedAmount: 0, 
        creditScore: 0 
      });
    }

    const totalApprovedAmount = loans.reduce((sum, loan) => {
      return sum + (Number(loan.approvedAmount) || 0);
    }, 0);

    const userCreditScore = loans[0].creditScore || 0;

    return res.status(200).json({ 
      approvedAmount: totalApprovedAmount,
      creditScore: userCreditScore
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Error' });
  }
});

router.get('/loans/all', UserMiddleware, AdminMiddleware, async (_req, res)=> {
  try{
    const loan = await Loan.find({}).populate('user', 'fullname email tel address taxId')

    if(!loan) return res.status(404).json({message: 'No current Loan'})

    return res.status(200).json(loan)

  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal Error'})
  }
})

router.put('/reject-loan', UserMiddleware, AdminMiddleware, async (req, res) => {
  const { loanId, reason, user } = req.body;

  try {
    if (!loanId || !reason) {
      return res.status(400).json({ message: 'Loan ID and Reason are required' });
    }

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    loan.status = 'rejected';
    loan.rejectionReason = reason;
    loan.approvedAmount = 0;

    const transporter = GetTransporter()

    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: user.email,
      subject: "LOAN APPLICATION REJECTED",
      text: `YOU LOAN APPLICATION HAS BEEN REJECTED`,
      html: RejectedLoanHtml(user, reason)
    });

    await loan.save();

    return res.status(200).json({ 
      message: 'Loan application has been rejected successfully',
    });

  } catch (err) {
    console.error("Rejection Error:", err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/delete/one', UserMiddleware, AdminMiddleware, async (req, res)=> {
  const {loanId} = req.body
  try{
    const loan = await Loan.deleteOne({_id: loanId})

    if(!loan) return res.status(404).json({message: 'Loan not found'})

    return res.status(200).json({message: 'Deleted'})

  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal Error'})
  }
})

router.put('/update-payment', UserMiddleware, AdminMiddleware, async (req, res)=> {
  const {loanId, amount} = req.body
  try{
    const loan = await Loan.findOne({_id: loanId})

    if(!loan) return res.status(404).json({message: 'Loan not found'})

    loan.approvedAmount = Number(loan.approvedAmount) + Number(amount)

    loan.status = 'approved'
    loan.updatedAt = new Date();
         
    await loan.save()

    return res.status(200).json({message: 'Payment Approved'})

  }catch(err){
    console.log(err.message)
    res.status(500).json({message: 'Internal Error'})
  }
})

router.post('/pay-loan', UserMiddleware, async (req, res) => {
  const { userId, rrr, amount } = req.body;

  try {

    if (!rrr) {
      return res.status(400).json({ message: 'RRR verification number is required' });
    }

    const loans = await Loan.find({ userId: userId, status: 'approved' });

    if (!loans || loans.length === 0) {
      return res.status(404).json({ message: 'No active approved loans found for repayment' });
    }

    await Loan.updateMany(
      { userId: userId, status: 'approved' },
      { 
        $set: { 
          status: 'pending repayment',
          rrrNumber: rrr,
          repaymentDate: new Date(),
          updatedAt: new Date()
        }
      }
    );

    return res.status(200).json({ 
      message: 'Payment received. Your RRR is being verified by our team.' 
    });

  } catch (err) {
    console.error("Payment Error:", err.message);
    res.status(500).json({ message: 'Internal Error during payment processing' });
  }
});

router.put('/admin/verify-repayment', UserMiddleware, AdminMiddleware, async (req, res) => {
  const { loanId, paymentMethod } = req.body;
  try {
    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    loan.status = 'completed';
    loan.approvedAmount = 0; 
    loan.updatedAt = new Date();
    loan.paymentNotes = `Paid via ${paymentMethod || 'Manual Verification'}`;

    if(loan.creditScore >= 100){
      loan.creditScore = loan.creditScore
    }else{
      loan.creditScore = Number(loan.creditScore) + 1
    }
    
    await loan.save();

    return res.status(200).json({ message: 'Repayment Verified Successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Error' });
  }
});

export default router
