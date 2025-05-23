
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key from environment variables
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define the interface for our contact form data
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

serve(async (req) => {
  // Handle preflight CORS request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Parse the request body
    const formData: ContactFormData = await req.json();
    const { name, email, phone, message } = formData;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "HUBERT FITNESS <no-reply@resend.dev>",
      to: [email],
      subject: "Thanks for contacting HUBERT FITNESS!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${name},</h2>
          <p>Thank you for contacting HUBERT FITNESS. We have received your message, and our team will get back to you shortly.</p>
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #ff0000;">
            <h3>Here's a copy of your message:</h3>
            <p><strong>Message:</strong> ${message}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          </div>
          <p>In the meantime, feel free to call us directly for urgent queries at +250 780 899 767.</p>
          <p>Stay fit,<br>— The HUBERT FITNESS Team<br>hubertsingiza@gmail.com</p>
        </div>
      `,
    });

    // Send notification email to the admin
    const adminEmailResponse = await resend.emails.send({
      from: "Contact Form <no-reply@resend.dev>",
      to: ["hubertsingiza@gmail.com"], // Admin email
      subject: `📬 New Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p>You've received a new message from the contact form:</p>
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #ff0000;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p><a href="mailto:${email}">Click here to reply</a></p>
        </div>
      `,
    });

    console.log("User email result:", userEmailResponse);
    console.log("Admin email result:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Your message has been sent successfully!" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to send message. Please try again later." 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
