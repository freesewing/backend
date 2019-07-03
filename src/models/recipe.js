import mongoose, { Schema } from "mongoose";

const RecipeSchema = new Schema({
  handle: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
    index: true
  },
  user: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  created: Date,
  notes: {
    type: String,
    trim: true
  },
  recipe: {},
},{ timestamps: true });

RecipeSchema.index({ user: 1 , handle: 1});

RecipeSchema.methods.info = function() {
  return this.toObject();
}

RecipeSchema.methods.asRecipe = function() {
  let recipe = this.toObject();
  for(let field of ["_id", "user", "createdAt", "updatedAt", "_v"])
    delete recipe[field];

  return recipe;
}

export default mongoose.model('Recipe', RecipeSchema);
