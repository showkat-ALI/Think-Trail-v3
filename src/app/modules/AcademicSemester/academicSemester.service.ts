import QueryBuilder from '../../builder/QueryBuilder';
import {
  AcademicSemesterSearchableFields,
  academicSemesterNameCodeMapper,
} from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code');
  }
  const existingSemesters = await AcademicSemester.findOne({
    name: payload.name,
    year: payload.year,
  });
  if (existingSemesters) {
    throw new Error('This semester is already exist');
  }
  const startDate = new Date(`${payload.year}-${payload.startMonth}-01`);
  const endDate = new Date(`${payload.year}-${payload.endMonth}-01`);

  if (endDate < startDate) {
    throw new Error('End date cannot be before start date');
  }

  const monthDifference =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  if (monthDifference < 3) {
    throw new Error(
      'There should be at least 4 months gap between start month and end month',
    );
  }

  const currentYearSemesters = await AcademicSemester.find({
    year: payload.year,
  });

  if (currentYearSemesters.length >= 3) {
    throw new Error('Cannot have more than 3 semesters in the current year');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemestersFromDB = async (
  query: Record<string, unknown>,
) => {
  // Get current month name (e.g., "March")
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const currentMonthName = monthNames[new Date().getMonth()];

  // First get all semesters that match other query parameters
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
    .search(AcademicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  let result = await academicSemesterQuery.modelQuery;

  // Filter on client side to ensure proper month comparison
  result = result.filter((semester) => {
    const startIndex = monthNames.indexOf(semester.startMonth);
    const endIndex = monthNames.indexOf(semester.endMonth);
    const currentIndex = monthNames.indexOf(currentMonthName);
    return currentIndex >= startIndex && currentIndex <= endIndex;
  });

  // Recalculate meta data based on filtered results
  const total = result.length;
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
};
