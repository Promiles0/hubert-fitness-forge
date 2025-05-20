
import { ArrowRight, Dumbbell, Users, Zap, Heart, Brain, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SectionTitle from '@/components/SectionTitle';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Program card component for this specific page
const ProgramDetailCard = ({ 
  title, 
  description, 
  image, 
  icon: Icon,
  benefits,
  className = "" 
}: { 
  title: string; 
  description: string; 
  image: string;
  icon: React.ElementType;
  benefits: string[];
  className?: string; 
}) => {
  return (
    <div className={`bg-fitness-darkGray rounded-lg overflow-hidden shadow-lg hover:shadow-red-900/20 transition-all duration-300 ${className}`}>
      <div className="h-56 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-fitness-red/20 p-2 rounded-full">
            <Icon className="text-fitness-red h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-300 mb-4">{description}</p>
        
        <h4 className="text-white font-semibold mb-2">Key Benefits:</h4>
        <ul className="text-gray-400 space-y-1 mb-5">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <span className="text-fitness-red mr-2">•</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        
        <Link to="/membership">
          <Button className="w-full bg-fitness-red hover:bg-red-700 mt-2">
            Join This Program
          </Button>
        </Link>
      </div>
    </div>
  );
};

const ProgramsPage = () => {
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
            src="https://images.unsplash.com/photo-1517130038641-a774d04afb3c?q=80&w=2070&auto=format&fit=crop" 
            alt="Programs Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75"></div>
        </div>
        
        {/* Content */}
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              FIND YOUR <span className="text-fitness-red">STRENGTH</span>
              <br />WITH OUR SPECIALIZED PROGRAMS
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
              Discover the perfect fitness program designed to transform your body and elevate your mindset.
            </p>
            <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Link to="/membership">
                <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold text-lg py-6 px-8">
                  Explore Memberships <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid Section */}
      <section className="bg-fitness-black py-20">
        <div className="container-custom">
          <SectionTitle 
            title="What We Offer" 
            subtitle="Our comprehensive range of fitness programs are designed to cater to every fitness goal, experience level, and personal preference."
            center={true}
            className="animate-on-scroll mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProgramDetailCard
              title="Personal Training"
              description="One-on-one coaching tailored specifically to your unique goals, fitness level, and preferences."
              image="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop"
              icon={Users}
              benefits={[
                "Customized workout plans",
                "Expert technique guidance",
                "Regular progress assessments",
                "Nutrition advice"
              ]}
              className="animate-on-scroll"
            />
            
            <ProgramDetailCard
              title="Group Classes"
              description="High-energy group workouts that combine fun, community, and results-driven exercises."
              image="https://images.unsplash.com/photo-1571945227444-5156a58ec50a?q=80&w=2070&auto=format&fit=crop"
              icon={Zap}
              benefits={[
                "HIIT, Spin, Zumba & CrossFit",
                "Motivation from peers",
                "Scheduled sessions to keep you accountable",
                "Varied workout styles"
              ]}
              className="animate-on-scroll"
            />
            
            <ProgramDetailCard
              title="Functional Training"
              description="Build practical strength for everyday movements with exercises that mimic real-life activities."
              image="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop"
              icon={Dumbbell}
              benefits={[
                "Improved daily movement patterns",
                "Reduced risk of injury",
                "Enhanced core strength",
                "Better balance and coordination"
              ]}
              className="animate-on-scroll"
            />
            
            <ProgramDetailCard
              title="Nutrition Coaching"
              description="Expert guidance on nutrition to complement your fitness routine and accelerate your results."
              image="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop"
              icon={Heart}
              benefits={[
                "Personalized meal planning",
                "Nutritional education",
                "Supplement recommendations",
                "Ongoing diet adjustments"
              ]}
              className="animate-on-scroll"
            />
            
            <ProgramDetailCard
              title="Women's Fitness"
              description="Programs designed specifically for women's unique fitness needs and goals."
              image="https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop"
              icon={Award}
              benefits={[
                "Focus on problem areas",
                "Prenatal and postnatal options",
                "Female trainers available",
                "Supportive community"
              ]}
              className="animate-on-scroll"
            />
            
            <ProgramDetailCard
              title="Senior Programs"
              description="Gentle, effective fitness routines designed to maintain mobility, strength, and balance for seniors."
              image="https://images.unsplash.com/photo-1532467411038-57680e3dc0f1?q=80&w=2048&auto=format&fit=crop"
              icon={Brain}
              benefits={[
                "Low-impact exercises",
                "Focus on mobility and balance",
                "Social atmosphere",
                "Medical considerations incorporated"
              ]}
              className="animate-on-scroll"
            />
          </div>
        </div>
      </section>

      {/* Program Philosophy Section */}
      <section className="py-20 bg-gradient-to-b from-fitness-black to-fitness-darkGray">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll order-2 lg:order-1">
              <SectionTitle 
                title="Our Training Philosophy" 
                subtitle="We believe fitness is not just about looking good—it's about feeling good, performing better, and living longer."
                center={false}
              />
              
              <p className="text-gray-300 mb-6">
                At HUBERT FITNESS, our approach to training is based on scientific principles and years of real-world experience. We understand that everyone's body is different, which is why our programs are adaptable to your unique needs.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="mt-1 bg-fitness-red/20 p-1 rounded-full mr-3">
                    <div className="bg-fitness-red rounded-full w-2 h-2"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Progressive Overload</h4>
                    <p className="text-gray-400">We gradually increase the weight, frequency, or number of repetitions in your workouts to continuously challenge your body.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="mt-1 bg-fitness-red/20 p-1 rounded-full mr-3">
                    <div className="bg-fitness-red rounded-full w-2 h-2"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Functional Movement</h4>
                    <p className="text-gray-400">Our focus is on exercises that improve your daily life, not just isolated muscles that look good in the mirror.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="mt-1 bg-fitness-red/20 p-1 rounded-full mr-3">
                    <div className="bg-fitness-red rounded-full w-2 h-2"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Holistic Approach</h4>
                    <p className="text-gray-400">We address all aspects of fitness including strength, endurance, flexibility, nutrition, and recovery.</p>
                  </div>
                </li>
              </ul>
              
              <Link to="/about">
                <Button className="bg-fitness-red hover:bg-red-700">
                  Learn More About Our Method <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="animate-on-scroll order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-fitness-red/20 rounded-lg"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-fitness-red/20 rounded-lg"></div>
                <img 
                  src="https://images.unsplash.com/photo-1616279969856-759f8111a008?q=80&w=2068&auto=format&fit=crop" 
                  alt="Trainer with client" 
                  className="rounded-lg w-full h-auto border-8 border-fitness-darkGray relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop" 
            alt="Fitness Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/70"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-on-scroll">
              READY TO <span className="text-fitness-red">TRANSFORM</span> YOUR BODY AND MIND?
            </h2>
            <p className="text-xl text-gray-300 mb-8 animate-on-scroll">
              Our expert trainers are ready to guide you through a customized fitness journey designed to help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-on-scroll">
              <Link to="/membership">
                <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold py-6 px-8">
                  Get Started Today
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 font-bold py-6 px-8">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* <Footer /> */}
    </>
  );
};

export default ProgramsPage;
