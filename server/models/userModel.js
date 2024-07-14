import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    // required: [true, "Please provide your email"],
    unique: true,
    lowecase: true,
    validate: [validator.isEmail, "Please Provide a valid email"],
  },
  photo: {
    default:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Fuser-profile&psig=AOvVaw16it1Tkc_wE2iPhQWSIt0H&ust=1720787707223000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOjH4_H_nocDFQAAAAAdAAAAABAE",
    type: String,
  },
  password: {
    type: String,
    // required: [true, "Please provide a password"],
    minlength: [8, "Your password must contain 8 characters"],
  },
  cart:{
    type:[{
      product: mongoose.Schema.ObjectId,
      quantity:Number,
    }],
    default:[]
  }
});

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();


  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

    next();
});

const User = mongoose.model('User', userSchema);

export default User

