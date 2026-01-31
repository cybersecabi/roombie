import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../firebase';

export class NotificationService {
  static async requestPermission(userId: string): Promise<string | null> {
    try {
      const msg = await messaging();
      if (!msg) return null;

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }

      const token = await getToken(msg, {
        vapidKey: 'YOUR_VAPID_KEY', // Replace with your Firebase VAPID key
      });

      if (token) {
        // Save token to user document
        const { updateDoc, doc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'users', userId), {
          fcmToken: token,
        });
      }

      return token;
    } catch (error) {
      console.error('Error getting notification permission:', error);
      return null;
    }
  }

  static async listenToMessages(): Promise<void> {
    const msg = await messaging();
    if (!msg) return;

    onMessage(msg, (payload) => {
      console.log('Message received:', payload);
      
      // Show notification
      if (payload.notification) {
        new Notification(payload.notification.title || 'Roommate Manager', {
          body: payload.notification.body,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
        });
      }
    });
  }

  static async sendLocalNotification(title: string, body: string): Promise<void> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192x192.png',
      });
    }
  }

  static async saveNotification(userId: string, title: string, body: string, type: string): Promise<void> {
    await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      body,
      type,
      read: false,
      createdAt: serverTimestamp(),
    });
  }

  static async checkAndSendReminders(): Promise<void> {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get pending assignments due tomorrow
    const { query, collection, where, getDocs } = await import('firebase/firestore');
    const assignmentsQuery = query(
      collection(db, 'assignments'),
      where('status', '==', 'pending'),
      where('weekEnd', '<=', tomorrow),
      where('weekEnd', '>=', now)
    );

    const assignments = await getDocs(assignmentsQuery);
    
    assignments.forEach(async (assignmentDoc) => {
      const data = assignmentDoc.data();
      const userId = data.userId;
      
      // Send reminder
      await this.saveNotification(
        userId,
        'Chore Reminder',
        `Your chore "${data.choreName}" is due soon!`,
        'reminder'
      );

      // Try to send push notification if token exists
      const userDocRef = doc(db, 'users', userId);
      const { getDoc: getDocFn } = await import('firebase/firestore');
      const userDoc = await getDocFn(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.fcmToken) {
          // In a real app, you would send this via Firebase Cloud Functions
          console.log(`Sending push notification to ${userId}`);
        }
      }
    });
  }
}
