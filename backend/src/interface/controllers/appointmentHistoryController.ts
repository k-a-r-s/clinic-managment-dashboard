import { Request, Response } from 'express';
import { GetAppointmentHistoryforPatientUseCase } from '../../application/use-cases/AppointmentHistory/GetAppointmentHistoryforPatientUseCase';
import { GetHistoriesByPatientUseCase } from '../../application/use-cases/AppointmentHistory/GetHistoriesByPatientUseCase';
import { UpdateAppointmentHistoryUseCase } from '../../application/use-cases/AppointmentHistory/UpdateAppointmentHistoryUseCase';
import { DeleteAppointmentHistoryUseCase } from '../../application/use-cases/AppointmentHistory/DeleteAppointmentHistoryUseCase';
import { ResponseFormatter } from '../utils/ResponseFormatter';

export class AppointmentHistoryController {
    constructor(
        private getAppointmentHistoryUseCase: GetAppointmentHistoryforPatientUseCase,
        private getHistoriesByPatientUseCase: GetHistoriesByPatientUseCase,
        private updateAppointmentHistoryUseCase: UpdateAppointmentHistoryUseCase,
        private deleteAppointmentHistoryUseCase: DeleteAppointmentHistoryUseCase
    ) { }

    async getHistoryByAppointmentId(req: Request, res: Response): Promise<void> {
        try {
            const { appointmentId } = req.params;
            const history = await this.getAppointmentHistoryUseCase.execute(appointmentId);
            
            if (!history) {
                ResponseFormatter.error(
                    res,
                    { type: 'NOT_FOUND', message: 'Appointment history not found' },
                    404,
                    'Appointment history not found'
                );
                return;
            }

            ResponseFormatter.success(
                res,
                history.toJson(),
                'Appointment history retrieved successfully',
                200
            );
        } catch (error) {
            ResponseFormatter.error(
                res,
                { type: 'FETCH_ERROR', message: String(error) },
                400,
                'Failed to retrieve appointment history'
            );
        }
    }

    async updateHistory(req: Request, res: Response): Promise<void> {
        try {
            const { appointmentId } = req.params;
            const { appointmentData } = req.body;

            const updatedHistory = await this.updateAppointmentHistoryUseCase.execute(
                appointmentId,
                appointmentData
            );

            ResponseFormatter.success(
                res,
                updatedHistory.toJson(),
                'Appointment history updated successfully',
                200
            );
        } catch (error) {
            ResponseFormatter.error(
                res,
                { type: 'UPDATE_ERROR', message: String(error) },
                400,
                'Failed to update appointment history'
            );
        }
    }

    async deleteHistory(req: Request, res: Response): Promise<void> {
        try {
            const { appointmentId } = req.params;
            await this.deleteAppointmentHistoryUseCase.execute(appointmentId);

            ResponseFormatter.success(
                res,
                null,
                'Appointment history deleted successfully',
                200
            );
        } catch (error) {
            ResponseFormatter.error(
                res,
                { type: 'DELETE_ERROR', message: String(error) },
                400,
                'Failed to delete appointment history'
            );
        }
    }

    async getHistoriesByPatientId(req: Request, res: Response): Promise<void> {
        try {
            const { patientId } = req.params;
            const histories = await this.getHistoriesByPatientUseCase.execute(patientId);

            ResponseFormatter.success(
                res,
                histories.map(h => h.toJson()),
                'Appointment histories retrieved successfully',
                200
            );
        } catch (error) {
            ResponseFormatter.error(
                res,
                { type: 'FETCH_ERROR', message: String(error) },
                400,
                'Failed to retrieve appointment histories'
            );
        }
    }
}
