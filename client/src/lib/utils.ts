import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getImageUrl(imagePath: string) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  return `${apiBaseUrl.replace('/api', '')}/media/hostels/${imagePath}`;
}