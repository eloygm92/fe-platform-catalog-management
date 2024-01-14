import { useUserStore } from '@/stores/user'
export async function get(url) {
  return await fetch(url).then((response) => response.json())
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
