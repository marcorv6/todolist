import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

if (!process.env.RESEND_API_KEY) {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    try {
      process.loadEnvFile(envPath);
    } catch {
      // Fallback
    }
  }
}

const resendApiKey = process.env.RESEND_API_KEY;

export interface WelcomeEmailInput {
  name: string;
  email: string;
}

export async function sendWelcomeEmail({ name, email }: WelcomeEmailInput): Promise<{ success: boolean; id?: string }> {
  const subject = 'Welcome to TaskFlow! 🚀';
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #faf9f7; color: #18181b; padding: 24px; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e4e4e7; }
          h1 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
          p { font-size: 14px; line-height: 1.6; color: #52525b; }
          .highlight { background: #f4f4f5; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin: 20px 0; border-left: 3px solid #18181b; }
          .footer { font-size: 11px; color: #a1a1aa; margin-top: 32px; border-top: 1px solid #f4f4f5; pt: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to TaskFlow, ${name}! 👋</h1>
          <p>Thank you for signing up. TaskFlow is designed to keep your productivity high with clean task management, priority tags, subtask checklists, and custom categories.</p>
          
          <div class="highlight">
            <strong>Getting Started:</strong><br/>
            • Create your first task using the <strong>+ New Task</strong> button.<br/>
            • Set priority levels (P1 - Urgent to P4 - Low).<br/>
            • Organize tasks into custom color-coded categories.
          </div>

          <p>If you have any questions or feedback, feel free to reply directly to this email.</p>
          <p>Happy organizing!<br/>— The TaskFlow Team</p>
          
          <div class="footer">
            TaskFlow • Full-Stack Portfolio Application
          </div>
        </div>
      </body>
    </html>
  `;

  const activeKey = process.env.RESEND_API_KEY || resendApiKey;

  if (activeKey) {
    try {
      const resend = new Resend(activeKey);
      const data = await resend.emails.send({
        from: 'TaskFlow <onboarding@resend.dev>',
        to: [email],
        subject,
        html: htmlContent,
      });

      if (data.error) {
        console.error('Resend API error:', data.error);
        return { success: false };
      }

      console.log(`✉️ [Resend API] Welcome email sent to ${email} (ID: ${data.data?.id})`);
      return { success: true, id: data.data?.id };
    } catch (err) {
      console.error('Resend API dispatch error:', err);
    }
  }

  // Fallback Dev Log when RESEND_API_KEY is missing
  console.log(`✉️ [DEV EMAIL SERVICE] Simulated Welcome Email dispatched to ${name} <${email}>`);
  return { success: true, id: 'simulated_dev_id' };
}
