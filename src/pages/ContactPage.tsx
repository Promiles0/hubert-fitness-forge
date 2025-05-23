
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import SectionTitle from '@/components/SectionTitle';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the contact form schema with validation
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const handleSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    console.log('Form submitted:', values);
    
    try {
      const response = await fetch('https://aotcazibvafyqufeuplx.supabase.co/functions/v1/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        form.reset();
      } else {
        toast.error(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20"> {/* Adding padding for the fixed navbar */}
      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop" 
            alt="Contact Us" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              CONTACT <span className="text-fitness-red">US</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Get in touch with our team. We're here to help you on your fitness journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="bg-fitness-black py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <SectionTitle 
                title="Get in Touch" 
                subtitle="Have questions or ready to start your fitness journey? Reach out to us using any of the methods below."
                center={false}
              />
              
              <div className="space-y-8 mt-8">
                <div className="flex items-start">
                  <div className="bg-fitness-red/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 shrink-0">
                    <MapPin size={24} className="text-fitness-red" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Our Location</h3>
                    <p className="text-gray-400">Juru Park</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-fitness-red/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 shrink-0">
                    <Mail size={24} className="text-fitness-red" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Email Us</h3>
                   <a href="mailto:hubertsingiza@gmail.com" className="text-gray-400 hover:text-fitness-red transition-colors"> 
                      <p>hubertsingiza@gmail.com</p>
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-fitness-red/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 shrink-0">
                    <Phone size={24} className="text-fitness-red" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Call Us</h3>
                    <p className="text-gray-400">Main: +250 780 899 767</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-fitness-red/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 shrink-0">
                    <Clock size={24} className="text-fitness-red" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Working Hours</h3>
                    <p className="text-gray-400">Monday - Thursday: 7:00 AM - 18:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-fitness-darkGray p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your name" 
                            className="bg-gray-800 border-gray-700 focus:ring-fitness-red" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your.email@example.com" 
                            className="bg-gray-800 border-gray-700 focus:ring-fitness-red" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+(250) 78- --- ---" 
                            className="bg-gray-800 border-gray-700 focus:ring-fitness-red" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How can we help you?" 
                            className="bg-gray-800 border-gray-700 focus:ring-fitness-red min-h-[150px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-fitness-red hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-fitness-black py-8 md:py-12">
        <div className="container-custom">
          <div className="rounded-lg overflow-hidden h-96">
            {/* This is a placeholder for a Google Maps embed */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304605!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1621529114578!5m2!1sen!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              title="HUBERT FITNESS Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
