import React, { useState } from 'react'
import { api } from "../api/index.js";

export default function Student({ getData, student }) {
    const [RegNo, setRegNo] = useState('');
    




    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            const {student, regs, grades} = (await api.get(`/api/students/${RegNo}`)).data;
            //setStudent(student);
            getData({student, regs, grades});
        }
    }

    return (
        <>
            <input type="text" name='regno' value={RegNo} onChange={(e) => setRegNo(e.target.value)} onKeyDown={handleKeyDown} />
            {Object.entries(student).length !== 0 && (
                <table>
                    <tbody>
                        <tr>
                            <th>Reg # : </th>
                            <td>{student.regno}</td>
                        </tr>
                        <tr>
                            <th>Name : </th>
                            <td>{student.studentname}</td>
                        </tr>
                        <tr>
                            <th>Father : </th>
                            <td>{student.fathername}</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </>
    )
}
