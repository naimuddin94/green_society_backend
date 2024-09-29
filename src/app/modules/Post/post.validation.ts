import { z } from 'zod';

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
  category: z.enum(['Vegetables', 'Flowers', 'Landscaping', 'Other'], {
    required_error: 'Category is required',
  }),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  premium: z.boolean().default(false),
});

const createPostValidationSchema = z.object({
  body: postValidationSchema,
});

const updatePostValidationSchema = z.object({
  body: postValidationSchema.partial(),
});

export const PostValidation = {
  postValidationSchema,
  createPostValidationSchema,
  updatePostValidationSchema,
};
