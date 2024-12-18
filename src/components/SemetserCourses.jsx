import React, { useEffect } from 'react'
import { useState } from 'react';
import { api } from '../api';

export default function SemetserCourses({ semno, getCourseIds, courseids, addRegs, regs }) {

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        api.get(`/api/courses/${semno}`).then(res => setCourses(res.data));
    }, [semno])


    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        let crsIds = checked ? courses.map(c => c.courseid) : [];
        getCourseIds({name, value, crsIds});
    }

    return (
        <>
            {courses.length !== 0 && (
                <table>
                    <tbody>
                        <tr>
                            <th>
                                <input type="checkbox" name="master" onChange={handleChange} />
                            </th>
                            <th>Code</th>
                            <th style={{ width: '350px' }}>Title</th>
                            <th>Cr</th>
                        </tr>
                        {courses.map(c => (
                            <tr key={c._id}>
                                <td>
                                    {regs.some(r => r.courseid === c.courseid) ? '' : (
                                        <input type="checkbox"
                                            name='courseid'
                                            value={c.courseid}
                                            onChange={handleChange}
                                            checked={courseids.includes(c.courseid)}
                                        />
                                    )}
                                </td>
                                <td>{c.code}</td>
                                <td>{c.title}</td>
                                <td>{c.crhr}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {courseids.length !== 0 && (
                <a href="#" onClick={addRegs}>Register</a>
            )}
            
        </>
    )
}
