import { JourneyContainer } from "@/components/journey/JourneyContainer";
const Index = () => {
  return <div className="min-h-screen bg-background section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 pt-12 md:pt-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h1 className="text-foreground">
              The Fractional Rate Simulator
            </h1>
          </div>
          
          {/* Journey description */}
          <div className="max-w-4xl mx-auto mb-8">
            <p className="body-text text-muted-foreground leading-relaxed">
              Explore options for pricing your time, either explicitly or as part of a value-priced service package. 
We've designed the Fractional Rate Simulator as a guided, four-stage journey to help you understand the moving pieces that define a sustainable fractional practice. The goal isn't to give you a final number, but to provide insights into the factors that impact your pricing and earnings.
            </p>
          </div>
        </div>

        <JourneyContainer />
      </div>
    </div>;
};
export default Index;