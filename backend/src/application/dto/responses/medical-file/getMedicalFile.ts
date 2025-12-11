export interface GetMedicalFileResponseDto {
    doctorId: string;
    data: {
        [key: string]: any;
    };
    createdAt: Date;
    lastUpdated: Date;
}