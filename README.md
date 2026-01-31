# 🏠 Roommate Chore Manager

A modern, responsive web application for managing shared household chores among roommates. Features automatic weekly rotation, real-time updates, push notifications, shopping lists, and gamification elements.

## ✨ Features

### Core Features
- 🔐 **Authentication** - Email/password login and signup with Firebase Auth
- 🏠 **House Management** - Create or join houses with unique 6-digit invite codes
- 👥 **Roommate Management** - View all roommates and their activity
- 🔄 **Automatic Chore Rotation** - Smart algorithm balances workload across roommates
- 📱 **Push Notifications** - FREE browser push notifications via Firebase Cloud Messaging
- 🌙 **Dark Mode** - Toggle between light and dark themes

### Chore System
- 📝 **Chore Categories** - Kitchen, Bathroom, Living Room, Bedroom, Trash, Outdoor, Other
- ⏱️ **Time Estimates** - Set expected completion time for each chore
- ✅ **Completion Tracking** - Mark chores as done with timestamps
- 📊 **Weekly Rotation** - Automatic assignment every Monday

### Gamification
- 🔥 **Streak System** - Track consecutive weeks of completed chores
- 🏆 **Leaderboard** - Compete with roommates on completion counts
- 📈 **Progress Bars** - Visual representation of each roommate's contributions

### Additional Features
- 🛒 **Shopping List** - Shared household items to purchase
- 📅 **Calendar View** - 4-week upcoming schedule preview
- 🔔 **Reminders** - Automatic notifications before chore due dates
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Frontend framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool |
| **Tailwind CSS** | Styling |
| **Firebase Auth** | Authentication |
| **Firestore** | Database |
| **FCM** | Push notifications |
| **date-fns** | Date handling |
| **Lucide React** | Icons |

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Firebase account (FREE tier)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd roommate-chore-manager
```

2. **Install dependencies**
```bash
npm install
```

3. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Register a web app and copy the config

4. **Configure environment variables**
```bash
cp .env.example .env
```
Edit `.env` and add your Firebase credentials:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. **Deploy Firestore Rules**
```bash
firebase deploy --only firestore:rules
```

6. **Start development server**
```bash
npm run dev
```

## 🏗️ Build for Production

```bash
npm run build
```

## 🚀 Deploy to Firebase Hosting (FREE)

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**
```bash
firebase login
```

3. **Initialize Firebase**
```bash
firebase init
```
   - Select Hosting
   - Select your project
   - Set public directory to `dist`
   - Configure as single-page app: Yes

4. **Deploy**
```bash
firebase deploy
```

## 📱 Push Notifications Setup

To enable push notifications:

1. In Firebase Console, go to Project Settings > Cloud Messaging
2. Generate a VAPID key pair
3. Add the VAPID key to `src/services/NotificationService.ts`
4. Add the Firebase config to your web app's service worker

## 🔄 Chore Rotation Algorithm

The app uses a **smart balancing algorithm**:

1. Tracks last 4 weeks of assignments
2. Counts assignments per roommate
3. Sorts roommates by workload (least first)
4. Uses round-robin starting from least-assigned person
5. Ensures fair distribution over time

## 📊 Database Schema

```
users: {
  id: string,
  email: string,
  name: string,
  houseId?: string,
  streak: number,
  totalCompleted: number,
  fcmToken?: string,
  createdAt: timestamp
}

houses: {
  id: string,
  name: string,
  inviteCode: string,
  createdBy: string,
  roommates: string[],
  createdAt: timestamp
}

chores: {
  id: string,
  name: string,
  category: string,
  description: string,
  estimatedTime: number,
  houseId: string,
  createdAt: timestamp
}

assignments: {
  id: string,
  choreId: string,
  choreName: string,
  userId: string,
  userName: string,
  houseId: string,
  weekStart: timestamp,
  weekEnd: timestamp,
  status: 'pending' | 'completed' | 'missed',
  completedAt?: timestamp,
  createdAt: timestamp
}

shoppingItems: {
  id: string,
  name: string,
  quantity: number,
  requestedBy: string,
  requestedByName: string,
  houseId: string,
  status: 'pending' | 'purchased',
  purchasedBy?: string,
  purchasedAt?: timestamp,
  createdAt: timestamp
}
```

## 🎯 Future Enhancements

- [ ] Recurring expense tracking with split calculations
- [ ] Photo proof for completed chores
- [ ] Custom chore schedules (bi-weekly, monthly)
- [ ] Chore swap requests between roommates
- [ ] House rules/agreements section
- [ ] Integration with calendar apps
- [ ] AI-powered chore suggestions

## 📝 License

MIT License - feel free to use and modify!

## 🙏 Credits

Built with ❤️ using React, Firebase, and Tailwind CSS.
# roombie
