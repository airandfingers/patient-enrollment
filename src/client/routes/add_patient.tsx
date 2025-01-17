import React from 'react';
import { addPatient } from '../api_requests';
import { redirect } from 'react-router-dom';
import { EnrollmentStatus } from '../../server/types';

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const enrollmentStatus = formData.get('enrollmentStatus') as EnrollmentStatus;
    addPatient({ name, enrollmentStatus })
        .then(() => {
            window.location.href = '/patients';
        }
    );
}

export function AddPatient() {
    return (
        <div>
            <h1>Add Patient</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name:
                        <input type="text" name="name" required />
                    </label>
                </div>
                <div>
                    <label>
                        Enrollment Status:
                        <select name="enrollmentStatus" required>
                            <option value="Prospect">Prospect</option>
                            <option value="Insurance Eligibility Verified">Insurance Eligibility Verified</option>
                            <option value="Enrollment Contract Signed">Enrollment Contract Signed</option>
                            <option value="Patient Record Created">Patient Record Created</option>
                            <option value="Intake Appointment Scheduled">Intake Appointment Scheduled</option>
                        </select>
                    </label>
                </div>
                <div>
                    <input type="submit" value="Add Patient" />
                </div>
            </form>
        </div>
    )
}