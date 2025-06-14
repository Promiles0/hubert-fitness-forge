import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Users, Trophy, Star, Dumbbell, Heart, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const stats = [
    { number: "500+", label: "Active Members", icon: Users },
    { number: "50+", label: "Expert Trainers", icon: Dumbbell },
    { number: "100+", label: "Classes Weekly", icon: Clock },
    { number: "98%", label: "Success Rate", icon: Trophy },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Member since 2022",
      content: "FitLife transformed my life! The trainers are amazing and the community is so supportive.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Mike Chen",
      role: "Personal Training Client",
      content: "Best investment I've made for my health. Lost 30 pounds and gained so much confidence!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "Group Class Regular",
      content: "The variety of classes keeps me motivated. I look forward to my workouts every day!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const features = [
    {
      icon: Heart,
      title: "Personalized Training",
      description: "Get customized workout plans tailored to your specific goals and fitness level."
    },
    {
      icon: Users,
      title: "Group Classes",
      description: "Join energizing group sessions with like-minded fitness enthusiasts."
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Monitor your progress with our advanced tracking and analytics tools."
    }
  ];

  return (
    <div className="min-h-screen bg-fitness-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-fitness-black via-fitness-black/80 to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          }}
        />
        
        <div className="relative z-20 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Dumbbell className="h-12 w-12 text-fitness-red" />
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="text-fitness-red">Fit</span>Life
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your body, mind, and life with our world-class fitness programs and expert trainers
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button size="lg" className="bg-fitness-red hover:bg-red-700 text-lg px-8 py-4 group">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/programs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-fitness-black text-lg px-8 py-4">
                View Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-fitness-darkGray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-12 w-12 text-fitness-red mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose FitLife?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We provide everything you need to achieve your fitness goals in a supportive, motivating environment
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-fitness-darkGray border-gray-800 hover:border-fitness-red transition-colors">
                <CardContent className="p-8 text-center">
                  <feature.icon className="h-16 w-16 text-fitness-red mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-fitness-darkGray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Members Say</h2>
            <p className="text-xl text-gray-400">Real results from real people</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-fitness-black border-gray-800">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-fitness-red to-red-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Life?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of members who have already started their fitness journey with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-fitness-red text-lg px-8 py-4">
                Get Started Today
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" className="bg-white text-fitness-red hover:bg-gray-100 text-lg px-8 py-4">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
