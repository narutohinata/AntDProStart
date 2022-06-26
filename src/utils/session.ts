import { TOKEN } from '@/constants';

export function addAuthHeader(): {
  authorization: string;
} {
  const token = localStorage.getItem(TOKEN);
  if (token) {
    return {
      authorization: `Bearer ${token}`,
    };
  } else {
    return {};
  }
}
