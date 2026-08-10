import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      college,
      degree,
      graduationYear,
      skills,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (fullName !== undefined) {
      if (!fullName.trim()) {
        return res.status(400).json({
          success: false,
          message: "Full name cannot be empty",
        });
      }

      user.fullName = fullName.trim();
    }

    if (college !== undefined) {
      user.college = college.trim();
    }

    if (degree !== undefined) {
      user.degree = degree.trim();
    }

    if (graduationYear !== undefined) {
      user.graduationYear =
        graduationYear === ""
          ? undefined
          : Number(graduationYear);
    }

    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({
          success: false,
          message: "Skills must be an array",
        });
      }

      user.skills = skills
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    await user.save();

    const updatedUser = await User.findById(
      req.user.id
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a PDF resume",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const uploadResult = await new Promise(
      (resolve, reject) => {
        const stream =
          cloudinary.uploader.upload_stream(
            {
              folder: "ai-mock-interview/resumes",
              resource_type: "raw",
              public_id: `${req.user.id}-resume.pdf`,
              overwrite: true,
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

        stream.end(req.file.buffer);
      }
    );

    user.resume = uploadResult.secure_url;

    await user.save();

    const updatedUser = await User.findById(
      req.user.id
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      user: updatedUser,
      resume: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Upload resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};