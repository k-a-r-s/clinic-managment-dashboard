export interface GetMedicalFileResponseDto {
    id: string;
    doctorId: string;
    data: {
        [key: string]: any;
    };
    createdAt: Date;
    lastUpdated: Date;
}