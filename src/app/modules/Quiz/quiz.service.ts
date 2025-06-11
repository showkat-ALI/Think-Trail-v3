import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import { Request } from 'express';
import { Question, Quiz, SubmitQuiz } from './quiz.model';

const createQuizIntoDB = async (req: Request) => {
  const data = req.body;
  try {
    // Assuming you have a function to save the assignment data to the database
    const savedQuiz = await Quiz.create(data);
    return { savedQuiz };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error creating quiz in the database',
    );
  }
};
const createSubmitQuizInDB = async (req: Request) => {
  const data = req.body;
  try {
    // Assuming you have a function to save the assignment data to the database
    const savedQuiz = await SubmitQuiz.create(data);
    return { savedQuiz };
  } catch (error) {

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error creating quiz in the database',
    );
  }
};
const getAllSubQuizFromDB = async () => {
  try {
    // Assuming you have a function to save the assignment data to the database
    const savedQuiz = await SubmitQuiz.find();
    return { savedQuiz };
  } catch (error) {
     
    

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error getting quiz in the database',
    );
  }
};
const createQuestionOfQuiz = async (req: Request) => {
  const data = req.body;
  try {
    // Assuming you have a function to save the assignment data to the database
    const quiz = await Quiz.findById({ _id: data.quiz });
    if (!quiz) {
      throw new AppError(httpStatus.NOT_FOUND, 'Quiz not found');
    }
    if (quiz) {
      const savedQuestion = await Question.create(data);

      return { savedQuestion };
    }
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error creating Question in the database',
    );
  }
};
const getSingleQuizQuestions = async (req: Request) => {
  const id = req.params.quiz
  const quiz = await Quiz.findById({ _id: id });
  if (quiz) {
    const questions = await Question.find({ quiz: quiz._id });
    return {
      quiz: {
        ...quiz.toObject(),
        questions,
      },
    };
  }
  throw new AppError(httpStatus.NOT_FOUND, 'Quiz not found');
};

const getallQuestionsOfAInsFromDB = async (req: Request) => {
  const userID = req.params.userID;
  try {
    const questions = await Question.find();
    const quizzes = await Quiz.find({ createdBy: userID });

    const userQuestions = questions.filter((q) =>
      quizzes.some((quiz) => quiz._id.toString() === q.quiz.toString()),
    );

    const populatedQuestions = await Promise.all(
      userQuestions.map(async (question) => {
        const quiz = await Quiz.findById(question.quiz);
        return { ...question.toObject(), quiz };
      }),
    );

    if (populatedQuestions.length === 0) {
      throw new AppError(httpStatus.NOT_FOUND, 'Questions not found');
    }

    const groupedQuestions = Object.values(
      populatedQuestions.reduce(
        (
          acc: {
            [key: string]: { title: string; questions: (typeof question)[] };
          },
          question,
        ) => {
          if (question.quiz) {
            const title = question.quiz.title;
            if (!acc[title]) {
              acc[title] = { title, questions: [] };
            }
            acc[title].questions.push(question);
          }
          return acc;
        },
        {},
      ),
    );

    return { groupedQuestions };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error retrieving questions from the database',
    );
  }
};

export const QuizServices = {
  createQuizIntoDB,
  createQuestionOfQuiz,
  getallQuestionsOfAInsFromDB,
  getSingleQuizQuestions,
  createSubmitQuizInDB,
  getAllSubQuizFromDB

  
};
