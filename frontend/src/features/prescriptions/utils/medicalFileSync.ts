import type { Prescription, MedicalFile, Medication } from "../../../types";

/**
 * Syncs prescription medications to a patient's medical file.
 * This function converts prescription medications to the medical file medication format
 * and adds them to the patient's medication history.
 *
 * @param prescription - The prescription containing medications to sync
 * @param currentMedicalFile - The patient's current medical file
 * @returns Updated medical file with new medications
 */
export function syncPrescriptionToMedicalFile(
  prescription: Prescription,
  currentMedicalFile: MedicalFile
): MedicalFile {
  const updatedMedications = [...(currentMedicalFile.medications || [])];

  // Process each medication from the prescription
  for (const prescMed of prescription.medications) {
    // Check if medication already exists in medical file
    const existingMedIndex = updatedMedications.findIndex(
      (med) => med.name.toLowerCase() === prescMed.medicationName.toLowerCase()
    );

    const newHistoryEntry = {
      prescriptionMedicationId: prescMed.id,
      prescriptionId: prescription.id,
      startDate: prescription.prescriptionDate,
      endDate: null,
      dosage: prescMed.dosage,
      frequency: prescMed.frequency,
      status: "active" as const,
      notes: prescMed.notes || null,
    };

    if (existingMedIndex >= 0) {
      // Medication exists - add new history entry and update current treatment
      const alreadySynced = updatedMedications[existingMedIndex].history.some(
        (hist) => hist.prescriptionId === prescription.id
      );

      if (!alreadySynced) {
        // Mark previous treatment as discontinued if it exists
        if (
          updatedMedications[existingMedIndex].currentTreatment.status ===
          "active"
        ) {
          const currentTreatment =
            updatedMedications[existingMedIndex].currentTreatment;
          const oldHistoryEntry = updatedMedications[
            existingMedIndex
          ].history.find(
            (h) => h.prescriptionId === currentTreatment.prescriptionId
          );
          if (oldHistoryEntry) {
            oldHistoryEntry.endDate = prescription.prescriptionDate;
            oldHistoryEntry.status = "discontinued";
          }
        }

        // Add new history entry
        updatedMedications[existingMedIndex].history.push(newHistoryEntry);

        // Update current treatment
        updatedMedications[existingMedIndex].currentTreatment = {
          dosage: prescMed.dosage,
          frequency: prescMed.frequency,
          startDate: prescription.prescriptionDate,
          status: "active",
          prescriptionId: prescription.id,
        };
      }
    } else {
      // New medication - create new entry
      const newMedication: Medication = {
        name: prescMed.medicationName,
        category: "Prescribed Medication",
        currentTreatment: {
          dosage: prescMed.dosage,
          frequency: prescMed.frequency,
          startDate: prescription.prescriptionDate,
          status: "active",
          prescriptionId: prescription.id,
        },
        history: [newHistoryEntry],
      };
      updatedMedications.push(newMedication);
    }
  }

  return {
    ...currentMedicalFile,
    medications: updatedMedications,
  };
}

/**
 * Removes prescription medications from medical file when prescription is deleted.
 * Only removes history entries that reference the deleted prescription.
 *
 * @param prescriptionId - ID of the deleted prescription
 * @param currentMedicalFile - The patient's current medical file
 * @returns Updated medical file with prescription references removed
 */
export function removePrescriptionFromMedicalFile(
  prescriptionId: string,
  currentMedicalFile: MedicalFile
): MedicalFile {
  const updatedMedications = (currentMedicalFile.medications || [])
    .map((med) => {
      const filteredHistory = med.history.filter(
        (hist) => hist.prescriptionId !== prescriptionId
      );

      // If current treatment is from this prescription, mark as discontinued
      let updatedCurrentTreatment = med.currentTreatment;
      if (med.currentTreatment.prescriptionId === prescriptionId) {
        // Find the most recent history entry that's not this prescription
        const previousActive = filteredHistory
          .filter((h) => h.status === "active")
          .sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          )[0];

        if (previousActive) {
          updatedCurrentTreatment = {
            dosage: previousActive.dosage,
            frequency: previousActive.frequency,
            startDate: previousActive.startDate,
            status: "active",
            prescriptionId: previousActive.prescriptionId || undefined,
          };
        } else {
          updatedCurrentTreatment = {
            ...med.currentTreatment,
            status: "discontinued",
          };
        }
      }

      return {
        ...med,
        currentTreatment: updatedCurrentTreatment,
        history: filteredHistory,
      };
    })
    // Remove medications that have no history left
    .filter((med) => med.history.length > 0);

  return {
    ...currentMedicalFile,
    medications: updatedMedications,
  };
}

/**
 * Updates medical file when a prescription is modified.
 * Removes old entries and adds new ones.
 *
 * @param prescription - The updated prescription
 * @param currentMedicalFile - The patient's current medical file
 * @returns Updated medical file
 */
export function updatePrescriptionInMedicalFile(
  prescription: Prescription,
  currentMedicalFile: MedicalFile
): MedicalFile {
  // First remove old entries for this prescription
  const withoutOld = removePrescriptionFromMedicalFile(
    prescription.id,
    currentMedicalFile
  );

  // Then add new entries
  return syncPrescriptionToMedicalFile(prescription, withoutOld);
}
