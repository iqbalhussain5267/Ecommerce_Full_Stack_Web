import mongoose from 'mongoose'
import 'dotenv/config'
const dbconnect=async()=>{
  try {
const db=await mongoose.connect(process.env.MONGO_URI)
console.log("database connected successfully")
  } catch(err){
    console.log(err,"error while connecting database")
  }
}
export default dbconnect;