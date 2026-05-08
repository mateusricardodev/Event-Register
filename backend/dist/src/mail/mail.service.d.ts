import { ConfigService } from '@nestjs/config';
export interface RegistrationConfirmationData {
    participantName: string;
    participantEmail: string;
    eventTitle: string;
    eventDate: Date;
    eventLocation?: string | null;
    registrationId: string;
}
export declare class MailService {
    private readonly config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    sendRegistrationConfirmation(data: RegistrationConfirmationData): Promise<void>;
    private buildEmailHtml;
}
