const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        const hash = await bcrypt.hash(this.password, 8);
        this.password = hash;
    }        
    next();    
});

UserSchema.methods.comparePassword = async function (password) {
    if(!password) throw new Error('Password is missing, cannot compare');

    try {
        const result = await bcrypt.compare(password, this.password)
        return result;
    } catch (error) {
        console.log('Error while comparing password', error.message)
    }
}

module.exports = mongoose.model("User", UserSchema);