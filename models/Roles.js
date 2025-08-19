// models/Role.js
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      trim: true,
      lowercase: true
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Pre-save middleware to clean up `name` and generate `slug`
roleSchema.pre("save", function (next) {
  if (this.name) {
    // Remove all spaces and convert to lowercase
    this.name = this.name.replace(/\s+/g, "").toLowerCase();

    // Also create a slug from the cleaned name
    this.slug = this.name;
  }
  next();
});

module.exports = mongoose.model("Role", roleSchema);
