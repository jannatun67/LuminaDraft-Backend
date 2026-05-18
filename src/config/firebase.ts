import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccountKey = process.env['FIREBASE_SERVICE_ACCOUNT_KEY'];
  const projectId = process.env['FIREBASE_PROJECT_ID'];

  try {
    if (serviceAccountKey && serviceAccountKey.trim().startsWith('{')) {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId,
      });
    }
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error);
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    });
  }
}

export default admin;
