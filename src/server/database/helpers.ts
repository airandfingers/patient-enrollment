import { patients, patientRiskProfiles } from "./fakeDatabaseData";
import type { EnrollmentStatus, Patient, PatientRiskProfile } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const patientsById = patients.reduce((acc: {[patientId: number]: Patient}, patient) => {
  acc[patient.id] = patient;
  return acc;
}, []);

const patientRiskProfilesById = patientRiskProfiles.reduce((acc: {[patientId: number]: PatientRiskProfile[]}, patient) => {
  if (!acc[patient.patientId]) {
    acc[patient.patientId] = [];
  }
  acc[patient.patientId].push(patient);
  return acc;
}, []);

export async function getPatients() {
  await delay(500);
  console.log({ patientsById})
  return Object.values(patientsById);
}

let maxPatientId = Math.max(...patients.map((patient) => patient.id));
export async function addPatient(name: string, enrollmentStatus: EnrollmentStatus): Promise<Patient> {
  await delay(500);
  const newPatientId = ++maxPatientId;
  const newPatient = { id: newPatientId, name, enrollmentStatus };
  // Add to in-memory datastore and fake database
  patientsById[newPatientId] = newPatient;
  patients.push(newPatient);
  console.log({ newPatient})
  return newPatient;
}

export async function getPatientRiskProfiles() {
  await delay(500);
  return Object.values(patientRiskProfilesById).flat();
}