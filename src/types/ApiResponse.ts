import {Message} from "../types/Message"

export interface ApiResponse{
    success:boolean
    message:string
    isAcceptingMessage?: boolean
    messages?: Array<Message>
}