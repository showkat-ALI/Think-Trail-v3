/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
// import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
// import { AcademicDepartment } from '../AcademicDepartment/academicDepartment.model';
import { AcademicSemester } from '../AcademicSemester/academicSemester.model';
import { TAdmin } from '../Admin/admin.interface';
import { Admin } from '../Admin/admin.model';
import { TFaculty } from '../Faculty/faculty.interface';
import { Faculty } from '../Faculty/faculty.model';
import { TStudent } from '../Student/student.interface';
import { Student } from '../Student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import emailSender, {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import { SuperAdmin } from '../SuperAdmin/admin.model';
import { sendFileToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (payload: TStudent) => {
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = payload.password || (config.default_password as string);

  //set student role
  userData.roles = ['student'];
  // set student email
  userData.email = payload.email;

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
  const currentMonth = new Date().getMonth();

  const semesters = await AcademicSemester.find().exec();
  const curentSemester = semesters.find((semester) => {
    const startIndex = monthNames.indexOf(semester.startMonth);
    const endIndex = monthNames.indexOf(semester.endMonth);
    
    if (startIndex > endIndex) {
      return currentMonth >= startIndex || currentMonth <= endIndex;
    } else {
      return currentMonth >= startIndex && currentMonth <= endIndex;
    }
  });

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    
    // Generate student ID
    if (!curentSemester) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Current semester not found');
    }
    userData.id = await generateStudentId(curentSemester);

    // Create user
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // Prepare email content
    const emailSubject = 'Your Student Account Credentials';
    const emailHtml = `
      <div>
        <h2>Welcome to Our Platform!</h2>
        <p>Here are your login credentials:</p>
        <p><strong>User ID:</strong> ${userData.id}</p>
        <p><strong>Password:</strong> ${userData.password}</p>
        <p>Please keep this information secure and do not share it with others.</p>
      </div>
    `;

    // Send email with credentials
    await emailSender(payload.email, emailSubject, emailHtml);

    // Set id and user reference
    payload.id = newUser[0].id;
    payload.user = new mongoose.Types.ObjectId(newUser[0]._id);

    // Create student
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set faculty role
  userData.roles = ['faculty', 'instructor'];
  //set faculty email
  userData.email = payload.email;

  // find academic department info

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      //send image to cloudinary
      const { secure_url } = await sendFileToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = new mongoose.Types.ObjectId(newUser[0]._id); //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.roles = ['admin'];
  //set admin email
  userData.email = payload.email;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      //send image to cloudinary
      const { secure_url } = await sendFileToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = new mongoose.Types.ObjectId(newUser[0]._id); //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const createSuperAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin,
) => {
  // create a user object
  const userData: Partial<TUser> = {};
//create a user object

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.roles = ['superAdmin'];
  //set admin email
  userData.email = payload.email;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      //send image to cloudinary
      const { secure_url } = await sendFileToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = new mongoose.Types.ObjectId(newUser[0]._id); //reference _id

    // create a admin (transaction-2)
    const newAdmin = await SuperAdmin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMe = async (userId: string, roles: string[]) => {
  let result = null;
  if (roles.includes('student')) {
    result = await Student.findOne({ id: userId }).populate('user');
  }
  if (roles.includes('superAdmin')) {
    result = await Admin.findOne({ id: userId }).populate('user');
  }
  if (roles.includes('admin')) {
    result = await Admin.findOne({ id: userId }).populate('user');
  }

  if (roles.includes('faculty')) {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
  createSuperAdminIntoDB,
};
