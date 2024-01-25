import { useUserStore } from '@/stores/user'
import { useCookies } from 'vue3-cookies'
export async function get(url: string) {
  const { cookies } = useCookies()
  return await fetch(import.meta.env.VITE_API + url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + cookies.get('access_token')
    },
    credentials: 'include'
  }).then((response) => response.json())
}

export async function post(url: string, data: object) {
  const { cookies } = useCookies()
  return await fetch(import.meta.env.VITE_API + url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + cookies.get('access_token')
    },
    credentials: 'include',
    body: JSON.stringify(data)
  })
}

export async function patch(url: string, data: object) {
  const { cookies } = useCookies()
  return await fetch(import.meta.env.VITE_API + url, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + cookies.get('access_token')
    },
    credentials: 'include',
    body: JSON.stringify(data)
  })
}

export async function logout(access_token: string) {
  const userStore = useUserStore()

  return await fetch(import.meta.env.VITE_API + 'auth/logout', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token
    },
    body: JSON.stringify({
      user: {
        sub: userStore.user.id
      }
    })
  })
}

export async function refreshToken() {
  return await fetch(import.meta.env.VITE_API + 'auth/refresh', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }).then((response) => response.json())
}
