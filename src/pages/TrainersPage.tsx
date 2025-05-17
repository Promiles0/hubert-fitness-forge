
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Facebook, Twitter, Linkedin, CalendarPlus, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/SectionTitle';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface TrainerProps {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experience: string;
  image: string;
  bio: string;
  certifications: string[];
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

const TrainerProfile = ({ trainer }: { trainer: TrainerProps }) => {
  return (
    <div className="bg-fitness-darkGray rounded-lg overflow-hidden shadow-lg hover:shadow-red-900/10 transition duration-300">
      <div className="h-80 overflow-hidden">
        <img 
          src={trainer.image} 
          alt={trainer.name} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-1">{trainer.name}</h3>
        <h4 className="text-fitness-red font-medium mb-3">{trainer.title}</h4>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-fitness-red/10 rounded-full p-1.5">
            <Award className="h-4 w-4 text-fitness-red" />
          </div>
          <span className="text-gray-300 text-sm">{trainer.specialty}</span>
        </div>
        
        <p className="text-gray-400 mb-5 line-clamp-3">{trainer.bio}</p>
        
        <div className="mb-5">
          <h5 className="text-white text-sm font-semibold mb-2">Certifications:</h5>
          <ul className="text-gray-400 text-sm space-y-1">
            {trainer.certifications.map((cert, index) => (
              <li key={index} className="flex items-start">
                <span className="text-fitness-red mr-2">•</span>
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            {trainer.socialMedia.instagram && (
              <a 
                href={trainer.socialMedia.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-fitness-darkGray hover:bg-fitness-red/10 text-gray-400 hover:text-fitness-red p-2 rounded-full transition-colors"
              >
                <Instagram size={18} />
              </a>
            )}
            {trainer.socialMedia.facebook && (
              <a 
                href={trainer.socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-fitness-darkGray hover:bg-fitness-red/10 text-gray-400 hover:text-fitness-red p-2 rounded-full transition-colors"
              >
                <Facebook size={18} />
              </a>
            )}
            {trainer.socialMedia.twitter && (
              <a 
                href={trainer.socialMedia.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-fitness-darkGray hover:bg-fitness-red/10 text-gray-400 hover:text-fitness-red p-2 rounded-full transition-colors"
              >
                <Twitter size={18} />
              </a>
            )}
            {trainer.socialMedia.linkedin && (
              <a 
                href={trainer.socialMedia.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-fitness-darkGray hover:bg-fitness-red/10 text-gray-400 hover:text-fitness-red p-2 rounded-full transition-colors"
              >
                <Linkedin size={18} />
              </a>
            )}
          </div>
          
          <Link to="/contact">
            <Button className="bg-fitness-red hover:bg-red-700 flex items-center gap-2">
              <CalendarPlus className="h-4 w-4" />
              Book Session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const TrainersPage = () => {
  const trainers: TrainerProps[] = [
    {
      id: "1",
      name: "Alex Johnson",
      title: "Head Strength Coach",
      specialty: "Strength Training & Powerlifting",
      experience: "10+ Years",
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop",
      bio: "Alex specializes in strength training with over a decade of experience helping clients build muscle, increase power, and transform their physiques. His approach combines traditional strength methodologies with modern sports science.",
      certifications: [
        "NSCA Certified Strength & Conditioning Specialist",
        "NASM Performance Enhancement Specialist",
        "CPR/AED Certified"
      ],
      socialMedia: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      id: "2",
      name: "Sarah Martinez",
      title: "HIIT & Cardio Specialist",
      specialty: "High-Intensity Interval Training",
      experience: "7 Years",
      image: "https://images.unsplash.com/photo-1609899066399-0aba93c8c6e3?q=80&w=1974&auto=format&fit=crop",
      bio: "Sarah is passionate about high-intensity workouts that push you to your limits and help you burn maximum calories. Her energetic training style keeps clients motivated while achieving rapid results.",
      certifications: [
        "ACE Certified Personal Trainer",
        "Precision Nutrition Level 1",
        "TRX Suspension Training Specialist"
      ],
      socialMedia: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        twitter: "https://twitter.com"
      }
    },
    {
      id: "3",
      name: "Michael Chen",
      title: "Yoga & Flexibility Coach",
      specialty: "Yoga & Functional Movement",
      experience: "9 Years",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1974&auto=format&fit=crop",
      bio: "Michael brings mindfulness to fitness, focusing on mobility, flexibility and mental wellbeing through yoga practices. His holistic approach helps clients improve not just physical health but overall wellness.",
      certifications: [
        "500hr Registered Yoga Teacher (RYT)",
        "FRC Mobility Specialist",
        "Mindfulness-Based Stress Reduction Certified"
      ],
      socialMedia: {
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      id: "4",
      name: "Jasmine Williams",
      title: "Nutrition Coach",
      specialty: "Weight Management & Nutrition",
      experience: "6 Years",
      image: "https://images.unsplash.com/photo-1526735252118-6c21f64e4fda?ixlib=rb-1.2.1&auto=format&fit=crop&w=1974&q=80",
      bio: "Jasmine specializes in creating sustainable nutrition plans that complement your fitness routine. Her evidence-based approach helps clients develop healthy relationships with food while achieving their body composition goals.",
      certifications: [
        "Precision Nutrition Level 2 Coach",
        "ISSN Sports Nutrition Specialist",
        "Weight Management Specialist"
      ],
      socialMedia: {
        instagram: "https://instagram.com",
        twitter: "https://twitter.com",
        facebook: "https://facebook.com"
      }
    },
    {
      id: "5",
      name: "David Thompson",
      title: "Senior Fitness Specialist",
      specialty: "Senior Fitness & Rehabilitation",
      experience: "15 Years",
      image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1974&q=80",
      bio: "David focuses on helping older adults maintain mobility, independence, and quality of life through appropriate exercise. His gentle approach ensures safety while delivering maximum benefits for seniors.",
      certifications: [
        "ACSM Exercise Physiologist",
        "ACE Senior Fitness Specialist",
        "Post-Rehab Exercise Specialist"
      ],
      socialMedia: {
        facebook: "https://facebook.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      id: "6",
      name: "Emma Rodriguez",
      title: "CrossFit & Functional Training",
      specialty: "CrossFit & Olympic Lifting",
      experience: "8 Years",
      image: "https://images.unsplash.com/photo-1534368786749-d60a6e0b62e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1974&q=80",
      bio: "Emma specializes in high-intensity CrossFit training and Olympic lifting techniques. Her coaching focuses on proper form, progressive intensity, and competitive motivation to help you surpass your limits.",
      certifications: [
        "CrossFit Level 3 Trainer",
        "USA Weightlifting Level 2",
        "Kettlebell Specialist"
      ],
      socialMedia: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com"
      }
    }
  ];

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
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?q=80&w=2072&auto=format&fit=crop" 
            alt="Trainers Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75"></div>
        </div>
        
        {/* Content */}
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              THE EXPERTS BEHIND YOUR <span className="text-fitness-red">TRANSFORMATION</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
              Meet our team of certified professionals dedicated to helping you achieve your fitness goals.
            </p>
          </div>
        </div>
      </section>

      {/* Team Philosophy Section */}
      <section className="bg-fitness-black py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll">
              <SectionTitle 
                title="Our Team Philosophy" 
                subtitle="At HUBERT FITNESS, our trainers share a common goal: to empower you through expert guidance, motivation, and education."
                center={false}
              />
              
              <p className="text-gray-300 mb-6">
                Our training team brings together diverse specialties and backgrounds, but we all share the same passion: helping our clients transform their lives through fitness. We believe that with the right guidance, anyone can achieve their health and fitness goals.
              </p>
              
              <p className="text-gray-300 mb-6">
                Each of our trainers undergoes continuous education and maintains certifications in their area of expertise, ensuring you receive the most effective, science-based training available.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="mt-1 bg-fitness-red/20 p-1 rounded-full mr-3">
                    <div className="bg-fitness-red rounded-full w-2 h-2"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Expert Knowledge</h4>
                    <p className="text-gray-400">All our trainers hold multiple industry-recognized certifications and continue to expand their knowledge.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="mt-1 bg-fitness-red/20 p-1 rounded-full mr-3">
                    <div className="bg-fitness-red rounded-full w-2 h-2"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Client-Centered Approach</h4>
                    <p className="text-gray-400">We focus on your unique needs, adapting our methods to your body, goals, and preferences.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="mt-1 bg-fitness-red/20 p-1 rounded-full mr-3">
                    <div className="bg-fitness-red rounded-full w-2 h-2"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Results-Driven Methods</h4>
                    <p className="text-gray-400">We implement proven techniques and track your progress to ensure you achieve measurable results.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="animate-on-scroll grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1559351230-9e2014b6ca0a?q=80&w=2070&auto=format&fit=crop" 
                  alt="Trainer with client" 
                  className="rounded-lg w-full h-auto transform translate-y-8"
                />
                <img 
                  src="https://images.unsplash.com/photo-1598136490929-292a0a7890c2?q=80&w=2069&auto=format&fit=crop" 
                  alt="Group training" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1613685703305-cd9a6320c331?q=80&w=2070&auto=format&fit=crop" 
                  alt="Personal trainer" 
                  className="rounded-lg w-full h-auto"
                />
                <img 
                  src="https://images.unsplash.com/photo-1521805103424-d8f8430e8933?q=80&w=2070&auto=format&fit=crop" 
                  alt="Yoga instructor" 
                  className="rounded-lg w-full h-auto transform translate-y-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trainers Grid Section */}
      <section className="bg-gradient-to-b from-fitness-black to-fitness-darkGray py-20">
        <div className="container-custom">
          <SectionTitle 
            title="Meet Our Team" 
            subtitle="Our diverse team of fitness professionals is here to guide you on your fitness journey."
            center={true}
            className="animate-on-scroll mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <div key={trainer.id} className="animate-on-scroll" style={index > 0 ? {animationDelay: `${index * 0.1}s`} : undefined}>
                <TrainerProfile trainer={trainer} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1508215885192-0eb3e35c777b?q=80&w=2067&auto=format&fit=crop" 
            alt="Fitness Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/80"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-on-scroll">
              START TRAINING WITH THE <span className="text-fitness-red">BEST</span> TODAY
            </h2>
            <p className="text-xl text-gray-300 mb-8 animate-on-scroll">
              Book a session with one of our expert trainers and take the first step towards achieving your fitness goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll">
              <Link to="/contact">
                <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold py-6 px-8">
                  Book a Session <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/membership">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 font-bold py-6 px-8">
                  View Membership Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default TrainersPage;
