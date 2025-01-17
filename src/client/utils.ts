import { Patient, PatientRiskProfile } from "../server/types";

const logInvalidCoefficient = (coefficient: any, { patientId, segmentName }: PatientRiskProfile, type: 'demographic' | 'diagnosis') => {
    console.warn(`Invalid ${type} coefficient for patient ${patientId}, segment ${segmentName}: ${coefficient}`);
}

export const calculateRafScore = (riskProfiles: PatientRiskProfile[]): number => {
    return riskProfiles.reduce((scoreSoFar: number, riskProfile: PatientRiskProfile) => {
        let updatedRiskScore = scoreSoFar;
        const {
            demographicCoefficients = [],
            diagnosisCoefficients = []
        } = riskProfile;
        for (const c of demographicCoefficients) {
            if (typeof c === 'number') {
                updatedRiskScore += c;
            } else {
                logInvalidCoefficient(c, riskProfile, 'demographic');
            }
        }
        for (const c of diagnosisCoefficients) {
            if (typeof c === 'number') {
                updatedRiskScore += c;
            } else {
                logInvalidCoefficient(c, riskProfile, 'diagnosis');
            }
        }
        return updatedRiskScore;
    }, 0);
}