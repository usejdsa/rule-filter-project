const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db/connection");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

//routes

//

//test route 
app.get("/", (req, res)=>{
    res.send("API is running...");
});

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})