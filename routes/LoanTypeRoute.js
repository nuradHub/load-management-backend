import express from 'express'
import LoanType from '../schema/LoanTypeSchema.js'; // Ensure the path and extension are correct
import { UserMiddleware } from '../middleware/UserMiddleware.js';
import { AdminMiddleware } from '../middleware/AdminMiddleware.js';

const router = express.Router()

router.post('/loan-types', UserMiddleware, AdminMiddleware, async (req, res) => {
  const { name, description, loanId } = req.body;
  try {
    const type = await LoanType.create({ name, description, loanId });
    return res.status(201).json({message: 'New Plan Type Created'});
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal Error' });
  }
});

router.get('/loan-types', async (_req, res) => {
  try {
    const types = await LoanType.find({});
    return res.status(200).json(types);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal Error' });
  }
});

router.delete('/loan-types/:id', UserMiddleware, AdminMiddleware, async (req, res) => {
  const { loanTypeId } = req.body
  try {
    const deletedType = await LoanType.findByIdAndDelete(loanTypeId);
    if (!deletedType) return res.status(404).json({ message: 'Type not found' });

    return res.status(200).json({ message: 'Loan Type Deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal Error' });
  }
});

export default router;