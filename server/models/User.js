import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["candidate", "admin"],
      default: "candidate",
    },

    // Starting Credits set to 100
    credits: {
      type: Number,
      default: 100,
      min: 0,
    },

    profileImage: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    college: {
      type: String,
      default: "",
    },

    degree: {
      type: String,
      default: "",
    },

    graduationYear: {
      type: Number,
    },

    skills: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;