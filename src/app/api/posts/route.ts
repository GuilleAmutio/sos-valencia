// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/mongodb'; // Fixed import name
import Post from '@/models/Post';

export async function GET() {
  await dbConnect();
  const posts = await Post.find().lean(); // Using lean() for better performance
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received post data:', body);
    
    const post = new Post({
      title: body.title,
      description: body.description,
      imageUrls: body.imageUrls || [], // Explicitly include imageUrls
    });
    
    const savedPost = await post.save();
    console.log('Saved post:', savedPost);
    
    // Return the complete saved post
    return NextResponse.json(savedPost, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
