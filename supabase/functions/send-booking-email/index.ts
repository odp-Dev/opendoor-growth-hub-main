import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Rate limiting storage
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Security-Policy": "default-src 'self'; script-src 'none'; object-src 'none'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
};

interface BookingEmailRequest {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

// Rate limiting function
const checkRateLimit = (clientIP: string): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 3; // 3 booking requests per minute (more restrictive)
  
  const clientData = rateLimitMap.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  if (clientData.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  
  clientData.count++;
  return { allowed: true, remaining: maxRequests - clientData.count };
};

// Input validation
const validateBookingData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email address is required');
  }
  
  if (!data.serviceType || typeof data.serviceType !== 'string') {
    errors.push('Service type is required');
  }
  
  if (!data.preferredDate || typeof data.preferredDate !== 'string') {
    errors.push('Preferred date is required');
  } else {
    const date = new Date(data.preferredDate);
    if (isNaN(date.getTime()) || date < new Date()) {
      errors.push('Valid future date is required');
    }
  }
  
  if (!data.preferredTime || typeof data.preferredTime !== 'string') {
    errors.push('Preferred time is required');
  }
  
  if (data.phone && typeof data.phone === 'string' && data.phone.length > 0) {
    if (!/^[\d\s\-\+\(\)]{10,20}$/.test(data.phone)) {
      errors.push('Phone number format is invalid');
    }
  }
  
  // Check for potential XSS attempts
  const xssPattern = /<script|javascript:|on\w+\s*=/i;
  if (xssPattern.test(data.name) || xssPattern.test(data.message || '') || xssPattern.test(data.serviceType)) {
    errors.push('Invalid characters detected');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Input sanitization
const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Limit length
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimit = checkRateLimit(clientIP);
    
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ error: "Too many booking requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0",
            "Retry-After": "60",
            ...corsHeaders,
          },
        }
      );
    }

    const bookingData: BookingEmailRequest = await req.json();
    
    // Validate input data
    const validation = validateBookingData(bookingData);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: validation.errors }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            "X-RateLimit-Remaining": rateLimit.remaining.toString()
          } 
        }
      );
    }
    
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(bookingData.name),
      email: sanitizeInput(bookingData.email),
      phone: sanitizeInput(bookingData.phone || ''),
      serviceType: sanitizeInput(bookingData.serviceType),
      preferredDate: bookingData.preferredDate,
      preferredTime: bookingData.preferredTime,
      message: bookingData.message ? sanitizeInput(bookingData.message) : undefined
    };
    
    console.log("Booking form validation passed");

    // Format the booking details
    const formattedDate = new Date(sanitizedData.preferredDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send email to company 
    const emailResponse = await resend.emails.send({
      from: "Open Door Professionals <noreply@opendoorpro.com>",
      to: ["Sales@opendoorpro.com", "admin@opendoorpro.com"],
      subject: `New Service Booking Request - ${sanitizedData.serviceType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #77C249; border-bottom: 2px solid #77C249; padding-bottom: 10px;">
            New Booking Request
          </h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Client Information</h2>
            <p><strong>Name:</strong> ${sanitizedData.name}</p>
            <p><strong>Email:</strong> ${sanitizedData.email}</p>
            <p><strong>Phone:</strong> ${sanitizedData.phone}</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Service Details</h2>
            <p><strong>Service Type:</strong> ${sanitizedData.serviceType}</p>
            <p><strong>Preferred Date:</strong> ${formattedDate}</p>
            <p><strong>Preferred Time:</strong> ${sanitizedData.preferredTime}</p>
            ${sanitizedData.message ? `<p><strong>Additional Message:</strong> ${sanitizedData.message}</p>` : ''}
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #e8f5e8; border-radius: 8px;">
            <p style="margin: 0; color: #333;">
              Please contact the client within 24 hours to confirm the appointment and discuss details.
            </p>
          </div>
          
          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated message from the Open Door Professionals booking system.</p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    // Send confirmation email to the client
    const confirmationResponse = await resend.emails.send({
      from: "Open Door Professionals <noreply@opendoorpro.com>",
      to: [sanitizedData.email],
      subject: "Booking Confirmation - Open Door Professionals",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #77C249; border-bottom: 2px solid #77C249; padding-bottom: 10px;">
            Thank You for Your Booking Request!
          </h1>
          
          <p>Dear ${sanitizedData.name},</p>
          
          <p>Thank you for your interest in our ${sanitizedData.serviceType} services. We have received your booking request and our team will contact you within 24 hours to confirm your appointment.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Your Booking Details</h2>
            <p><strong>Service:</strong> ${sanitizedData.serviceType}</p>
            <p><strong>Requested Date:</strong> ${formattedDate}</p>
            <p><strong>Requested Time:</strong> ${sanitizedData.preferredTime}</p>
          </div>
          
          <p>If you have any urgent questions, please don't hesitate to contact us directly.</p>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #e8f5e8; border-radius: 8px;">
            <p style="margin: 0; color: #333; text-align: center;">
              <strong>Open Door Professionals</strong><br>
              Your trusted partner for HR, BPO, and business solutions in the Philippines.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Confirmation email sent successfully:", confirmationResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Booking emails sent successfully",
        emailId: emailResponse.data?.id,
        confirmationId: confirmationResponse.data?.id
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send booking emails"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);