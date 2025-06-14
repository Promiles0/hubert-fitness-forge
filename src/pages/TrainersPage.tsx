
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TrainerCard from "@/components/TrainerCard";
import LoadingSpinner from "@/components/LoadingSpinner";

const TrainersPage = () => {
  const { data: trainers, isLoading, error } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      console.log('Fetching trainers from Supabase...');
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trainers:', error);
        throw error;
      }
      
      console.log('Trainers fetched successfully:', data);
      return data;
    },
  });

  console.log('TrainersPage render state:', { 
    trainers, 
    isLoading, 
    error,
    trainersCount: trainers?.length || 0
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Trainers</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Our certified fitness professionals are here to help you achieve your goals
          </p>
        </div>

        {/* Debug info - remove in production */}
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Debug Info:</h3>
          <p className="text-xs text-gray-300">
            Trainers loaded: {trainers?.length || 0} | 
            Loading: {isLoading ? 'Yes' : 'No'} | 
            Error: {error ? 'Yes' : 'No'}
          </p>
          {trainers && trainers.length > 0 && (
            <p className="text-xs text-gray-300 mt-1">
              Sample trainer: {trainers[0].first_name} {trainers[0].last_name}
            </p>
          )}
        </div>

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
                'Professional fitness trainer dedicated to helping you reach your goals.';

              return (
                <TrainerCard
                  key={trainer.id}
                  name={fullName}
                  role={specialtiesString}
                  image={trainerImage}
                  bio={trainerBio}
                  socialMedia={trainer.social_links as any}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Trainers Available
              </h3>
              <p className="text-gray-500">
                We're currently updating our trainer profiles. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainersPage;
