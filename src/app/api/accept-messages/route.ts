import {getServerSession} from "next-auth"
import {authOptions} from "../auth/[...nextauth]/options"
import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import {User} from "next-auth"

export async function POST(request:Request) {
    await ConnectDB()

    const session = await getServerSession(authOptions)
    const user:User  = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }

    const userID = user?._id
    const {acceptMessages} =  await request.json();

    try {
       const updatedUser= await UserModel.findByIdAndUpdate(userID,{isAcceptingMessage:acceptMessages},{new:true})

       if(!updatedUser){
            return Response.json({
            success:false,
            message:"Failed to update user status to accept messages"
            },{status:401})
       }

       return Response.json({
            success:true,
            message:"Message acceptance status is updated successfully",
            updatedUser
        },{status:200})


        
    } catch (error) {
        console.error("Failed to update user status to accept messages",error)
        return Response.json({
            success:false,
            message:"Failed to update user status to accept messages"
        },{status:500})
    }
}

export async function GET(request:Request) {
    await ConnectDB()

    const session  = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }

    const userID = user?._id;

    try {
        const FoundUser = await UserModel.findById(userID)
        if(!FoundUser){
            return Response.json({
                success:false,
                message:"User not found"
            })
        }
    
        return Response.json({
                success:true,
                message:"User found",
                isAcceptingMessages : FoundUser.isAcceptingMessage
            },{
                status:200
            })
    
    } catch (error) {
        console.error(error)
        console.error("Failed to get the user messages acceptance status",error)
        return Response.json({
            success:false,
            message:"Failed to get the user messages acceptance status"
        },{status:401})
    }

    
}