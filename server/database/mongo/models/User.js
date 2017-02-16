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

export default mongoose.model('User', UserSchema);
