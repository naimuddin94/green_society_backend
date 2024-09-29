import { Router } from 'express';
import multer from 'multer';
import { validateRequest } from '../../middlewares';
import { PostController } from './post.controller';
import { PostValidation } from './post.validation';

const upload = multer(); // Initialize multer for handling file uploads

const router = Router();

// Route for creating a post
router.route('/').post(
  upload.array('images'),
  validateRequest(PostValidation.createPostValidationSchema), 
  PostController.createPost
);

// Route for updating a post
router.route('/:postId').patch(
  upload.array('images'), 
  validateRequest(PostValidation.updatePostValidationSchema), 
  PostController.updatePost 
);

// Route for deleting a post
router.route('/:postId').delete(PostController.deletePost); 

// Route for reacting to a post
router
  .route('/reaction')
  .post(
    validateRequest(PostValidation.reactToPostValidationSchema),
    PostController.reactToPost
  ); 

export const postRouters = router;
