const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\']+(\.[^<>()\[\]\.,;:\s@\']+)*)|(\'.+\'))@(([^<>()[\]\.,;:\s@\']+\.)+[^<>()[\]\.,;:\s@\']{2,})$/i;

const generateRandomToken = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name needs at last 3 chars'],
    trim: true
  },
  lastname: {
    type: String,
    required: [true, 'Lastname is required'],
    minlength: [3, 'Lastname needs at last 3 chars'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_PATTERN, 'Email is invalid']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password min length is 8']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  avatar: {
    type: String,
    trim: true
  },
	genre: {
    type: String,
    enum: ['Female', 'Male', 'Other'],
		default: 'Other'
  },
	phoneNumber: String,
  activation: {
    active: {
      type: Boolean,
      default: false
    },
    token: {
      type: String,
      default: generateRandomToken
    },
    oldToken: {
      type: String
    }
  },
  socialLogin: {
    slack: String,
    google: String
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin', 'client'],
    default: 'client'
  },
  terms: {
    type: Boolean,
    required: [true, 'Terms are required']
  }
},
{ timestamps: true, toJSON: { virtuals: true } });

userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10)
      .then((hash) => {
        this.password = hash
        next()
      })
      .catch(next)
  } else {
    next()
  }
})

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

userSchema.virtual("address", {
  ref: "Address",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("storage", {
  ref: "Storage",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("box", {
  ref: "Box",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("product", {
  ref: "Product",
  localField: "_id",
  foreignField: "user",
});

const User = mongoose.model('User', userSchema);

module.exports = User;