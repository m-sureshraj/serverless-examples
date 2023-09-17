import { API_ENDPOINT, isDev } from './config.ts';
import { User } from './types.ts';

export async function getUser(): Promise<User | null> {
  const res = await fetch(`${API_ENDPOINT}/user-info`, {
    ...(isDev ? { credentials: 'include' } : {}),
  });
  const resBody = await res.json();
  if (res.ok) {
    return resBody;
  }

  console.error(resBody);
  return null;
}

export async function updateUserProfile(
  userProfile: Pick<User, 'given_name' | 'family_name' | 'custom:company'>
) {
  const res = await fetch(`${API_ENDPOINT}/user-info`, {
    method: 'POST',
    ...(isDev ? { credentials: 'include' } : {}),
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userProfile),
  });
  const resBody = await res.json();
  if (res.ok) {
    return resBody;
  }

  return Promise.reject(resBody);
}

export async function logout() {
  await fetch(`${API_ENDPOINT}/logout`, {
    // instructs browser to include the cookies when making cross-origin request in dev
    ...(isDev ? { credentials: 'include' } : {}),
  });
}
