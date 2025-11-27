import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Anchor, Activity, BarChart3, TrendingDown } from 'lucide-react';
import { JourneyStage } from '../JourneyStage';
import { type StageStatus } from '../JourneyContainer';
import { type Inputs, type Results, formatCurrency, formatCurrencyDecimal } from '@/utils/calculator';
import { type JourneyStage as JourneyStageType } from '../JourneyContainer';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
interface Stage4SolutionProps {
  isActive: boolean;
  status: StageStatus;
  inputs: Inputs;
  results: Results;
  onEditStage: (stage: JourneyStageType) => void;
  onReset: () => void;
  pathForwardRef: React.RefObject<HTMLDivElement>;
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
  // Utilization ranges: 0-50%, 50-70%, 70%+
  const isLowUtil = utilizationRate < 50;
  const isMedUtil = utilizationRate >= 50 && utilizationRate < 70;
  const isHighUtil = utilizationRate >= 70;

  // Matrix logic
  if (isLowUtil && (pipelineHealth === 'poor' || pipelineHealth === 'fair')) {
    return {
      title: 'Critical: You Need Comprehensive Support',
      description: 'With low utilization and a struggling pipeline, you\'re spending too much time on non-billable work while also struggling to find clients. This is the exact situation Fractional First was built to solve.',
      recommendations: ['Immediate access to qualified client opportunities through our marketplace', 'Structured BD support to build a consistent pipeline', 'Administrative offloading to free up 20-30% more billable time', 'Rate optimization coaching to ensure you\'re charging appropriately'],
      ctaText: 'Get Immediate Support from Fractional First',
      severity: 'critical'
    };
  }
  if (isLowUtil && (pipelineHealth === 'good' || pipelineHealth === 'excellent')) {
    return {
      title: 'Opportunity: Convert Pipeline to Billable Hours',
      description: 'You have a strong pipeline, but you\'re losing too much time to admin and operational tasks. Let\'s help you convert that strong pipeline into more billable revenue.',
      recommendations: ['Operational support to reduce admin time by 50%+', 'Contract and invoicing automation', 'Client onboarding streamlining', 'Focus your time on converting your strong pipeline'],
      ctaText: 'Maximize Your Strong Pipeline',
      severity: 'warning'
    };
  }
  if (isMedUtil && (pipelineHealth === 'poor' || pipelineHealth === 'fair')) {
    return {
      title: 'Let\'s Build Your Foundation',
      description: 'You\'re achieving decent utilization, but your pipeline health suggests this may not be sustainable. Let\'s build a foundation for consistent, long-term success.',
      recommendations: ['Pipeline development and lead generation support', 'Client qualification and matching services', 'Build a sustainable, recurring client base'],
      ctaText: 'Build a Sustainable Practice',
      severity: 'warning'
    };
  }
  if (isMedUtil && (pipelineHealth === 'good' || pipelineHealth === 'excellent')) {
    return {
      title: 'Good Position: Optimize for Excellence',
      description: 'You\'re in a solid position with good utilization and a healthy pipeline. Fractional First can help you reach elite performance levels (75%+ utilization).',
      recommendations: ['Premium client matching for higher-value engagements', 'Advanced operational efficiency tools', 'Strategic growth consulting', 'Network access to expand into new markets'],
      ctaText: 'Reach Elite Performance',
      severity: 'success'
    };
  }

  // High utilization cases
  if (isHighUtil && (pipelineHealth === 'poor' || pipelineHealth === 'fair')) {
    return {
      title: 'Caution: Unsustainable Pace',
      description: 'You\'re achieving excellent utilization, but a weak pipeline suggests you may be overworked on current clients without planning for the future. This creates burnout risk and income volatility.',
      recommendations: ['Build a sustainable pipeline while maintaining current work', 'Strategic BD support that doesn\'t require your time', 'Succession planning for current engagements', 'Work-life balance optimization'],
      ctaText: 'Create Sustainable Success',
      severity: 'warning'
    };
  }

  // High utilization + good/excellent pipeline (ideal state)
  return {
    title: 'Excellent: You\'re in Elite Territory',
    description: 'You\'ve achieved what most fractional leaders aspire to: high utilization with a strong pipeline. Fractional First can help you maintain this position and explore premium opportunities.',
    recommendations: ['Access to premium, high-value client engagements', 'Peer network of elite fractional leaders', 'Strategic growth and scaling opportunities', 'Maintain your position with minimal effort'],
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
  pathForwardRef
}) => {

  // BD Pipeline health state
  const [pipelineHealth, setPipelineHealth] = useState<BDPipelineHealth>('fair');
  const bdPct = inputs.bdPct ?? 0.15;
  const invoicingPct = inputs.invoicingPct ?? 0.10;
  const adminPct = inputs.adminPct ?? 0.15;
  const nonBillablePct = bdPct + invoicingPct + adminPct;
  const utilizationRate = (1 - nonBillablePct) * 100;
  const effectiveRate = results.nominalHourly;
  const billingRate = effectiveRate / (1 - nonBillablePct);

  // Get utilization feedback and personalized recommendation
  const utilizationFeedback = getUtilizationFeedback(utilizationRate);
  const UtilFeedbackIcon = utilizationFeedback.icon;
  const utilizationCategory = getUtilizationCategory(utilizationRate);
  const recommendation = getRecommendation(utilizationCategory, pipelineHealth);
  
  // Replace XX% with actual utilization rate in the situation text
  const situationWithRate = recommendation.situation.replace(/\(XX\)%/g, `${Math.round(utilizationRate)}%`);
  const recommendationsWithRate = recommendation.recommendations.replace(/\(XX\)%/g, `${Math.round(utilizationRate)}%`);
  
  const advice = getAdviceMatrix(utilizationRate, pipelineHealth);
  const SeverityIcon = advice.severity === 'critical' ? AlertTriangle : advice.severity === 'warning' ? TrendingUp : CheckCircle2;
  const severityColor = advice.severity === 'critical' ? 'text-red-600 dark:text-red-400' : advice.severity === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400';
  const severityBg = advice.severity === 'critical' ? 'bg-red-500/10 border-red-500/20' : advice.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-green-500/10 border-green-500/20';
  
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
  
  const pipelineDisplay = getPipelineHealthDisplay(pipelineHealth);
  const PipelineIcon = pipelineDisplay.icon;
  
  return <JourneyStage stageNumber={3} title="Your Path Forward" subtitle="Personalized analysis and actionable next steps" status={status} isActive={isActive}>
      <div className="space-y-6 mt-6" ref={pathForwardRef} data-segment="path-forward">
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
          
          <RadioGroup value={pipelineHealth} onValueChange={value => setPipelineHealth(value as BDPipelineHealth)}>
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

        {/* Personalized Recommendation */}
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
                  <PipelineIcon className={`w-4 h-4 ${pipelineDisplay.color}`} />
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
            <h4 className="text-sm font-semibold text-foreground mb-3">Recommendations:</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              {recommendationsWithRate.split('\n').map((line, idx) => {
                if (!line.trim()) return null;
                if (line.startsWith('Consider:')) {
                  return <p key={idx} className="font-medium">{line}</p>;
                }
                if (line.startsWith('•')) {
                  return (
                    <div key={idx} className="flex items-start gap-2 ml-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{line.substring(1).trim()}</span>
                    </div>
                  );
                }
                return <p key={idx}>{line}</p>;
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
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