import express from 'express'
import LoanPlan from '../schema/LoanPlanSchema.js';
import { UserMiddleware } from '../middleware/UserMiddleware.js';
import { AdminMiddleware } from '../middleware/AdminMiddleware.js';

const router = express.Router()

router.post('/loan-plans', UserMiddleware, AdminMiddleware, async (req, res) => {
  const { months, interest, penalty, loanId } = req.body;
  try {
    const plan = await LoanPlan.create({ loanId, months, interest, penalty });
    return res.status(201).json({message: 'New Loan Plan Created'});
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: 'Internal Error' })
  }
});

router.get('/loan-plans', async (_req, res) => {
  try {
    const plans = await LoanPlan.find({});
    return res.status(200).json(plans);
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: 'Internal Error' })
  }
});

router.delete('/loan-plans/:id', UserMiddleware, AdminMiddleware, async (req, res) => {
  const { loanPlanId } = req.body
  try {
    const deletedPlan = await LoanPlan.findByIdAndDelete(loanPlanId);

    if (!deletedPlan) {
      return res.status(404).json({ message: 'Loan Plan not found' });
    }

    return res.status(200).json({ message: 'Loan Plan Deleted' });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: 'Internal Error' })
  }
});

export default router