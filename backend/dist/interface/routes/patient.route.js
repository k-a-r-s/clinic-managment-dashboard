"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const roles_1 = require("../../shared/lib/roles");
const Validate_1 = require("../middlewares/Validate");
const addPatientDto_1 = require("../../application/dto/requests/addPatientDto");
const updatePatienDto_1 = require("../../application/dto/requests/updatePatienDto");
const asyncWrapper_1 = require("../../shared/utils/asyncWrapper");
const container_1 = require("../../config/container");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNumber
 *         - birthDate
 *         - gender
 *         - address
 *         - profession
 *         - childrenNumber
 *         - familySituation
 *         - insuranceNumber
 *         - emergencyContactName
 *         - emergencyContactPhone
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the patient
 *         firstName:
 *           type: string
 *           description: The first name of the patient
 *         lastName:
 *           type: string
 *           description: The last name of the patient
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the patient
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the patient
 *         birthDate:
 *           type: string
 *           format: date
 *           description: The birth date of the patient (YYYY-MM-DD)
 *         age:
 *           type: integer
 *           description: The age of the patient
 *         gender:
 *           type: string
 *           description: The gender of the patient
 *         address:
 *           type: string
 *           description: The address of the patient
 *         profession:
 *           type: string
 *           description: The profession of the patient
 *         childrenNumber:
 *           type: integer
 *           minimum: 0
 *           description: The number of children
 *         familySituation:
 *           type: string
 *           description: The family situation of the patient
 *         insuranceNumber:
 *           type: string
 *           description: The insurance number of the patient
 *         emergencyContactName:
 *           type: string
 *           description: The name of the emergency contact
 *         emergencyContactPhone:
 *           type: string
 *           description: The phone number of the emergency contact
 *         allergies:
 *           type: array
 *           items:
 *             type: string
 *           description: List of allergies
 *         currentMedications:
 *           type: array
 *           items:
 *             type: string
 *           description: List of current medications
 *         medicalFileId:
 *           type: string
 *           nullable: true
 *           format: uuid
 *           description: The id of the associated medical file for the patient (nullable)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the patient was added
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the patient was last updated
 *       example:
 *         id: "c0b837f3-5a95-44b6-bb60-7aeccc4afe9f"
 *         firstName: "John"
 *         lastName: "Doe"
 *         email: "john.doe@example.com"
 *         phoneNumber: "+1-555-123-4567"
 *         birthDate: "1985-03-15"
 *         age: 40
 *         gender: "Male"
 *         address: "123 Main St"
 *         profession: "Engineer"
 *         childrenNumber: 2
 *         familySituation: "Married"
 *         insuranceNumber: "INS-123456789"
 *         emergencyContactName: "Jane Doe"
 *         emergencyContactPhone: "+1-555-987-6543"
 *         allergies: ["Penicillin"]
 *         currentMedications: ["Lisinopril 10mg"]
 *         medicalFileId: null
 *         createdAt: "2024-01-15T10:30:00Z"
 *         updatedAt: "2024-01-15T10:30:00Z"
 */
/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: The patients managing API
 */
/**
 * @swagger
 * /patients/add-patient:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *               - birthDate
 *               - gender
 *               - address
 *               - profession
 *               - childrenNumber
 *               - familySituation
 *               - insuranceNumber
 *               - emergencyContactName
 *               - emergencyContactPhone
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 pattern: '^\d{4}-\d{2}-\d{2}$'
 *               gender:
 *                 type: string
 *               address:
 *                 type: string
 *               profession:
 *                 type: string
 *               childrenNumber:
 *                 type: integer
 *                 minimum: 0
 *               familySituation:
 *                 type: string
 *               insuranceNumber:
 *                 type: string
 *               emergencyContactName:
 *                 type: string
 *               emergencyContactPhone:
 *                 type: string
 *               allergies:
 *                 type: array
 *                 items:
 *                   type: string
 *               currentMedications:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: The patient was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *                 error:
 *                   type: null
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Receptionist only
 */
router.post("/add-patient", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST]), (0, Validate_1.validate)(addPatientDto_1.addPatientSchemaDto), (0, asyncWrapper_1.asyncWrapper)(container_1.patientController.addPatient.bind(container_1.patientController)));
/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Returns the list of all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of all patients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Patient'
 *                 error:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Receptionist only
 */
/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get the patient by id
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The patient id
 *     responses:
 *       200:
 *         description: The patient description by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *                 error:
 *                   type: null
 *       404:
 *         description: The patient was not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Receptionist only
 */
router.get("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST]), (0, asyncWrapper_1.asyncWrapper)(container_1.patientController.getPatientById.bind(container_1.patientController)));
/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Remove the patient by id
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The patient id
 *     responses:
 *       200:
 *         description: The patient was deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: null
 *                 error:
 *                   type: null
 *       404:
 *         description: The patient was not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Receptionist only
 */
router.delete("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST]), (0, asyncWrapper_1.asyncWrapper)(container_1.patientController.deletePatientById.bind(container_1.patientController)));
/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Returns the list of all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of all patients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Patient'
 *                 error:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Receptionist only
 */
// todo dont fetch all data of patient , just necessary ones like firstname , id , email and stuff
router.get("/", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST]), (0, asyncWrapper_1.asyncWrapper)(container_1.patientController.getAllPatients.bind(container_1.patientController)));
/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update a patient by ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The patient id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               address:
 *                 type: string
 *               profession:
 *                 type: string
 *               childrenNumber:
 *                 type: integer
 *               familySituation:
 *                 type: string
 *               insuranceNumber:
 *                 type: string
 *               emergencyContactName:
 *                 type: string
 *               emergencyContactPhone:
 *                 type: string
 *               medicalFileId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: The patient was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: null
 *                 error:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Receptionist only
 *       404:
 *         description: Patient not found
 */
router.put("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST]), (0, Validate_1.validate)(updatePatienDto_1.updatePatientSchemaDto), (0, asyncWrapper_1.asyncWrapper)(container_1.patientController.updatePatient.bind(container_1.patientController)));
exports.default = router;
