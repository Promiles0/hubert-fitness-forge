
import SectionTitle from '@/components/SectionTitle';

const AboutPage = () => {
  return (
    <div className="pt-20"> {/* Adding padding for the fixed navbar */}
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1570829460005-c840387bb1ca?q=80&w=2070&auto=format&fit=crop" 
            alt="About Us" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ABOUT <span className="text-fitness-red">HUBERT</span> FITNESS
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Building strength, community, and transforming lives since 2015.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-fitness-black py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <SectionTitle 
                title="Our Story" 
                subtitle="From a small local gym to a premium fitness destination."
                center={false}
              />
              <p className="text-gray-400 mb-6">
                HUBERT FITNESS was founded in 2015 by Michael Hubert, a former professional athlete with a passion for helping others achieve their fitness goals. What began as a small training space with a handful of dedicated members has grown into a premier fitness destination.
              </p>
              <p className="text-gray-400">
                Our journey has been driven by a simple mission: to create a fitness community where people of all levels feel welcome, supported, and empowered to transform their lives through physical training and mental discipline.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?q=80&w=2069&auto=format&fit=crop" 
                alt="Our Story" 
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1571388208497-71bedc66e932?q=80&w=2072&auto=format&fit=crop" 
                alt="Our Mission" 
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div className="order-1 lg:order-2">
              <SectionTitle 
                title="Our Mission" 
                subtitle="More than just a gym – we're building a fitness movement."
                center={false}
              />
              <p className="text-gray-400 mb-6">
                At HUBERT FITNESS, we believe that fitness is not just about physical transformation—it's about building discipline, confidence, and a healthier lifestyle that extends beyond the gym walls.
              </p>
              <p className="text-gray-400">
                Our mission is to empower individuals to discover their strength, both physically and mentally, through expert guidance, supportive community, and innovative training methods. We're committed to making premium fitness accessible to everyone who's ready to commit to their transformation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle 
                title="Our Values" 
                subtitle="The core principles that guide everything we do."
                center={false}
              />
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Excellence</h3>
                  <p className="text-gray-400">
                    We strive for excellence in everything from our facility and equipment to our training programs and customer service.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Community</h3>
                  <p className="text-gray-400">
                    We foster a supportive, inclusive environment where members motivate each other and celebrate achievements together.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Innovation</h3>
                  <p className="text-gray-400">
                    We continuously seek out the most effective training methods and technologies to help our members achieve results.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Integrity</h3>
                  <p className="text-gray-400">
                    We operate with honesty and transparency in all aspects of our business, building trust with our members.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=2071&auto=format&fit=crop" 
                alt="Our Values" 
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Facility Section */}
      <section className="bg-gradient-to-b from-fitness-black to-fitness-darkGray py-16 md:py-24">
        <div className="container-custom">
          <SectionTitle 
            title="Our Facility" 
            subtitle="Experience a premium fitness environment designed for results."
            center={true}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop" 
                alt="Weight Area" 
                className="rounded-lg w-full h-64 object-cover mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Strength Zone</h3>
              <p className="text-gray-400">
                Our comprehensive strength area features free weights, machines, and functional training equipment for all levels.
              </p>
            </div>
            
            <div>
              <img 
                src="https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=2067&auto=format&fit=crop" 
                alt="Cardio Area" 
                className="rounded-lg w-full h-64 object-cover mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Cardio Deck</h3>
              <p className="text-gray-400">
                State-of-the-art cardio machines equipped with entertainment systems to keep your workouts engaging.
              </p>
            </div>
            
            <div>
              <img 
                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075&auto=format&fit=crop" 
                alt="Group Fitness" 
                className="rounded-lg w-full h-64 object-cover mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Group Studios</h3>
              <p className="text-gray-400">
                Dedicated spaces for our variety of group classes, from high-intensity training to mind-body practices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
