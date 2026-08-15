import mongoose, { Document, Model, Schema } from "mongoose";

export interface EmailChangeVerification extends Document {
  userId: mongoose.Types.ObjectId;
  newEmail: string;
  verificationCode: string;
  verificationCodeExpiry: Date;
  createdAt: Date;
}

const EmailChangeVerificationSchema =
  new Schema<EmailChangeVerification>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      newEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      verificationCode: {
        type: String,
        required: true,
      },

      verificationCodeExpiry: {
        type: Date,
        required: true,
      },

      createdAt: {
        type: Date,
        default: Date.now,
        expires: 600,
      },
    },
  );

const EmailChangeVerificationModel: Model<EmailChangeVerification> =
  mongoose.models.EmailChangeVerification ||
  mongoose.model<EmailChangeVerification>(
    "EmailChangeVerification",
    EmailChangeVerificationSchema,
  );

export default EmailChangeVerificationModel;