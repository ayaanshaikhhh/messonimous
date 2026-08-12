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
