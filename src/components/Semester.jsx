import React, { useEffect, useState } from 'react'
import { api } from '../api';

export default function Semester({ getSemetser }) {
    const [semNo, setSemNo] = useState(0);
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        api.get(`/api/semetsers`).then(res => setSemesters(res.data));
    }, []);

    return (
        <>
            <select name="semno" value={semNo} onChange={(e) => {
                setSemNo(e.target.value);
                getSemetser(e.target.value);
            }}>
                <option value="" hidden>Select</option>
                {semesters.length !== 0 && semesters.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                ))}

            </select>
        </>
    )
}
