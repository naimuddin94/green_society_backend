import { ObjectId } from 'mongoose';

// Define the structure of a comment
export interface IComment {
  _id: ObjectId; 
  postId: ObjectId; 
  author: ObjectId; 
  content: string; 
  createdAt?: Date; 
  updatedAt?: Date; 
}
