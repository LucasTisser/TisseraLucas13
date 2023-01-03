import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    max: 100,
  },
  password: {
    type: String,
    required: true,
    max: 100,
  }
})

export const UsuariosModel = mongoose.model("usuarios", Schema);
