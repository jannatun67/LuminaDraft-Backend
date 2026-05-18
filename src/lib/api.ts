const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API wrapper with authentication
export const syncUserWithBackend = async (
  uid: string,
  email: string,
  displayName: string | null,
  photoURL: string | null,
  token: string
) => {
  const response = await fetch(`${API_URL}/api/auth/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      uid,
      email,
      name: displayName || (email ? email.split('@')[0] : undefined),
      profilePic: photoURL || '',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to sync user');
  }

  return response.json();
};