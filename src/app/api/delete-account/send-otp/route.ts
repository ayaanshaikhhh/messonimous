import ConnectDB from "@/lib/dbConnect";
import { AccountDeletionVerification } from "@/models/AccountDeletion.model";
import UserModel from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { sendAccountDeletionEmail } from "@/helpers/sendAccountDeletionEmail";
import crypto from "crypto";

export async function POST(request:Request) {
    try {
        await ConnectDB()

        // Get Logged-In User First
        const session = await getServerSession(authOptions);

        const userId = session?.user._id

        if(!userId){
            return Response.json({
                success:false,
                message:"Not Authenticated"
            },{status:401})
        }

        // Find the user
        const user = await UserModel.findById(userId);

        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})  
        }

        // Checking if the user is scheduled for deletetion  
        if(user.isDeleted){
            return Response.json({
                success:false,
                message:"User is already scheduled for deletion."
            },{status:400})    
        }

        // IF USER IS FOUND THEN GENERATE THE VERIFICATION CODE AND EXPIRY
        const verificationCode = crypto.randomInt(100000 , 1000000).toString()

        const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000 );

        // Removing previous deletion request !
        await AccountDeletionVerification.deleteOne({
            userId : user._id
        })

        // Storing new delete OTP
        await AccountDeletionVerification.create({
            userId : user._id,
            verificationCode,
            verificationCodeExpiry
        })

        // Sending OTP to the registered E-mail
        const EmailResponse = await sendAccountDeletionEmail(
            user.email,
            user.username,
            verificationCode
        )

        // IF Email Response , then directly delete the OTP
        if(!EmailResponse.success){
            await AccountDeletionVerification.deleteOne({
                userId: user._id
            })

            return Response.json({
                success:false,
                message:"Failed to send verification code"
            },{status:500})
        }

        return Response.json({
                success:true,
                message:"Verification code sent successfully"
            },{status:200})

    } catch (error) {
        console.error("SEND DELETE ACCOUNT OTP ERROR:", error);

        return Response.json(
      {
        success: false,
        message: "Failed to send verification code.",
      },
      { status: 500 }
    );
    }
}