import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationCode(
    email:string,
    username:string,
    verificationCode:string
):Promise<ApiResponse> {

    try {
        const {data ,error} = await resend.emails.send({
            from: 'Messonimous <mail.messonimous@resend.dev>',
            to: email ,
            subject: 'Messonimous Verfication code',
            react: VerificationEmail({ username,verificationCode }),
        })
        // console.log("RESPONSE :::::::::::::::::::::",data);

        if(error){
            console.error(error)
            return {
                success:false,
                message:error.message
            }
        }

        return {success:true , message:"Verification code send successfully"}
            
    
    } catch (error) {
    console.error("Resend Error:",error);

    return {
        success: false,
        message: "Failed to send verification email",
    };
}
    
}
