import { Router } from 'express';
import { validateRequest } from '../../middlewares';
import { CommentController } from './comment.controller';
import { CommentValidation } from './comment.validation'; // Adjust path as necessary

const router = Router();

// Route for creating a comment
router
  .route('/:postId')
  .post(
    validateRequest(CommentValidation.createCommentValidationSchema),
    CommentController.createComment
  );

// Route for updating and deleting a comment
router
  .route('/comment/:commentId')
  .patch(
    validateRequest(CommentValidation.updateCommentValidationSchema),
    CommentController.updateComment
  )
  .delete(CommentController.deleteComment);

// Route for getting comments for a specific post
router.route('/:postId/comments').get(CommentController.getComments);

export const commentRouters = router;
