
import React from 'react';

interface ClassLevelBadgeProps {
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}

const ClassLevelBadge = ({ level }: ClassLevelBadgeProps) => {
  const getColorByLevel = () => {
    switch (level) {
      case 'Beginner':
        return 'bg-sky-500/10 text-sky-500';
      case 'Intermediate':
        return 'bg-amber-500/10 text-amber-500';
      case 'Advanced':
        return 'bg-fitness-red/10 text-fitness-red';
      case 'All Levels':
      default:
        return 'bg-emerald-500/10 text-emerald-500';
    }
  };

  return (
    <div className={`${getColorByLevel()} px-3 py-1 rounded-full text-xs font-semibold`}>
      {level}
    </div>
  );
};

export default ClassLevelBadge;
