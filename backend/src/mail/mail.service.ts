import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

export interface RegistrationConfirmationData {
  participantName: string;
  participantEmail: string;
  eventTitle: string;
  eventDate: Date;
  eventLocation?: string | null;
  registrationId: string;
  ticketName?: string | null;
  amountPaid?: number | null;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: Number(this.config.get('MAIL_PORT', 587)),
      secure: this.config.get<string>('MAIL_SECURE') === 'true',
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendRegistrationConfirmation(data: RegistrationConfirmationData): Promise<void> {
    const from = this.config.get<string>('MAIL_FROM', 'inscrições.app <noreply@inscricoes.app>');

    const formattedDate = new Date(data.eventDate).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const formattedTime = new Date(data.eventDate).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    try {
      await this.transporter.sendMail({
        from,
        to: data.participantEmail,
        subject: `Inscrição confirmada — ${data.eventTitle}`,
        html: this.buildEmailHtml({ ...data, formattedDate, formattedTime }),
      });
      this.logger.log(`Email de confirmação enviado para ${data.participantEmail}`);
    } catch (err) {
      this.logger.error(`Falha ao enviar email para ${data.participantEmail}: ${err}`);
    }
  }

  private buildEmailHtml(
    data: RegistrationConfirmationData & { formattedDate: string; formattedTime: string },
  ): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmação de Inscrição</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%);padding:36px 40px;text-align:center;">
              <p style="margin:0 0 8px 0;color:#ddd6fe;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">
                inscrições.app
              </p>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;line-height:1.3;">
                Inscrição Confirmada!
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="margin:0 0 24px 0;color:#374151;font-size:16px;line-height:1.6;">
                Olá, <strong>${data.participantName}</strong>! 👋
              </p>
              <p style="margin:0 0 32px 0;color:#6b7280;font-size:15px;line-height:1.6;">
                Sua inscrição foi recebida e confirmada com sucesso. Guarde este email — ele é o seu comprovante.
              </p>

              <!-- Event Card -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f5f3ff;border-radius:12px;border-left:4px solid #7c3aed;overflow:hidden;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 16px 0;color:#5b21b6;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
                      Detalhes do Evento
                    </p>
                    <p style="margin:0 0 8px 0;color:#1f2937;font-size:20px;font-weight:700;">
                      ${data.eventTitle}
                    </p>
                    <p style="margin:0 0 6px 0;color:#6b7280;font-size:14px;">
                      📅 ${data.formattedDate} às ${data.formattedTime}
                    </p>
                    ${
                      data.eventLocation
                        ? `<p style="margin:0;color:#6b7280;font-size:14px;">📍 ${data.eventLocation}</p>`
                        : ''
                    }
                  </td>
                </tr>
              </table>

              <!-- Registration ID -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 28px;text-align:center;">
                    <p style="margin:0 0 6px 0;color:#9ca3af;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">
                      Número da Inscrição
                    </p>
                    <p style="margin:0;color:#1f2937;font-size:15px;font-weight:700;font-family:monospace;letter-spacing:1px;">
                      ${data.registrationId}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;">
                Caso precise de ajuda ou queira cancelar sua inscrição, entre em contato com o organizador do evento.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#d1d5db;font-size:12px;">
                Este email foi enviado automaticamente pela plataforma
                <strong style="color:#7c3aed;">inscrições.app</strong>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }
}
