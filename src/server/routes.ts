import { Router } from "express";
import { addPatient, getPatientRiskProfiles, getPatients } from "./database/helpers";

const router = Router();

router.get("/api/patients", async (req, res) => {
  const patients = await getPatients();
  return res.json(patients);
});

router.post("/api/patients", async (req, res) => {
  console.log({ body: req.body })
  const { name, enrollmentStatus } = req.body;
  // TODO: validate input
  const newPatient = await addPatient(name, enrollmentStatus);
  return res.json(newPatient);
});

router.get("/api/patient_risk_profiles", async (req, res) => {
  const patientRiskProfiles = await getPatientRiskProfiles();
  return res.json(patientRiskProfiles);
});

export { router }