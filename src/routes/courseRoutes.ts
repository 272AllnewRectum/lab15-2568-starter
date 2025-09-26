import { Router } from "express";
import type { Student } from "../libs/types.js";
import { zStudentId } from "../schemas/studentValidator.js";
import {
  zCourseId,
  zCoursePostBody,
  zCoursePutBody,
  zCourseDeleteBody,
} from "../schemas/courseValidator.js";
import { students, courses } from "../db/db.js";
import { string, success } from "zod";

const router: Router = Router();

// READ all
router.get("/api/v2/students/:studentId/courses", (req, res) => {
  try {
    const studentId = req.params.studentId;

    const result = zStudentId.safeParse(studentId);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: result.error.issues[0]?.message,
      });
    }

    const student = students.find((s) => s.studentId === studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student does not exist",
      });
    }

    if (!student.courses) {
      return res.status(200).json({
        success: true,
        message: `Student ${studentId} has no courses`,
        data: {
          studentId,
          courses: [],
        },
      });
    }

    const enrolledCourses = student.courses
      .map((cid) => {
        const course = courses.find((c) => c.courseId === cid);
        return course
          ? { courseId: course.courseId, courseTitle: course.courseTitle }
          : undefined;
      })
      .filter((c) => c !== undefined);

    res.set("Link", `/api/v2/students/${studentId}/courses`);
    return res.status(200).json({
      success: true,
      message: `Get courses detail of student ${studentId}`,
      data: {
        studentId,
        courses: enrolledCourses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
});
// Params URL
router.get("/api/v2/courses/:courseId", (req, res) => {
  try {
    const courseId = Number(req.params.courseId);

    const result = zCourseId.safeParse(courseId);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: result.error.issues[0]?.message,
      });
    }
    const course = courses.find((s) => s.courseId === courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course does not exist",
      });
    }

    res.set("Link", `/api/v2/courses/${courseId}`);
    return res.status(200).json({
      success: true,
      message: ` Get course ${courseId} successfully`,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
});

router.post("/api/v2/courses", (req, res) => {
  try {
    const body = req.body;
    const result = zCoursePostBody.safeParse(body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: result.error.issues[0]?.message,
      });
    }
    const found = students.find(
      (student) => student.studentId === body.studentId
    );
    if (found) {
      return res.status(409).json({
        message: "Validation failed",
        error: "Course Id already exists",
      });
    }
    students.push(body);
    return res.status(201).json({
      success: true,
      message: `Course ${body.courseId} has been added successfully`,
      data: body,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
});

router.put("/api/v2/courses", (req, res) => {
  try {
    const CourseId = req.body;
    const result = zCoursePutBody.safeParse(CourseId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.issues[0]?.message,
      });
    }

    const foundIndex = courses.findIndex(
      (course) => course.courseId === CourseId.courseId
    );
    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id does not exists",
      });
    }
    courses[foundIndex] = { ...courses[foundIndex], ...CourseId };
    return res.status(200).json({
      success: true,
      message: `course ${CourseId.courseId} has been updated successfully`,
      data: courses[foundIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
});

router.delete("/api/v2/courses", (req, res) => {
  const CourseId = req.body;
  const result = zCourseDeleteBody.safeParse(CourseId);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error.issues[0]?.message,
    });
  }

  const foundIndex = courses.findIndex(
    (course) => course.courseId === CourseId.courseId
  );
  if (foundIndex == -1) {
    return res.status(404).json({
      success: false,
      message: "Course Id does not exists",
    });
  }
  courses.splice(foundIndex, 1);
  return res.status(200).end();
});
export default router;
