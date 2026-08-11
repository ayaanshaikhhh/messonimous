// import mongoose,{Schema,Document} from "mongoose";


// export interface Message extends Document{
//     content : string;
//     createdAt :Date;
// }

// const MessageSchema:Schema<Message> = new Schema({
//     content:{
//         type:String,
//         required:true,
//     },
//     createdAt:{
//         type:Date,
//         required:true,
//         default:Date.now
//     }
// })


// export interface User extends Document{
//     username :string;
//     email:string;
//     password:string;
//     verifyCode:string;
//     verifyCodeExpiry:Date;
//     isVerified:boolean
//     isAcceptingMessage:boolean;
//     messages:Message[],
//     resetPasswordToken : string | null,
//     resetPasswordExpiry:Date | null
// }

// const UserSchema:Schema<User>  = new Schema({
//     username:{
//         type:String,
//         required:[true,"Username is required"],
//         trim:true,
//         unique:true
//     },
//     email:{
//         type:String,
//         required:[true,"Email is required"],
//         unique:true,
//         match: [/.+\@.+\..+/ ,"please provide a valid email address"]
//     },

//     password:{
//         type:String,
//         required:[true,"Password is required"]
//     },
//     verifyCode:{
//         type:String,
//         required:[true,"Verification Code is required"],
//     },
//     verifyCodeExpiry:{
//         type:Date,
//         required:[true,"Verifi is required"],
//         unique:true
//     },

//     isVerified:{
//         type:Boolean,
//         default:false
//     },
//     isAcceptingMessage:{
//         type:Boolean,
//         default:true
//     },
//     messages:[MessageSchema],

//     resetPasswordToken:{
//         type:String,
//         default:null
//     },
//     resetPasswordExpiry:{
//         type:Date,
//         default:null
//     }
// })

// // Creating User Model 
// const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))

// export default UserModel;


// MODIFIED ::: 

import mongoose, { Document, Schema, Model } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema = new Schema<Message>(
  {
    content: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

export interface User extends Document {
  username: string;
  email: string;
  password: string;

  isVerified: boolean;
  isAcceptingMessage: boolean;

  messages: Message[];

  resetPasswordToken: string | null;
  resetPasswordExpiry: Date | null;
}

const UserSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /.+\@.+\..+/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    isAcceptingMessage: {
      type: Boolean,
      default: true,
    },

    messages: {
      type: [MessageSchema],
      default: [],
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel: Model<User> =
  mongoose.models.User ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
