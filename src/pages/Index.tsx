import { JourneyContainer } from "@/components/journey/JourneyContainer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h1 className="text-foreground">
              Guided Fractional Rate Calculator: The 4-Stage Journey
            </h1>
          </div>
          
          {/* Journey description */}
          <div className="max-w-4xl mx-auto mb-8">
            <p className="body-text text-muted-foreground leading-relaxed">
              Stop guessing what to charge. This powerful calculator is reframed as a guided, four-stage journey that converts your full-time compensation into a defensible fractional billing rate. We start with your total earnings, reveal the hidden costs of utilization, fine-tune for your local market and lifestyle, and empower you with the exact, strategic rate you need to succeed.
            </p>
          </div>
        </div>

        <JourneyContainer />
      </div>
    </div>
  );
};

export default Index;
