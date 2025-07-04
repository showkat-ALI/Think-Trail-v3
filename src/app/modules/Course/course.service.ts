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

// const apiKey= config?.api_key
const openai = new OpenAI({ apiKey:process.env.OPENAI_KEY });
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

const chatWithCourseBot = async (req: Request & { body: { message: string; userId: string } }, res: Response) => {
  const { message, userId } = req.body;

  // Input validation
  if (!message || !userId) {
    return res.status(400).json({
      success: false,
      message: "Both message and userId are required",
    });
  }

  try {
    // 1. Fetch user data
    const userCourses = await Course.find({ userId });
    
    // 2. Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k-0613", // Default working model
      messages: [
        {
          role: "system",
          content: `You are an LMS assistant. User is enrolled in: ${userCourses.map(c => c.name).join(', ')}`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return res.json({
      success: true,
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("API Error:", error);
    
    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 404) {
        return res.status(404).json({
          success: false,
          message: "The requested AI model is not available. Please try a different model.",
        });
      }
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }

    // Generic error handler
    return res.status(500).json({
      success: false,
      message: "Internal server error",
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
