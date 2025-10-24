export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  category?: string;
  level?: string;
  instructor?: {
    full_name: string;
  };
  profiles?: {
    full_name: string;
  };
  is_paid?: boolean;
  price?: number;
  // Additional fields from mock data
  is_published?: boolean;
  created_at?: string;
  instructor_id?: string;
  instructorName: string;
  instructorBio?: string;
  duration?: string;
  students?: number;
  rating?: number;
  isPaid?: boolean;
  youtubeUrl?: string;
  videoUrl?: string;
  modules?: any[];
  discount?: number;
  // MongoDB fields
  _id?: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
}
