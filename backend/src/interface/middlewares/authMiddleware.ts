import { Request, Response, NextFunction } from 'express';
import { AuthError } from '../../domain/errors/AuthError';
import { CreateSupabaseClient } from '../../infrastructure/database/supabase';
import { Logger } from '../../shared/utils/logger';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        userId: number;  // Add local user ID from database
    };
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // 1. Check if Authorization header exists
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            const err = AuthError.invalidToken('No authorization header provided');
            return next(err);
        }

        // 2. Extract Bearer token
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            const err = AuthError.invalidToken('Invalid authorization header format');
            return next(err);
        }

        const token = parts[1];

        // 3. Verify token with Supabase
        const supabase = CreateSupabaseClient(token);
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            Logger.error('Token verification failed', { error: error?.message });
            const err = AuthError.invalidToken('Invalid or expired token');
            return next(err);
        }

        // 4. Get user role from database (using authenticated client)
        const { data: userData, error: dbError } = await supabase
            .from('users')
            .select('id, email, role_id, roles(name)')
            .eq('auth_uuid', user.id)
            .single();

        if (dbError || !userData) {
            Logger.error('User not found in database', { error: dbError?.message });
            const err = AuthError.invalidToken('User not found');
            return next(err);
        }

        // 5. Attach user to request
        req.user = {
            id: user.id,
            email: user.email || '',
            role: userData.roles?.length ? userData.roles[0]?.name : 'patient',
            userId: userData.id,  // Store local database user ID
        };

        Logger.info(`User authenticated: ${user.id} (${userData.id})`);
        next();
    } catch (error) {
        Logger.error('Auth middleware error', { error });
        const err = AuthError.invalidToken('Authentication failed');
        next(err);
    }
};

// Role-based access control middleware
export const requireRole = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            const err = AuthError.invalidToken('User not authenticated');
            return next(err);
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
            });
        }

        Logger.info(`User ${req.user.userId} authorized for role: ${req.user.role}`);
        next();
    };
};
