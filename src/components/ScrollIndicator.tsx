
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hide the indicator when user scrolls down a bit
      if (window.scrollY > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };

  if (!isVisible || isMobile) return null;

  return (
    <div 
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce" 
      onClick={scrollToContent}
    >
      <div className="flex flex-col items-center text-white">
        <span className="text-sm mb-2">Scroll Down</span>
        <ChevronDown size={24} className="text-fitness-red" />
      </div>
    </div>
  );
};

export default ScrollIndicator;
