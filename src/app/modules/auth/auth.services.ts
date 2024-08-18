import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { User } from '../users/users.model';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interfaces';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  // // Formula:I: using of instance methods by creating a User's instance
  // const user = new User();
  // const isUserExist = await user.isUserExist(id);
  // if (!isUserExist) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  // }

  // if (
  //   isUserExist.password &&
  //   !(user.isPasswordMatch(password, isUserExist?.password as string))
  // ) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Password mismatched!');
  // }

  // Formula:II: using of statics methods by importing the User model
  const isUserExist = await User.isUserExist(id);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatch(password, isUserExist?.password as string))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password mismatched!');
  }

  const { id: userId, role, needsPasswordChange } = isUserExist;

  // creating access and refresh tokens
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshTokenHandler = async (
  payload: string,
): Promise<IRefreshTokenResponse> => {
  // verify that the refresh token
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      payload,
      config.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId, role } = verifiedToken;
  const isUserExist = await User.isUserExist(userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  const newAccesToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccesToken,
  };
};

export const AuthServices = {
  loginUser,
  refreshTokenHandler,
};
