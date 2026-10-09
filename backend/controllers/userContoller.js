
import bcrypt from "bcrypt"
import { User } from "../model/userModel.js"
import jwt from  "jsonwebtoken"
import { verifyEmail } from "../middleware/emailVerify.js"
import { Session } from "../model/sessionModel.js";
import { sendOtpMail } from "../middleware/sendOtpMail.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    // 1. Log the exact body coming from your API tool
    console.log("👉 Incoming Request Body:", req.body);

    const { firstName, lastName, email, password } = req.body;

    // 2. Stronger validation (removes spaces, ensures it's a string)
    if (!firstName || !lastName || !email || typeof email !== 'string' || !email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, and email must be a valid text string."
      });
    }

    // Clean up the email string just in case
    const cleanEmail = email.trim().toLowerCase();

    // 3. Find user with the cleaned email
    const user = await User.findOne({ email: cleanEmail });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "user already exist"
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email: cleanEmail,
      password: hashPassword
    });

    const token = jwt.sign({ id: newUser._id }, process.env.SECRETE_KEY, { expiresIn: "10m" });

    // 4. Forceful check right before sending
    console.log(`✉️ Sending email to: "${cleanEmail}" with token: "${token}"`);

    // Pass the cleaned email inside the object wrapper
    await verifyEmail({ email: cleanEmail, token }); 

    newUser.token = token;
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      user: newUser
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "error while registering user",
      error: err.message
    });
    console.log("❌ Error caught in controller:", err);
  }
};


// export const verify=async(req,res)=>{
//   try{
// const authHeader=req.headers.authorization;
// if(!authHeader || authHeader.startsWith("Bearer ")){
//   res.status(400).json({
//     success:false,
//     message :"authorization token is invalid"
//   })
// }
// // find string of 1 index in array
// const token=authHeader.split(" ")[1]
// let decoded
// try{
//   decoded=jwt.verify(token,process.env.SECRETE_KEY)

// }catch(error){
//   if(erro.name==="TokenExpired"){
//     return res.status(400).json({
//       success:false,
//       message:"the registration token expired"
//     })
//   }
//   return res.status(400).json({
//     success:false,
//     message:"token verification failed"
//   })
// }
// const user= await User.findById(decoded.id)
// if (!user){
//   res.status(404).json({
//     success:false,
//     message:"user not found"
//   })

// }
// user.token=null
// user.isVerified=true
// await user.save()
// return res.status(200).json({
//   success:true,
//   message :"email verified succesfully"
// })
//   } catch(error){
//     res.status(500).json({
//       success:false,
//       message:error.message
//     })

//   }
// }


export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    // FIX 1: Added ! to check if it does NOT start with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ // FIX 2: Added return
        success: false,
        message: "authorization token is invalid"
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.SECRETE_KEY);
    } catch (error) {
      // FIX 3: Fixed typo 'erro' to 'error' and changed name to 'TokenExpiredError'
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "the registration token expired"
        });
      }
      return res.status(400).json({
        success: false,
        message: "token verification failed"
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ // FIX 4: Added return
        success: false,
        message: "user not found"
      });
    }

    user.token = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "email verified successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Sanitize email input before querying database
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    const cleanEmail = email.trim().toLowerCase();

    // 2. FIXED: Use findOne instead of findById for emails
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 3. Generate verification token (Ensure SECRET_KEY matches your .env)
    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY || process.env.SECRETE_KEY,
      { expiresIn: "10m" }
    );

    // 4. Dispatch the verification mail
    await verifyEmail({ email: cleanEmail, token });

    // 5. Persist token to database and respond
    user.token = token;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Verification email sent again",
      email: cleanEmail,
      token: user.token
    });

  } catch (err) {
    // Catches database or token generation runtime failures
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// export const login=async(req,res)=>{
//   try{
// const {email,password}=req.body
// if(!email || !password){
//   res.status(400).json({
//     success:false,
//     message :"all fields are required"
//   })
// }
// const existinguser=await User.findOne({email})
// if(!existinguser){
//   res.status(400).json({
//     success:false,
//     messsage:"USER NOT FOUND REGISTER FIRST THEN LOGIN  "
//   })
// }
// const isPasswordValid=await bcrypt.compare(password,existinguser.password)
// if(!isPasswordValid){
//   res.status(400).json({
//     success:false,
//   message:"invalid password"
//   })
// }
// if(existinguser.isVerified==false){
//   return res.status(4000).json({
//     success:false,
//     message:"verify your account the try"
//   })
// }
// // generate token
// const accessToken=jwt.sign({id:existinguser._id},process.env.SECRETE_KEY,{expiresIn:"10d"})
// const refreshToken=jwt.sign({id:existinguser._id},process.env.SECRETE_KEY,{expiresIn:"30d"})
// existinguser.isLoggedIn=true
// await existinguser.save()

// // session logic
// const existingSession=await Session.findOne({userId:existinguser._id})
// if (existingSession){
//   await Session.deleteOne({userId:existinguser._id})
// }


// await Session.create({userId:existinguser})
// return  res.status(200).json({
//   success:true,
//   message:`welcome back bhai jan ${existinguser.firstName} + ${existinguser.lastName}`,
//   existingUser:existinguser
  
// })
//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:err.message
//     })
//   }
// }


export const login=async(req,res)=>{
  try{
const {email,password}=req.body
if(!email || !password){
  res.status(400).json({
    success:false,
    message :"all fields are required"
  })
}
const existinguser=await User.findOne({email})
if(!existinguser){
  res.status(400).json({
    success:false,
    message:"USER NOT FOUND REGISTER FIRST THEN LOGIN  "
  })
}
const isPasswordValid=await bcrypt.compare(password,existinguser.password)
if(!isPasswordValid){
  res.status(400).json({
    success:false,
  message:"invalid password"
  })
}
if(existinguser.isVerified==false){
  return res.status(400).json({
    success:false,
    message:"verify your account the try"
  })
}
// generate token
const accessToken=jwt.sign({id:existinguser._id},process.env.SECRETE_KEY,{expiresIn:"10d"})
const refreshToken=jwt.sign({id:existinguser._id},process.env.SECRETE_KEY,{expiresIn:"30d"})
existinguser.isLoggedIn=true
await existinguser.save()

// session logic
const existingSession=await Session.findOne({userId:existinguser._id})
if (existingSession){
  await Session.deleteOne({userId:existinguser._id})
}


await Session.create({userId:existinguser})
return  res.status(200).json({
  success:true,
  message:`welcome back bhai jan ${existinguser.firstName} + ${existinguser.lastName}`,
  user:existinguser,
  accessToken,   // Added here for Thunder Client testing
  refreshToken   // Added here for Thunder Client testing
})
  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

export const logout=async(req,res)=>{
  try{
    const userId=req.id
    await Session.deleteMany({userId:userId})
    await User.findByIdAndUpdate(userId,{isLoggedIn:false})
    return res.status(200).json({
      success:true,
      message:"logout successfully"
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}


// export const forgotPassword=async(req,res)=>{
//   try{
//     const {email}=req.body;
//     const user=await User.findOne({email})
//     if(!user){
//       res.status(400).json({
//         success:false,
//         message:"user not found"
//     })
//     }
//  const cleanEmail = email.trim().toLowerCase();


//     const otp=Math.floor(100000 + Math.random()*900000).toString()
//     const otpExpiry=new Date(Date.now()+10*60*1000) //10 mints to expire

//     user.otp=otp;
//     user.otpExpiry=otpExpiry;
//     await user.save()

//     await sendOtpMail({email:cleanEmail,otp})

//     return res.status(200).json({
//       success:true,
//       message:`otp send to successfully to ${email}`
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:err.message
//     })
//   }
// }



// export const verifyOtp=async(req,res)=>{
//   try{
// const {otp}=req.body
// const {email}=req.params.email
// if(!otp){
//   res.status(400).json({
//     success:false,
//     message:"OTP is required"
//   })
// }
// const user=await User.findOne({email})
// if(!user){
//   res.status(400).json({
//     success:false,
//     message:"user not found"
//   })
// }

// if(!user.otp || !user.otpExpiry){
//   res.status(400).json({
//     success:false,
//     message:"OTP not generated for this user or already verified"
//   })
// }

// if(user.otpExpiry<new Date()){
//   res.status(400).json({
//     success:false,
//     message:"OTP expired"
//   })
// }
// if(otp!==user.otp){
//   res.status(400).json({
//     success:false,
//     message:"invalid otp"
//   })
// }
// user.otp=null;
// user.otpExpiry=null
// await user.save()

// return res.status(200).json({
//   success:true,
//   message:"otp verified successfully"
// })

//   } catch(err){
//     res.status(500).json({
//       success:false,
//       message:err.message
//     })
//   }
// }


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
   
    // 2. Find user with the clean email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ // Added return here
        success: false,
        message: "user not found"
      });
    }

    // 3. Generate values
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // 4. Assign and save (Fixed the typo here)
    user.otp = otp;
    user.otpExpiry = otpExpiry; // Fixed: changed == to =
    await user.save();

    // 5. Send mail
    await sendOtpMail({ email, otp });

    return res.status(200).json({
      success: true,
      message: `otp sent successfully to ${email}`
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.params; // Fixed destructuring here

    if (!otp) {
      return res.status(400).json({ // Added return
        success: false,
        message: "OTP is required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ // Added return
        success: false,
        message: "user not found"
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ // Added return
        success: false,
        message: "OTP not generated for this user or already verified"
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ // Added return
        success: false,
        message: "OTP expired"
      });
    }

    // Safely compare by converting both sides to string
    if (otp !== user.otp) { 
      return res.status(400).json({ // Added return
        success: false,
        message: "invalid otp"
      });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "otp verified successfully"
    });

  } catch (err) {
    // Prevent double response if an error happens after headers are sent
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
};


export const resetPassword=async(req,res)=>{

  try{
    const {newPassword,confirmPassword}=req.body
    const { email } = req.params;
    const user= await User.findOne({email})
      if(!user){
        res.status(400).json({
          success:false,
          message:"user not found"
        })
      }

if(!newPassword || !confirmPassword){
  res.status(400).json({
    success:false,
    message:"all fields are required"
  })
}
if(newPassword !== confirmPassword){
  res.status(400).json({
    success:false,
    message:"password do not match"
  })
}
const hashPassword=await bcrypt.hash(newPassword,10)
 user.password = hashPassword; 
 await user.save()
return res.status(200).json({
  success:true,
  message:"reset password successfully"
})


  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

export const allUsers=async(req,res)=>{
  try{
    const users=await User.find()

    return res.status(200).json({
      success:true,
      message:"fatch all users",
      users
    })
  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}


export const getUserById=async(req,res)=>{
  try{
    const { userId } = req.params;
    const user=await User.findById(userId).select("-password -otp -otpExpiry -token") // Exclude sensitive fields
    if(!user){
      return res.status(404).json({
        success:false,
        message:"user not found"
      })
    }
    return res.status(200).json({
      success:true,
      message:"user found",
      user
    })
  }catch(err){
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;
    const loggedInUser = req.user;

    const {
      firstName,
      lastName,
      address,
      city,
      zipCode,
      phone,
      role,
    } = req.body;

    // Only the logged-in user or an admin can update the profile
    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Only admin or the authenticated user can update this profile.",
      });
    }

    let user = await User.findById(userIdToUpdate);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    // Upload new profile picture if provided
    if (req.file) {
      // Delete old image from Cloudinary
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          
          {
            folder: "profile",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
console.log("Deleting old image...");
        stream.end(req.file.buffer);
      });

      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    // Update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.phone = phone || user.phone;

    // Only allow admins to change roles
    if (loggedInUser.role === "admin" && role) {
      user.role = role;
    }

    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
console.error("Cloudinary Error:", err);
console.error("Message:", err.message);
console.error("Response:", err.http_code);
console.log(cloudinary.config());
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};