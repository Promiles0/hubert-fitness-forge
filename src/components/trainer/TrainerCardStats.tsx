
interface TrainerCardStatsProps {
  experienceYears: number;
  totalReviews: number;
}

const TrainerCardStats = ({ experienceYears, totalReviews }: TrainerCardStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-fitness-lightGray/20">
      <div className="text-center">
        <div className="text-fitness-red font-bold text-lg">{experienceYears}+</div>
        <div className="text-gray-400 text-xs uppercase tracking-wide">Years Exp</div>
      </div>
      <div className="text-center">
        <div className="text-fitness-red font-bold text-lg">{totalReviews}</div>
        <div className="text-gray-400 text-xs uppercase tracking-wide">Reviews</div>
      </div>
    </div>
  );
};

export default TrainerCardStats;
