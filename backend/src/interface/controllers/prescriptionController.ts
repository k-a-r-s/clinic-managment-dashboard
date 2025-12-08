import { Request, Response } from 'express';
import { container } from '../../config/container';
import { asyncWrapper } from '../../shared/utils/asyncWrapper';

import { CreatePrescriptionUseCase } from '../../application/use-cases/prescriptions/CreatePrescriptionUseCase';
import { GetPrescriptionsByPatientUseCase } from '../../application/use-cases/prescriptions/GetPrescriptionsByPatientUseCase';
import { Prescription } from '../../domain/entities/Prescription';

export class PrescriptionController {

  static createPrescription = asyncWrapper(async (req: Request, res: Response) => {
    const createPrescriptionUseCase =
      container.resolve(CreatePrescriptionUseCase);

    const prescription = await createPrescriptionUseCase.execute(req.body);

    if (!prescription) {
      return res.status(400).json({
        success: false,
        message: 'Prescription could not be created'
      });
    }

    res.status(201).json({
      success: true,
      data: prescription.toJson(),
      message: 'Prescription created successfully'
    });
  });


  static getPrescriptionsByPatient = asyncWrapper(async (req: Request, res: Response) => {
    const { patientId } = req.params;

    const getPrescriptionsByPatientUseCase =
      container.resolve(GetPrescriptionsByPatientUseCase);

    const prescriptions = await getPrescriptionsByPatientUseCase.execute({ patientId });

    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No prescriptions found'
      });
    }

    res.status(200).json({
      success: true,
      data: prescriptions.map((p: Prescription) => p.toJson()),
      count: prescriptions.length
    });
  });


  static getPrescriptionById = asyncWrapper(async (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Get by ID endpoint' });
  });

  static updatePrescription = asyncWrapper(async (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Update endpoint' });
  });

  static deletePrescription = asyncWrapper(async (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Delete endpoint' });
  });

}
