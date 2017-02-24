import mongoose from 'mongoose';

var MembershipSchema = new mongoose.Schema({
  type: String, //user_org
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
  org_id: {type: String, ref: 'Organization', default: null},
  created_at: Date,
  updated_at: Date
});

MembershipSchema.pre('save', function(next) {
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

export default mongoose.model('Membership', MembershipSchema);
