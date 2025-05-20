
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/SectionTitle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

// Price table row component
const PriceTableRow = ({ 
  feature, 
  plans 
}: { 
  feature: string; 
  plans: { 
    dayPass: boolean | string; 
    monthly: boolean | string; 
    annual: boolean | string; 
    student: boolean | string; 
  } 
}) => {
  return (
    <div className="grid grid-cols-5 py-4 border-b border-gray-800">
      <div className="text-white font-medium col-span-2">{feature}</div>
      
      <div className="text-center">
        {typeof plans.dayPass === 'boolean' ? (
          plans.dayPass ? 
            <Check className="mx-auto h-5 w-5 text-fitness-red" /> : 
            <span className="text-gray-600">—</span>
        ) : (
          <span className="text-gray-300">{plans.dayPass}</span>
        )}
      </div>
      
      <div className="text-center">
        {typeof plans.monthly === 'boolean' ? (
          plans.monthly ? 
            <Check className="mx-auto h-5 w-5 text-fitness-red" /> : 
            <span className="text-gray-600">—</span>
        ) : (
          <span className="text-gray-300">{plans.monthly}</span>
        )}
      </div>
      
      <div className="text-center">
        {typeof plans.annual === 'boolean' ? (
          plans.annual ? 
            <Check className="mx-auto h-5 w-5 text-fitness-red" /> : 
            <span className="text-gray-600">—</span>
        ) : (
          <span className="text-gray-300">{plans.annual}</span>
        )}
      </div>
    </div>
  );
};

// Membership Plan card
const MembershipPlanCard = ({
  name,
  price,
  period,
  description,
  features,
  popular = false,
  className = "",
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  className?: string;
}) => {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      {popular && (
        <div className="absolute top-0 right-0 bg-fitness-red text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          MOST POPULAR
        </div>
      )}
      
      <div className={`p-8 ${popular ? 'bg-fitness-darkGray border-2 border-fitness-red' : 'bg-fitness-darkGray border border-gray-800'}`}>
        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold text-white">{price}</span>
          <span className="text-gray-400 ml-2">/{period}</span>
        </div>
        
        <p className="text-gray-300 mb-6">{description}</p>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-fitness-red shrink-0 mt-0.5 mr-3" />
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Link to={popular ? "/signup" : "/contact"}>
          <Button 
            className={`w-full ${popular ? 'bg-fitness-red hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
          >
            {popular ? 'Join Now' : 'Learn More'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

const MembershipPage = () => {
  const { isAuthenticated } = useAuth();

  // Animation on scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
          element.classList.add('animated');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* <Navbar /> */}
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=2070&auto=format&fit=crop" 
            alt="Membership Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75"></div>
        </div>
        
        {/* Content */}
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              JOIN THE <span className="text-fitness-red">MOVEMENT</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
              Flexible membership plans for every fitness level and budget
            </p>
            <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold text-lg py-6 px-8">
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="#plans">
                  <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold text-lg py-6 px-8">
                    Choose Plan <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section id="plans" className="bg-fitness-black py-20">
        <div className="container-custom">
          <SectionTitle 
            title="Membership Tiers" 
            subtitle="Choose the perfect plan that fits your fitness goals and budget"
            center={true}
            className="animate-on-scroll mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-on-scroll">
              <MembershipPlanCard
                name="Day Pass"
                price="$--"
                period="day"
                description="Perfect for visitors or those wanting to try our facilities before committing."
                features={[
                  "Full facility access for one day",
                  "Access to all equipment",
                  "Locker room access",
                  "Group classes (if available that day)",
                  "No commitment required"
                ]}
              />
            </div>
            
            <div className="animate-on-scroll">
              <MembershipPlanCard
                name="Monthly"
                price="$--"
                period="month"
                description="Our most popular plan for regular gym-goers who want comprehensive access."
                features={[
                  "Unlimited access to all facilities",
                  "Unlimited group classes",
                  "1 free personal training session",
                  "Access to gym app with workouts",
                  "Fitness assessment",
                  "Monthly billing, cancel anytime"
                ]}
                popular={true}
              />
            </div>
            
            <div className="animate-on-scroll">
              <MembershipPlanCard
                name="Annual"
                price="$--"
                period="year"
                description="Our best value plan with two months free and additional premium perks."
                features={[
                  "All monthly plan benefits",
                  "Two months free (save $98)",
                  "4 personal training sessions",
                  "Priority class booking",
                  "10% discount on merchandise",
                  "Bring a friend free (4x per month)"
                ]}
              />
            </div>
          </div>
          
          <div className="mt-20 animate-on-scroll">
            <SectionTitle 
              title="Detailed Plan Comparison" 
              subtitle="See exactly what's included in each of our membership tiers"
              center={true}
              className="mb-8"
            />
            
            <div className="bg-fitness-darkGray rounded-lg overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-5 py-5 border-b border-gray-800 bg-fitness-black">
                <div className="col-span-2 font-bold text-white px-6">Feature</div>
                <div className="text-center font-bold text-white">Day Pass</div>
                <div className="text-center font-bold text-white">Monthly</div>
                <div className="text-center font-bold text-white">Annual</div>
              </div>
              
              {/* Price row */}
              <div className="grid grid-cols-5 py-5 border-b border-gray-800 bg-fitness-black/50">
                <div className="col-span-2 text-white font-medium px-6">Price</div>
                <div className="text-center text-white">$--/day</div>
                <div className="text-center text-white">$--/month</div>
                <div className="text-center text-white">$--/year</div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <PriceTableRow 
                  feature="Gym Access" 
                  plans={{
                    dayPass: "1 Day",
                    monthly: "24/7",
                    annual: "24/7",
                    student: "24/7"
                  }}
                />
                
                <PriceTableRow 
                  feature="Group Classes" 
                  plans={{
                    dayPass: "If available",
                    monthly: "Unlimited",
                    annual: "Unlimited",
                    student: "Unlimited"
                  }}
                />
                
                <PriceTableRow 
                  feature="Personal Training Sessions" 
                  plans={{
                    dayPass: false,
                    monthly: "1 per month",
                    annual: "4 per year",
                    student: false
                  }}
                />
                
                <PriceTableRow 
                  feature="Fitness Assessment" 
                  plans={{
                    dayPass: false,
                    monthly: true,
                    annual: true,
                    student: true
                  }}
                />
                
                <PriceTableRow 
                  feature="Locker Room" 
                  plans={{
                    dayPass: true,
                    monthly: true,
                    annual: true,
                    student: true
                  }}
                />
                
                <PriceTableRow 
                  feature="Towel Service" 
                  plans={{
                    dayPass: false,
                    monthly: false,
                    annual: true,
                    student: false
                  }}
                />
                
                <PriceTableRow 
                  feature="Guest Passes" 
                  plans={{
                    dayPass: false,
                    monthly: "2 per month",
                    annual: "4 per month",
                    student: "1 per month"
                  }}
                />
                
                <PriceTableRow 
                  feature="Fitness App Access" 
                  plans={{
                    dayPass: false,
                    monthly: true,
                    annual: true,
                    student: true
                  }}
                />
                
                <PriceTableRow 
                  feature="Merchandise Discount" 
                  plans={{
                    dayPass: false,
                    monthly: false,
                    annual: "10%",
                    student: false
                  }}
                />
                
                <PriceTableRow 
                  feature="Class Priority Booking" 
                  plans={{
                    dayPass: false,
                    monthly: false,
                    annual: true,
                    student: false
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add-On Services */}
      <section className="bg-gradient-to-b from-fitness-black to-fitness-darkGray py-20">
        <div className="container-custom">
          <SectionTitle 
            title="Add-On Services" 
            subtitle="Enhance your membership with these premium services"
            center={true}
            className="animate-on-scroll mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-fitness-darkGray rounded-lg p-8 border border-gray-800 animate-on-scroll">
              <h3 className="text-xl font-bold text-white mb-4">Personal Training Packages</h3>
              <p className="text-gray-300 mb-6">Accelerate your results with personalized one-on-one coaching.</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <span className="text-white">Single Session</span>
                  <span className="text-fitness-red font-semibold">$--</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <span className="text-white">5 Session Pack</span>
                  <span className="text-fitness-red font-semibold">$--</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <span className="text-white">10 Session Pack</span>
                  <span className="text-fitness-red font-semibold">$--</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white">
                Book Training
              </Button>
            </div>
            
            <div className="bg-fitness-darkGray rounded-lg p-8 border border-gray-800 animate-on-scroll">
              <h3 className="text-xl font-bold text-white mb-4">Nutrition Plans</h3>
              <p className="text-gray-300 mb-6">Expert nutrition guidance to complement your fitness routine.</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <span className="text-white">Initial Consultation</span>
                  <span className="text-fitness-red font-semibold">$--</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <span className="text-white">Personalized Meal Plan</span>
                  <span className="text-fitness-red font-semibold">$--</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <span className="text-white">Monthly Coaching</span>
                  <span className="text-fitness-red font-semibold">$--/mo</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white">
                Schedule Consultation
              </Button>
            </div>
            
            <div className="bg-fitness-darkGray rounded-lg p-8 border border-gray-800 animate-on-scroll">
              <h3 className="text-xl font-bold text-white mb-4">Premium Amenities</h3>
              <p className="text-gray-300 mb-6">Elevate your gym experience with these additional services.</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <span className="text-white">Private Locker Rental</span>
                  <span className="text-fitness-red font-semibold">$--/mo</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <span className="text-white">Towel Service</span>
                  <span className="text-fitness-red font-semibold">$--/mo</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <span className="text-white">Recovery Zone Access</span>
                  <span className="text-fitness-red font-semibold">$--/mo</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white">
                Add Amenities
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-fitness-black py-20">
        <div className="container-custom">
          <SectionTitle 
            title="Frequently Asked Questions" 
            subtitle="Find answers to our most commonly asked questions about memberships"
            center={true}
            className="animate-on-scroll mb-12"
          />
          
          <div className="max-w-3xl mx-auto animate-on-scroll">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border border-gray-800 rounded-lg overflow-hidden bg-fitness-darkGray">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-fitness-red hover:no-underline">
                  How do I get started with a membership?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  You can sign up for a membership through our website by clicking on the "Join Now" button, or visit our gym in person where our staff will help you choose the right plan and complete your registration.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border border-gray-800 rounded-lg overflow-hidden bg-fitness-darkGray">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-fitness-red hover:no-underline">
                  Can I cancel or freeze my membership?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  Yes, monthly memberships can be canceled with 30 days' notice. Membership freezes are available for 1-3 months for medical reasons or extended travel. Annual memberships can be transferred to another person for a small administrative fee.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border border-gray-800 rounded-lg overflow-hidden bg-fitness-darkGray">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-fitness-red hover:no-underline">
                  Are there any hidden fees?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  We pride ourselves on transparent pricing. Your membership fee covers everything stated in your plan. There's a one-time registration fee of $25 for new members, and some specialty classes or services may have additional costs, but these are always clearly marked.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border border-gray-800 rounded-lg overflow-hidden bg-fitness-darkGray">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-fitness-red hover:no-underline">
                  What's included in the free personal training session?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  Your free personal training session includes a fitness assessment, goal-setting discussion, and a customized workout plan. Your trainer will demonstrate proper form for exercises and answer any questions you have about your fitness journey.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border border-gray-800 rounded-lg overflow-hidden bg-fitness-darkGray">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-fitness-red hover:no-underline">
                  Do you offer student or military discounts?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  Yes, we offer a special student rate of $--/month with valid student ID. Active military and veterans receive a 15% discount on any membership plan. These discounts cannot be combined with other promotions.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="border border-gray-800 rounded-lg overflow-hidden bg-fitness-darkGray">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-fitness-red hover:no-underline">
                  How do I book classes?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  Classes can be booked through our mobile app, website, or at the front desk. We recommend booking at least 24 hours in advance as popular classes fill quickly. Annual members get early access to class bookings (48 hours in advance).
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1623874228601-f4193c7b1818?q=80&w=2070&auto=format&fit=crop" 
            alt="Gym Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              START YOUR FITNESS JOURNEY <span className="text-fitness-red">TODAY</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join HUBERT FITNESS and experience the difference at the premier fitness destination in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold text-lg py-6 px-8">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold text-lg py-6 px-8">
                      Join Now
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10 font-bold text-lg py-6 px-8">
                      Contact Us
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* <Footer /> */}
    </>
  );
};

export default MembershipPage;
