import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, GraduationCap, Building, Bot, Calendar, FileText, Settings, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import BookingDialog from "@/components/BookingDialog";

const Services = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          // Add highlight effect
          element.classList.add('ring-2', 'ring-primary', 'ring-opacity-50');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-primary', 'ring-opacity-50');
          }, 2000);
        }, 100);
      }
    }
  }, [location.hash]);

  const services = [
    {
      id: "hr-staffing",
      icon: Users,
      title: "HR and Staffing",
      description: "Complete recruitment and human resource management solutions. From talent acquisition to performance management, we handle your HR needs end-to-end.",
      features: [
        "Talent acquisition and recruitment",
        "HR policy development",
        "Employee onboarding and training",
        "Performance management systems",
        "Payroll and benefits administration"
      ],
      ctaText: "Schedule a Discovery Call",
      ctaIcon: Calendar
    },
    {
      id: "bpo-training",
      icon: GraduationCap,
      title: "BPO Staff Training",
      description: "Comprehensive training programs designed to elevate your team's performance and ensure consistent, high-quality service delivery.",
      features: [
        "Customer service excellence training",
        "Technical skills development",
        "Communication and soft skills",
        "Quality assurance programs",
        "Ongoing professional development"
      ],
      ctaText: "See Training Options",
      ctaIcon: FileText
    },
    {
      id: "company-setup",
      icon: Building,
      title: "Company Establishment in PH",
      description: "Navigate the complexities of setting up your business in the Philippines with our expert guidance and comprehensive support.",
      features: [
        "Business registration and licensing",
        "Legal compliance consulting",
        "Office setup and location assistance",
        "Banking and financial setup",
        "Government permits and documentation"
      ],
      ctaText: "Start Company Setup",
      ctaIcon: Settings
    },
    {
      id: "ai-integration",
      icon: Bot,
      title: "AI Integration",
      description: "Transform your operations with intelligent automation and AI-powered solutions designed to boost efficiency and reduce costs.",
      features: [
        "Process automation consulting",
        "AI tool selection and implementation",
        "Custom workflow optimization",
        "Staff training on AI tools",
        "Performance monitoring and optimization"
      ],
      ctaText: "Book a Free AI Audit",
      ctaIcon: Zap
    }
  ];

  const handleBookingClick = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Our Services Are Built to Help You <span className="text-primary">Grow</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            From staffing to AI integration, we provide the complete toolkit for modern business success.
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} id={service.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm scroll-mt-24">
                <CardContent className="p-8">
                  {/* Icon and Title */}
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Key Features</h4>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start group/item">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 mr-3 flex-shrink-0 group-hover/item:scale-125 transition-transform"></div>
                          <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* CTA Button */}
                  <Button 
                    onClick={() => handleBookingClick(service.title)}
                    className="w-full group-hover:bg-primary group-hover:shadow-lg transition-all duration-300" 
                    size="lg"
                    variant="outline"
                  >
                    <service.ctaIcon className="w-4 h-4 mr-2" />
                    {service.ctaText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Let's Build Your Future Team Together
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Ready to take the next step? Our team of experts is here to help you choose the right solutions 
            and create a customized plan for your business growth.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link to="/contact">Contact Our Experts</Link>
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

export default Services;