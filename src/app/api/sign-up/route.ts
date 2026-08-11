import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import PendingUser from "@/models/PendingVerification.model";

import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { ApiResponse } from "@/types/ApiResponse";
import { sendVerificationCode } from "@/helpers/sendVerificationEmail";

export async function POST(request: NextRequest) {

  try {
    await ConnectDB();

    // Parsing the request
    const { username, email, password } = await request.json();

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Searching the user into the database
    const existingUserByUsername = await UserModel.findOne({
      username: normalizedUsername,
    });

    // Checking if the user exists
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

    const existingUserByEmail = await UserModel.findOne({
      email: normalizedEmail,
    });

    if (existingUserByEmail) {
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

    // Generating Verification Code 
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verificationExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );
    
    // Hashing the Password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Deleting Previous Pending Request
    const deletePendingResult =
      await PendingUser.deleteOne({
        email: normalizedEmail,
      });

    //Create pending user
    const pendingUser = await PendingUser.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiry: verificationExpiry,
    });

    // Sending Verification Mail
    const emailResponse = await sendVerificationCode(
      normalizedEmail,
      normalizedUsername,
      verificationCode
    );

    if (!emailResponse.success) {

      await PendingUser.deleteOne({
        email: normalizedEmail,
      });

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
        message:
          "Registration started. Please verify your email.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {

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