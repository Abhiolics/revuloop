import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple unique ID generator for our mock data
export function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

// Simulated network delay
export async function delay(ms: number = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
