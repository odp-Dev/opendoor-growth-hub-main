import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders };
  }

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const data = JSON.parse(event.body || '{}');
    const { name, email, message, company, phone } = data;

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Please fill all required fields.' }),
      };
    }

    await resend.emails.send({
      from: 'Open Door Professionals <noreply@opendoorpro.com>',
      to: ['sales@opendoorpro.com', 'admin@opendoorpro.com'],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Inquiry</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Company:</b> ${company || 'N/A'}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || 'N/A'}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    await resend.emails.send({
      from: 'Open Door Professionals <noreply@opendoorpro.com>',
      to: [email],
      subject: 'Thank you for contacting Open Door Professionals',
      html: `<p>Hi ${name},</p><p>Thanks for reaching out! We'll get back to you within one business day.</p>`,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
}
