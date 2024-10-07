import { z } from 'zod';
import { postCategory, postReaction } from './post.constant';

const postValidationSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(100, { message: 'Title cannot exceed 100 characters' }),
  content: z
    .string({
      required_error: 'Content is required',
    })
    .min(10, { message: 'Content must be at least 10 characters long' }),
  category: z.enum([...postCategory] as [string], {
    required_error: 'Category is required',
  }),
  tags: z.array(z.string()).optional(),
  premium: z.boolean().default(false),
});

const createPostValidationSchema = z.object({
  body: postValidationSchema,
});

const updatePostValidationSchema = z.object({
  body: postValidationSchema.partial(),
});

const reactToPostValidationSchema = z.object({
  body: z.object({
    postId: z.string({
      required_error: 'Post ID is required',
    }),
    reaction: z.enum([...postReaction] as [string], {
      required_error: 'Reaction is required',
      message: 'Reaction is like or dislike',
    }),
  }),
});

export const PostValidation = {
  postValidationSchema,
  createPostValidationSchema,
  updatePostValidationSchema,
  reactToPostValidationSchema,
};
