import { Router } from "express";
//import { students , courses } from "../db/db.js";
const router = Router();

router.get("/me",(req, res) => {
    try{
        res.status(200).json( {
            "success" : true,
            "message" : "Student Information",
            "data" : {
                "studentId": "670610674",
                "firstName": "Kittiphum",
                "lastName": "Nooudom",
                "program": "CPE",
                "section": "001",
            }
        }
        )
       
    }catch(error){ 
        res.status(500).json({ error: "Internal Server Error" });
    }
    
});

export default router;
