'use server'
 
import { cookies } from 'next/headers'
 
export async function setCookie(name, value) {
  const cookieStore = await cookies()
 
  cookieStore.set({
    name: name,
    value: value,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  })
}

export async function getCookie(name) {
  const cookieStore = await cookies()

  const value = cookieStore.get(name);

  return value;
 
}

export async function deleteCookie(name) {
    (await cookies()).delete(name)
}
