const express= require("express")
const app = express();
const users = require('../models/user.model')
const path = require("path");
const fs =require("fs")
app.use("/data",express.static("/images"))
// ====================================Create New User=====================================
exports.createUser = async(req, res) => {
  try {
   const findUser = await users.findOne({email:req.body.email})
   if(findUser){
    return res.json('user already exist')
   }
   const filePath= `http://localhost:4006/data/${req.file.filename}`
   const newUser = new users
   ({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
    image: filePath,
  });
   await newUser.save();
   return res.json(newUser)
  } catch (error) {
    console.log("server error", error);
    return res.json({ error: "Internal server error" });
  }
};
// ====================================Get All User Data=====================================
exports.getAllUser = async(req, res) => {
 const allUsers = await users.find()
  return res.send(allUsers);
};

// ==============================Delete User Data With Params==================================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await users.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.json({ error: "User not found" });
    }

    if (deletedUser.image) {
      const imagePath = path.join(__dirname, '..', 'images', path.basename(deletedUser.image));
      fs.unlinkSync(imagePath);
    }

    return res.send(deletedUser);
  } catch (error) {
    console.log("server error", error);
    return res.json({ error: "Internal server error" });
  }
};

// ==============================Updata User Data With Params===================================
exports.updateUser = async(req, res) => {
  const {id} = req.params
  const { name,email,password,age } = req.body;
  const findUser =await users.findByIdAndUpdate(id);
  if (findUser) {
    if (name) {
      findUser.name = name;
    }
    if (email) {
      findUser.email = email;
    }
    if (password) {
      findUser.password = password;
    }
    if (age) {
      findUser.age = age;
    }
    if (req.file) {
      const filePath = `http://localhost:4006/data/${req.file.filename}`;
      findUser.image = filePath;
    }
  }

  await findUser.save()
  res.send(findUser);
};

