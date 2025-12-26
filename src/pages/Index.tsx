import { JourneyContainer } from "@/components/journey/JourneyContainer";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return <div className="min-h-screen bg-background section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 pt-12 md:pt-16 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 mb-6">
            <h1 className="text-foreground text-[clamp(1.5rem,4vw,2.4rem)] leading-tight">
              The Fractional Rate Simulator
            </h1>
            <Badge className="text-xs font-medium bg-accent text-accent-foreground">Beta</Badge>
          </div>
          
          {/* Journey description */}
          <div className="max-w-4xl mx-auto mb-8">
            <p className="body-text text-muted-foreground leading-relaxed">
              Leaving a full-time role requires a shift in mindset — from salary to value. We designed this three-stage simulator to guide you through the mechanics of that shift. From unseen business development time to the realities of utilization, this tool helps you navigate the hidden variables that define a sustainable practice, balancing your income goals with the reality of your time.
            </p>
          </div>
        </div>

        <JourneyContainer />
      </div>
    </div>;
};
export default Index;