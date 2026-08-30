interface DecodedUser {
  id: string;
  email: string;
  name?: string;
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  );
}

export function getCurrentUser(): DecodedUser | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(token.split('.')[1]));
    const id = payload.id ?? payload.userId ?? payload.sub;
    const email = payload.email;

    if (!id || !email) {
      console.warn('JWT payload missing expected fields:', payload);
      return null;
    }

    return { id: String(id), email, name: payload.name };
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
}