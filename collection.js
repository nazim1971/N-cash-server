const connectDB = require("./db");


let usersCollection;
let sendTransCollection;

const getUsersCollection = async () => {
  if (!usersCollection) {
    const db = await connectDB();
    usersCollection = db.collection('users');
  }
  return usersCollection;
};

const getsendTransCollection = async () => {
  if (!sendTransCollection) {
    const db = await connectDB();
    sendTransCollection = db.collection('sendTrans');
  }
  return sendTransCollection;
};

const getCashOutCollection = async () => {
  if (!sendTransCollection) {
    const db = await connectDB();
    cashoutCollection = db.collection('cashout');
  }
  return cashoutCollection;
};



module.exports = {
    getUsersCollection,
    getsendTransCollection,
    getCashOutCollection
  };