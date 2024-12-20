const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  history: [{
    action: {
      type: String,
      enum: ['Earned', 'Redeemed'],
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    description: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  tier: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze'
  }
}, {
  timestamps: true
});

const Reward = mongoose.model('Reward', rewardSchema);
module.exports = Reward;