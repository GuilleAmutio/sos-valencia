import mongoose, { Document, Schema } from 'mongoose';

export interface IComment {
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  title: string;
  description: string;
  imageUrls?: string[];
  comments: IComment[];
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrls: [{ type: String }],
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
