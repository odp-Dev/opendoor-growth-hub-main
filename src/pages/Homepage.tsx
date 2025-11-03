import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, GraduationCap, Building, Bot, CheckCircle, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ServiceCard from "@/components/ServiceCard";
import Navigation from "@/components/Navigation";
import BookingDialog from "@/components/BookingDialog";

const Homepage = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const services = [
    {
      icon: Users,
      title: "HR & Staffing",
      description: "Expert recruitment and HR management solutions tailored for your business needs.",
    },
    {
      icon: GraduationCap,
      title: "BPO Staff Training",
      description: "Comprehensive training programs to ensure your team delivers exceptional results.",
    },
    {
      icon: Building,
      title: "Company Setup",
      description: "Complete assistance in establishing your business presence in the Philippines.",
    },
    {
      icon: Bot,
      title: "AI Tool Integration",
      description: "Streamline operations with cutting-edge AI solutions and automation tools.",
    },
  ];

  const advantages = [
    {
      icon: CheckCircle,
      title: "Transparent Pricing",
      description: "Clear, upfront costs with no hidden fees or surprises.",
    },
    {
      icon: Globe,
      title: "Local Expertise, Global Standards",
      description: "Deep Philippine market knowledge with international quality standards.",
    },
    {
      icon: Award,
      title: "Focus on Retention & Quality",
      description: "We prioritize long-term success and sustainable team growth.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-secondary/30">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            End-to-End HR, Staffing, and BPO Solutions 
            <span className="text-primary"> in the Philippines</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Empowering businesses local and global with expertly managed teams, 
            streamlined operations, and intelligent workforce solutions.
          </p>
          <Button 
            onClick={() => {
              setSelectedService("Free Consultation");
              setIsBookingOpen(true);
            }}
            size="lg" 
            className="text-lg px-8 py-3"
          >
            Book a Free Consultation
          </Button>
        </div>
      </section>

      {/* Core Services Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Core Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions designed to scale your business efficiently and effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/services">Explore Our Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Open Door Professionals?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine local expertise with global standards to deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <advantage.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {advantage.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {advantage.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to scale your team with confidence?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that trust us to build and manage their success teams.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link to="/contact">Get in Touch Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-navy-foreground py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg font-semibold mb-2">Open Door Professionals</p>
          <p className="text-sm opacity-90">
            Your trusted partner for HR, BPO, and business solutions in the Philippines.
          </p>
        </div>
      </footer>

      {/* Booking Dialog */}
      <BookingDialog
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        serviceType={selectedService}
      />
    </div>
  );
};

export default Homepage;