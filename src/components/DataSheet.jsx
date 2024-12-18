import React, { useState } from 'react'
import Student from './Student'
import Semester from './Semester';
import SemetserCourses from './SemetserCourses';
import { api } from '../api';
import RegCourse from './RegCourse';

export default function DataSheet() {

    const [student, setStudent] = useState({});
    const [SemNo, setSemNo] = useState(0);
    const [courseids, setCourseIds] = useState([])
    const [regs, setRegs] = useState([])
    const [grades, setGrades] = useState([])



    const getCourseIds = (args) => {
        if (args.name === 'master') {
            setCourseIds(args.crsIds);
        } else {
            let index = courseids.indexOf(Number(args.value));
            setCourseIds(index === -1 ? [...courseids, Number(args.value)] : courseids.filter(id => id !== Number(args.value)))
        }
    }

    const updateReg = (reg) => {
        setRegs(regs.map(r => r._id === reg._id ? { ...r, gradeid: reg.gradeid, grade: grades.find(g => g.gradeid === reg.gradeid) } : r));
    }

    const addRegs = () => {
        api.post(`/api/regs/add`, {
            regno: student.regno,
            courseids: JSON.stringify(courseids)
        }).then(res => {
            setRegs([...regs, ...res.data.filter(a => !regs.some(r => a.courseid === r.courseid))]);
            setCourseIds([]);
        })
    }

    const getData = (args) => {
        console.log(args)
        setStudent(args.student);
        setGrades(args.grades);
        setRegs(args.regs);
        setSemNo(0)
        setCourseIds([]);
    }

    const getSemetser = (semno) => {
        setSemNo(semno);
    }

    return (
        <>
            <div style={{ display: 'flex', /*border: '1px solid green'*/  }}>
                <div style={{ flexGrow: 1 }}>

                    <Student getData={getData} student={student} />
                    <br />
                    {Object.entries(student).length !== 0 && <Semester getSemetser={getSemetser} />}
                    <br />
                    {SemNo !== 0 && <SemetserCourses semno={SemNo}
                        getCourseIds={getCourseIds}
                        courseids={courseids}
                        addRegs={addRegs}
                        regs={regs}
                    />}
                </div>
                <div style={{ flexGrow: 1 }}>
                    {Object.entries(student).length !== 0 && <RegCourse regs={regs} updateReg={updateReg} grades={grades} />}
                </div>
                <div style={{ flexGrow: 1, height: '93vh', overflowY: 'auto' }}>
                    <pre style={{ alignItems: 'left' }}>{JSON.stringify({ student, SemNo, courseids, regs }, null, 4)}</pre>
                </div>
            </div>
        </>
    )
}
