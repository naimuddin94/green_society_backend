import { Request } from 'express';
import { AppError } from '../../utils';
import Comment from './comment.model'; // Assuming you want to associate comments with posts
import httpStatus from 'http-status';
import message from '../../lib/message'; // Adjust path as necessary
import Post from '../Post/post.model';

const createCommentIntoDB = async (req: Request) => {
  const { postId } = req.params; // Get the post ID from request parameters
  const { content } = req.body; // Get the content from request body
  const { accessToken } = req.cookies; // Get the access token for authentication

  // Ensure the post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, message.post_not_exist);
  }

  // Create a new comment
  const comment = new Comment({
    content,
    post: postId, // Associate the comment with the post
    author: accessToken, // Or use user ID extracted from token
  });

  await comment.save(); // Save the comment to the database

  return comment;
};

const updateCommentIntoDB = async (req: Request) => {
  const { commentId } = req.params; // Get the comment ID from request parameters
  const { content } = req.body; // Get the updated content from request body

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  );
  if (!updatedComment) {
    throw new AppError(httpStatus.NOT_FOUND, message.comment_not_exist);
  }

  return updatedComment;
};

const deleteCommentFromDB = async (req: Request) => {
  const { commentId } = req.params; // Get the comment ID from request parameters

  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) {
    throw new AppError(httpStatus.NOT_FOUND, message.comment_not_exist);
  }

  return deletedComment;
};

const getCommentsForPost = async (req: Request) => {
  const { postId } = req.params; // Get the post ID from request parameters
  const comments = await Comment.find({ post: postId }); // Find comments associated with the post
  return comments;
};

export const CommentService = {
  createCommentIntoDB,
  updateCommentIntoDB,
  deleteCommentFromDB,
  getCommentsForPost,
};
