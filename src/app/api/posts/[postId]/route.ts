import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get postId from URL
    const url = request.url;
    const postId = url.split('/posts/')[1];
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const post = await Post.findById(postId);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in GET /api/posts/[postId]:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
} 