import { JourneyContainer } from "@/components/journey/JourneyContainer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h1 className="text-foreground">
              Fractional Rate Calculator
            </h1>
          </div>
          
          {/* Journey description */}
          <div className="max-w-4xl mx-auto mb-8">
            <p className="body-text text-muted-foreground leading-relaxed">
              Discover what you're really worth as a fractional professional through our guided 4-stage journey. We'll start with your compensation, reveal the reality of billable time, fine-tune the details, and show you the path forward.
            </p>
          </div>
        </div>

        <JourneyContainer />
      </div>
    </div>
  );
};

export default Index;
