import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Target, Users, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";

const About = () => {
  const values = [
    {
      icon: Eye,
      title: "Transparency",
      description: "Clear communication and honest pricing with no hidden costs or surprises.",
    },
    {
      icon: TrendingUp,
      title: "Efficiency",
      description: "Streamlined processes that deliver results faster and more effectively.",
    },
    {
      icon: Users,
      title: "Professionalism",
      description: "Maintaining the highest standards in every interaction and service delivery.",
    },
    {
      icon: Target,
      title: "Continuous Learning",
      description: "Staying ahead of industry trends to provide cutting-edge solutions.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
            About Open Door Professionals
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Your trusted partner in building exceptional teams and streamlined business operations in the Philippines.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            To revolutionize outsourcing by providing transparent, efficient, and results-driven HR, 
            BPO, and business solutions that empower companies to scale confidently while maintaining 
            the highest standards of quality and professionalism.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="mb-6 leading-relaxed">
              Open Door Professionals was founded with a clear vision: to solve the inefficiencies 
              and lack of transparency that plague the outsourcing industry. We witnessed too many 
              businesses struggle with hidden costs, poor communication, and subpar results from 
              their outsourcing partners.
            </p>
            <p className="mb-6 leading-relaxed">
              Our approach is different. We believe in building genuine partnerships based on trust, 
              transparency, and measurable results. Every client receives dedicated attention, clear 
              pricing, and access to top-tier talent that's been rigorously trained and vetted.
            </p>
            <p className="leading-relaxed">
              Today, we're proud to serve businesses across various industries, helping them scale 
              their operations efficiently while maintaining the quality standards they demand. 
              Our commitment to excellence and continuous improvement drives everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide every decision we make and every service we deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed flex-grow">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Partner with a team that puts your success first
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the difference that transparency, expertise, and dedication can make for your business.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link to="/contact">Let's Talk</Link>
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
    </div>
  );
};

export default About;