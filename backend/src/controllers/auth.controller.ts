import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const login = async (req: Request, res: Response) => {
  // TODO: Implement login logic
  res.json({ message: 'Login endpoint' });
};

export const signup = async (req: Request, res: Response) => {
  // TODO: Implement signup logic
  res.json({ message: 'Signup endpoint' });
};

export const logout = async (req: Request, res: Response) => {
  // TODO: Implement logout logic
  res.json({ message: 'Logout endpoint' });
};
