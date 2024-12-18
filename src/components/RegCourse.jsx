import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function RegCourse({ regs, updateReg, grades }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        //console.log(name, value);
        api.post(`/api/regs/update`, { regid: name, gradeid: value })
            .then(res => updateReg(res.data))
    }

    return (
        <>
            {regs.length !== 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Title</th>
                            <th>Cr</th>
                            <th>Grade</th>
                            <th>GPA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {regs.map(reg => (
                            <tr key={reg._id}>
                                <td>{reg.course.code}</td>
                                <td>{reg.course.title}</td>
                                <td>{reg.course.crhr}</td>
                                <td>
                                    <select name={reg._id} value={reg.gradeid || ''} onChange={handleChange}>
                                        <option hidden></option>
                                        {grades.map(g => (
                                            <option key={g._id} value={g.gradeid} >{g.grade}</option>
                                        ))}
                                    </select>
                                </td>
                                <td style={{ textAlign: 'center' }}>{reg.gradeid !== null ? grades.find(g => reg.gradeid === g.gradeid).gpa : ''}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3}></td>
                            <td><b>CGPA</b></td>
                            <td>{(regs.filter(r => r.gradeid !== null).reduce((sum, r) => (r.course.crhr * r.grade.gpa) + sum, 0) /
                                regs.filter(r => r.gradeid !== null).reduce((sum, r) => r.course.crhr + sum, 0)).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            )}
        </>
    )
}
