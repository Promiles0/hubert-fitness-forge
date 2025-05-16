
import { useEffect } from 'react';
import { ArrowRight, Dumbbell, Users, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/SectionTitle';
import ProgramCard from '@/components/ProgramCard';
import MembershipCard from '@/components/MembershipCard';
import TrainerCard from '@/components/TrainerCard';
import TestimonialCard from '@/components/TestimonialCard';

const HomePage = () => {
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
        <div className="container-custom relative z-10 pt-20 pb-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              UNLOCK YOUR <span className="text-fitness-red">STRENGTH</span>
              <br />TRAIN AT HUBERT FITNESS
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
              Transform your body, elevate your mindset, and join our community of fitness enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold text-lg py-6 px-8">
                Join Now
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-bold text-lg py-6 px-8">
                Book Free Session
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-fitness-black py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-fitness-darkGray p-8 rounded-lg text-center animate-on-scroll">
              <div className="bg-fitness-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Dumbbell size={32} className="text-fitness-red" />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Equipment</h3>
              <p className="text-gray-400">State-of-the-art fitness equipment for effective workouts.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-fitness-darkGray p-8 rounded-lg text-center animate-on-scroll" style={{animationDelay: '0.1s'}}>
              <div className="bg-fitness-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={32} className="text-fitness-red" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Trainers</h3>
              <p className="text-gray-400">Professional coaches to guide your fitness journey.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-fitness-darkGray p-8 rounded-lg text-center animate-on-scroll" style={{animationDelay: '0.2s'}}>
              <div className="bg-fitness-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={32} className="text-fitness-red" />
              </div>
              <h3 className="text-xl font-bold mb-3">Proven Results</h3>
              <p className="text-gray-400">Achieve your fitness goals with our effective programs.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-fitness-darkGray p-8 rounded-lg text-center animate-on-scroll" style={{animationDelay: '0.3s'}}>
              <div className="bg-fitness-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={32} className="text-fitness-red" />
              </div>
              <h3 className="text-xl font-bold mb-3">24/7 Access</h3>
              <p className="text-gray-400">Work out anytime with our flexible gym hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-gradient-to-b from-fitness-black to-fitness-darkGray">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <img 
                src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop" 
                alt="About Hubert Fitness" 
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div className="animate-on-scroll">
              <SectionTitle 
                title="About HUBERT FITNESS" 
                subtitle="We're more than just a gym – we're a community dedicated to helping you become the best version of yourself."
                center={false}
              />
              <p className="text-gray-400 mb-6">
                Founded in 2015, HUBERT FITNESS has grown from a small local gym to a premium fitness destination. Our philosophy is built on three core principles: discipline, community, and transformation.
              </p>
              <p className="text-gray-400 mb-8">
                We provide a supportive environment where members of all fitness levels can thrive, with state-of-the-art equipment, expert coaching, and a variety of programs designed to challenge and inspire.
              </p>
              <Button className="bg-fitness-red hover:bg-red-700">
                Learn More About Us <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section-padding bg-fitness-black">
        <div className="container-custom">
          <SectionTitle 
            title="Our Programs" 
            subtitle="Discover a variety of fitness programs designed to help you reach your goals, whether you're a beginner or advanced athlete."
            center={true}
            className="animate-on-scroll"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              style={{animationDelay: '0.1s'}}
            />
            
            <ProgramCard
              title="Yoga & Flexibility"
              description="Improve flexibility, balance, and mental wellbeing with our expert-led yoga classes for all levels."
              image="https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=2070&auto=format&fit=crop"
              level="Beginner"
              className="animate-on-scroll"
              style={{animationDelay: '0.2s'}}
            />
          </div>
          
          <div className="text-center mt-12 animate-on-scroll">
            <Button variant="outline" className="border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white">
              View All Programs <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="section-padding bg-gradient-to-b from-fitness-black to-fitness-darkGray">
        <div className="container-custom">
          <SectionTitle 
            title="Membership Plans" 
            subtitle="Choose the perfect membership plan that fits your fitness goals and budget."
            center={true}
            className="animate-on-scroll"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MembershipCard
              title="Basic"
              price="$49"
              period="month"
              features={[
                "Full gym access",
                "2 group classes per week",
                "Locker room access",
                "Fitness assessment",
                "24/7 gym access"
              ]}
              className="animate-on-scroll"
            />
            
            <MembershipCard
              title="Premium"
              price="$79"
              period="month"
              features={[
                "Full gym access",
                "Unlimited group classes",
                "1 personal training session/month",
                "Nutrition consultation",
                "Locker room access",
                "24/7 gym access",
                "Guest passes (2/month)"
              ]}
              popular={true}
              className="animate-on-scroll"
              style={{animationDelay: '0.1s'}}
            />
            
            <MembershipCard
              title="Elite"
              price="$129"
              period="month"
              features={[
                "Full gym access",
                "Unlimited group classes",
                "4 personal training sessions/month",
                "Quarterly nutrition consultation",
                "Locker room access with towel service",
                "24/7 gym access",
                "Guest passes (unlimited)",
                "Recovery zone access"
              ]}
              className="animate-on-scroll"
              style={{animationDelay: '0.2s'}}
            />
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="section-padding bg-fitness-black">
        <div className="container-custom">
          <SectionTitle 
            title="Our Expert Trainers" 
            subtitle="Meet our team of certified fitness professionals who are dedicated to helping you achieve your goals."
            center={true}
            className="animate-on-scroll"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              style={{animationDelay: '0.1s'}}
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
              className="animate-on-scroll"
              style={{animationDelay: '0.2s'}}
            />
          </div>
          
          <div className="text-center mt-12 animate-on-scroll">
            <Button variant="outline" className="border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white">
              Meet All Trainers <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gradient-to-b from-fitness-black to-fitness-darkGray">
        <div className="container-custom">
          <SectionTitle 
            title="Success Stories" 
            subtitle="Hear from our members who have transformed their bodies and lives with HUBERT FITNESS."
            center={true}
            className="animate-on-scroll"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              style={{animationDelay: '0.1s'}}
            />
            
            <TestimonialCard
              quote="The personal training program at HUBERT FITNESS is top-notch. My trainer customized workouts specifically for my goals, and I've seen tremendous improvement in my strength and endurance."
              name="Michelle L."
              role="Member since 2019"
              image="https://randomuser.me/api/portraits/women/44.jpg"
              className="animate-on-scroll"
              style={{animationDelay: '0.2s'}}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075&auto=format&fit=crop" 
            alt="Gym Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/80"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              START YOUR FITNESS JOURNEY TODAY
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join HUBERT FITNESS and take the first step towards a stronger, healthier you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold text-lg py-6 px-8">
                Become a Member
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-bold text-lg py-6 px-8">
                Book Free Session
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
