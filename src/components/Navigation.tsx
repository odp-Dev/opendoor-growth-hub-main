import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const serviceItems = [
    { name: "HR Management", path: "/services#hr-staffing", description: "Comprehensive HR solutions" },
    { name: "BPO Staff Training", path: "/services#bpo-training", description: "Professional training programs" },
    { name: "Company Setup", path: "/services#company-setup", description: "Business establishment services" },
    { name: "AI Consulting", path: "/services#ai-integration", description: "AI-powered business solutions" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <img 
                src="/lovable-uploads/95efd69c-fcf4-49ae-83f4-13af0308779b.png" 
                alt="Open Door Professionals" 
                className="h-16 w-auto transition-transform duration-200 group-hover:scale-105" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isActive(item.path)
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 outline-none">
                  Services
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-background/95 backdrop-blur border border-border shadow-lg">
                  {serviceItems.map((service) => (
                    <DropdownMenuItem key={service.name} asChild>
                      <Link
                        to={service.path}
                        className="flex flex-col items-start p-3 hover:bg-secondary/80 transition-colors cursor-pointer"
                      >
                        <span className="font-medium text-foreground">{service.name}</span>
                        <span className="text-xs text-muted-foreground mt-1">{service.description}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* CTA Button with enhanced styling */}
          <div className="hidden md:block">
            <Button asChild size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 hover:scale-105 shadow-lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors duration-200 hover:bg-secondary/50 rounded-md"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur border-b border-border">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-base font-medium transition-colors rounded-md ${
                  isActive(item.path)
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-primary hover:bg-secondary"
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Services Menu */}
            <div className="px-3 py-2">
              <div className="text-sm font-medium text-muted-foreground mb-2">Services</div>
              {serviceItems.map((service) => (
                <Link
                  key={service.name}
                  to={service.path}
                  onClick={() => setIsOpen(false)}
                  className="block pl-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {service.name}
                </Link>
              ))}
            </div>
            
            <div className="px-3 py-2">
              <Button asChild size="sm" className="w-full bg-gradient-to-r from-primary to-primary/80">
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;