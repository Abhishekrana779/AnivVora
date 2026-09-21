const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  defaultServer: {
    type: String,
    default: 'vidstreaming'
  },
  defaultQuality: {
    type: String,
    enum: ['360p', '480p', '720p', '1080p', '4k'],
    default: '1080p'
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  notifications: {
    episodeRelease: {
      type: Boolean,
      default: true
    },
    watchlistUpdate: {
      type: Boolean,
      default: true
    }
  },
  theme: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark'
  },
  language: {
    type: String,
    default: 'en'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);