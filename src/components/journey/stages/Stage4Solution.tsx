import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Anchor } from 'lucide-react';
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
type BDPipelineHealth = 'poor' | 'fair' | 'good' | 'excellent';
interface AdviceContent {
  title: string;
  description: string;
  recommendations: string[];
  ctaText: string;
  severity: 'critical' | 'warning' | 'success';
}
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

  // Get personalized advice
  const advice = getAdviceMatrix(utilizationRate, pipelineHealth);
  const SeverityIcon = advice.severity === 'critical' ? AlertTriangle : advice.severity === 'warning' ? TrendingUp : CheckCircle2;
  const severityColor = advice.severity === 'critical' ? 'text-red-600 dark:text-red-400' : advice.severity === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400';
  const severityBg = advice.severity === 'critical' ? 'bg-red-500/10 border-red-500/20' : advice.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-green-500/10 border-green-500/20';
  return <JourneyStage stageNumber={3} title="Your Path Forward" subtitle="Personalized analysis and actionable next steps" status={status} isActive={isActive}>
      <div className="space-y-6 mt-6" ref={pathForwardRef} data-segment="path-forward">
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

        {/* Personalized Advice Matrix - Comparison Table */}
        <div className="p-6 bg-card rounded-xl border border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Your Personalized Recommendations Matrix
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Based on your utilization rate ({Math.round(utilizationRate)}%) and pipeline health ({pipelineHealth}), here's where you stand and what we recommend.
          </p>
          
          {/* Responsive Table */}
          <div className="overflow-x-auto -mx-2">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="p-3 text-left bg-muted/50 border border-border font-semibold text-foreground">
                    Pipeline / Utilization Rate
                  </th>
                  <th className="p-3 bg-amber-100/50 dark:bg-amber-950/30 border border-border font-semibold text-foreground">
                    below 40%
                  </th>
                  <th className="p-3 bg-yellow-100/50 dark:bg-yellow-950/30 border border-border font-semibold text-foreground">
                    40–60%<br/>
                    <span className="font-normal text-muted-foreground">Acceptable for new fractional leaders</span>
                  </th>
                  <th className="p-3 bg-green-100/50 dark:bg-green-950/30 border border-border font-semibold text-foreground">
                    60–70%<br/>
                    <span className="font-normal text-muted-foreground">Good utilization rate</span>
                  </th>
                  <th className="p-3 bg-emerald-100/50 dark:bg-emerald-950/30 border border-border font-semibold text-foreground">
                    70–85%<br/>
                    <span className="font-normal text-muted-foreground">Great utilization rate</span>
                  </th>
                  <th className="p-3 bg-blue-100/50 dark:bg-blue-950/30 border border-border font-semibold text-foreground">
                    85%+<br/>
                    <span className="font-normal text-muted-foreground">It depends</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1: Early Stage / Building */}
                <tr>
                  <td className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-border font-medium text-foreground">
                    <div className="font-semibold">Early Stage / Building</div>
                    <div className="text-xs text-muted-foreground mt-1">Struggling to find leads; inconsistent pipeline; often unsure where next client will come from</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is low and your pipeline visibility is low.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is in the acceptable range, and your pipeline visibility is low.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is fairly strong, and your pipeline visibility is low.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is very strong, and your pipeline visibility is low.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is excellent, and your pipeline visibility is low.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                </tr>
                
                {/* Row 2: Developing / Inconsistent */}
                <tr>
                  <td className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-border font-medium text-foreground">
                    <div className="font-semibold">Developing / Inconsistent</div>
                    <div className="text-xs text-muted-foreground mt-1">Some leads but inconsistent; spending significant time on BD; pipeline has gaps</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is low, and your pipeline visibility is developing but not yet highly predictable.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is in the acceptable range, and your pipeline visibility is developing and not yet highly predictable.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is fairly strong, and your pipeline visibility is developing and not yet highly predictable.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is very strong, and your pipeline visibility is developing and not yet highly predictable.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is excellent, and your pipeline visibility is developing and not yet highly predictable.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                </tr>
                
                {/* Row 3: Steady */}
                <tr>
                  <td className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-border font-medium text-foreground">
                    <div className="font-semibold">Steady</div>
                    <div className="text-xs text-muted-foreground mt-1">Steady flow of qualified leads; reasonable pipeline visibility; BD is manageable but time-consuming</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is low but your pipeline is showing promise.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is in the acceptable range, and your pipeline visibility is steady and visible.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is fairly strong, and your pipeline visibility is steady and visible.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is very strong, and your pipeline visibility is steady and visible.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is excellent, and your pipeline visibility is steady and visible. You are in pretty good shape.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                      <li>Keep doing what you are doing! Well done.</li>
                      <li>You may want to assess how you can balance between your current deliverables and making sure BD is streamlined and efficient.</li>
                      <li>You may want to consider increasing your rate gradually to benefit from higher compensation.</li>
                      <li>You may want to carefully and strategically evaluate if you can outsource or insource routine tasks to free up your time.</li>
                      <li>You may want to help the community of fractional leaders by sharing your experience.</li>
                    </ul>
                  </td>
                </tr>
                
                {/* Row 4: Strong */}
                <tr>
                  <td className="p-3 bg-green-50/50 dark:bg-green-950/20 border border-border font-medium text-foreground">
                    <div className="font-semibold">Strong</div>
                    <div className="text-xs text-muted-foreground mt-1">Strong, consistent pipeline; clients seeking you out; confident in future bookings</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is low but your pipeline seems strong.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is in the acceptable range, and your pipeline seems strong.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate is fairly strong, and your pipeline seems strong.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate and pipeline seem strong.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                  </td>
                  <td className="p-3 border border-border bg-background align-top">
                    <div className="text-foreground mb-1">Your current XX utilization rate and pipeline are impressive. You are in great shape and you have healthy demand for your work.</div>
                    <div className="text-muted-foreground">Recommendations:</div>
                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                      <li>Keep doing what you are doing! Well done.</li>
                      <li>You may want to consider increasing your rate gradually to benefit from higher compensation.</li>
                      <li>You may want to carefully and strategically evaluate if you can outsource or insource routine tasks to free up your time.</li>
                      <li>You may want to help the community of fractional leaders by sharing your experience.</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Highlighted Current Position */}
          <div className="mt-6 p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
            <div className="flex items-start gap-3">
              <SeverityIcon className={`w-6 h-6 ${severityColor} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-2">Your Current Position</h4>
                <p className="text-sm text-muted-foreground">
                  Utilization Rate: <strong>{Math.round(utilizationRate)}%</strong> | Pipeline Health: <strong className="capitalize">{pipelineHealth}</strong>
                </p>
              </div>
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