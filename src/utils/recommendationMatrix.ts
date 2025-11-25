export type BDPipelineHealth = 'poor' | 'fair' | 'good' | 'excellent';
export type UtilizationCategory = 'very-low' | 'acceptable' | 'good' | 'great' | 'excellent';

export interface RecommendationContent {
  situation: string;
  recommendations: string;
}

// Recommendation matrix based on utilization and pipeline health
export const getRecommendation = (
  utilizationCategory: UtilizationCategory,
  pipelineHealth: BDPipelineHealth
): RecommendationContent => {
  const matrix: Record<BDPipelineHealth, Record<UtilizationCategory, RecommendationContent>> = {
    poor: {
      'very-low': {
        situation: 'Your current utilization rate is low and your pipeline visibility is low.',
        recommendations:
          'Focus on building your pipeline through consistent BD activities. Consider joining fractional communities and leveraging your network. Start with smaller engagements to build momentum and testimonials.',
      },
      acceptable: {
        situation: 'Your current utilization rate is in the acceptable range, and your pipeline visibility is low.',
        recommendations:
          'Your utilization is reasonable for early stage, but pipeline development needs attention. Allocate dedicated time each week for BD activities. Consider partnering with agencies or platforms that can provide leads.',
      },
      good: {
        situation: 'Your current utilization rate is fairly strong, and your pipeline visibility is low.',
        recommendations:
          'Strong utilization but weak pipeline is a warning sign. Without consistent BD, your utilization will drop when current projects end. Dedicate time now to pipeline development before it becomes critical.',
      },
      great: {
        situation: 'Your current utilization rate is very strong, and your pipeline visibility is low.',
        recommendations:
          'High utilization with weak pipeline is risky. You are too busy for BD, which will hurt future revenue. Consider outsourcing BD or administrative tasks to free up time for pipeline development.',
      },
      excellent: {
        situation: 'Your current utilization rate is excellent, and your pipeline visibility is low.',
        recommendations:
          'Critical situation: Excellent utilization today but no pipeline means potential revenue cliff ahead. Immediately allocate resources to BD—consider hiring support or joining fractional platforms to maintain deal flow.',
      },
    },
    fair: {
      'very-low': {
        situation:
          'Your current utilization rate is low, and your pipeline visibility is developing but not yet highly predictable.',
        recommendations:
          'Your pipeline shows promise. Focus on converting leads more efficiently and reducing time spent on administrative tasks. Consider streamlining your sales process and onboarding procedures.',
      },
      acceptable: {
        situation:
          'Your current utilization rate is in the acceptable range, and your pipeline visibility is developing and not yet highly predictable.',
        recommendations:
          'You are in a growth phase. Work on making your pipeline more predictable through consistent BD routines. Track conversion rates and optimize what is working. Build systems for repeatable success.',
      },
      good: {
        situation:
          'Your current utilization rate is fairly strong, and your pipeline visibility is developing and not yet highly predictable.',
        recommendations:
          'Good position but pipeline consistency needs work. Develop a structured BD cadence. Document what is working in your client acquisition so you can replicate it. Consider building partnerships for more consistent referrals.',
      },
      great: {
        situation:
          'Your current utilization rate is very strong, and your pipeline visibility is developing and not yet highly predictable.',
        recommendations:
          'High utilization with developing pipeline requires attention to balance. Do not let current work completely crowd out BD time. Block dedicated time for pipeline development, even when busy.',
      },
      excellent: {
        situation:
          'Your current utilization rate is excellent, and your pipeline visibility is developing and not yet highly predictable.',
        recommendations:
          'Excellent utilization but inconsistent pipeline is concerning. Build systems that allow BD to continue even when you are at capacity. Consider automation, partnerships, or support staff to maintain deal flow.',
      },
    },
    good: {
      'very-low': {
        situation: 'Your current utilization rate is low but your pipeline is showing promise.',
        recommendations:
          'Good pipeline with low utilization suggests operational inefficiency. Examine what is taking your non-billable time. Automate administrative tasks, streamline processes, and focus on converting your strong pipeline into revenue.',
      },
      acceptable: {
        situation: 'Your current utilization rate is in the acceptable range, and your pipeline visibility is steady and visible.',
        recommendations:
          'Solid foundation. Focus on gradual improvement—can you move from 60% to 65% utilization? Look for small efficiency gains in how you manage projects and client communications. Your steady pipeline gives you room to optimize.',
      },
      good: {
        situation: 'Your current utilization rate is fairly strong, and your pipeline visibility is steady and visible.',
        recommendations:
          'You are in a healthy position. Maintain your current BD practices while looking for opportunities to increase efficiency. Consider whether you can raise rates or take on more strategic (higher-value) work.',
      },
      great: {
        situation: 'Your current utilization rate is very strong, and your pipeline visibility is steady and visible.',
        recommendations:
          'Strong performance. Focus on sustainability—ensure your BD systems can run even when you are busy. Consider if you are ready to increase rates or be more selective about projects. Protect your capacity for highest-value work.',
      },
      excellent: {
        situation:
          'Your current utilization rate is excellent, and your pipeline visibility is steady and visible. You are in pretty good shape.',
        recommendations:
          'Excellent position! Keep doing what you are doing. Consider: (1) Can you increase rates to benefit from higher compensation? (2) Can you outsource routine tasks to free up time? (3) Balance deliverables with efficient BD. (4) Share your experience to help the fractional community.',
      },
    },
    excellent: {
      'very-low': {
        situation: 'Your current utilization rate is low but your pipeline seems strong.',
        recommendations:
          'Strong pipeline with low utilization indicates operational issues or underpricing. Review your processes, pricing, and project scoping. You have demand—optimize to convert it into billable revenue more efficiently.',
      },
      acceptable: {
        situation: 'Your current utilization rate is in the acceptable range, and your pipeline seems strong.',
        recommendations:
          'Strong pipeline provides a solid foundation. Work on increasing utilization through better project scoping, efficient onboarding, and minimizing administrative overhead. You have the demand to grow revenue.',
      },
      good: {
        situation: 'Your current utilization rate is fairly strong, and your pipeline seems strong.',
        recommendations:
          'You are in a strong position. Consider strategic growth—can you increase rates? Take on higher-value projects? The strong pipeline gives you leverage to be more selective and strategic about opportunities.',
      },
      great: {
        situation: 'Your current utilization rate and pipeline seem strong.',
        recommendations:
          'Very strong position. Focus on strategic optimization—increase rates, be selective about projects, consider outsourcing tasks that do not require your expertise. You have the demand to command premium compensation.',
      },
      excellent: {
        situation:
          'Your current utilization rate and pipeline are impressive. You are in great shape and you have healthy demand for your work.',
        recommendations:
          'Outstanding position! Recommendations: (1) Keep doing what you are doing—you have built something excellent. (2) Consider increasing rates to benefit from high demand. (3) Carefully evaluate outsourcing routine tasks to free up your time. (4) Share your experience to help the fractional community grow.',
      },
    },
  };

  return matrix[pipelineHealth][utilizationCategory];
};

export const getUtilizationCategory = (utilizationRate: number): UtilizationCategory => {
  if (utilizationRate < 40) return 'very-low';
  if (utilizationRate < 60) return 'acceptable';
  if (utilizationRate < 70) return 'good';
  if (utilizationRate < 85) return 'great';
  return 'excellent';
};
