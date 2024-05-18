require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Add this line
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
app.use(express.json());
app.use(cors()); // Add this line

// MongoDB connection
mongoose.connect(MONGO_URI, { 
  //useNewUrlParser: true, 
  //useUnifiedTopology: true 
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Routes
app.use('/api', require('./routes/api'));
app.use('/api/auth', require('./routes/auth'));

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }
}

// Dashboard route
app.get('/api/dashboard', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Dashboard accessed successfully',
        authData
      });
    }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
