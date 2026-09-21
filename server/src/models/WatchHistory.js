const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  anime: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  episode: {
    type: Number,
    required: true,
    min: 1
  },
  title: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  episodeTitle: {
    type: String,
    default: ''
  },
  watchedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

watchHistorySchema.index({ user: 1, watchedAt: -1 });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);