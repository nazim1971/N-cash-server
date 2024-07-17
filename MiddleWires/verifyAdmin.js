const { getUsersCollection } = require("../collection");

 // use verify admin after verifyToken
 const verifyAdmin = async (req, res, next) => {
    const usersCollection = await getUsersCollection();
    const email = req.user.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    const isAdmin = user?.role === 'admin';
    if (!isAdmin) {
      return res.status(403).send({ message: 'forbidden access' });
    }
    next();
  }

  module.exports = verifyAdmin;