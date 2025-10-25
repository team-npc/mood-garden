# 🌱 Mood Garden 2.0

A mindful journaling web app where your virtual plant grows with your reflections — no numbers, just natural growth and gentle encouragement for consistent self-care.

![Mood Garden](https://img.shields.io/badge/React-18.2.0-blue) ![Firebase](https://img.shields.io/badge/Firebase-10.0.0-orange) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Overview

Mood Garden 2.0 transforms journaling into a beautiful, organic experience without the pressure of statistics or quantified metrics. Your thoughts and reflections nurture a virtual plant that evolves naturally, providing gentle motivation for consistent self-reflection through plant-based metaphors instead of numbers.

### � Core Philosophy

- **No quantification**: Zero statistics, scores, or numerical pressure
- **Plant-based insights**: Growth phases, activity levels, and emotional gardens replace charts
- **Progress, not perfection**: Your plant may wilt but never dies permanently
- **Privacy-first**: All journal entries are private and secure
- **Visual rewards**: Natural growth stages celebrate your dedication
- **Gentle encouragement**: Plant wisdom replaces numerical metrics

## 🌟 Key Features

### 🔐 **Secure Authentication**
- Email/password registration and login
- Google OAuth integration
- Protected user sessions with Firebase Auth

### 📝 **Mindful Journaling**
- Rich text journal entries with optional mood tracking
- Emoji picker for emotional context
- Plant-inspired feedback based on content depth (🌱🌿🌳)
- Search and filter through past entries

### 🌿 **Dynamic Plant Growth**
- **6 Growth Stages**: seed → sprout → plant → blooming → tree → fruiting tree
- **Visual States**: healthy, wilting, recovering based on activity
- **Plant Insights**: Growth phases, activity levels, emotional garden views
- **Time-based Evolution**: Plant health changes based on journaling consistency

### 🎁 **Plant-Based Rewards System**
- **Natural Growth**: Visual progression through plant stages
- **Activity Insights**: "Budding", "Flowering", "Dormant" activity descriptions
- **Emotional Garden**: Qualitative mood landscape visualization  
- **Growth Encouragement**: Plant wisdom messages instead of statistics
- **No Numbers**: Pure organic celebration of progress

### 📱 **Responsive Design**
- Mobile-first responsive layout
- Clean, minimalist interface
- Calming sage and earth color palette
- Smooth animations with Framer Motion

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons
- **React Router** for navigation

### Backend
- **Firebase Authentication** for user management
- **Cloud Firestore** for data storage
- **Firebase Hosting** ready for deployment

### Development Tools
- **Vite** for fast builds and HMR
- **PostCSS** and **Autoprefixer**
- **ESLint** for code quality

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase project (instructions below)

### 1. Clone and Install
```bash
git clone https://github.com/team-npc/mood-garden.git
cd mood-garden
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password and Google)
4. Create Firestore database in production mode
5. Add your domain to authorized domains

#### Get Configuration
1. Go to Project Settings → General
2. Scroll to "Your apps" section
3. Add a web app or use existing one
4. Copy the Firebase config object

### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your Firebase credentials
```

Add your Firebase configuration to `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Development Server
```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see your Mood Garden!

### 5. Build for Production
```bash
npm run build
npm run preview  # Preview production build locally
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── EmojiPicker.jsx
│   ├── JournalEntryForm.jsx
│   ├── JournalEntryItem.jsx
│   ├── LoginForm.jsx
│   ├── Navigation.jsx
│   ├── PlantStage.jsx
│   ├── ProtectedRoute.jsx
│   ├── RegisterForm.jsx
│   └── RewardNotification.jsx
├── context/              # React context providers
│   └── AuthContext.jsx
├── firebase/             # Firebase configuration
│   ├── auth.js
│   ├── config.js
│   └── firestore.js
├── hooks/                # Custom React hooks
│   ├── useEncouragement.js
│   ├── useJournal.js
│   └── usePlantLogic.js
├── pages/                # Main application pages
│   ├── GardenPage.jsx
│   ├── JournalPage.jsx
│   ├── ProfilePage.jsx
│   └── WelcomePage.jsx
├── utils/                # Utility functions
│   └── timeUtils.js
└── App.jsx              # Root component
```

## 🌱 How Plant Growth Works

### Growth Stages
1. **Seed** (0-1 entries): Starting point with underground potential
2. **Sprout** (1-3 entries): First green shoots emerge  
3. **Plant** (3-7 entries): Multiple leaves and stronger stem
4. **Blooming** (7-15 entries): Flowers begin to appear
5. **Tree** (15-25 entries): Strong trunk with full canopy
6. **Fruiting Tree** (25+ entries): Abundant flowers and fruits

### Health System
- **Healthy** (70-100%): Vibrant colors, normal animation
- **Wilting** (30-69%): Faded colors, drooping effect
- **Severely Wilting** (0-29%): Desaturated, minimal animation

### Time-based Changes
- **Day 0**: New entry boosts health by 10%
- **Day 1**: Health maintained
- **Day 2**: Slight decline (-5%)
- **Days 3-6**: Moderate decline (-8% per day)
- **Day 7+**: Significant decline (-10% per day)

## 🎯 Database Structure

### Users Collection
```javascript
/users/{uid}/
├── profile: {
│   uid, displayName, email, photoURL,
│   createdAt, lastActive, preferences
│ }
├── plant: {
│   stage, health, lastWatered, lastEntryDate,
│   currentStreak, longestStreak, totalEntries,
│   flowers[], fruits[], specialEffects[]
│ }
└── entries/{entryId}: {
    content, mood, createdAt,
    wordCount, characterCount
  }
```

### Security Rules
```javascript
// Allow users to read/write only their own data
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

## 🚀 Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### Alternative Deployment Options
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop build folder or connect repository
- **GitHub Pages**: Use gh-pages package for static deployment

## 🔧 Configuration

### Theme Customization
Edit `tailwind.config.js` to customize colors:
```javascript
theme: {
  extend: {
    colors: {
      sage: { /* custom sage colors */ },
      earth: { /* custom earth colors */ }
    }
  }
}
```

### Plant Growth Parameters
Modify growth requirements in `src/firebase/firestore.js`:
```javascript
const stageRequirements = {
  seed: { points: 1, streak: 1 },
  sprout: { points: 3, streak: 2 },
  // ... customize as needed
};
```

### Encouragement Messages
Add custom messages in `src/hooks/useEncouragement.js`:
```javascript
const affirmations = {
  healthy: ["Your custom message here"],
  // ... add more categories
};
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Journal entry creation with emoji
- [ ] Plant health updates after entries
- [ ] Visual plant stage progression
- [ ] Reward notifications display
- [ ] Mobile responsiveness
- [ ] Data persistence across sessions

### Automated Testing (Future Enhancement)
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react vitest

# Run tests
npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style Guidelines
- Use functional components with hooks
- Follow ESLint configuration
- Write descriptive commit messages
- Add JSDoc comments for functions
- Keep components focused and reusable

## 🛣️ Roadmap

### Near-term Enhancements
- [ ] **Push Notifications**: Gentle reminders via Firebase Cloud Messaging
- [ ] **Dark Mode**: Complete dark theme implementation
- [ ] **Plant Variety**: Multiple plant types to choose from
- [ ] **Export Data**: Download journal entries as PDF/text
- [ ] **Sharing**: Anonymous sharing of plant progress

### Future Features
- [ ] **AI Insights**: Gentle reflection prompts based on entry patterns
- [ ] **Soundscape**: Ambient nature sounds during writing
- [ ] **Community**: Optional anonymous community garden view
- [ ] **Seasonal Events**: Special plant decorations for holidays
- [ ] **Accessibility**: Screen reader support and keyboard navigation

### Technical Improvements
- [ ] **Offline Support**: Service worker for offline journaling
- [ ] **Performance**: Lazy loading and code splitting
- [ ] **Testing**: Comprehensive test suite
- [ ] **Analytics**: Privacy-focused usage analytics
- [ ] **Progressive Web App**: Installable mobile experience

## ❓ Troubleshooting

### Common Issues

**Plant not updating after entry**
- Check Firebase console for Firestore security rules
- Verify user is authenticated
- Check browser console for JavaScript errors

**Authentication failing**
- Confirm Firebase project configuration in `.env`
- Check authorized domains in Firebase console
- Verify OAuth client settings for Google sign-in

**Styling issues**
- Ensure TailwindCSS is properly configured
- Check for conflicting CSS imports
- Verify PostCSS configuration

**Performance problems**
- Monitor Firestore query patterns
- Check for unnecessary re-renders with React DevTools
- Optimize images and assets

### Debug Mode
Add to `.env` for additional logging:
```env
VITE_DEBUG=true
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase** for providing robust backend services
- **React** team for the excellent framework
- **TailwindCSS** for the utility-first styling approach
- **Framer Motion** for smooth animations
- **Lucide** for beautiful, consistent icons

## 💌 Support

If you find Mood Garden helpful, consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs via GitHub issues
- 💡 Suggesting features or improvements
- 📢 Sharing with friends who might benefit

---

**Remember**: Your mental health journey is unique. Mood Garden is a tool to support your reflection practice, not replace professional mental health care when needed.

*Built with 💚 for mindful souls everywhere*
