require('dotenv').config();
const express = require('express');
const chatsRoutes = require('./routes/chats.js');
const userRoutes = require('./routes/users.js');
const connectDB = require('./config/db.js');
const cors = require('cors');

const app = express();
const PORT = 3000;

// CORS middleware configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,  // This should be your frontend URL (http://localhost:5173)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow methods you want to use
  credentials: true, // Allow cookies and credentials to be sent with the request
}));

app.use(express.json());


//routes
app.use('/api/v1/users',userRoutes)
app.use('/api/v1', chatsRoutes);
app.listen(PORT, async() => {
  await connectDB();
  console.log(`App is listening on PORT ${PORT}`);
});


