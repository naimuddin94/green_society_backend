import httpStatus from 'http-status';
import { message } from '../../lib';
import { AppResponse, asyncHandler } from '../../utils';
import { CommentService } from './comment.service';

const createComment = asyncHandler(async (req, res) => {
  const result = await CommentService.createCommentIntoDB(req);
  res
    .status(httpStatus.CREATED)
    .json(new AppResponse(httpStatus.CREATED, result, message.comment_created));
});

const updateComment = asyncHandler(async (req, res) => {
  const result = await CommentService.updateCommentIntoDB(req);
  res
    .status(httpStatus.OK)
    .json(new AppResponse(httpStatus.OK, result, message.comment_updated));
});

const deleteComment = asyncHandler(async (req, res) => {
  await CommentService.deleteCommentFromDB(req);
  res
    .status(httpStatus.OK)
    .json(new AppResponse(httpStatus.OK, {}, message.comment_delete));
});

const getComments = asyncHandler(async (req, res) => {
  const result = await CommentService.getCommentsForPost(req);
  res
    .status(httpStatus.OK)
    .json(new AppResponse(httpStatus.OK, result, message.comment_delete));
});

export const CommentController = {
  createComment,
  updateComment,
  deleteComment,
  getComments,
};
