
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResultCard } from './ResultCard';
import { InfoTooltip } from './InfoTooltip';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AssumptionsAccordion } from './AssumptionsAccordion';
import { RiskToleranceSection } from './RiskToleranceSection';
import { UtilizationRateSection } from './UtilizationRateSection';
import { FullTimeToFractionalTab } from './FullTimeToFractionalTab';
import { FractionalToFullTimeTab } from './FractionalToFullTimeTab';
import { compute, formatCurrency, formatCurrencyDecimal, type Inputs } from '@/utils/calculator';
import { countryDefaults } from '@/utils/countryDefaults';
import { TrendingUp } from 'lucide-react';

export const FractionalRateCalculator: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [inputs, setInputs] = useState<Inputs>({
    baseSalary: 120000,
    annualBonus: 20000,
    annualEquityFmv: 15000,
    fractionalHourlyInput: 0,
    overheadPct: 0.25,
    hoursPerDay: 8,
    vacationDays: 15,
    publicHolidays: 10,
    otherLeaveDays: 10,
    trainingDays: 4,
    nonBillablePct: 0.40,
    riskTolerancePct: 0.50
  });
  const [results, setResults] = useState(compute(inputs));
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  useEffect(() => {
    setResults(compute(inputs));
  }, [inputs]);

  // Handle country change
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const defaults = countryDefaults[countryCode];
    if (defaults) {
      setInputs(prev => ({
        ...prev,
        overheadPct: defaults.overheadPct,
        vacationDays: defaults.vacationDays,
        publicHolidays: defaults.publicHolidays,
      }));
    }
  };

  const updateInput = (field: keyof Inputs) => (value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFractionalInput = () => {
    setInputs(prev => ({
      ...prev,
      fractionalHourlyInput: 0
    }));
  };

  const clearSalaryInputs = () => {
    setInputs(prev => ({
      ...prev,
      baseSalary: 0,
      annualBonus: 0,
      annualEquityFmv: 0
    }));
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background section-spacing">
        <div className="max-w-7xl mx-auto">
          {/* Header with Fractional First styling */}
          <div className="text-center mb-8 md:mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <h1 className="text-foreground">
                Fractional Rate Calculator
              </h1>
            </div>
            
            {/* Narrative explanation */}
            <div className="max-w-4xl mx-auto mb-8">
              <p className="body-text text-muted-foreground leading-relaxed">
                This calculator helps you translate between full-time and fractional compensation. Whether you're converting a full-time salary into equivalent hourly and daily rates for fractional work or estimating what a fractional rate would look like as a full-time salary, it adjusts for benefits, flexibility, and your personal risk tolerance to give you a clear sense of your effective rate as a fractional leader.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 md:gap-8">
            {/* Left Column - Tabbed Inputs */}
            <div className="lg:col-span-3 space-y-6">
              <Tabs defaultValue="fulltime-to-fractional" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="fulltime-to-fractional">Full-time → Fractional</TabsTrigger>
                  <TabsTrigger value="fractional-to-fulltime">Fractional → Full-time</TabsTrigger>
                </TabsList>
                
                <TabsContent value="fulltime-to-fractional" className="space-y-6">
                  <FullTimeToFractionalTab 
                    inputs={inputs}
                    updateInput={updateInput}
                    clearFractionalInput={clearFractionalInput}
                  />
                </TabsContent>
                
                <TabsContent value="fractional-to-fulltime" className="space-y-6">
                  <FractionalToFullTimeTab 
                    inputs={inputs}
                    updateInput={updateInput}
                    clearSalaryInputs={clearSalaryInputs}
                  />
                </TabsContent>
              </Tabs>

              {/* Assumptions Accordion */}
              <AssumptionsAccordion 
                inputs={inputs}
                updateInput={updateInput}
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
              />

              {/* Utilization Rate Section - Optional section for billable hours */}
              <UtilizationRateSection 
                inputs={inputs}
                updateInput={updateInput}
              />

              {/* Risk Tolerance Section - Separate optional section */}
              <RiskToleranceSection 
                inputs={inputs}
                updateInput={updateInput}
              />
            </div>

            {/* Right Column - Results organized by perspective */}
            <div className="lg:col-span-2 space-y-6">
              {/* Toggle Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
                  className="text-xs text-primary hover:text-primary/80 underline transition-colors"
                >
                  {showDetailedBreakdown ? 'Show Simplified View' : 'Show Detailed Breakdown'}
                </button>
              </div>

              {!showDetailedBreakdown ? (
                // Simplified View
                <div className="grid grid-cols-2 gap-4">
                  {/* Column 1: Organization Hourly Cost */}
                  <Card className="section-bg shadow-sm border-border animate-slide-in-right">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-foreground">Organization Cost</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-3xl font-bold text-foreground">
                        {formatCurrencyDecimal(results.nominalHourly * (1 + inputs.overheadPct))}
                        <span className="text-sm font-normal text-muted-foreground">/hr</span>
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border">
                        <p className="font-medium mb-1">Formula:</p>
                        <p>(Total Compensation + Overhead) ÷ Working Days per Annum ÷ Hours per Day</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Column 2: Fractional Talent Hourly Rate */}
                  <Card className="section-bg shadow-sm border-border animate-slide-in-right">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-foreground">Talent Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-3xl font-bold text-foreground">
                        {formatCurrencyDecimal(results.nominalHourly)}
                        <span className="text-sm font-normal text-muted-foreground">/hr</span>
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border">
                        <p className="font-medium mb-1">Formula:</p>
                        <p>Total Compensation ÷ Working Days per Annum ÷ Hours per Day</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                // Detailed Breakdown View
                <div className="grid grid-cols-2 gap-6">
                  {/* For Organization - LEFT SIDE */}
                  <Card className="section-bg shadow-sm border-border animate-slide-in-right">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base text-foreground mb-2">For Organization</CardTitle>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The all-in cost for a business that pays you <strong>{formatCurrency(results.totalAnnualComp)}</strong> in total compensation is below
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <ResultCard 
                        title={
                          <div className="flex items-center gap-1 text-xs">
                            Monthly Cost (w/ Overhead)
                            <InfoTooltip content={
                              <>
                                Monthly compensation <strong>including overhead expenses</strong>. This is your total monthly revenue target to maintain your desired lifestyle and cover all business costs.
                              </>
                            } />
                          </div>
                        } 
                        value={formatCurrency(results.monthlyCostIncludingOH)} 
                        className="p-2"
                      />
                      
                      <ResultCard 
                        title={
                          <div className="flex items-center gap-1 text-xs">
                            Annual Cost (w/ Overhead)
                            <InfoTooltip content={
                              <>
                                Your total compensation <strong>plus business overhead costs</strong>. This represents what a company would actually spend to employ you including benefits and operational expenses.
                              </>
                            } />
                          </div>
                        } 
                        value={formatCurrency(results.annualCostIncludingOH)} 
                        className="p-2"
                      />
                    </CardContent>
                  </Card>

                  {/* For Fractional Talent - RIGHT SIDE */}
                  <Card className="section-bg shadow-sm border-border animate-slide-in-right">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base text-foreground mb-2">For Fractional Talent</CardTitle>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        An annual total compensation of <strong>{formatCurrency(results.totalAnnualComp)}</strong> translates to the following, assuming your utilization rate is 100%
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <ResultCard 
                        title={
                          <div className="flex items-center gap-1 text-xs">
                            Nominal Hourly Compensation
                            <InfoTooltip content={
                              <>
                                Your <strong>baseline hourly rate</strong> that accounts for overhead and limited working days. This is your starting point before adjusting for non-billable time and risk.
                              </>
                            } />
                          </div>
                        }
                        value={formatCurrencyDecimal(results.nominalHourly)} 
                        className="p-2"
                      />
                      
                      <ResultCard 
                        title={
                          <div className="flex items-center gap-1 text-xs">
                            Nominal Daily Compensation
                            <InfoTooltip content={
                              <>
                                Your <strong>daily rate equivalent</strong> for full-day engagements. Many fractional leaders price by the day rather than hour for strategic work.
                              </>
                            } />
                          </div>
                        } 
                        value={formatCurrency(results.nominalDaily)} 
                        className="p-2"
                      />

                      <ResultCard 
                        title={
                          <div className="flex items-center gap-1 text-xs">
                            Nominal Monthly Compensation
                            <InfoTooltip content={
                              <>
                                Your <strong>monthly take-home target</strong> from fractional work. This helps you plan cash flow and set monthly revenue goals across all clients.
                              </>
                            } />
                          </div>
                        } 
                        value={formatCurrency(results.monthlyComp)} 
                        className="p-2"
                      />

                      <ResultCard 
                        title={
                          <div className="flex items-center gap-1 text-xs">
                            Nominal Yearly Compensation
                            <InfoTooltip content={
                              <>
                                Your <strong>complete yearly package</strong> including salary, bonus, and equity value. This is what you should aim to replace with fractional work.
                              </>
                            } />
                          </div>
                        } 
                        value={formatCurrency(results.totalAnnualComp)} 
                        className="p-2"
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Effective Hourly Rate - At Bottom, Visually Separated */}
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg border-2 border-primary/30 animate-slide-in-right">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Effective Hourly Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-foreground">
                        {formatCurrencyDecimal(results.effectiveHourly)}
                      </div>
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <InfoTooltip content={
                          <>
                            Your <strong>billable hour rate</strong> after accounting for non-billable time. This reflects that you can't bill <strong>100%</strong> of your time due to business development and admin work.
                          </>
                        } />
                        <span>Your recommended billable rate</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-primary/20">
                      <div className="text-sm text-muted-foreground">
                        Working Days per Year: <span className="font-medium text-foreground">{results.workingDaysPerYear}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
