import express from 'express'
const router = express.Router();
import { db } from "../models/index.js";
import { Registration } from "../models/Registration.js"

router.get("/courses", async (req, res) => {
    const courses = await db.Course.find().sort({ courseid: 1 });
    res.status(200).json(courses)
});

router.get("/semetsers", async (req, res) => {
    const semesters = await db.Course.distinct("semester");
    res.status(200).json(semesters)
});

router.get("/students/:regno", async (req, res) => {
    const student = await db.Student.findOne({ regno: req.params.regno });
    const [regs, grades] = await getStudentRegs(req.params.regno);
    //console.log(regs, grades)
    res.status(200).json({ student, regs, grades });
});

router.get("/courses/:semno", async (req, res) => {
    const { semno } = req.params
    const course = await db.Course.find({ semester: semno }).sort({ courseid: 1 });
    res.status(200).json(course)
})

router.get("/regs/:regno", async (req, res) => {
    const { regno } = req.params
    Promise.all([
        db.Registration.aggregate([
            { $match: { regno: regno } },
            { $lookup: { from: 'courses', localField: 'courseid', foreignField: 'courseid', as: 'course' } }, { $unwind: '$course' }
        ]),
        db.Grade.find().sort({ gradeid: 1 })
    ])
        .then(([regs, grades]) => res.status(200).json({ regs, grades }))

})

router.post("/courses", async (req, res) => {
    console.log(`body >`, req.body);

    const UpdatedCourse = await db.Course.findByIdAndUpdate(
        { _id: req.body._id },
        { $set: req.body },
        { new: true })

    res.status(200).json(UpdatedCourse);
});

router.post("/regs/update", async (req, res) => {
    console.log(`body >`, req.body);

    const UpdatedReg = await db.Registration.findByIdAndUpdate(
        { _id: req.body.regid },
        { $set: { gradeid: req.body.gradeid } },
        { new: true })

    res.status(200).json(UpdatedReg);
});

router.post("/regs/add", async (req, res) => {
    console.log(`body >`, req.body);

    let courseids = JSON.parse(req.body.courseids);
    let regs = [];

    for (let courseid of courseids) {
        regs.push(new Registration({ courseid, regno: req.body.regno, gradeid: null }));
    }

    db.Registration.insertMany(regs).then(async regs => {

        if (regs.length !== 0) {
            const [regs, grades] = await getStudentRegs(req.body.regno);
            res.status(200).json(regs);
        }
    });
})

const getStudentRegs = async (regno) => {
    const response = await Promise.all([
        db.Registration.aggregate([
            { $match: { regno: regno } },
            { $lookup: { from: 'courses', localField: 'courseid', foreignField: 'courseid', as: 'course' } }, { $unwind: '$course' },
            { $lookup: { from: 'grades', localField: 'gradeid', foreignField: 'gradeid', as: 'grade' } }, { $unwind: { path: '$grade', preserveNullAndEmptyArrays: true } },
        ]),
        db.Grade.find().sort({ gradeid: 1 }), 
        // db.Registration.aggregate([
        //     { $match: { regno: req.params.regno, gradeid: { $ne: null } } },
        //     { $lookup: { from: 'courses', localField: 'courseid', foreignField: 'courseid', as: 'course' } }, { $unwind: '$course' },
        //     { $lookup: { from: 'grades', localField: 'gradeid', foreignField: 'gradeid', as: 'grade' } }, { $unwind: '$grade' },
        //     { $group: { _id: null, tcr: { $sum: '$course.crhr' }, tgpa: { $sum: { $multiply: ['$course.crhr', '$grade.gpa'] } } } },
        //     { $project: { _id: 0, gpa: { $divide: ['$tgpa', '$tcr'] } } },
        // ])        
    ]);

    //console.log(response);

    return response;
    //.then(([regs, grades]) => res.status(200).json({ regs, grades }))   
}




export default router