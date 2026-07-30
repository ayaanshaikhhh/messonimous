import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { usernameValidation} from "@/schemas/signUpSchema";
import {z} from "zod";

const usernameValidationSchema = z.object({
    username : usernameValidation   
})

export async function GET(request:Request) {
    await ConnectDB()

    try {
        const {searchParams}= new URL(request.url)
        const queryparam = {
            username : searchParams.get("username")
        }

        // Validate with zod
        const result = usernameValidationSchema.safeParse(queryparam);
        // console.log("RESULT OF VALIDATION",result);

        if(!result.success){
            const errors = z.treeifyError(result.error)
            const usernameErrors = errors.properties?.username?.errors ?? []

            return Response.json({
                success :false,
                message : usernameErrors[0] || "Invalid Username"
            },{
                status:400
            })
        }

        const {username} = result.data
        
        const ExistingVerifiedUser = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(ExistingVerifiedUser){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{
                status:400
            })
        }

        return Response.json({
                success:true,
                message:"Username is available"
            },{
                status:200
            })

        

    } catch (error) {
        console.error("Error checking username",error)  
        return Response.json({
            success:false,
            message:"Error checking username"
        })
    }
}


