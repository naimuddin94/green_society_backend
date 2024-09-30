import { Request } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { verifyToken } from '../../lib';
import message from '../../lib/message'; // Adjust path as necessary
import { AppError } from '../../utils';
import Post from '../Post/post.model';
import Comment from './comment.model'; // Assuming you want to associate comments with posts

const createCommentIntoDB = async (req: Request) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { accessToken } = req.cookies;

  // Ensure the post exists
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, message.post_not_exist);
  }

  if (!accessToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, message.unauthorized);
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id } = await verifyToken(accessToken);

    // Create a new comment
    const comment = new Comment({
      content,
      postId,
      author: id,
    });

    await comment.save({ session });

    if (!comment) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        message.comment_creating_error
      );
    }

    await Post.findByIdAndUpdate(
      post._id,
      {
        $addToSet: { comments: comment._id },
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return comment;
  } catch {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      message.comment_creating_error
    );
  }
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
  const { commentId } = req.params;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedComment = await Comment.findByIdAndDelete(commentId, {
      session,
    });
    if (!deletedComment) {
      throw new AppError(httpStatus.NOT_FOUND, message.comment_not_exist);
    }

    await Post.findByIdAndUpdate(
      deletedComment.postId,
      {
        $pull: { comments: deletedComment._id },
      },
      { session }
    );

    await session.commitTransaction();
    await session.endSession();

    return deletedComment;
  } catch {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      message.comment_creating_error
    );
  }
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
