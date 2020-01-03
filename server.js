const express = require("express");
const connectDB = require("./config/db");
// const path = require('path')
const app = express();
const cors = require('cors')
const config = require("config");

const Prompts = require("./models/Prompts")
//connect DB
connectDB();

//init Middleware
app.use(express.json({extended:false}))
app.use(cors())


app.get("/", (req, res) => res.json({ msg: `Welcome to WriteInspyre` }));

app.get("/all", async (req, res) => {
  try {
    //req.user is accessible through the auth middleware      //sorts prompts by most recent date.
    const prompts = await Prompts.find()
    res.json(prompts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});





//routes
app.use("/api/users", require("./routes/users"));
app.use("/api/prompts", require("./routes/prompts"));
app.use("/api/auth", require("./routes/auth"));


// //serve static assetts in production
// if(process.env.NODE_ENV === 'production') {
//   //set static folder
//   app.use(express.static('client/build'));
//   app.get('*'(req,res)=> res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')))
// } 

//port
const PORT = process.env.PORT || 5000;

//port listening
app.listen(PORT, () => console.log(`server started on ${PORT}`));
