import { EnrollmentStatus, Patient, PatientRiskProfile } from "../server/types";

export const fetchPatients = async (): Promise<Patient[]> => {
    // TODO: handle errors
    const response = await fetch("/api/patients");
    return response.json();
}

export const fetchPatientRiskProfiles = async (): Promise<PatientRiskProfile[]> => {
    // TODO: handle errors
    const response = await fetch("/api/patient_risk_profiles");
    return response.json();
}

export const addPatient = async ({
    name,
    enrollmentStatus
}: {
    name: string,
    enrollmentStatus: EnrollmentStatus
}): Promise<Patient> => {
    // TODO: handle errors
    const response = await fetch(
        "/api/patients",
        {
            method: 'POST',
            body: JSON.stringify({ name, enrollmentStatus }),
            headers: { 'Content-Type': 'application/json' }
        }
    );
    return response.json();
}