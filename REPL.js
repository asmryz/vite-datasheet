import { db } from "./models/index.js";

// db.Course.find({ semester: 1 })
//     .then(res => console.log(res))
//     .then(() => process.exit());


db.Registration.aggregate([
    { $match: { regno: "1112140" } },
    { $lookup: { from: 'courses', localField: 'courseid', foreignField: 'courseid', 
        // pipeline: [ {
        //     $match: {
        //        $expr: { $in: [ "$courseid", [1, 2] ] }
        //     }
        //  } ],
        as: 'course'}}, { $unwind : '$course'}, 
    { $lookup: { from: 'grades', localField: 'gradeid', foreignField: 'gradeid', as: 'grade' } }, { $unwind: { path: '$grade', preserveNullAndEmptyArrays: true } },        
])
.then(res => console.log(JSON.stringify(res, null, 4)))
.then(() => process.exit());


// db.Course.find( { courseid: { $in: [ 5, 15 ] } })
// .then(res => console.log(JSON.stringify(res, null, 4)))
// .then(() => process.exit());
