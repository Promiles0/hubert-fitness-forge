
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TrainerCard from "@/components/TrainerCard";
import LoadingSpinner from "@/components/LoadingSpinner";

const TrainersPage = () => {
  const { data: trainers, isLoading, error } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trainers:', error);
        throw error;
      }
      
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-fitness-black text-white flex items-center justify-center">
        <LoadingSpinner size={40} className="flex items-center justify-center" />
      </div>
    );
  }

  if (error) {
    console.error('TrainersPage error:', error);
    return (
      <div className="min-h-screen bg-fitness-black text-white flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            Error Loading Trainers
          </h3>
          <p className="text-gray-500 mb-4">
            {error instanceof Error ? error.message : 'Please try refreshing the page'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-fitness-red hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fitness-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Meet Our Trainers
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Our certified fitness professionals are here to guide you on your journey to better health and fitness. 
            Each trainer brings unique expertise and passion to help you achieve your goals.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers && trainers.length > 0 ? (
            trainers.map((trainer) => {
              const fullName = `${trainer.first_name} ${trainer.last_name}`;
              const specialtiesString = Array.isArray(trainer.specialties) 
                ? trainer.specialties.join(', ') 
                : 'General Fitness';
              const trainerImage = trainer.photo_url || 
                `https://api.dicebear.com/7.x/initials/svg?seed=${trainer.first_name}${trainer.last_name}`;
              const trainerBio = trainer.bio || 
                'Professional fitness trainer dedicated to helping you reach your goals with personalized training programs and expert guidance.';

              return (
                <TrainerCard
                  key={trainer.id}
                  name={fullName}
                  role={specialtiesString}
                  image={trainerImage}
                  bio={trainerBio}
                  socialMedia={trainer.social_links as any}
                  trainer={{
                    experience_years: trainer.experience_years,
                    certifications: trainer.certifications,
                    hourly_rate: trainer.hourly_rate,
                    availability: trainer.availability
                  }}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-semibold text-gray-400 mb-4">
                  No Active Trainers Found
                </h3>
                <p className="text-gray-500 mb-6">
                  We're currently updating our trainer profiles. Check back soon for our amazing team of fitness professionals!
                </p>
                <div className="w-16 h-1 bg-fitness-red mx-auto rounded"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainersPage;
