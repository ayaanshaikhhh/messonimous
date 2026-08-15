import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { changeUsernameSchema } from "@/schemas/changeUsername";

const USERNAME_COOLDOWN_DAYS = 14;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    //  Authenticate user

    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated.",
        },
        { status: 401 },
      );
    }

    await ConnectDB();

    // Validate request body
    const body = await request.json();

    const validationResult =
      changeUsernameSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid username.",
          errors:
            validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { username } = validationResult.data;

    // Normalize username
    const normalizedUsername = username.trim().toLowerCase();

    // Find authenticated user

    const user = await UserModel.findById(session.user._id);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    //Check if username is actually changing

    if (
      user.username.toLowerCase() === normalizedUsername
    ) {
      return Response.json(
        {
          success: false,
          message: "This is already your current username.",
        },
        { status: 400 },
      );
    }

    // Check 14-day cooldown

    if (user.usernameLastChangedAt) {
      const now = Date.now();

      const nextAllowedChange =
        user.usernameLastChangedAt.getTime() +
        USERNAME_COOLDOWN_DAYS * MS_PER_DAY;

      if (now < nextAllowedChange) {
        const remainingTime =
          nextAllowedChange - now;

        const remainingDays = Math.ceil(
          remainingTime / MS_PER_DAY,
        );

        return Response.json(
          {
            success: false,
            message: `You can change your username again in ${remainingDays} day${
              remainingDays === 1 ? "" : "s"
            }.`,
            nextAllowedChangeAt:
              new Date(nextAllowedChange),
          },
          { status: 429 },
        );
      }
    }

    //  Check username uniqueness

    const existingUser = await UserModel.findOne({
      username: normalizedUsername,
      _id: { $ne: user._id },
    }).select("_id");

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken.",
        },
        { status: 409 },
      );
    }

    //  Update username

    user.username = normalizedUsername;
    user.usernameLastChangedAt = new Date();

    await user.save();

    //   Success

    return Response.json(
      {
        success: true,
        message: "Username changed successfully.",
        username: user.username,
        nextAllowedChangeAt:
          user.usernameLastChangedAt.getTime() +
          USERNAME_COOLDOWN_DAYS * MS_PER_DAY,
      },
      { status: 200 },
    );
  } catch (error: any) {
    // MongoDB duplicate-key protection
    if (error?.code === 11000) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken.",
        },
        { status: 409 },
      );
    }

    console.error(
      "CHANGE USERNAME ERROR:",
      error,
    );

    return Response.json(
      {
        success: false,
        message: "Failed to change username.",
      },
      { status: 500 },
    );
  }
}