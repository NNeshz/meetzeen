import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvitationEmail(
  email: string,
  companyName: string,
  inviterName: string,
  magicLink: string,
  role: string
) {
  try {
    await resend.emails.send({
      from: 'meetzeen@meetzeen.com',
      to: email,
      subject: `Invitación a unirte a ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>¡Has sido invitado!</h2>
          <p>Hola,</p>
          <p><strong>${inviterName}</strong> te ha invitado a unirte a <strong>${companyName}</strong> como <strong>${role}</strong>.</p>
          <p>Haz clic en el siguiente enlace para aceptar la invitación:</p>
          <a href="${magicLink}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Aceptar Invitación
          </a>
          <p>Este enlace expirará en 7 días.</p>
          <p>Si no esperabas esta invitación, puedes ignorar este correo.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error enviando email:', error);
    throw new Error('No se pudo enviar el email de invitación');
  }
}

export async function sendVerificationEmail(email: string, url: string) {
  try {
    await resend.emails.send({
      from: 'meetzeen@meetzeen.com',
      to: email,
      subject: 'Verifica tu correo electrónico',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verifica tu correo electrónico</h2>
          <p>Haz clic en el siguiente enlace para verificar tu correo:</p>
          <a href="${url}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Verificar Email
          </a>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error enviando email de verificación:', error);
  }
}