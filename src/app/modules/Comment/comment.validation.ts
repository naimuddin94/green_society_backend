import { z } from 'zod';

// Validation for creating a comment
const createCommentValidationSchema = z.object({
  body: z.object({
    postId: z.string({
      required_error: 'Post ID is required',
    }),
    content: z
      .string({
        required_error: 'Content is required',
      })
      .min(1, { message: 'Content must be at least 1 character long' })
      .max(500, { message: 'Content cannot exceed 500 characters' }),
  }),
});

// Validation for updating a comment
const updateCommentValidationSchema = z.object({
  body: z.object({
    content: z
      .string({
        required_error: 'Content is required',
      })
      .min(1, { message: 'Content must be at least 1 character long' })
      .max(500, { message: 'Content cannot exceed 500 characters' }),
  }),
});

export const CommentValidation = {
  createCommentValidationSchema,
  updateCommentValidationSchema,
};
