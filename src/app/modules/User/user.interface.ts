/* eslint-disable no-unused-vars */
import { HydratedDocument, Model } from 'mongoose';
import { z } from 'zod';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';

export interface IUser
  extends z.infer<typeof UserValidation.userValidationSchema> {
  image?: string;
  refreshToken?: string;
  passwordChangedAt?: Date;
}

export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IUserModel
  extends Model<IUser, Record<string, never>, IUserMethods> {
  isUserExists(email: string): Promise<HydratedDocument<IUser, IUserMethods>>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export type TUserRole = keyof typeof USER_ROLE;
