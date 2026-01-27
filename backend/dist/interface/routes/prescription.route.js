"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../config/container");
const asyncWrapper_1 = require("../../shared/utils/asyncWrapper");
const Validate_1 = require("../middlewares/Validate");
const createPrescriptionDto_1 = require("../../application/dto/requests/createPrescriptionDto");
const updatePrescriptionDto_1 = require("../../application/dto/requests/updatePrescriptionDto");
const router = (0, express_1.Router)();
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
router.post("/", (0, Validate_1.validate)(createPrescriptionDto_1.createPrescriptionDto), (0, asyncWrapper_1.asyncWrapper)(container_1.prescriptionController.createPrescription.bind(container_1.prescriptionController)));
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
router.get("/", (0, asyncWrapper_1.asyncWrapper)(container_1.prescriptionController.getPrescriptions.bind(container_1.prescriptionController)));
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
router.get("/:id", (0, asyncWrapper_1.asyncWrapper)(container_1.prescriptionController.getPrescriptionById.bind(container_1.prescriptionController)));
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
router.get("/patient/:patientId", (0, asyncWrapper_1.asyncWrapper)(container_1.prescriptionController.getPrescriptionsByPatientId.bind(container_1.prescriptionController)));
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
router.put("/:id", (0, Validate_1.validate)(updatePrescriptionDto_1.updatePrescriptionDto), (0, asyncWrapper_1.asyncWrapper)(container_1.prescriptionController.updatePrescription.bind(container_1.prescriptionController)));
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
router.delete("/:id", (0, asyncWrapper_1.asyncWrapper)(container_1.prescriptionController.deletePrescription.bind(container_1.prescriptionController)));
exports.default = router;
