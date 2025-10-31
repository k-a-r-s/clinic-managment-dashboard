import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getAllDoctors = async (req: Request, res: Response) => {
  // TODO: Implement get all doctors
  res.json({ message: 'Get all doctors' });
};

export const getDoctorById = async (req: Request, res: Response) => {
  // TODO: Implement get doctor by id
  res.json({ message: 'Get doctor by id' });
};

export const createDoctor = async (req: Request, res: Response) => {
  // TODO: Implement create doctor
  res.json({ message: 'Create doctor' });
};

export const updateDoctor = async (req: Request, res: Response) => {
  // TODO: Implement update doctor
  res.json({ message: 'Update doctor' });
};

export const deleteDoctor = async (req: Request, res: Response) => {
  // TODO: Implement delete doctor
  res.json({ message: 'Delete doctor' });
};
