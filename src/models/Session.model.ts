import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface Session extends Document {
  userId: mongoose.Types.ObjectId;

  // Unique identifier stored inside the JWT
  sessionId: string;

  // Device information
  device: string;
  browser: string;
  operatingSystem: string;

  // Request information
  ipAddress: string | null;
  userAgent: string | null;

  // Session activity
  lastActiveAt: Date;

  // Session expiration
  expiresAt: Date;

  // Revocation
  revokedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<Session>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    device: {
      type: String,
      required: true,
      default: "Unknown Device",
    },

    browser: {
      type: String,
      required: true,
      default: "Unknown Browser",
    },

    operatingSystem: {
      type: String,
      required: true,
      default: "Unknown OS",
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const SessionModel: Model<Session> =
  mongoose.models.Session ||
  mongoose.model<Session>(
    "Session",
    SessionSchema,
  );

export default SessionModel;