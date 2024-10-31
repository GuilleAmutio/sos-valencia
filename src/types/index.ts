export interface Post {
  _id: string;
  title: string;
  description: string;
  imageUrls?: string[];
  comments: {
    text: string;
    createdAt: Date;
  }[];
} 