import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export async function GET(request: Request) {
  try {
    
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    await ConnectDB();

    const now = new Date();

    const result = await UserModel.deleteMany({
      isDeleted: true,
      deletionScheduledFor: {
        $lte: now,
      },
    });

    console.log(
      `🗑️ Account cleanup completed. Deleted: ${result.deletedCount}`
    );

    return Response.json(
      {
        success: true,
        message: "Account cleanup completed successfully.",
        deletedCount: result.deletedCount,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PERMANENT ACCOUNT CLEANUP ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message: "Failed to cleanup deleted accounts.",
      },
      {
        status: 500,
      }
    );
  }
}