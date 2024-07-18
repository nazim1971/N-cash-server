
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { getUsersCollection } = require("../collection");


// Create User

const addUser = async (req, res) => {
  const usersCollection = await getUsersCollection();
  try {
 // Check if user exists
    const userExists = await usersCollection.findOne({
      $or: [ { email: req.body.email }, { number: req.body.number } ]  });
    if (userExists) {  return res.status(409).json("User already exists"); }
    // Create new user
    const newUser = req.body;
    const {pinNumber} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(pinNumber, salt);
    newUser.pinNumber = hash;
    const result = await usersCollection.insertOne(newUser);
    res.json(result);
  } catch (err) { res.status(500).json({ Error: "Server error" }); } 
};


//login user

const login = async (req, res) => {
  const usersCollection = await getUsersCollection();
   const { pinNumber, email, number } = req.body;
    try {
      // Check if user exists by email or number
      const user = await usersCollection.findOne({ $or: [ { email },  { number } ] });
      if (!user) {  return res.json({ Status: "User Not Found" }); }

      // Check pin number
      const pinNumberMatch = await bcrypt.compare(pinNumber, user.pinNumber);
      if (!pinNumberMatch) { return res.json({ Status: "Wrong Pin Number" }); }

      // Generate JWT token
      const { pinNumber: userPinNumber, ...userWithoutPinNumber } = user;
      const userEmail = user.email;
      const token = jwt.sign({ email: userEmail }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
     res.cookie('token', token, { httpOnly: true }).json({ Status: "Success", User: userWithoutPinNumber });
    } catch (err) { res.status(500).json({ Error: "Login error in server" }); }
  };

        // logout user
const logoutUser = async (req,res)=>{
  res.clearCookie("token",{
      secure: true,
      sameSite: "none"
  }).json({Status: "Success"})}
 
  // get all user 
   const loger = async(req,res)=>{
    const usersCollection = await getUsersCollection();
    const email = req.query.email;
    if (!email) { return res.status(400).json({ message: 'Email is required' }); }
    const result = await usersCollection.findOne({ email }, { projection: { pinNumber: 0 } });
    if (!result) { return res.status(404).json({ message: 'User not found' }); }
    res.json(result);
  }

   //get all user name and email

   const getAllUser= async (req,res)=>{
    const usersCollection = await getUsersCollection();
    const loggedInUserEmail = req.user.email;
    const allUsers = await usersCollection.find(
            {
                role: 'user',
                email: { $ne: loggedInUserEmail } // Exclude the logged-in user by email
            },
            { projection: { name: 1, email: 1, number: 1, _id: 0 } } ).toArray();
        res.json(allUsers);
  } 

    //get all agent 
    const getAllAgent = async(req,res)=>{
      const usersCollection = await getUsersCollection();
      const allAgent = await usersCollection.find({role: 'agent'},
        {
            projection: { name: 1, email: 1, number: 1, _id: 0 }
        }).toArray();
        res.json(allAgent)
    } 
    
    //update send amount 
    const updateSender = async(req,res)=>{
      const usersCollection = await getUsersCollection();
      const { email, amount } = req.body;
      const filter = { email};
      const updateDoc = {  $set: { amount: amount }};
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.json({ message: 'Sender New balance' });
    }



      //pin verification
  const pinVerification = async (req, res) => {
    const usersCollection = await getUsersCollection();
    const { pinNumber, email } = req.body;
   try {
      // Check if user exists by email or number
      const user = await usersCollection.findOne({email});
      // Check pin number
      const pinNumberMatch = await bcrypt.compare(pinNumber, user.pinNumber);
      if (!pinNumberMatch) {
        return res.json({ Status: "Wrong Pin Number" });
      }
     // Return success message
      res.json({ Status: "Success" });
    } catch (err) {
      res.status(500).json({ Error: "PIN verification error in server" });
    }
  };

  //**************** */ All Admin related routess ***************** ///

  // get all user and agent
  const getAllUandA = async (req, res) => {
    const usersCollection = await getUsersCollection();
    const { name } = req.query;
    
    // Base search criteria
    let searchCriteria = { $or: [ { role: 'agent' }, { role: 'user' } ] };
    
    // Add name search criteria if provided
    if (name) {
      searchCriteria = {
        $and: [
          searchCriteria,
          { name: { $regex: name, $options: 'i' } }
        ]
      };
    }
    
    try {
      const allUandA = await usersCollection.find(searchCriteria, {
        projection: { pinNumber: 0 }
      }).toArray();
      
      res.json(allUandA);
    } catch (error) {
      console.error('Error fetching users and agents:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

      //update  account and status
      const updateAccount = async (req, res) => {
        const usersCollection = await getUsersCollection();
        const { email, account, status } = req.body;
        const filter = { email };
        const updateDoc = {};
       if (account) { updateDoc.$set = { ...updateDoc.$set, account };}
        if (status) { updateDoc.$set = { ...updateDoc.$set, status }; }
      
        if (!updateDoc.$set) {
          return res.status(400).json({ message: 'No update field provided' });
        }
      
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.json({ message: 'User updated successfully', result });
      };
  
   

  module.exports = {login, loger, addUser, logoutUser, getAllUser, getAllAgent, updateSender, pinVerification, getAllUandA , updateAccount}