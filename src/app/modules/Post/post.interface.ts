/* eslint-disable no-unused-vars */
import { ObjectId } from 'mongoose';
import { z } from 'zod';
import { PostValidation } from './post.validation';

// Define the Post interface with validation schema fields
export interface IPost
  extends z.infer<typeof PostValidation.postValidationSchema> {
  title: string;
  content: string;
  author: ObjectId;
  images?: string[];
  like: ObjectId[];
  dislike: ObjectId[];
  comments: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
