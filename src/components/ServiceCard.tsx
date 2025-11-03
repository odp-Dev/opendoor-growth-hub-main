import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  ctaText = "Learn More",
  onCtaClick 
}: ServiceCardProps) => {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
        {onCtaClick && (
          <Button 
            variant="outline" 
            onClick={onCtaClick}
            className="w-full"
          >
            {ctaText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;