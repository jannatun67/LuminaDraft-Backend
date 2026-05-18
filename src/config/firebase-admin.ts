import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  // Check if already initialized
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  // For production, use service account JSON from environment variable
  // For development, you can use the default credentials
  let serviceAccount: ServiceAccount | undefined;

  if (process.env['FIREBASE_SERVICE_ACCOUNT_KEY']) {
    try {
      // Parse the service account JSON from environment variable
      serviceAccount = JSON.parse(process.env['FIREBASE_SERVICE_ACCOUNT_KEY']) as ServiceAccount;
    } catch (error) {
      console.error('Error parsing Firebase service account JSON:', error);
      throw new Error('Invalid Firebase service account configuration');
    }
  }

  // Initialize with service account or use default credentials
  const app = admin.initializeApp({
    credential: serviceAccount 
      ? admin.credential.cert(serviceAccount)
      : admin.credential.applicationDefault(),
    projectId: process.env['FIREBASE_PROJECT_ID'] || 'luminadraft',
  });

  console.log('✅ Firebase Admin SDK initialized');
  return app;
};

// Get the initialized app
const firebaseAdmin = initializeFirebaseAdmin();
const auth = firebaseAdmin.auth();

export { firebaseAdmin, auth };