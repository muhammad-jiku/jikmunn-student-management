import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { managementDeptSearchableFields } from './managementDept.constants';
import {
  IManagementDept,
  IManagementDeptFilters,
} from './managementDept.interfaces';
import { ManagementDept } from './managementDept.model';

const createManagementDept = async (
  payload: IManagementDept,
): Promise<IManagementDept> => {
  const result = await ManagementDept.create(payload);

  return result;
};

const getAllManagementDepts = async (
  filters: IManagementDeptFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IManagementDept[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: managementDeptSearchableFields.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await ManagementDept.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await ManagementDept.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleManagementDept = async (
  id: string,
): Promise<IManagementDept | null> => {
  const result = await ManagementDept.findById(id);

  return result;
};

const updateManagementDept = async (
  id: string,
  payload: Partial<IManagementDept>,
): Promise<IManagementDept | null> => {
  const result = await ManagementDept.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteManagementDept = async (
  id: string,
): Promise<IManagementDept | null> => {
  const result = await ManagementDept.findByIdAndDelete(id);

  return result;
};

export const ManagementDeptServices = {
  createManagementDept,
  getAllManagementDepts,
  getSingleManagementDept,
  updateManagementDept,
  deleteManagementDept,
};