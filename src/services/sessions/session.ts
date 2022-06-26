import { addAuthHeader } from '@/utils';
import { request } from 'umi';

export async function login(loginData: { username: string; password: string }): Promise<any> {
  return request('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: loginData,
  });
}

export async function queryCurrentUser(): Promise<DASHBOARD_API.CurrentUser> {
  console.log('queryCurrentUser');
  return request('/api/queryCurrentUser', {
    method: 'GET',
    headers: addAuthHeader(),
  });
}
