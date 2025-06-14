
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TrainerCard from "@/components/TrainerCard";
import LoadingSpinner from "@/components/LoadingSpinner";

const TrainersPage = () => {
  const { data: trainers, isLoading, error } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      console.log('Public TrainersPage: Fetching trainers...');
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Public TrainersPage: Error fetching trainers:', error);
        throw error;
      }
      
      console.log('Public TrainersPage: Trainers fetched:', data);
      console.log('Public TrainersPage: Number of active trainers:', data?.length || 0);
      return data;
    },
  });

  console.log('Public TrainersPage render:', { trainers, isLoading, error });

  if (isLoading) {
    console.log('Public TrainersPage: Showing loading spinner');
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  if (error) {
    console.error('Public TrainersPage: Query error:', error);
    return (
      <div className="min-h-screen bg-fitness-black text-white flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            Error Loading Trainers
          </h3>
          <p className="text-gray-500">
            Please try refreshing the page
          </p>
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

        {/* Debug Information */}
        <div className="bg-fitness-darkGray p-4 rounded-lg mb-8 text-sm">
          <p className="text-white">Public TrainersPage Debug Info:</p>
          <p className="text-gray-300">- Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p className="text-gray-300">- Total Active Trainers: {trainers?.length || 0}</p>
          <p className="text-gray-300">- Has Error: {error ? 'Yes' : 'No'}</p>
          <p className="text-gray-300">- Trainers Data: {JSON.stringify(trainers?.map(t => ({ id: t.id, name: `${t.first_name} ${t.last_name}`, active: t.is_active })) || [])}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers && trainers.length > 0 ? (
            trainers.map((trainer) => {
              console.log('Rendering trainer:', trainer);
              return (
                <TrainerCard
                  key={trainer.id}
                  name={`${trainer.first_name} ${trainer.last_name}`}
                  role={trainer.specialties?.join(', ') || 'Personal Trainer'}
                  image={trainer.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trainer.first_name}${trainer.last_name}`}
                  bio={trainer.bio || 'Professional fitness trainer dedicated to helping you reach your goals.'}
                />
              );
            })
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
