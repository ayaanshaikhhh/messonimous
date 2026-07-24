import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { Message } from "@/models/User.model";
import { success } from "zod";


export async function POST(request:Request) {
    await ConnectDB()

    try {
        const {username , content } = await request.json();

      const user = await UserModel.findOne({username})
      if(!user){
        return Response.json({
            success:false,
            message:"User not found"
        },{status:401})
      }

    //Checking Is User accepting Messages
    if(!user.isAcceptingMessage){
        return Response.json({
            success:false,
            message:"User is not accepting messages"
        },{status:403})
    }

    //Receiveing the content and pushing it to the User's message array 
    const newMessage = {content,createdAt:new Date()};
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json({
        success:true,
        message:"Message send successfully"
    },{status:201})


    } catch (error) {
        console.error("Error adding messages",error)
        return Response.json({
        success:false,
        message:"Internal Server error"
    },{status:500})
    }
    
}
