  import mongoose, { Document, Model, Schema } from "mongoose";

  export interface IPendingVerification extends Document {
    username: string;
    email: string;
    password: string;
    verificationCode: string;
    verificationCodeExpiry: Date;
  }

  const PendingVerificationSchema = new Schema<IPendingVerification>(
    {
      username: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
      },

      verificationCode: {
        type: String,
        required: true,
      },

      verificationCodeExpiry: {
        type: Date,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  // Automatically delete expired pending registrations
  PendingVerificationSchema.index(
    { verificationCodeExpiry: 1 },
    { expireAfterSeconds: 0 }
  );

  const PendingVerification: Model<IPendingVerification> =
    mongoose.models.PendingVerification ||
    mongoose.model<IPendingVerification>( 
      "PendingVerification",
      PendingVerificationSchema
    );    

  export default PendingVerification;
    