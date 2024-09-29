import { Schema, model } from 'mongoose';
import { IComment } from './comment.interface';

// Define the comment schema
const commentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    versionKey: false, // Disable the version key (_v)
  }
);

// Create the Comment model
const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
