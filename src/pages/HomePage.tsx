import { useEffect } from 'react';
import { ArrowRight, Dumbbell, Users, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SectionTitle from '@/components/SectionTitle';
import ProgramCard from '@/components/ProgramCard';
import MembershipCard from '@/components/MembershipCard';
import TrainerCard from '@/components/TrainerCard';
import TestimonialCard from '@/components/TestimonialCard';
import ScrollIndicator from '@/components/ScrollIndicator';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
            alt="Gym Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 sm:pt-20 pb-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight">
              UNLOCK YOUR <span className="text-fitness-red">STRENGTH</span>
              <br />TRAIN AT HUBERT FITNESS
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-6 sm:mb-8 animate-fade-in px-4 sm:px-0" style={{animationDelay: '0.2s'}}>
              Transform your body, elevate your mindset, and join our community of fitness enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in px-4 sm:px-0" style={{animationDelay: '0.4s'}}>
              {isAuthenticated ? (
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold text-base sm:text-lg py-4 sm:py-6 px-6 sm:px-8 w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold text-base sm:text-lg py-4 sm:py-6 px-6 sm:px-8 w-full sm:w-auto">
                      Join Now
                    </Button>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10 font-bold text-base sm:text-lg py-4 sm:py-6 px-6 sm:px-8 w-full sm:w-auto">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <ScrollIndicator />
      </section>

      {/* Features Section */}
      <section className="bg-fitness-black py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-fitness-darkGray p-6 sm:p-8 rounded-lg text-center animate-on-scroll">
              <div className="bg-fitness-red/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Dumbbell size={28} className="text-fitness-red sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Premium Equipment</h3>
              <p className="text-sm sm:text-base text-gray-400">State-of-the-art fitness equipment for effective workouts.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-fitness-darkGray p-6 sm:p-8 rounded-lg text-center animate-on-scroll" style={{animationDelay: '0.1s'}}>
              <div className="bg-fitness-red/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users size={28} className="text-fitness-red sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Expert Trainers</h3>
              <p className="text-sm sm:text-base text-gray-400">Professional coaches to guide your fitness journey.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-fitness-darkGray p-6 sm:p-8 rounded-lg text-center animate-on-scroll" style={{animationDelay: '0.2s'}}>
              <div className="bg-fitness-red/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Award size={28} className="text-fitness-red sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Proven Results</h3>
              <p className="text-sm sm:text-base text-gray-400">Achieve your fitness goals with our effective programs.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-fitness-darkGray p-6 sm:p-8 rounded-lg text-center animate-on-scroll" style={{animationDelay: '0.3s'}}>
              <div className="bg-fitness-red/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Clock size={28} className="text-fitness-red sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">24/7 Access</h3>
              <p className="text-sm sm:text-base text-gray-400">Work out anytime with our flexible gym hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-fitness-black to-fitness-darkGray">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="animate-on-scroll order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop" 
                alt="About Hubert Fitness" 
                className="rounded-lg w-full h-64 sm:h-80 md:h-96 lg:h-auto object-cover"
              />
            </div>
            <div className="animate-on-scroll order-1 lg:order-2">
              <SectionTitle 
                title="About HUBERT FITNESS" 
                subtitle="We're more than just a gym – we're a community dedicated to helping you become the best version of yourself."
                center={false}
              />
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
                Founded in 2015, HUBERT FITNESS has grown from a small local gym to a premium fitness destination. Our philosophy is built on three core principles: discipline, community, and transformation.
              </p>
              <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8">
                We provide a supportive environment where members of all fitness levels can thrive, with state-of-the-art equipment, expert coaching, and a variety of programs designed to challenge and inspire.
              </p>
              <Link to="/about">
                <Button className="bg-fitness-red hover:bg-red-700 w-full sm:w-auto">
                  Learn More About Us <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-fitness-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Our Programs" 
            subtitle="Discover a variety of fitness programs designed to help you reach your goals, whether you're a beginner or advanced athlete."
            center={true}
            className="animate-on-scroll"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            <ProgramCard
              title="Strength Training"
              description="Build muscle, increase strength, and improve your overall fitness with our comprehensive strength training program."
              image="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop"
              level="All Levels"
              className="animate-on-scroll"
            />
            
            <ProgramCard
              title="HIIT Workouts"
              description="High-intensity interval training to burn calories, boost metabolism, and improve cardiovascular health."
              image="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop"
              level="Intermediate"
              className="animate-on-scroll"
            />
            
            <ProgramCard
              title="Yoga & Flexibility"
              description="Improve flexibility, balance, and mental wellbeing with our expert-led yoga classes for all levels."
              image="https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=2070&auto=format&fit=crop"
              level="Beginner"
              className="animate-on-scroll md:col-span-2 xl:col-span-1"
            />
          </div>
          
          <div className="text-center mt-8 sm:mt-12 animate-on-scroll">
            <Link to="/programs">
              <Button variant="outline" className="border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white w-full sm:w-auto">
                View All Programs <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-fitness-black to-fitness-darkGray">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Membership Plans" 
            subtitle="Choose the perfect membership plan that fits your fitness goals and budget."
            center={true}
            className="animate-on-scroll"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            <MembershipCard
              title="Day Pass"
              price="$2.13"
              period="Day"
              features={[
                "Full gym access",
                "1 group class (If available)",
                "Fitness assessment",
                "24/7 gym access"
              ]}
              className="animate-on-scroll"
            />
            
            <MembershipCard
              title="Monthly"
              price="$21.33"
              period="month"
              features={[
                "Full gym access",
                "Unlimited group classes",
                "1 personal training session/month",
                "Nutrition consultation",
                "24/7 gym access",
                "Guest passes (2/month)"
              ]}
              popular={true}
              className="animate-on-scroll md:col-span-2 lg:col-span-1"
            />
            
            <MembershipCard
              title="Annual"
              price="$213.27"
              period="year"
              features={[
                "Full gym access",
                "Unlimited group classes",
                "4 personal training sessions/month",
                "Quarterly nutrition consultation",
                "24/7 gym access",
                "Guest passes (unlimited)",
                "Recovery zone access"
              ]}
              className="animate-on-scroll"
            />
          </div>
          
          <div className="text-center mt-8 sm:mt-12 animate-on-scroll">
            <Link to="/membership">
              <Button variant="outline" className="border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white w-full sm:w-auto">
                Explore Memberships <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-fitness-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Our Expert Trainers" 
            subtitle="Meet our team of certified fitness professionals who are dedicated to helping you achieve your goals."
            center={true}
            className="animate-on-scroll"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            <TrainerCard
              name="Alex Johnson"
              role="Head Strength Coach"
              image="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop"
              bio="Alex specializes in strength training with 10+ years of experience helping clients build muscle and increase power."
              socialMedia={{
                instagram: "https://instagram.com",
                facebook: "https://facebook.com",
                linkedin: "https://linkedin.com"
              }}
              className="animate-on-scroll"
            />
            
            <TrainerCard
              name="Sarah Martinez"
              role="HIIT & Cardio Specialist"
              image="https://images.unsplash.com/photo-1609899066399-0aba93c8c6e3?q=80&w=1974&auto=format&fit=crop"
              bio="Sarah is passionate about high-intensity workouts that push you to your limits and help you burn maximum calories."
              socialMedia={{
                instagram: "https://instagram.com",
                facebook: "https://facebook.com"
              }}
              className="animate-on-scroll"
            />
            
            <TrainerCard
              name="Michael Chen"
              role="Yoga & Flexibility Coach"
              image="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1974&auto=format&fit=crop"
              bio="Michael brings mindfulness to fitness, focusing on mobility, flexibility and mental wellbeing through yoga practices."
              socialMedia={{
                instagram: "https://instagram.com",
                linkedin: "https://linkedin.com"
              }}
              className="animate-on-scroll md:col-span-2 xl:col-span-1"
            />
          </div>
          
          <div className="text-center mt-8 sm:mt-12 animate-on-scroll">
            <Link to="/trainers">
              <Button variant="outline" className="border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white w-full sm:w-auto">
                Meet All Trainers <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-fitness-black to-fitness-darkGray">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Success Stories" 
            subtitle="Hear from our members who have transformed their bodies and lives with HUBERT FITNESS."
            center={true}
            className="animate-on-scroll"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            <TestimonialCard
              quote="HUBERT FITNESS completely changed my approach to working out. The trainers pushed me to achieve goals I never thought possible. I've lost 30 pounds and gained confidence!"
              name="Jennifer K."
              role="Member since 2020"
              image="https://randomuser.me/api/portraits/women/28.jpg"
              className="animate-on-scroll"
            />
            
            <TestimonialCard
              quote="As someone who was intimidated by gyms, the welcoming atmosphere at HUBERT FITNESS made all the difference. The community here is supportive and the results speak for themselves."
              name="David T."
              role="Member since 2021"
              image="https://randomuser.me/api/portraits/men/32.jpg"
              className="animate-on-scroll"
            />
            
            <TestimonialCard
              quote="The personal training program at HUBERT FITNESS is top-notch. My trainer customized workouts specifically for my goals, and I've seen tremendous improvement in my strength and endurance."
              name="Michelle L."
              role="Member since 2019"
              image="https://randomuser.me/api/portraits/women/44.jpg"
              className="animate-on-scroll md:col-span-2 xl:col-span-1"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075&auto=format&fit=crop" 
            alt="Gym Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/80"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              START YOUR FITNESS JOURNEY TODAY
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8">
              Join HUBERT FITNESS and take the first step towards a stronger, healthier you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              {isAuthenticated ? (
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold text-base sm:text-lg py-4 sm:py-6 px-6 sm:px-8 w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold text-base sm:text-lg py-4 sm:py-6 px-6 sm:px-8 w-full sm:w-auto">
                    Become a Member
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
