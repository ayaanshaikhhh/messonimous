import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";
import { sendVerificationCode } from "@/helpers/sendVerificationEmail";

export async function POST(request: NextRequest) {
  try {
    await ConnectDB();

    const { username, email, password } = await request.json();

    // Check if username is already taken by a verified user
    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByUsername) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Username is already taken.",
        },
        {
          status: 400,
        }
      );
    }

    // Check if email already exists
    const existingUserByEmail = await UserModel.findOne({ email });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verificationExpiry = new Date(Date.now() + 60 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    let isNewUser = false;

    if (existingUserByEmail) {
      // Email already belongs to a verified account
      if (existingUserByEmail.isVerified) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "User already exists with this email.",
          },
          {
            status: 400,
          }
        );
      }

      // Update existing unverified account
      existingUserByEmail.username = username;
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyCode = verificationCode;
      existingUserByEmail.verifyCodeExpiry = verificationExpiry;

      user = existingUserByEmail;
    } else {
      // Create new account
      user = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verificationCode,
        verifyCodeExpiry: verificationExpiry,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      isNewUser = true;
    }

    await user.save();

    // Send verification email
    const emailResponse = await sendVerificationCode(
      email,
      username,
      verificationCode
    );

    if (!emailResponse.success) {
      // Rollback only for newly created users
      if (isNewUser) {
        await UserModel.findByIdAndDelete(user._id);
      }

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      {
        status: isNewUser ? 201 : 200,
      }
    );
  } catch (error) {
    console.error("Error registering user:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error registering user.",
      },
      {
        status: 500,
      }
    );
  }
}