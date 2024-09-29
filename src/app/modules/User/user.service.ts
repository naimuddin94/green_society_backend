import { Request } from 'express';
import httpStatus from 'http-status';
import { message, verifyToken } from '../../lib';
import { AppError, fileUploadOnCloudinary } from '../../utils';
import User from './user.model';

// Update user information in the database
const updateUserIntoDB = async (req: Request) => {
  const userData = req.body;
  const { accessToken } = req.cookies;

  if (accessToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, message.user_not_exist);
  }

  const { id } = await verifyToken(accessToken);

  const isUserExists = await User.findById(id);

  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, message.user_not_exist);
  }

  if (req.file && req.file.buffer) {
    userData.image = await fileUploadOnCloudinary(req.file.buffer);
  }

  const result = await User.findByIdAndUpdate(id, userData).select(
    '-password -createdAt -updateAt'
  );

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      message.user_updating_error
    );
  }

  return result;
};

export const UserService = {
  updateUserIntoDB,
};
