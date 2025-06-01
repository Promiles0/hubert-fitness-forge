
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key from environment variables
const resend = new Resend(Deno.env.get("MY_API_KEY"));

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

// Define the interface for welcome email data
interface WelcomeEmailData {
  name: string;
  email: string;
  type: 'welcome';
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
    const requestData = await req.json();
    
    // Check if this is a welcome email request
    if (requestData.type === 'welcome') {
      const { name, email }: WelcomeEmailData = requestData;

      if (!name || !email) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Missing required fields for welcome email" 
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Send welcome email to the new user
      const welcomeEmailResponse = await resend.emails.send({
        from: "HUBERT FITNESS <no-reply@resend.dev>",
        to: [email],
        subject: "🎉 Welcome to HUBERT FITNESS, " + name + "!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #ff0000; font-size: 28px; margin: 0;">HUBERT FITNESS</h1>
                <h2 style="color: #333; font-size: 24px; margin: 10px 0;">Welcome, ${name}! 🎉</h2>
              </div>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Welcome to HUBERT FITNESS!</p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Your account has been created successfully. You can now:</p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <ul style="color: #333; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>✅ Log in to your dashboard</li>
                  <li>✅ Book fitness classes</li>
                  <li>✅ Track your memberships and workouts</li>
                  <li>✅ Get access to exclusive offers</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://hubertfitness.vercel.app/login" 
                   style="background-color: #ff0000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                   👉 Login Here
                </a>
              </div>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Need help? Just reply to this email or contact our support team at +250 780 899 767.</p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">We're excited to have you in the HUBERT FITNESS community! 💪</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px; margin: 0;">
                  — The HUBERT FITNESS Team<br>
                  hubertsingiza@gmail.com
                </p>
                <p style="color: #999; font-size: 12px; margin-top: 15px;">
                  🔐 If this wasn't you, please contact support immediately.
                </p>
              </div>
            </div>
          </div>
        `,
      });

      console.log("Welcome email result:", welcomeEmailResponse);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Welcome email sent successfully!" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Handle contact form submission (existing functionality)
    const { name, email, phone, message }: ContactFormData = requestData;

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
      to: ["hubertsingiza@gmail.com"],
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
