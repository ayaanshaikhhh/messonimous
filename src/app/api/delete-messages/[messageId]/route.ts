import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    await ConnectDB();

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }

    // Get dynamic route parameter
    const { messageId } = await params;

    // Validate ObjectId
    if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid message ID",
        },
        { status: 400 }
      );
    }

    // Get logged-in user's ID
    const userId = session.user._id;

    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "User ID not found in session",
        },
        { status: 401 }
      );
    }

    // Delete the message
    const result = await UserModel.updateOne(
      {
        _id: userId,
        "messages._id": new mongoose.Types.ObjectId(messageId),
      },
      {
        $pull: {
          messages: {
            _id: new mongoose.Types.ObjectId(messageId),
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ERROR DELETING MESSAGE:", error);

    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}