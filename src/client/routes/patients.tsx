import React, { useEffect, useMemo, useState } from 'react';
import { Patient, PatientRiskProfile } from '../../server/types';
import { fetchPatientRiskProfiles, fetchPatients } from '../api_requests';
import { calculateRafScore } from '../utils';

function PatientRow({ patient, riskProfiles }: { patient: Patient, riskProfiles: PatientRiskProfile[] | undefined }) {
    const rafScore = riskProfiles ? calculateRafScore(riskProfiles) : null;
    const rafScoreString = typeof rafScore === 'number' ? rafScore.toFixed(3) : 'N/A';
    
    return (
        <tr>
            <td>{patient.id}</td>
            <td>{patient.name}</td>
            <td>{patient.enrollmentStatus}</td>
            <td>{rafScoreString}</td>
        </tr>
    )
}

function HighestRiskProfileSegment({ riskProfiles }: { riskProfiles: PatientRiskProfile[] }) {
    // Calculate highest-averaging risk profile segment, only once when riskProfiles is loaded
    const { maxAverage, maxAveragingSegmentName } = useMemo(() => {
        const riskProfilesBySegment = riskProfiles.reduce((acc, riskProfile) => {
            const segmentRiskProfiles = acc[riskProfile.segmentName] ?? [];
            segmentRiskProfiles.push(riskProfile);
            acc[riskProfile.segmentName] = segmentRiskProfiles;
            return acc;
        }, {} as Record<string, PatientRiskProfile[]>);
        
        let maxAverage = 0;
        let maxAveragingSegmentName = 'None';
        for (const riskProfiles of Object.values(riskProfilesBySegment)) {
            const rafScores = riskProfiles.map((riskProfile) => calculateRafScore([riskProfile]));
            const segmentAverage = rafScores.reduce((a, b) => a + b, 0) / rafScores.length;
            if (segmentAverage > maxAverage) {
                maxAverage = segmentAverage;
                maxAveragingSegmentName = riskProfiles[0].segmentName;
            }
        }
        return { maxAverage, maxAveragingSegmentName };
    }, [riskProfiles]);
    return (
        <div>
            <h3>Highest-Averaging Risk Profile Segment</h3>
            <p>Segment Name: {maxAveragingSegmentName}</p>
            <p>Average: {maxAverage.toFixed(3)}</p>
        </div>
    )
}

export function Patients() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [riskProfiles, setRiskProfiles] = useState<PatientRiskProfile[]>([]);
    useEffect(() => {
        // Load patients and patient risk profiles from API
        fetchPatients().then((setPatients));
        // Load patient risk profiles from API
        fetchPatientRiskProfiles().then((setRiskProfiles));
    }, []);

    // Construct riskProfilesByPatient, only once when riskProfiles is loaded
    const riskProfilesByPatient = useMemo(() => {
        return riskProfiles.reduce((acc, riskProfile) => {
            const patientRiskProfiles = acc[riskProfile.patientId] ?? [];
            patientRiskProfiles.push(riskProfile);
            acc[riskProfile.patientId] = patientRiskProfiles;
            return acc;
        }, {} as Record<string, PatientRiskProfile[]>);
    }, [riskProfiles]);

    return (
        <div>
            <h1>Patients</h1>
            <section className="patient-list">
                <button>
                    <a href="/add_patient">Add Patient</a>
                </button>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Enrollment Status</th>
                            <th>RAF Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) =>
                            <PatientRow
                                key={patient.id}
                                patient={patient}
                                riskProfiles={riskProfilesByPatient[patient.id]}
                            />
                        )}
                    </tbody>
                </table>
            </section>
            <HighestRiskProfileSegment riskProfiles={riskProfiles} />
        </div>
    )
}