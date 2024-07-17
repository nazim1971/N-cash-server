const { getsendTransCollection } = require("../collection");


const sendTrans = async(req,res)=>{
    const sendTransCollection = await getsendTransCollection()
    const query = req.body;
    const result = await  sendTransCollection.insertOne(query);
    res.json(result);
  }

  module.exports = {sendTrans}