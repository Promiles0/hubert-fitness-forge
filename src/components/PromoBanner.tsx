
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const PromoBanner = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) return null;
  
  return (
    <div className="bg-gradient-to-r from-fitness-red to-red-700 py-3 px-4 text-white">
      <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <span className="bg-white text-fitness-red text-xs font-bold uppercase px-2 py-1 rounded mr-3">
            New
          </span>
          <span className="font-medium">
            Try your first class free! No commitment required.
          </span>
        </div>
        <Button 
          variant="outline" 
          className="bg-white text-fitness-red border-0 hover:bg-gray-100 whitespace-nowrap"
          onClick={() => window.location.href = "/signup"}
        >
          Claim Offer
        </Button>
      </div>
    </div>
  );
};

export default PromoBanner;
