import { resend } from "@/lib/resend";
import ResetPasswordEmail from '../../emails/PasswordResetLink';
import { ApiResponse } from '../types/ApiResponse';

export async function sendPasswordResetLink(
    email:string,
    username:string,
    resetUrl:string
): Promise<ApiResponse> {
    try {
        const {error} = await resend.emails.send({
            from:'Messonimous <mail.messonimous@resend.dev>', 
            to: email,
            subject:"Messonimous Password Reset Link",
            react:ResetPasswordEmail({username,resetUrl})
        })

        // If any error occurs
        if(error){
            return {
                success : false,
                message:error.message
            }
        }

        return {
            success:true,
            message:'Password reset link sent successfully'
        }


    } catch (error) {
       console.error("RESEND_PASSWORD_RESET_ERROR",error) 
       return {
        success:false,
        message:"Internal server error"
       }
    }
}