import mongoose from 'mongoose'

const DBCon = async()=>{
    try{
         mongoose.connect(process.env.MONGODB_URI)
         console.log('Mongodb is connected');
    }catch(error){
       console.log('mongodb not connected',error);
    }
}

export default DBCon;