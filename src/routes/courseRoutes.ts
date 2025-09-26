import { Router } from "express";
//import type { Student } from "../libs/types.js";
import {zStudentId} from "../schemas/studentValidator.js"
import { students , courses } from "../db/db.js";
//import {zCourseId, zCourseTitle} from "../schemas/courseValidator.js"

const router: Router = Router();

// READ all
router.get("/api/v2/students/:studentId/courses", (req,res) => {
    try{
       const studentId = req.params.studentId;
       const result = zStudentId.safeParse(studentId);
       if(!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            error: result.error.issues[0]?.message,
        })
       }
       const foundIndex = students.findIndex(
        student => student.studentId === studentId
       );
       if(foundIndex === -1){
        return res.status(404).json({
            success: false,
            message: "Student does not exist",
        })
        
       }
       res.set("Link", `/api/v2/students/${studentId}/courses`);
       return res.status(200).json({
        success: true,
        message: `Get courses detail of student ${studentId}`,
        data: {
            studentId: students,
            courses: [
                
            ]
        }
       })
    }catch(error){
        res.status(500).json({
            "success": false,
            "message": "Student does not exists"
        })
    }
});

// Params URL 
router.get("/", () => {
});

router.post("/", () => {
});

router.put("/", () => {
});

router.delete("/",() => {
});

export default router;
