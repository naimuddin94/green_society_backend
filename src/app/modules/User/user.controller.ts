import httpStatus from 'http-status';
import { message } from '../../lib';
import { AppResponse, asyncHandler } from '../../utils';
import { UserService } from './user.service';

const updateUser = asyncHandler(async (req, res) => {
  const result = await UserService.updateUserIntoDB(req);

  res
    .status(httpStatus.OK)
    .json(new AppResponse(httpStatus.OK, result, message.user_update));
});

export const UserController = {
  updateUser,
};
