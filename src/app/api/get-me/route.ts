import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";

export async function GET(request: Request) {
  try {
    await ConnectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }

    const sessionUser = session.user as User;

    const foundUser = await UserModel.findById(sessionUser._id).select(
      "messages"
    );

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: foundUser.messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting user messages:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to get user messages",
      },
      { status: 500 }
    );
  }
}