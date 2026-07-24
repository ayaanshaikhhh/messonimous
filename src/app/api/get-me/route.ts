import {getServerSession} from "next-auth"
import {authOptions} from "../auth/[...nextauth]/options"
import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import {User} from "next-auth"
import mongoose from "mongoose";
import { use } from "react";
import { success } from "zod";

export async function GET(request:Request) {
    await ConnectDB()

    const session = await getServerSession(authOptions)
    const user:User  = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }

    const userID = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match:{ id:userID}},
            {$unwind:"$messages"},
            {$sort:{"messages.createdAt":-1}},
            {$group:{_id:"$_id", messages:{$push:"$messages"}}}
        ])

        if(!user || user.length === 0){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:400})
        }

        return Response.json({
            success:true,
            messages:user[0].messages
        },{status:200})




    } catch (error) {
        console.error("Error getting the user messages",error)
        return Response.json({
            success:false,
            message:"Failed to get the user messages"
        },{status:500})
    }

}