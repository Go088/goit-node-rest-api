import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      default: null,
      required: [true, "Verify token is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const authUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

export default mongoose.model("User", userSchema);
