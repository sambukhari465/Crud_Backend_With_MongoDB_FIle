const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const {authenticateToken }=require('./middleware/authMiddleware')
const app = express();
const {
  createUser,
  deleteUser,
  updateUser,
  getAllUser,
  signinUser,
  signupUser
} = require("./controller/user");

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/my-db", {
    // useNewUrlParser: false,
    // useUnifiedTopology: false,
  })
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

  //================================== Multur =======================================
app.use("/data", express.static(path.join(__dirname, "images")));

const storage = multer.diskStorage({
  destination: "./images",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).single("image");
console.log(upload)
//=============================== User Routes =========================================
app.post("/create",authenticateToken ,  upload, createUser);
app.get("/",authenticateToken ,  getAllUser);
app.delete("/delete/:id",  deleteUser);
app.put("/update/:id", upload, updateUser);
app.post("/signin", signinUser)
app.post('/signup', signupUser)
app.post ("/logout", (req,res)=>{
  res.json({message: "Logout"})
})



app.listen(4006, () => {
  console.log(`Server run on port ${4006}`);
});
