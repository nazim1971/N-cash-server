const { getsendTransCollection } = require("../collection");


const sendTrans = async(req,res)=>{
    const sendTransCollection = await getsendTransCollection()
    const query = req.body;
    const result = await  sendTransCollection.insertOne(query);
    res.json(result);
  }

     // get all transaction history
     const allTransHis = async(req,res)=>{
      const sendTransCollection = await getsendTransCollection()
      const result = await sendTransCollection.find({status: 'success'}).toArray()
      res.json(result)
     }

     const singleUserReq = async(req,res)=>{
      const sendTransCollection = await getsendTransCollection();
      const email = req.query.email;
      const result = await sendTransCollection.find({status: 'pending', 
          $or: [
         { senderEmail: email },
         { reciverEmail: email }
     ] }).toArray();
      res.json(result)
     }

     // get user all success trans 
     const userAllTrans = async(req,res)=>{
      const sendTransCollection = await getsendTransCollection();
      const email = req.query.email;
      const result = await sendTransCollection.find({status: 'success', $or: [
         { senderEmail: email },
         { receiverEmail: email }
     ] }).toArray();
      res.json(result)
     }

     // update status pending to success
         //update send amount 
    const updateStatus = async(req,res)=>{
      const sendTransCollection = await getsendTransCollection();
      const { email, status } = req.body;
      const filter = { email};
      const updateDoc = {  $set: { status: status }};
    const result = await sendTransCollection.updateOne(filter, updateDoc);
    res.json({ message: 'Update Status' });
    }

  module.exports = {sendTrans, allTransHis, singleUserReq, userAllTrans, updateStatus}