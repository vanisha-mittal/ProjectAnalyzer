const Joi = require("joi");

//  User schema (for signup/login)
const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").default("user"),
});

//  Project schema (when uploading project)
const projectSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  techStack: Joi.array().items(Joi.string()).required(),
  repoLink: Joi.string().uri().allow(null, ""),
  deployedLink: Joi.string().uri().allow(null, ""),
  uploadedBy: Joi.string().required(), // userId reference
});

//  Review schema (project feedback)
const reviewSchema = Joi.object({
  rating: Joi.number().min(0).max(5).required(),
  comment: Joi.string().required(),
  projectId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { userSchema, projectSchema, reviewSchema };
