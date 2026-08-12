import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { success } from "zod";
import { Delete } from "lucide-react";

export async function DELETE(request: Request) {
  await ConnectDB();

  try {
    const session = await getServerSession(authOptions);

    const userId = session?.user._id;

    if (!session?.user?._id) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 },
      );
    }

    const user = await UserModel.findById(userId);

    if(!user){
        return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401},
    );
    }

    // Already emppty

    if(user.messages.length === 0) {
        return Response.json(
      {
        success: true,
        message: "No messages to delete",
      },
      { status: 200 },
    );
    }

    user.messages = [];

    await user.save();

    return Response.json(
      {
        success: true,
        message: "All messages deleted successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("ERROR DELETING ALL MESSAGES:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete all messages.",
      },
      { status: 500 },
    );
  }
}
