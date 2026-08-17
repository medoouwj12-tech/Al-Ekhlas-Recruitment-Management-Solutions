import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotificationDocument extends Document {
  id: string;
  title: string;
  titleEn: string;
  message: string;
  messageEn: string;
  type: "employer_request" | "candidate_applied" | "status_change" | "match_created";
  createdAt: string;
  read: boolean;
  link?: string;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    titleEn: { type: String, required: true },
    message: { type: String, required: true },
    messageEn: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["employer_request", "candidate_applied", "status_change", "match_created"], 
      required: true 
    },
    createdAt: { type: String, default: () => new Date().toISOString() },
    read: { type: Boolean, default: false },
    link: { type: String, default: "" },
  },
  { timestamps: true }
);

export const NotificationModel: Model<INotificationDocument> =
  mongoose.models.Notification ||
  mongoose.model<INotificationDocument>("Notification", NotificationSchema);
