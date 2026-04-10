import dotenv from 'dotenv'
import cors from 'cors'
import express, { json } from 'express'
import { connectDB } from './db.js'
import UserRoute from './routes/UserRoute.js'
import LoanRoute from './routes/LoanRoute.js'
import LoanPlanRoute from './routes/LoanPlanRoute.js'
import LoanTypeRoute from './routes/LoanTypeRoute.js'

dotenv.config()
connectDB()

const app = express()

app.use(json())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}))

const PORT = process.env.PORT || 3000

app.get('/', (_req, res)=> {
  try{
    res.status(200).send('✅✅ Server is running')
  }catch(err){
    console.log(err.message)
  }
})

app.post('/', (_req, res)=> {
  try{
    res.status(200).send('✅✅ Server is running')
  }catch(err){
    console.log(err.message)
  }
})

app.use('/', UserRoute)
app.use('/', LoanRoute)
app.use('/', LoanPlanRoute)
app.use('/', LoanTypeRoute)


app.listen(PORT, ()=> {
  console.log(`✅✅ Server running at PORT ${PORT}`)
})

