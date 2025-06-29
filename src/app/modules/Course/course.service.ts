import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { CourseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import { Admission } from '../Admission/module.model';
import { Admin } from '../Admin/admin.model';
import { Module } from '../Module/module.model';
import { ModuleAssignment, ModuleQuiz, ModuleVideo } from '../ModuleData/module.model';
import { Assignment } from '../Assignments/assignments.model';
import { Question, Quiz } from '../Quiz/quiz.model';
import OpenAI from 'openai';
import { Request, Response } from 'express';
import config from '../../config';

// const apiKey= config?.api_key
const unkKey="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"
const openai = new OpenAI({ apiKey: config.api_key });
const createCourseIntoDB = async (payload: TCourse) => {
  try {
    // Check the number of courses created by the user
    // const courseCount = await Course.countDocuments({ createdBy: payload.createdBy });
    // if (courseCount >= 5) {
    //   throw new AppError(httpStatus.BAD_REQUEST, 'Maximum course creation limit exceeded');
    // }

    // Create the course if the limit is not exceeded
    const result = await Course.create(payload);
    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Error creating course');
  }
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleCourseFromDB = async (id: string) => {
  const course = await Course.findById(id);

const module = await Module.find({ course: course?._id });
const moduleIds = module.map(m => m._id);
const moduleVideo = await ModuleVideo.find({ module: { $in: moduleIds } });
const assignment= await ModuleAssignment.find({module:{ $in: moduleIds }})
const moduleAssignment = await Assignment.find({
  _id: { $in: assignment.map(a => a.assignment) }
});
const moduleQuizzes = await ModuleQuiz.find({ module: { $in: moduleIds } }).populate({
  path: 'quiz',
  model: 'Quiz',
});

const quizzesWithQuestions = await Promise.all(
  moduleQuizzes.map(async (moduleQuiz) => {
    const quiz = await Quiz.findById(moduleQuiz.quiz);
    if (quiz) {
      const questions = await Question.find({ quiz: quiz._id });
      return {
        ...moduleQuiz.toObject(),
        quiz: {
          ...quiz.toObject(),
          questions,
        },
      };
    }
    return moduleQuiz;
  })
);

return {
  course,
  module,
  moduleVideo,
  assignment,
  moduleAssignment,
  quizzesWithQuestions
};
};
const getAllmyCourse = async (id: string) => {
  const admission = await Admission.findOne({
    id: id,
    roles: { $all: ["student", "admitted"] },
    // status: "accepted"
  }).populate('program');

if (!admission) {
  throw new AppError(httpStatus.NOT_FOUND, 'Admission not found or not eligible');
}

const admin = await Admin.findOne({
  assignedDepartment: admission?.program,
});
if (!admin) {
  throw new AppError(httpStatus.NOT_FOUND, 'Admin not found for the assigned department');
}

const courses = await Course.find({
  createdBy: admin?._id,
});

const result = {
  courses
  
};
  return result;
};

const chatWithCourseBot = async(req: Request & { body: { message: string; userId: string } }, res: Response) => {
  const { message, userId } = req.body;

  // 1. Fetch user-specific data from MongoDB (e.g., courses, deadlines)
  const userCourses = await Course.find({ userId }); 

  // 2. Generate AI response (with LMS context)
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an LMS assistant. User's courses: ${JSON.stringify(userCourses)}`,
        },
        { role: "user", content: message },
      ],
    });
    return res.send({ reply: response.choices[0].message.content });
  } catch (error) {
    if ((error as { code?: string }).code === "insufficient_quota") {
      return res.status(429).json({
        success: false,
        message: "You have exceeded your quota. Please check your plan and billing details.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  getAllmyCourse,
  chatWithCourseBot
};
