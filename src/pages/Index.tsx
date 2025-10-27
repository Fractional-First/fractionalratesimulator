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
          
          {/* Narrative explanation */}
          <div className="max-w-4xl mx-auto mb-8">
            <p className="body-text text-muted-foreground leading-relaxed">
              This calculator helps you determine your Equivalent Full-Time Rate as a fractional professional. Enter your target full-time compensation to see your apples-to-apples <strong>Effective Rate</strong>, then refine with utilization inputs to calculate the final <strong>Billing Rate</strong> needed to achieve that target.
            </p>
            
            {/* Disclaimer */}
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                ⚠️ Garbage In, Garbage Out: This calculator's accuracy depends entirely on the quality of your inputs. Be realistic with your assumptions for meaningful results.
              </p>
            </div>
          </div>
        </div>

        <JourneyContainer />
      </div>
    </div>
  );
};

export default Index;
