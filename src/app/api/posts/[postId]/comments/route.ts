import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await dbConnect();
    
    // Get postId from URL
    const url = request.url;
    const postId = url.split('/posts/')[1].split('/comments')[0];
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const { text } = await request.json();
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    post.comments.push({
      text,
      createdAt: new Date(),
    });

    await post.save();
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in POST /api/posts/[postId]/comments:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
} 