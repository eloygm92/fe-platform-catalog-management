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

export async function remove(url: string) {
  const { cookies } = useCookies()
  return await fetch(import.meta.env.VITE_API + url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + cookies.get('access_token')
    },
    credentials: 'include',
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
  const { cookies } = useCookies();
  return await fetch(import.meta.env.VITE_API + 'auth/refresh', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + cookies.get('refresh_token')
    },
    credentials: 'include'
  }).then((response) => response.json())
}

export async function changePassword(url: string, token: string, data: object) {
  return await fetch(import.meta.env.VITE_API + url, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    credentials: 'include',
    body: JSON.stringify(data)
  })
}

export async function isMaintenance() {
  return await fetch(import.meta.env.VITE_API + 'config/maintenance')
    .then((response) => response.json())
    .then((data) => !!data[0].value_status)
}
