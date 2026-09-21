const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  animeId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  synopsis: {
    type: String,
    default: ''
  },
  episodes: {
    type: Number,
    default: 0
  },
  genres: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'],
    default: 'plan_to_watch'
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

watchlistSchema.index({ user: 1, animeId: 1 }, { unique: true });
watchlistSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Watchlist', watchlistSchema);