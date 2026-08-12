import mongoose,{Schema,Document} from "mongoose";

export interface IAccountDeletionVerification extends Document {
    userId:mongoose.Types.ObjectId;
    verificationCode:string,
    verificationCodeExpiry:Date,
    createdAt:Date
}

const AccountDeletionVerificationSchema = new Schema<IAccountDeletionVerification>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    verificationCode:{
        type:String,
        required:true
    },
    verificationCodeExpiry:{
        type:Date,
        required:true
    }
},{
    timestamps:true
})


export const AccountDeletionVerification =
  mongoose.models.AccountDeletionVerification ||
  mongoose.model<IAccountDeletionVerification>(
    "AccountDeletionVerification",
    AccountDeletionVerificationSchema
  );
