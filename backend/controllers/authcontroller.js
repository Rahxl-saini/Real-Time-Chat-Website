import User from "../models/usermodel.js"
import generatetokens from "../utils/generatetokens.js"
import bcryptjs from "bcryptjs"

export const signup=async (req,res)=>{
  try{
    const {fullName,username,password,confirmPassword,gender}=req.body;

  if(password!==confirmPassword){
      return res.status(400).json({error:"Passwords dont match"})
  }
  const user=await User.findOne({username});
  if(user){
      return res.status(400).json({error:"username already exist"})
  }
  const salt=await bcryptjs.genSalt(10);
  const hashedpassword=await bcryptjs.hash(password,salt);

  const profilePic = `https://robohash.org/${username}.png`;
  const newUser = new User({
    fullName,
    username,
    password: hashedpassword,
    gender,
    profilePic,
  });

  await newUser.save();
  generatetokens(newUser._id, res);
  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    profilePic: newUser.profilePic,
  });
}
 catch(error){
  console.log("error in signup controller",error.message);
  res.status(500).json({error:"Internal server errorr"});
}
}

export const login=async (req,res)=>{
    try{
      const {username,password}=req.body;
      const user=await User.findOne({username});
      const isPasswordcorrect=await bcryptjs.compare(password,user?.password || "");

      if(!user || !isPasswordcorrect){
        return res.status(400).json({error:"invalid username or password"});
      }
      generatetokens(user._id,res);
      res.status(201).json({
        _id:user._id,
        username:user.username,
        profilePic:user.profilePic,
        message:"Logged in Successfully"
    })
    }catch(error){
      console.log("error in login controller",error.message);
      res.status(500).json({error:"Internal server error"});
    }
}

export const logout=(req,res)=>{
  try{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Logged out Successfully"})
  }catch(error){
    console.log("error in logout controller",error.message);
    res.status(500).json({error:"Internal server error"});
  }
}
