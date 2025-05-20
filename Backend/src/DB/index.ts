import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: "jobseeker" | "employer";
  company?: string;
  googleId?: string;
}

export interface IJob extends Document {
  title: string;
  company: string;
  userId: Types.ObjectId;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: Date;
  category: string;
}

export interface IApplication extends Document {
  jobId: Types.ObjectId;
  userId: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  appliedDate: Date;
  coverLetter: string;
  resume: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  role: { type: String, enum: ["jobseeker", "employer"], required: true },
  company: { type: String },
  googleId: { type: String },
});

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  salary: { type: String },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  postedDate: { type: Date, default: Date.now },
  category: { type: String, index: true },
});

const ApplicationSchema = new Schema<IApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  appliedDate: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);
export const ApplicationModel = mongoose.model<IApplication>(
  "Application",
  ApplicationSchema
);
export const JobModel = mongoose.model<IJob>("Job", JobSchema);
