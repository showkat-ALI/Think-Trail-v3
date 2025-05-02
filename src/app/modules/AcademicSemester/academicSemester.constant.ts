import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TAcademicSemesterNameCodeMapper,
  TMonths,
} from './academicSemester.interface';

export const Months: TMonths[] = [
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

export const AcademicSemesterName: TAcademicSemesterName[] = [
 
  'Summer',
  'Fall',
];

export const AcademicSemesterCode: TAcademicSemesterCode[] = ['01', '02', ];

export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
  
  Summer: '01',
  Fall: '02',
};

export const AcademicSemesterSearchableFields = ['name', 'year'];
