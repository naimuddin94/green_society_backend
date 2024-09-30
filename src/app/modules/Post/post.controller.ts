import httpStatus from 'http-status';
import { message } from '../../lib';
import { AppResponse, asyncHandler } from '../../utils';
import { PostService } from './post.service';

// Get all posts from
const fetchPosts = asyncHandler(async (req, res) => {
  const result = await PostService.getAllPostFromDB(req.query, req.cookies.accessToken);

  res
    .status(httpStatus.OK)
    .json(new AppResponse(httpStatus.OK, result, message.posts_fetched));
});

// Get single posts from
const fetchPost = asyncHandler(async (req, res) => {
  const result = await PostService.getSinglePostFromDB(req.params.postId);

  res
    .status(httpStatus.OK)
    .json(new AppResponse(httpStatus.OK, result, message.post_fetched));
});

// Create a new post
const createPost = asyncHandler(async (req, res) => {
  const result = await PostService.savePostIntoDB(req);

  res
    .status(httpStatus.CREATED)
    .json(new AppResponse(httpStatus.CREATED, result, message.post_created));
});

// Update an existing post
const updatePost = asyncHandler(async (req, res) => {
  const result = await PostService.updatePostIntoDB(req);

  res
    .status(httpStatus.OK)
    .json(new AppResponse(httpStatus.OK, result, message.post_updated));
});

// Delete a post
const deletePost = asyncHandler(async (req, res) => {
  const result = await PostService.deletePostFromDB(req);

  res
    .status(httpStatus.OK)
    .json(new AppResponse(httpStatus.OK, result.message, message.post_delete));
});

// React to a post
const reactToPost = asyncHandler(async (req, res) => {
  const result = await PostService.posReactionIntoDB(req);

  res
    .status(httpStatus.OK)
    .json(new AppResponse(httpStatus.OK, result, message.post_reaction));
});

export const PostController = {
  fetchPosts,
  fetchPost,
  createPost,
  updatePost,
  deletePost,
  reactToPost,
};
