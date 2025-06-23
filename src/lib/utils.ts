import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export const getToken = () => {
    const match = document.cookie.match(/(?:^|; )token=([^;]*)/)
    return match ? decodeURIComponent(match[1]) : ''
  }