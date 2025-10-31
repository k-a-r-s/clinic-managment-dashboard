import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getAllPatients = async (req: Request, res: Response) => {
  // TODO: Implement get all patients
  res.json({ message: 'Get all patients' });
};

export const getPatientById = async (req: Request, res: Response) => {
  // TODO: Implement get patient by id
  res.json({ message: 'Get patient by id' });
};

export const createPatient = async (req: Request, res: Response) => {
  // TODO: Implement create patient
  res.json({ message: 'Create patient' });
};

export const updatePatient = async (req: Request, res: Response) => {
  // TODO: Implement update patient
  res.json({ message: 'Update patient' });
};

export const deletePatient = async (req: Request, res: Response) => {
  // TODO: Implement delete patient
  res.json({ message: 'Delete patient' });
};
