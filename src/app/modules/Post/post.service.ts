/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import httpStatus from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import { message, verifyToken } from '../../lib';
import { AppError, fileUploadOnCloudinary } from '../../utils';
import User from '../User/user.model';
import { postSearchableFields } from './post.constant';
import Post from './post.model';

// Fetch all post from the database
const getAllPostFromDB = async (
  query: Record<string, unknown>,
  accessToken?: string
) => {
  let filter: Record<string, unknown> = {};

  if (accessToken) {
    const { id } = await verifyToken(accessToken);
    const user = await User.findById(id);

    // Check if the user has blocked other users or has been blocked
    if (user?.block?.length || user?.blockedBy?.length) {
      filter = {
        author: {
          $nin: [...(user.block || []), ...(user.blockedBy || [])],
        },
      };
    }

    // If user is premium, show all posts including premium posts
    if (user?.premium || user?.role === 'admin') {
      filter.premium = { $in: [true, false] };
    } else {
      filter.$or = [{ premium: { $ne: true } }, { author: id }];
    }
  }

  // Building the query with filters and other options
  const postQuery = new QueryBuilder(
    Post.find(filter).populate([
      {
        path: 'author',
        select: 'name image',
      },
      {
        path: 'comments',
        select: 'author content createdAt updatedAt',
        populate: { path: 'author', select: 'name image' },
      },
      {
        path: 'like',
        select: 'name image',
      },
    ]),
    query
  )
    .search(postSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;
  const meta = await postQuery.countTotal();

  return {
    meta,
    result,
  };
};

// Fetch single post from the database
const getSinglePostFromDB = async (id: string) => {
  const result = await Post.findById(id).populate([
    {
      path: 'author',
      select: 'name image',
    },
    {
      path: 'comments',
      select: 'author content createdAt updatedAt',
      populate: { path: 'author', select: 'name image' },
    },
    {
      path: 'like',
      select: 'name image',
    },
  ]);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, message.post_not_exist);
  }

  return result;
};

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

  console.log('from PS 100', req.files);

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
  const { id, role } = await verifyToken(accessToken);
  const post = await Post.findById(postId);

  if (!post) { 
    throw new AppError(httpStatus.NOT_FOUND, message.post_not_exist);
  }

  // Ensure the post exists and the user is authorized to delete it
  if (post.author.toString() !== id && role !== "admin") {
    throw new AppError(httpStatus.FORBIDDEN, message.forbidden);
  }

  // Delete the post from the database
  await Post.findByIdAndDelete(postId);

  return { message: message.post_delete };
};

// Reaction a post
const postReactionIntoDB = async (req: Request) => {
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

// Make premium a post into database
const makePremiumPostIntoDB = async (postId: string, accessToken: string) => {
  // Ensure the user is authenticated
  if (!accessToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, message.unauthorized);
  }

  // Verify the user's access token
  const { role } = await verifyToken(accessToken);

  const post = await Post.findById(postId);

  if (role !== 'admin') {
    throw new AppError(httpStatus.UNAUTHORIZED, message.unauthorized);
  }

  const result = await Post.findByIdAndUpdate(
    postId,
    {
      premium: !post?.premium,
    },
    { new: true }
  );

  return result;
};

export const PostService = {
  getAllPostFromDB,
  getSinglePostFromDB,
  savePostIntoDB,
  updatePostIntoDB,
  deletePostFromDB,
  postReactionIntoDB,
  makePremiumPostIntoDB,
};
