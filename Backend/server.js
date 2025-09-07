require("dotenv").config({ path: ".env" });
const express = require('express');
const chatsRoutes = require('./routes/chats.js');
const userRoutes = require('./routes/users.js');
const connectDB = require('./config/db.js');
const cors = require('cors');
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3000;

const DIRNAME = path.resolve()

// CORS middleware configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,   // This should be your frontend URL (http://localhost:5173)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow methods you want to use
  credentials: true, // Allow cookies and credentials to be sent with the request
}));

app.use(express.json());


//routes
app.use('/api/v1/users',userRoutes)
app.use('/api/v1', chatsRoutes);

// Corrected wildcard route for Express v5
app.use(express.static(path.join(DIRNAME, "Frontend", "dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(DIRNAME, "Frontend", "dist", "index.html"));
});

app.listen(PORT, async() => {
  await connectDB();
  console.log(`App is listening on PORT ${PORT}`);
});