const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Allow empty string or valid phone number
          return !v || /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
        },
        message: "Please enter a valid phone number",
      },
    },
    age: {
      type: Number,
      min: [1, "Age must be at least 1"],
      max: [120, "Age cannot exceed 120"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be male, female, or other",
      },
      lowercase: true,
    },
    role: {
      type: String,
      enum: {
        values: ["student", "counselor", "admin"],
        message: "Role must be student, counselor, or admin",
      },
      default: "student",
      required: [true, "Role is required"],
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    profileCompleteness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Virtual to calculate profile completeness
userSchema.virtual("isProfileComplete").get(function () {
  let completeness = 0;
  if (this.name) completeness += 20;
  if (this.email) completeness += 20;
  if (this.phone) completeness += 20;
  if (this.age) completeness += 20;
  if (this.gender) completeness += 20;
  return completeness;
});

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update profile completeness
userSchema.pre("save", function (next) {
  this.profileCompleteness = this.isProfileComplete;
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

// Method to update last login
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

// Method to get public profile (without sensitive information)
userSchema.methods.getPublicProfile = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    age: this.age,
    gender: this.gender,
    role: this.role,
    isActive: this.isActive,
    profileCompleteness: this.profileCompleteness,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Static method to find active users
userSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

// Static method to find by role
userSchema.statics.findByRole = function (role) {
  return this.find({ role: role.toLowerCase(), isActive: true });
};

module.exports = mongoose.model("User", userSchema);
