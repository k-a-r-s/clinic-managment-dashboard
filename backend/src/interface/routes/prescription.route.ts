import { Router } from "express";
import { prescriptionController } from "../../config/container";
import { asyncWrapper } from "../../shared/utils/asyncWrapper";
import { validate } from "../middlewares/Validate";
import { createPrescriptionDto } from "../../application/dto/requests/createPrescriptionDto";
import { updatePrescriptionDto } from "../../application/dto/requests/updatePrescriptionDto";

const router = Router();

/**
 * @openapi
 * /prescriptions:
 *   post:
 *     tags:
 *       - Prescriptions
 *     summary: Create a new prescription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - doctorId
 *               - prescriptionDate
 *               - medications
 *             properties:
 *               patientId:
 *                 type: string
 *                 format: uuid
 *               doctorId:
 *                 type: string
 *                 format: uuid
 *               appointmentId:
 *                 type: string
 *                 format: uuid
 *               prescriptionDate:
 *                 type: string
 *                 format: date
 *               medications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - medicationName
 *                     - dosage
 *                     - frequency
 *                     - duration
 *                   properties:
 *                     medicationName:
 *                       type: string
 *                     dosage:
 *                       type: string
 *                     frequency:
 *                       type: string
 *                     duration:
 *                       type: string
 *                     notes:
 *                       type: string
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/",
  validate(createPrescriptionDto),
  asyncWrapper(
    prescriptionController.createPrescription.bind(prescriptionController)
  )
);

/**
 * @openapi
 * /prescriptions:
 *   get:
 *     tags:
 *       - Prescriptions
 *     summary: Get all prescriptions
 *     responses:
 *       200:
 *         description: List of all prescriptions
 */
router.get(
  "/",
  asyncWrapper(prescriptionController.getPrescriptions.bind(prescriptionController))
);

/**
 * @openapi
 * /prescriptions/{id}:
 *   get:
 *     tags:
 *       - Prescriptions
 *     summary: Get prescription by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Prescription details
 *       404:
 *         description: Prescription not found
 */
router.get(
  "/:id",
  asyncWrapper(
    prescriptionController.getPrescriptionById.bind(prescriptionController)
  )
);

/**
 * @openapi
 * /prescriptions/patient/{patientId}:
 *   get:
 *     tags:
 *       - Prescriptions
 *     summary: Get prescriptions by patient ID
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of patient prescriptions
 */
router.get(
  "/patient/:patientId",
  asyncWrapper(
    prescriptionController.getPrescriptionsByPatientId.bind(
      prescriptionController
    )
  )
);

/**
 * @openapi
 * /prescriptions/{id}:
 *   put:
 *     tags:
 *       - Prescriptions
 *     summary: Update prescription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *                 format: uuid
 *               doctorId:
 *                 type: string
 *                 format: uuid
 *               appointmentId:
 *                 type: string
 *                 format: uuid
 *               prescriptionDate:
 *                 type: string
 *                 format: date
 *               medications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     medicationName:
 *                       type: string
 *                     dosage:
 *                       type: string
 *                     frequency:
 *                       type: string
 *                     duration:
 *                       type: string
 *                     notes:
 *                       type: string
 *     responses:
 *       200:
 *         description: Prescription updated successfully
 *       404:
 *         description: Prescription not found
 */
router.put(
  "/:id",
  validate(updatePrescriptionDto),
  asyncWrapper(
    prescriptionController.updatePrescription.bind(prescriptionController)
  )
);

/**
 * @openapi
 * /prescriptions/{id}:
 *   delete:
 *     tags:
 *       - Prescriptions
 *     summary: Delete prescription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Prescription deleted successfully
 *       404:
 *         description: Prescription not found
 */
router.delete(
  "/:id",
  asyncWrapper(
    prescriptionController.deletePrescription.bind(prescriptionController)
  )
);

export default router;
