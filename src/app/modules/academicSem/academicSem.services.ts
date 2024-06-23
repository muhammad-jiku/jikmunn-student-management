import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { academicSemesterTitleCodeMapper } from './academicSem.constant';
import { IAcademicSemester } from './academicSem.interface';
import { AcademicSemester } from './academicSem.model';

const createSemester = async (
  payload: IAcademicSemester,
): Promise<IAcademicSemester> => {
  // Summer  02 !=== 03
  if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester Code');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

export const AcademicSemesterServices = {
  createSemester,
};
