import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Phone, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import BookingDialog from "@/components/BookingDialog";
import { supabase } from "@/integrations/supabase/client";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    newsletter: false
  });
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation to match server rules
    const trimmedMessage = formData.message.trim();
    if (trimmedMessage.length < 10) {
      toast({
        title: "Message too short",
        description: "Please enter at least 10 characters.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call the edge function to send emails
      const response = await fetch('/.netlify/functions/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...formData, message: trimmedMessage }),
});

const result = await response.json();
if (!response.ok) throw new Error(result.error || 'Failed to send message');
      toast({
        title: "Message Sent!",
        description: "We'll respond within 1 business day.",
      });

      // Reset form
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        message: "",
        newsletter: false,
      });
    } catch (error: any) {
      console.error('Error sending contact form:', error);
      const serverDetail = (error?.context as any)?.error || (error?.message ?? null);
      toast({
        title: "Error",
        description: serverDetail || "Failed to send message. Please ensure your message has at least 10 characters and try again.",
        variant: "destructive",
      });
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
            Get in Touch with Our Team
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            We'll respond within 1 business day.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" name="company" value={formData.company} onChange={handleInputChange} className="mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    minLength={10}
                    rows={6}
                    className="mt-1"
                    placeholder="Tell us about your project (minimum 10 characters)..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">Minimum 10 characters.</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" checked={formData.newsletter} onCheckedChange={checked => setFormData(prev => ({
                  ...prev,
                  newsletter: checked as boolean
                }))} />
                  <Label htmlFor="newsletter" className="text-sm">
                    Subscribe to our newsletter for industry insights and updates
                  </Label>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Submit Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
                    <p className="text-muted-foreground">
                      <a
                        href="mailto:Sales@opendoorpro.com"
                        aria-label="Email Open Door Professionals at Sales@opendoorpro.com"
                        className="hover:text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-sm"
                      >
                        Sales@opendoorpro.com
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      For general inquiries and support
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Phone</h3>
                    <p className="text-muted-foreground">+63 954 4950056</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monday to Friday, 9:00 AM - 6:00 PM (PHT)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Office Address</h3>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Open%20Door%20Professionals%2C%208th%20Floor%2C%20SHARVD%20The%20Valero%20Tower%2C%20Salcedo%20Village%2C%20Valero%2C%20Makati%20City%2C%201227%20Metro%20Manila"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open Open Door Professionals address in Google Maps"
                      className="text-muted-foreground hover:text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-sm"
                    >
                      Suite 8C The Valero Tower<br />
                      122 Valero St, Makati City<br />
                      Metro Manila, Philippines
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Ready to get started?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Schedule a free consultation to discuss your specific needs and how we can help grow your business.
                </p>
                <Button onClick={() => {
                setSelectedService("Free Consultation");
                setIsBookingOpen(true);
              }} variant="outline" className="w-full">
                  Book a Free Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
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
      <BookingDialog isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} serviceType={selectedService} />
    </div>;
};
export default Contact;