
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TrainerCard from "@/components/TrainerCard";
import LoadingSpinner from "@/components/LoadingSpinner";

const TrainersPage = () => {
  const { data: trainers, isLoading } = useQuery({
    queryKey: ['trainers-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .eq('is_active', true)
        .order('created_at');

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers && trainers.length > 0 ? (
            trainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                name={`${trainer.first_name} ${trainer.last_name}`}
                role={trainer.specialties.join(', ')}
                image={trainer.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trainer.first_name}${trainer.last_name}`}
                bio={trainer.bio || 'Professional fitness trainer dedicated to helping you reach your goals.'}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Trainers Available
              </h3>
              <p className="text-gray-500">
                Check back soon for our amazing team of trainers!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainersPage;
