/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request } from 'express';
import httpStatus from 'http-status';
import { message, verifyToken } from '../../lib';
import { AppError, fileUploadOnCloudinary } from '../../utils';
import Post from './post.model';

// Save a new post into the database
const savePostIntoDB = async (req: Request) => {
  const { accessToken } = req.cookies;
  const postData = req.body;

  // Ensure the user is authenticated
  if (!accessToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, message.unauthorized);
  }

  // Verify the user's access token and fetch user details
  const { id } = await verifyToken(accessToken);

  postData.author = id;

  // Handle image uploads if files are present
  if (req.files) {
    // eslint-disable-next-line no-undef
    const imageUploadPromises = (req.files as Express.Multer.File[]).map(
      async (file) => {
        return await fileUploadOnCloudinary(file.buffer);
      }
    );
    postData.images = await Promise.all(imageUploadPromises);
  }

  // Create the post in the database
  const result = await Post.create(postData);

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      message.post_creating_error
    );
  }

  return result;
};

// Update an existing post in the database
const updatePostIntoDB = async (req: Request) => {
  const { accessToken } = req.cookies;
  const postData = req.body;
  const { postId } = req.params;

  // Ensure the user is authenticated
  if (!accessToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, message.unauthorized);
  }

  // Verify the user's access token
  const { id } = await verifyToken(accessToken);
  const post = await Post.findById(postId);

  // Ensure the post exists and the user is authorized to update it
  if (!post || post.author.toString() !== id) {
    throw new AppError(httpStatus.FORBIDDEN, message.forbidden);
  }

  // Handle image uploads if files are present
  if (req.files) {
    // eslint-disable-next-line no-undef
    const imageUploadPromises = (req.files as Express.Multer.File[]).map(
      async (file) => {
        return await fileUploadOnCloudinary(file.buffer);
      }
    );
    postData.images = await Promise.all(imageUploadPromises);
  }

  // Update the post
  const updatedPost = await Post.findByIdAndUpdate(postId, postData, {
    new: true,
  });

  if (!updatedPost) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      message.post_updating_error
    );
  }

  return updatedPost;
};

// Delete a post from the database
const deletePostFromDB = async (req: Request) => {
  const { accessToken } = req.cookies;
  const { postId } = req.params;

  // Ensure the user is authenticated
  if (!accessToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, message.unauthorized);
  }

  // Verify the user's access token
  const { id } = await verifyToken(accessToken);
  const post = await Post.findById(postId);

  // Ensure the post exists and the user is authorized to delete it
  if (!post || post.author.toString() !== id) {
    throw new AppError(httpStatus.FORBIDDEN, message.forbidden);
  }

  // Delete the post from the database
  await Post.findByIdAndDelete(postId);

  return { message: message.post_delete };
};

// Reaction a post
const posReactionIntoDB = async (req: Request) => {
  const { accessToken } = req.cookies;
  const { postId, reaction } = req.body;

  // Ensure the user is authenticated
  if (!accessToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, message.unauthorized);
  }

  // Verify the user's access token
  const { id } = await verifyToken(accessToken);
  const post = await Post.findById(postId);

  // Ensure the post exists
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, message.post_not_exist);
  }

  // Check if the reaction is valid
  if (reaction !== 'like' && reaction !== 'dislike') {
    throw new AppError(httpStatus.BAD_REQUEST, message.invalid_data_format);
  }

  const likedArray = post.like.map((user) => user.toString());
  const dislikedArray = post.dislike.map((user) => user.toString());

  // Handle 'like' reaction
  if (reaction === 'like') {
    if (likedArray.includes(id)) {
      // User has already liked, so remove their like
      post.like = post.like.filter((userId) => userId.toString() !== id);
    } else {
      // Add user to likes and remove from dislikes if they exist
      //! Note: work this letter

      (post.like as any).push(id);
      post.dislike = post.dislike.filter((userId) => userId.toString() !== id);
    }
  }

  // Handle 'dislike' reaction
  if (reaction === 'dislike') {
    if (dislikedArray.includes(id)) {
      // User has already disliked, so remove their dislike
      post.dislike = post.dislike.filter((userId) => userId.toString() !== id);
    } else {
      // Add user to dislikes and remove from likes if they exist
      //! Note: work this letter
      (post.dislike as any).push(id);
      post.like = post.like.filter((userId) => userId.toString() !== id);
    }
  }

  // Save the updated post
  await post.save();

  return post;
};

export const PostService = {
  savePostIntoDB,
  updatePostIntoDB,
  deletePostFromDB,
  posReactionIntoDB,
};
