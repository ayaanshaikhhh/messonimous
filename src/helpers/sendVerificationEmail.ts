import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationCode(
    email:string,
    username:string,
    verificationCode:string
):Promise<ApiResponse> {

    try {
        const response = await resend.emails.send({
        from: 'Messonimous <onboarding@resend.dev>',
        to: email ,
        subject: 'Messonimous Verfication code',
        react: VerificationEmail({ username,verificationCode }),
        })

        console.log("RESPONSE :::::::::::::::::::::",response);

        return {success:true , message:"Verification code send successfully"}
        
    // } catch (emailError) {
    //     console.error("Error sending verification email",emailError)
    //     return {success:false,message:"Failed to send verification email"}
    // }
    } catch (error) {
    console.error("Resend Error:");

    if (error instanceof Error) {
        console.error(error.message);
        console.error(error.stack);
    } else {
        console.error(error);
    }

    return {
        success: false,
        message: "Failed to send verification email",
    };
}
    
}
