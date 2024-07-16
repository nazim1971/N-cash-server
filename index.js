const express = require('express');
const app = express()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
require('dotenv').config();
const port = process.env.PORT || 5000;
// middleware
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174','https://med-nust.web.app','https://med-nust.firebaseapp.com'],
    credentials: true,
    optionSuccessStatus: 200,
  }
  app.use(cors(corsOptions))
  app.use(express.json());
  



  const verifyToken = (req,res,next)=>{
    const token = req.cookies?.token;
    if(!token) return res.status(401).send({message: 'Unauthorized access '})
  
            if(token){
              jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decoded )=>{
                if(err){
                  return res.status(401).send({message: 'Unauthorized access '})
                }
                req.user = decoded;
                next()
              })
            } 
  }

  //mongodb

  
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uwjhzip.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const usersCollection = client.db("mfsDB").collection('users');
    const sendTransCollection = client.db("mfsDB").collection('sendTrans');
    
    const addUser = async (req, res) => {
        try {
      
          // Check if user exists
          const userExists = await usersCollection.findOne({
            $or: [
              { email: req.body.email },
              { number: req.body.number }
            ]
          });
          if (userExists) {
            return res.status(409).json("User already exists");
          }
      
          // Create new user
          const newUser = req.body;
          const {pinNumber} = req.body;
          const salt = bcrypt.genSaltSync(10);
          const hash = await bcrypt.hash(pinNumber, salt);
          newUser.pinNumber = hash;
          const result = await usersCollection.insertOne(newUser);
          res.json(result);
        } catch (err) {
          res.status(500).json({ Error: "Server error" });
        } 
      };
   

      // login user

      const login = async (req, res) => {
        const { pinNumber, email, number } = req.body;
      
        try {
          // Check if user exists by email or number
          const user = await usersCollection.findOne({
            $or: [
              { email },
              { number }
            ]
          });
          if (!user) {
            return res.json({ Status: "User Not Found" });
          }
      
          // Check pin number
          const pinNumberMatch = await bcrypt.compare(pinNumber, user.pinNumber);
          if (!pinNumberMatch) {
            return res.json({ Status: "Wrong Pin Number" });
          }
      
          // Generate JWT token
          const { pinNumber: userPinNumber, ...userWithoutPinNumber } = user;
          const userEmail = user.email;
          const token = jwt.sign({ email: userEmail }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
      
          res.cookie('token', token, { httpOnly: true }).json({ Status: "Success", User: userWithoutPinNumber });
        } catch (err) {
          res.status(500).json({ Error: "Login error in server" });
        }
      };

      // logout user
const logoutUser = async (req,res)=>{
    res.clearCookie("token",{
        secure: true,
        sameSite: "none"
    }).json({Status: "Success"})
}
      
  //get all user name and email

  const getAllUser= async (req,res)=>{
    const loggedInUserEmail = req.user.email;

    const allUsers = await usersCollection.find(
            {
                role: 'user',
                email: { $ne: loggedInUserEmail } // Exclude the logged-in user by email
                // or number: { $ne: loggedInUserNumber } if you are using number
            },
            {
                projection: { name: 1, email: 1, number: 1, _id: 0 }
            }
        ).toArray();

        res.json(allUsers);
  } 

  //get loger
  const loger = async(req,res)=>{
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const result = await usersCollection.findOne({ email }, { projection: { pinNumber: 0 } });
    
    if (!result) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(result);
  }

  //send trans

  const sendTrans = async(req,res)=>{
    const query = req.body;
    const result = await  sendTransCollection.insertOne(query);
    res.json(result);
  }

  //updaeesender bal
  const updateSender = async(req,res)=>{
    const { email, amount } = req.body;
    const filter = { email};
    const updateDoc = {
      $set: {
          amount: amount
      }
  };
  const result = await usersCollection.updateOne(filter, updateDoc);
  res.json({ message: 'Sender New balance' });
  }

  //pin verification
  const pinVerification = async (req, res) => {
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
  
  // check pinNumber
  app.post('/checkPin',verifyToken ,pinVerification)

  // add transection
  app.post('/sendTrans', sendTrans)
   
  //sender balance upadate
   app.patch('/updateSender',verifyToken ,updateSender)
    app.post('/addUser', addUser);
    app.post('/login',login);
    app.post('/logout', logoutUser)

    app.get('/allUserForSend',verifyToken, getAllUser)
   app.get('/loger',verifyToken , loger)
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('MFS Is On Fire')
})

app.listen(port, ()=>{
    console.log(`MFS is running on port: ${port}`);
})