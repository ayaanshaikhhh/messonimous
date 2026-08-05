import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";
import { sendVerificationCode } from "@/helpers/sendVerificationEmail";


export async function POST(request:NextRequest) {
    try {
       await ConnectDB()

    const {username, email, password} = await request.json() 

    // Checking existing user by its username && verified too 
    const existingUserbyUsername = await UserModel.findOne({
        username,
        isVerified:true
    })

    if(existingUserbyUsername){
        return NextResponse.json<ApiResponse>({
            success:false,
            message:"Username is taken"
        },{
            status:400
        })
    }

    // Checking existing User by its email && verified too
    const existingUserbyEmail = await UserModel.findOne({
        email
    })

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    if(existingUserbyEmail){
        if(existingUserbyEmail.isVerified){
            return NextResponse.json({
            success:false,
            message:"User already exists with this email",
        },{
            status:400
        })  
        }
        else {
            const hashedPassword = await bcrypt.hash(password,10)
            existingUserbyEmail.password = hashedPassword
            existingUserbyEmail.verifyCode = verificationCode
            existingUserbyEmail.verifyCodeExpiry = new Date(Date.now()+ 3600000)
            await existingUserbyEmail.save();
        }
    }
    else{
        const hashedPassword = await bcrypt.hash(password,10)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        const newUser = new UserModel({
            username ,
            email,
            password:hashedPassword,
            verifyCode:verificationCode,
            verifyCodeExpiry:expiryDate,
            isVerified:false,
            isAcceptingMessage:true,
            messages:[]
        })

        await newUser.save();

        const emailResponse = await sendVerificationCode(email,username, verificationCode)
    
        if(!emailResponse.success){
            await UserModel.findByIdAndDelete(newUser._id)
            return NextResponse.json({
                success:false,
                message:emailResponse.message,
            },{
                status:500
            })
    }
    
    return NextResponse.json({
        success:true,
        message:"User Registered Successfully, Please verify your email",
    },{
        status:201
    })
    }
   } 
   catch (error) {
        console.error("Error registering user",error)

        return NextResponse.json<ApiResponse>({
           success:false,
           message:"Error Registering User" 
        },{
            status:500
        })
   }
}