import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getAllAppointments = async (req: Request, res: Response) => {
  // TODO: Implement get all appointments
  res.json({ message: 'Get all appointments' });
};

export const getAppointmentById = async (req: Request, res: Response) => {
  // TODO: Implement get appointment by id
  res.json({ message: 'Get appointment by id' });
};

export const createAppointment = async (req: Request, res: Response) => {
  // TODO: Implement create appointment
  res.json({ message: 'Create appointment' });
};

export const updateAppointment = async (req: Request, res: Response) => {
  // TODO: Implement update appointment
  res.json({ message: 'Update appointment' });
};

export const deleteAppointment = async (req: Request, res: Response) => {
  // TODO: Implement delete appointment
  res.json({ message: 'Delete appointment' });
};
