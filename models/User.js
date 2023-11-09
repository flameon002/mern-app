const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    lowercase: true,
    require: true,
  },
  email: {
    type: String,
    lowercase: true,
    require: true,
    unique: true,
    index: {unique: true}
  },
  password: {
    type: String,
    require: true,
  },
  tokenConfirm:{
    type: String,
    default: null,
  },
  cuentaConfirmada:{
    type: Boolean,
    default: false
  },
  imagen: {
    type: String,
    default: null,
  },
});


userSchema.pre('save', async function(next){
  const user = this;
  if (!user.isModified('password')) return next()
  try {
    const salt= await bcrypt.genSalt(10)
    const hash= await bcrypt.hash(this.password, salt)

    user.password = hash
    next()
  } catch (error) {
    console.log(error);
    throw new Error("error al codificar la contraseña")
  }
})

userSchema.methods.comparePassword= async function(canditePassword) {
  return await bcrypt.compare(canditePassword, this.password)
}




const User = mongoose.model("User", userSchema);
module.exports = User;
