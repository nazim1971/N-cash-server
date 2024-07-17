const express = require('express');
const app = express()

const cors = require('cors');

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
  





  //            // use verify seller after verifyToken
  const verifyAgent = async (req, res, next) => {
    const email = req.decoded.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    const isAdmin = user?.role === 'agent';
    if (!isAdmin) {
      return res.status(403).send({ message: 'forbidden access' });
    }
    next();
  }

          // use verify admin after verifyToken
          const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            const isAdmin = user?.role === 'admin';
            if (!isAdmin) {
              return res.status(403).send({ message: 'forbidden access' });
            }
            next();
          }
  

  //mongodb

  


const userRouter = require('./routes/userRoute');
const transRouter = require('./routes/transRoute');

// user route
app.use('/v1', userRouter)
app.use('/v1', transRouter)

app.get('/', (req, res)=>{
    res.send('MFS Is On Fire')
})

app.listen(port, ()=>{
    console.log(`MFS is running on port: ${port}`);
})