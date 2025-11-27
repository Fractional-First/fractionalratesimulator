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
        situation: "Your current (XX)% utilization rate is low, and your pipeline viability is limited. You are still available.",
        recommendations: "Consider:\n• Focusing 80% of your time on active Business Development (BD).\n• Reaching out to past colleagues and peers to let them know you have capacity.\n• Refining your value proposition to ensure it resonates with your ideal client profile.\n• Joining Fractional First workshops and coaching to accelerate your growth."
      },
      acceptable: {
        situation: "Your current (XX)% utilization rate is acceptable, but your pipeline viability is low. You are now delivering, but you need to watch the horizon.",
        recommendations: "Consider:\n• Prioritizing lead generation to avoid a future income gap.\n• Asking current happy clients for referrals or testimonials.\n• Balancing delivery excellence with consistent daily outreach.\n• Joining Fractional First workshops to build a reliable pipeline engine."
      },
      good: {
        situation: "Your current (XX)% utilization rate is strong, but your pipeline viability is low. You are in the \"feast or famine\" danger zone.",
        recommendations: "Consider:\n• Blocking specific time on your calendar for BD, even when busy.\n• Leveraging your current work to create case studies that attract inbound leads.\n• Reconnecting with \"warm\" leads from the past who weren't ready then.\n• Joining Fractional First coaching to prevent future gaps while you deliver."
      },
      great: {
        situation: "Your current (XX)% utilization rate is very strong, yet your pipeline viability is critically low. You risk an income \"cliff\" when projects end.",
        recommendations: "Consider:\n• Aggressively scheduling networking chats during your non-billable hours.\n• Considering a retainer model for current clients to secure longer-term stability.\n• Signaling to your network that you will have availability in the coming months.\n• Leveraging Fractional First resources to quickly refill the pipeline or extend current work ends."
      },
      excellent: {
        situation: "Your current (XX)% utilization rate is excellent, but your pipeline viability is critically low. You risk an income \"cliff\" when projects end. (ideally reserve but risky if pipeline development is neglected)",
        recommendations: "Consider:\n• Focusing on \"low-lift, high-impact\" marketing like posting thought leadership on LinkedIn.\n• Simplifying your referral network that you will have availability soon.\n• Saving excess revenue to cover potential gaps between contracts.\n• Leveraging Fractional First resources to rapidly secure your next opportunity, possibly with the help of Fractional First."
      }
    },
    fair: {
      'very-low': {
        situation: "Your current (XX)% utilization rate is low, and your pipeline is inconsistent. You are doing the work, but the results aren't predictable yet.",
        recommendations: "Consider:\n• Analyzing your sales funnel to see where you are losing leads.\n• Increasing your volume of outreach to smooth out the inconsistency.\n• Partnering with Fractional First or other leaders to cross-refer opportunities.\n• Joining Fractional First workshops to stabilize your lead flow."
      },
      acceptable: {
        situation: "Your current (XX)% utilization rate is acceptable, with a developing pipeline. You are heading in the right direction but need more stability.",
        recommendations: "Consider:\n• Systematizing your BD routine to make it less time-consuming.\n• Focusing on nurturing the leads you have rather than just chasing new ones.\n• Reviewing your pricing to ensure you aren't underpricing just to gaps.\n• Engaging with Fractional First coaching to master business development efficiency."
      },
      good: {
        situation: "Your current (XX)% utilization rate is strong, and your pipeline is showing promise. You are doing well, but it feels a bit chaotic.",
        recommendations: "Consider:\n• Being more selective with new leads, focusing on \"ideal\" clients.\n• Dedicating Friday afternoons to pipeline maintenance and documentation.\n• Preventing client delivery from bleeding into your sales time.\n• Leveraging Fractional First resources to optimize your time management."
      },
      great: {
        situation: "Your current (XX)% utilization rate is great, though your pipeline remains inconsistent. You risk burnout if you don't manage this carefully.",
        recommendations: "Consider:\n• Pricing your limited availability at a premium.\n• Outsourcing the more task-oriented stuff to free up time, possibly with help from Fractional First.\n• Extending current contracts rather than finding net-new clients.\n• Moving away from \"hours for dollars\" toward value-based or flat-fee pricing."
      },
      excellent: {
        situation: "Your current (XX)% utilization rate is exceptional, but your inconsistent pipeline is a risk. You might be over-servicing clients.",
        recommendations: "Consider:\n• Maintaining consistency in BD to avoid dropping the ball.\n• Using your high utilization as social proof: \"I'm fully booked.\"\n• Outsourcing non-critical tasks or bringing in a junior, possibly with the help of Fractional First.\n• Referring weak leads to Fractional First to earn a fee."
      }
    },
    good: {
      'very-low': {
        situation: "Your current (XX)% utilization rate is low, but you have a steady flow of qualified leads. You are in a prime position to convert those without desperation.",
        recommendations: "Consider:\n• Focusing on closing the best-fit clients rather than just filling the calendar.\n• Reviewing your sales process to ensure you are converting efficiently.\n• Setting clear boundaries to protect your delivery time from sales creep.\n• Leveraging Fractional First coaching to refine your closing techniques."
      },
      acceptable: {
        situation: "Your current (XX)% utilization rate is acceptable, and your pipeline is steady. You have found a sustainable rhythm.",
        recommendations: "Consider:\n• Being selective; avoiding the rush to sign everyone.\n• Nudging your rates up for new clients.\n• Setting clear boundaries to protect your delivery time from sales creep.\n• Focusing on relationship building and high-leverage networking."
      },
      good: {
        situation: "Your current (XX)% utilization rate is strong, supported by a steady pipeline. This is the \"Fractional Dream\" scenario.",
        recommendations: "Consider:\n• Building a waitlist to increase your perceived value.\n• Giving yourself lower-paying clients—referring them to Fractional First for prioritization.\n• Focusing on relationship building and high-leverage networking."
      },
      great: {
        situation: "Your current (XX)% utilization rate is high, and your pipeline remains steady. You are approaching a tech-income.",
        recommendations: "Consider:\n• Referring excess work to Fractional First to earn referral fees.\n• Increasing prices to naturally manage demand.\n• Assembling a bigger team to handle the load, possibly with the help of Fractional First.\n• Referring excess demand to Fractional First to monetize your overflow, via referral fees."
      },
      excellent: {
        situation: "Your current (XX)% utilization rate is excellent, and your pipeline remains steady. Supply and demand are in your favor.",
        recommendations: "Consider:\n• Raising rates immediately for any new inquiries.\n• Switching \"passive versus active\" (exclusive/reactive) versus active outreach.\n• Outsourcing more \"low-lift, time-heavy tasks to free up time.\n• Helping the community of fractional leaders by sharing your experience to the Fractional First community, possibly with referrals."
      }
    },
    excellent: {
      'very-low': {
        situation: "Your current (XX)% utilization rate is low, but you have a steady, strong flow of qualified leads. You are in a prime position to convert those without desperation.",
        recommendations: "Consider:\n• Maintaining confidence in your sales conversations.\n• Auditing your pricing and contracts; are you under-priced?\n• Reviewing your sales process to ensure you are efficiently converting.\n• Productizing services for better efficiency."
      },
      acceptable: {
        situation: "Your current (XX)% utilization rate is healthy, and your pipeline is strong. You have found a sustainable rhythm.",
        recommendations: "Consider:\n• Ensuring your BD efforts remain consistent so the flow doesn't dry up.\n• Productizing services for better efficiency.\n• Being more selective about which new projects you take on."
      },
      good: {
        situation: "Your current (XX)% utilization rate is strong, and your pipeline is strong. This is a very healthy state.",
        recommendations: "Consider:\n• Assessing upcoming leads for cultural fit and long-term potential.\n• Preparing for lower-paying clients—referring them to your network.\n• Focusing on capability building or cultural brand potential.\n• Reviewing your pricing before you get too busy."
      },
      great: {
        situation: "Your current (XX)% utilization rate and pipeline are both very strong. You are operating at peak performance.",
        recommendations: "Consider:\n• Raising rates for all new incoming leads.\n• Switching \"passive outreach.\n• Increasing prices to naturally manage demand.\n• Moving away from \"hours for dollars\" toward value-based or flat-fee pricing.\n• Referring excess work to Fractional First to earn a referral fee."
      },
      excellent: {
        situation: "Your current (XX)% utilization rate is maxed out, and you have healthy demand. You are in excellent shape.",
        recommendations: "Consider:\n• Raising rates to capitalize on demand.\n• Assembling your team to scale your delivery, possibly with the help of Fractional First, to scale your delivery.\n• Referring excess demand to Fractional First to monetize your overflow, via referral fees.\n• Helping the community of fractional leaders by sharing your success story and lessons."
      }
    }
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
