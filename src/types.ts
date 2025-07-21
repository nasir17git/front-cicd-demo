export interface User {
  id: string;
  name: string;
  profileImage?: string;
  level: number;
  badges: string[];
  carbonSaved: number;
  isLoggedIn: boolean;
  region?: string;
  age?: number;
  representativeBadge?: string;
  bookmarkedRoutes?: string[];
}

export interface Mission {
  id: string;
  title: string;
  category: string;
  description: string;
  carbonSaving: number;
  image: string;
  completed: boolean;
}

export interface MissionResult {
  id: string;
  image: string;
  category: string;
  missionId: string;
  missionTitle: string;
  location: string;
  coordinates: { lat: number; lng: number };
  badges: string[];
  likes: number;
  date: string;
  author: string;
  authorProfile: string;
  content: string;
  photos: string[];
}

export interface EcoTourRoute {
  id: string;
  name: string;
  location: string;
  region: string;
  description: string;
  detailedDescription: string;
  mainImage: string;
  detailImages: string[];
  carbonRating: "low" | "medium" | "high";
  viewCount: number;
  category: string;
  activities: string[];
  difficulty: "easy" | "medium" | "hard";
  duration: string;
  season: string;
}

export interface BadgeInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: string;
  acquired: boolean;
  acquiredDate?: string;
}

export interface LevelInfo {
  level: number;
  name: string;
  icon: string;
  carbonThreshold: number;
}

export interface CalculatorData {
  people: number;
  routes: Array<{
    from: string;
    to: string;
    transport: string;
  }>;
  stays: Array<{
    startDate: Date | null;
    endDate: Date | null;
    accommodation: string;
  }>;
  selectedCourses: string[];
}