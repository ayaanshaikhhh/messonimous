import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import PendingVerification from "@/models/PendingVerification.model";

export async function POST(request: Request) {
  try {
    await ConnectDB();

    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    // Find pending registration
    const pendingUser = await PendingVerification.findOne({
      username: decodedUsername,
    });

    if (!pendingUser) {
      return Response.json(
        {
          success: false,
          message:
            "Registration not found or verification code has expired. Please sign up again.",
        },
        { status: 404 }
      );
    }

    // Check expiry
    const isCodeNotExpired =
      new Date(pendingUser.verificationCodeExpiry) > new Date();

    // Check verification code
    const isCodeValid = pendingUser.verificationCode === code;

    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code.",
        },
        { status: 400 }
      );
    }

    if (!isCodeNotExpired) {
      // MONGODB itself will clean this up but doing this here give assurance 
      await PendingVerification.deleteOne({
        _id: pendingUser._id,
      });

      return Response.json(
        {
          success: false,
          message: "Verification code has expired. Please sign up again.",
        },
        { status: 400 }
      );
    }

    // Checking again before creating the actual user.
    // --------------------------------------------------

    const existingUser = await UserModel.findOne({
      $or: [
        { username: pendingUser.username },
        { email: pendingUser.email },
      ],
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username or email is already registered.",
        },
        { status: 409 }
      );
    }

   
    // Creating the REAL user
    // --------------------------------------------------

    await UserModel.create({
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.password,

      isVerified: true,
      isAcceptingMessage: true,
      messages: [],
    });

    
    // Delete pending registration
    // --------------------------------------------------

    await PendingVerification.deleteOne({
      _id: pendingUser._id,
    });

    return Response.json(
      {
        success: true,
        message: "Account verified successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);

    return Response.json(
      {
        success: false,
        message: "Error verifying user.",
      },
      { status: 500 }
    );
  }
}