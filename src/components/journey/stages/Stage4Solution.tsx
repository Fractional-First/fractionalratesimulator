import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Anchor, Activity, BarChart3, TrendingDown } from 'lucide-react';
import { JourneyStage } from '../JourneyStage';
import { type StageStatus } from '../JourneyContainer';
import { type Inputs, type Results, formatCurrency, formatCurrencyDecimal } from '@/utils/calculator';
import { type JourneyStage as JourneyStageType } from '../JourneyContainer';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MobileSidebarContent } from '../MobileSidebarContent';
interface Stage4SolutionProps {
  isActive: boolean;
  status: StageStatus;
  inputs: Inputs;
  results: Results;
  onEditStage: (stage: JourneyStageType) => void;
  onReset: () => void;
}
import { getRecommendation, getUtilizationCategory, type BDPipelineHealth, type UtilizationCategory } from '@/utils/recommendationMatrix';

interface UtilizationFeedback {
  category: UtilizationCategory;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
  message: string;
}

interface AdviceContent {
  title: string;
  description: string;
  recommendations: string[];
  ctaText: string;
  severity: 'critical' | 'warning' | 'success';
}

const getUtilizationFeedback = (utilizationRate: number): UtilizationFeedback => {
  if (utilizationRate < 40) {
    return {
      category: 'very-low',
      label: 'Below 40%',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/20',
      icon: AlertTriangle,
      message: "Your utilization rate is low. This means you're spending a significant amount of time on non-billable activities. Focus on streamlining operations and improving your pipeline to increase billable hours."
    };
  } else if (utilizationRate < 60) {
    return {
      category: 'acceptable',
      label: '40–60% (Acceptable for new fractional leaders)',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      icon: TrendingUp,
      message: "Your utilization rate is acceptable, especially if you're new to fractional work. As you build systems and optimize processes, aim to gradually increase this percentage."
    };
  } else if (utilizationRate < 70) {
    return {
      category: 'good',
      label: '60–70% (Good utilization rate)',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      icon: TrendingUp,
      message: "Your utilization rate is good. You're maintaining a healthy balance between billable work and business development. Continue refining your processes to optimize further."
    };
  } else if (utilizationRate < 85) {
    return {
      category: 'great',
      label: '70–85% (Great utilization rate)',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10 border-green-500/20',
      icon: CheckCircle2,
      message: "Your utilization rate is great. You're highly efficient while still maintaining time for business development. This is a sustainable and profitable position."
    };
  } else {
    return {
      category: 'excellent',
      label: '85%+ (Excellent)',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      icon: CheckCircle2,
      message: "Your utilization rate is excellent. However, ensure you're not neglecting pipeline development. If you've outsourced BD, this is ideal. If not, monitor pipeline health carefully to avoid future gaps."
    };
  }
};
const getAdviceMatrix = (utilizationRate: number, pipelineHealth: BDPipelineHealth): AdviceContent => {
  // Utilization ranges: <50%, 50-70%, 70%+
  const isLowUtil = utilizationRate < 50;
  const isMedUtil = utilizationRate >= 50 && utilizationRate < 70;
  const isHighUtil = utilizationRate >= 70;

  // Matrix logic based on the 6 scenarios
  
  // Row 1: <50% + Poor/Fair
  if (isLowUtil && (pipelineHealth === 'poor' || pipelineHealth === 'fair')) {
    return {
      title: 'Critical: You Are Undervalued & Undersold',
      description: 'You\'re in the "Danger Zone." With low billable hours and no clear pipeline, you aren\'t just independent — you\'re isolated. You need immediate deal flow to validate your independence.',
      recommendations: [
        'Structured BD support to build a consistent pipeline',
        'Administrative offloading to free up more billable time',
        'Rate optimization'
      ],
      ctaText: 'Get Support from Fractional First',
      severity: 'critical'
    };
  }
  
  // Row 2: <50% + Good/Excellent
  if (isLowUtil && (pipelineHealth === 'good' || pipelineHealth === 'excellent')) {
    return {
      title: 'Opportunity: Convert Pipeline to Billable Hours',
      description: 'You have the demand, but you\'re spending too much time running the business instead of billing for your expertise. Let\'s help you convert that strong pipeline into more billable revenue.',
      recommendations: [
        'Operational support to increase billable hours',
        'Contract and invoicing support',
        'Streamlined client onboarding',
        'Time back to focus on converting your strong pipeline'
      ],
      ctaText: 'Maximize Your Strong Pipeline',
      severity: 'warning'
    };
  }
  
  // Row 3: 50-70% + Poor/Fair
  if (isMedUtil && (pipelineHealth === 'poor' || pipelineHealth === 'fair')) {
    return {
      title: 'Let\'s Build Your Foundation',
      description: 'You\'re earning today, but your pipeline and future earnings are at risk. Fractional First can help you build a foundation for consistent, long-term success.',
      recommendations: [
        'Pipeline development and lead-generation support',
        'Client qualification and matching services',
        'Build a sustainable, recurring client base'
      ],
      ctaText: 'Secure Your Future Pipeline',
      severity: 'warning'
    };
  }
  
  // Row 4: 50-70% + Good/Excellent
  if (isMedUtil && (pipelineHealth === 'good' || pipelineHealth === 'excellent')) {
    return {
      title: 'Good Position: Optimize for Excellence',
      description: 'You\'ve achieved "Smart Scaling," with a healthy balance of work and demand. Now, the goal isn\'t more hours — it\'s reaching elite performance levels, meaning higher-impact hours at better rates.',
      recommendations: [
        'Premium client-matching opportunities for higher-value engagements',
        'Strategic growth consulting and coaching',
        'Possible network access to expand into new markets'
      ],
      ctaText: 'Reach Elite Performance',
      severity: 'success'
    };
  }

  // Row 5: 70%+ + Poor/Fair
  if (isHighUtil && (pipelineHealth === 'poor' || pipelineHealth === 'fair')) {
    return {
      title: 'Caution: Unsustainable Pace',
      description: 'You\'re busy, but you aren\'t safe. High utilization with a weak pipeline suggests you may be overworked with current clients without planning for the future. This creates burnout risk and income volatility.',
      recommendations: [
        'Build a sustainable pipeline while maintaining current work',
        'Strategic BD support that doesn\'t require your time',
        'Succession planning for current engagements'
      ],
      ctaText: 'Create Sustainable Income',
      severity: 'warning'
    };
  }

  // Row 6: 70%+ + Good/Excellent (ideal state)
  return {
    title: 'Excellent: You\'re in Elite Territory',
    description: 'You are in the top 1% of independent operators. The challenge now is capacity. Fractional First can help you maintain this momentum and explore premium opportunities.',
    recommendations: [
      'Peer network of elite fractional leaders',
      'Strategic growth and scaling opportunities',
      'Maintain your position with minimal effort'
    ],
    ctaText: 'Join Our Elite Network',
    severity: 'success'
  };
};
export const Stage4Solution: React.FC<Stage4SolutionProps> = ({
  isActive,
  status,
  inputs,
  results,
  onEditStage,
  onReset,
}) => {

  // BD Pipeline health state
  const [pipelineHealth, setPipelineHealth] = useState<BDPipelineHealth | null>(null);
  const bdPct = inputs.bdPct ?? 0.15;
  const invoicingPct = inputs.invoicingPct ?? 0.10;
  const adminPct = inputs.adminPct ?? 0.15;
  const nonBillablePct = bdPct + invoicingPct + adminPct;
  const utilizationRate = (1 - nonBillablePct) * 100;
  const effectiveRate = results.nominalHourly;
  const billingRate = effectiveRate / (1 - nonBillablePct);

  // Get utilization feedback (doesn't depend on pipeline health)
  const utilizationFeedback = getUtilizationFeedback(utilizationRate);
  const UtilFeedbackIcon = utilizationFeedback.icon;
  
  // Only compute pipeline-dependent values when pipeline health is selected
  const utilizationCategory = getUtilizationCategory(utilizationRate);
  const recommendation = pipelineHealth ? getRecommendation(utilizationCategory, pipelineHealth) : null;
  
  // Replace XX% with actual utilization rate in the situation text
  const situationWithRate = recommendation ? recommendation.situation.replace(/\(XX\)%/g, `${Math.round(utilizationRate)}%`) : '';
  const recommendationsWithRate = recommendation ? recommendation.recommendations.map(rec => rec.replace(/\(XX\)%/g, `${Math.round(utilizationRate)}%`)) : [];
  
  const advice = pipelineHealth ? getAdviceMatrix(utilizationRate, pipelineHealth) : null;
  
  // Pipeline health icon and styling
  const getPipelineHealthDisplay = (health: BDPipelineHealth) => {
    switch (health) {
      case 'poor':
        return {
          icon: TrendingDown,
          color: 'text-red-600 dark:text-red-400',
          bg: 'bg-red-500/10',
          label: 'Early Stage / Building'
        };
      case 'fair':
        return {
          icon: Activity,
          color: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-500/10',
          label: 'Developing / Inconsistent'
        };
      case 'good':
        return {
          icon: BarChart3,
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-500/10',
          label: 'Steady'
        };
      case 'excellent':
        return {
          icon: TrendingUp,
          color: 'text-green-600 dark:text-green-400',
          bg: 'bg-green-500/10',
          label: 'Strong'
        };
    }
  };
  
  const pipelineDisplay = pipelineHealth ? getPipelineHealthDisplay(pipelineHealth) : null;
  const PipelineIcon = pipelineDisplay?.icon;
  
  return <JourneyStage stageNumber={3} title="Your Path Forward" subtitle="Personalized analysis and actionable next steps" status={status} isActive={isActive}>
      <div className="space-y-6 mt-6">
        {/* Mobile Sidebar Content */}
        <MobileSidebarContent segment="path-forward" />
        
        {/* Utilization Rate Feedback */}
        <div className={`p-6 rounded-xl border-2 ${utilizationFeedback.bgColor}`}>
          <div className="flex items-start gap-3 mb-3">
            <UtilFeedbackIcon className={`w-6 h-6 ${utilizationFeedback.color} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">Your Utilization Rate: {Math.round(utilizationRate)}%</h3>
              <p className="text-sm font-medium text-foreground mb-2">{utilizationFeedback.label}</p>
              <p className="text-sm text-muted-foreground">{utilizationFeedback.message}</p>
            </div>
          </div>
        </div>

        {/* BD Pipeline Health Assessment */}
        <div className="p-6 bg-card rounded-xl border border-border">
          <h3 className="text-lg font-bold text-foreground mb-3">
            Assess Your Business Development Pipeline
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            How would you describe the current health of your client pipeline and business development efforts?
          </p>
          
          <RadioGroup value={pipelineHealth || undefined} onValueChange={value => setPipelineHealth(value as BDPipelineHealth)}>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="poor" id="poor" className="mt-0.5" />
                <Label htmlFor="poor" className="flex-1 cursor-pointer">
                  <span className="font-medium text-foreground">Early Stage / Building</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Struggling to find leads; inconsistent pipeline; often unsure where next client will come from
                  </p>
                </Label>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="fair" id="fair" className="mt-0.5" />
                <Label htmlFor="fair" className="flex-1 cursor-pointer">
                  <span className="font-medium text-foreground">Developing / Inconsistent</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Some leads but inconsistent; spending significant time on BD; pipeline has gaps
                  </p>
                </Label>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="good" id="good" className="mt-0.5" />
                <Label htmlFor="good" className="flex-1 cursor-pointer">
                  <span className="font-medium text-foreground">Steady</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Steady flow of qualified leads; reasonable pipeline visibility; BD is manageable but time-consuming
                  </p>
                </Label>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="excellent" id="excellent" className="mt-0.5" />
                <Label htmlFor="excellent" className="flex-1 cursor-pointer">
                  <span className="font-medium text-foreground">Strong</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Strong, consistent pipeline; clients seeking you out; confident in future bookings
                  </p>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Personalized Recommendation - only show when pipeline health is selected */}
        {pipelineHealth && pipelineDisplay && (
          <div className="p-6 bg-card rounded-xl border border-border">
            <h3 className="text-lg font-bold text-foreground mb-3">
              Your Personalized Recommendation
            </h3>
            <div className="p-4 bg-muted/30 rounded-lg mb-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                  Your Current Position
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <UtilFeedbackIcon className={`w-4 h-4 ${utilizationFeedback.color}`} />
                    <span className="text-sm font-medium text-foreground">
                      Utilization: {Math.round(utilizationRate)}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({utilizationFeedback.label})
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border"></div>
                  <div className="flex items-center gap-2">
                    {PipelineIcon && <PipelineIcon className={`w-4 h-4 ${pipelineDisplay.color}`} />}
                    <span className="text-sm font-medium text-foreground">
                      Pipeline: {pipelineDisplay.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">{situationWithRate}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Consider:</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                {recommendationsWithRate.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 ml-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA - only show when pipeline health is selected */}
        {pipelineHealth && advice && (
          <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-primary/20">
            <h3 className="text-xl font-bold text-foreground mb-2">{advice.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{advice.description}</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  How Fractional First Can Help You:
                </h4>
                <ul className="space-y-2">
                  {advice.recommendations.map((rec, idx) => <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{rec}</span>
                    </li>)}
                </ul>
              </div>

              <div className="pt-4 border-t border-border">
                <Button size="lg" className="w-full" asChild>
                  <a href="https://talent.fractionalfirst.com/signup" target="_blank" rel="noopener noreferrer">
                    {advice.ctaText}
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer / Additional Information */}
        {pipelineHealth && (
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Note:</strong> Converting a full-time compensation package (used as an anchor in this simulator) into a utilization-adjusted hourly rate is only one method of arriving at indicative fractional rates. There are other methods, including assessing the value delivered for your clientele and understanding how much they are willing to pay for an equivalent service.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">
              Ultimately, triangulating across several techniques and comparing competitive benchmarks can help you determine a defensible hourly rate or, alternatively, a value-based project rate that isn't tied to the number of hours you work.
            </p>
          </div>
        )}

        {/* Additional Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button size="lg" variant="outline" onClick={onReset} className="flex-1">
            Start Over
          </Button>
          <Button size="lg" variant="outline" onClick={() => onEditStage('foundation')} className="flex-1">
            Edit Inputs
          </Button>
        </div>
      </div>
    </JourneyStage>;
};