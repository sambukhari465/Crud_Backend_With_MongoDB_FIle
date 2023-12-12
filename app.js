const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const jwt = require('jsonwebtoken');
const cors = require("cors");
const fs = require("fs");
const app = express();
const Signup = require("./models/signupModel");
const {
  createUser,
  deleteUser,
  updateUser,
  getAllUser,
} = require("./controller/user");

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/my-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/data", express.static(path.join(__dirname, "images")));

const storage = multer.diskStorage({
  destination: "./images",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).single("image");
//===============================
function verifyToken(req, res, next) {
  console.log("i am inside of verify",req.headers.authorization)
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'token', (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.sendStatus(403);
    }
console.log("i am decode",decoded)
    req.user = decoded; // Save decoded user information in the request object
    next();
  });
}

// User Routes
app.post("/create", verifyToken, upload, createUser);
app.get("/", verifyToken, getAllUser);
app.delete("/delete/:id", verifyToken, deleteUser);
app.put("/update/:id", verifyToken, upload, updateUser);
// Signin Route
app.post('/signup', async (req, res) => {
  const { name, email, password, age } = req.body;
  

  try {
    const existingUser = await Signup.findOne({ email });

    if (existingUser) {
      console.log("i am the error")
      return res.send('user already exists');
    }

    const newUser = new Signup({
      name,
      email,
      password,
      age,
    });

    await newUser.save();
    console.log(newUser)
    console.log("umsr")
    res.json('user created successfully');
  } catch (error) {
    console.error(error);
    console.log("notumar ")
    res.send('user already exist');
  }
});
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  // const user_id=req.body._id;
  try {
    const user = await Signup.findOne({ email });
    // console.log(user._id,"user bydefault")

    if (!user || user.password !== password) {
      return res.status(404).json("user not found");
    }
    const token = jwt.sign({ userId: user._id, userEmail: user.email,ref_id:user._id }, 'token');

    res.json({
      id: user._id,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

app.post ("/logout", (req,res)=>{
  res.json({message: "Logout"})
})

app.listen(4006, () => {
  console.log(`Server run on port ${4006}`);
});
