import mongoose from 'mongoose';
import shortid from 'shortid';

var OrganizationSchema = new mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  name: String,
  created_at: Date,
  updated_at: Date
});

OrganizationSchema.pre('save', function(next) {
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

export default mongoose.model('Organization', OrganizationSchema);

