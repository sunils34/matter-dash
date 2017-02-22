import mongoose from 'mongoose';

var UserSchema = new mongoose.Schema({
  name: String,
  // TODO add a reference to an organization
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  google: {
    id: String,
    token: String,
    name: String
  },
  created_at: Date,
  updated_at: Date
});

UserSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  // change the updated_at field to current date
  this.updated_at = currentDate;
  // if created_at doesn't exist, add to that field
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

export default mongoose.model('User', UserSchema);
