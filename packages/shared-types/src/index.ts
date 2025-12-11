// Shared TypeScript types and interfaces

export interface User {
  id: string
  email: string
  name: string
  role: string
  isVerified: boolean
  createdAt: Date
}

export interface Track {
  id: string
  title: string
  artist: string
  genre: string
  bpm: number
  key: string
  duration: number
  fileUrl: string
  coverUrl?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface ApiError {
  error: string
  message?: string
  statusCode?: number
}
