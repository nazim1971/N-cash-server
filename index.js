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
      


    app.post('/addUser', addUser);
    app.post('/login',login);
    app.post('/logout', logoutUser)

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