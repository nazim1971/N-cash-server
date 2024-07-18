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

  module.exports = {sendTrans, allTransHis}