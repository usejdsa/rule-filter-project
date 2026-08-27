const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db/connection");
const rulesRoutes = require("./routes/rules");
const processRoutes = require("./routes/process");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/rules", rulesRoutes);
app.use("/process-text", processRoutes);

//test route 
app.get("/", (req, res)=>{
    res.send("API is running...");
});

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})

