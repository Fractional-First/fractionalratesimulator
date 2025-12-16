export type BDPipelineHealth = 'poor' | 'fair' | 'good' | 'excellent';
export type UtilizationCategory = 'very-low' | 'acceptable' | 'good' | 'great' | 'excellent';

export interface RecommendationContent {
  situation: string;
  recommendations: string[];
}

// Recommendation matrix based on utilization and pipeline health
export const getRecommendation = (
  utilizationCategory: UtilizationCategory,
  pipelineHealth: BDPipelineHealth
): RecommendationContent => {
  const matrix: Record<BDPipelineHealth, Record<UtilizationCategory, RecommendationContent>> = {
    // Early Stage / Building
    poor: {
      'very-low': {
        situation: "Your current (XX)% utilization rate is low, and your pipeline visibility is limited. You have availability, so now is the time to build momentum.",
        recommendations: [
          "Focusing the majority of your time on active Business Development (BD).",
          "Reaching out to past colleagues and peers to let them know your desire to build a portfolio career and that you have capacity.",
          "Refining your value proposition to ensure it resonates with your unique interests, superpowers, and skills.",
          "Tweaking the articulation and positioning of your value proposition so that it stands out to the ideal client profile (ICP).",
          "Joining various community workshops and/or Fractional First coaching to accelerate your growth."
        ]
      },
      acceptable: {
        situation: "Your current (XX)% utilization rate is acceptable, but your pipeline visibility remains low. You are safe for now, but a future income gap is a clear and present risk.",
        recommendations: [
          "Shifting focus to aggressive lead generation to quickly fill the top of the funnel and mitigate future risk.",
          "Leveraging happy clients for immediate results by proactively asking for warm referrals and testimonials.",
          "Systematizing consistent daily outreach (e.g., dedicated 1-2 hours) and balancing it ruthlessly with client delivery excellence.",
          "Balancing delivery excellence with consistent daily outreach.",
          "Refining your core value proposition to ensure it clearly resonates with your target market for better lead conversion.",
          "Utilizing Fractional First workshops to help build a reliable, repeatable pipeline engine."
        ]
      },
      good: {
        situation: "Your current (XX)% utilization rate is strong, but your pipeline visibility is low. You are busy delivering, but you need to watch the horizon. You are in the \"feast or famine\" danger zone.",
        recommendations: [
          "Blocking specific time on your calendar for BD, even when busy.",
          "Leveraging your current work to create case studies that attract inbound interest.",
          "Reconnecting with \"warm\" leads from the past who weren't ready then.",
          "Joining Fractional First coaching to prevent future gaps while you deliver."
        ]
      },
      great: {
        situation: "Your current (XX)% utilization rate is very strong, yet your pipeline visibility is critically low. You risk an income \"cliff\" when projects end.",
        recommendations: [
          "Aggressively scheduling networking chats during your non-billable hours.",
          "Considering a retainer model for current clients to secure longer-term stability.",
          "Signaling to your network that you will have availability in the coming months.",
          "Leveraging Fractional First coaching to fix your pipeline before current work ends."
        ]
      },
      excellent: {
        situation: "Your current (XX)% utilization rate is excellent, but your pipeline visibility is critically low. You risk an income \"cliff\" when projects end.",
        recommendations: [
          "Focusing on \"low-lift, high-impact\" marketing like posting thought leadership on LinkedIn.",
          "Signaling to your network now that you will have availability in the coming months.",
          "Saving excess revenue to cover potential gaps between contracts.",
          "Leveraging Fractional First resources to rapidly rebuild your pipeline strategy."
        ]
      }
    },
    // Developing / Inconsistent
    fair: {
      'very-low': {
        situation: "Your current (XX)% utilization rate is low, and your pipeline is inconsistent. You are doing the work, but the results aren't predictable yet.",
        recommendations: [
          "Analyzing your sales funnel to see where you are losing leads.",
          "Increasing your volume of outreach to smooth out the inconsistency.",
          "Refining your value proposition to ensure it resonates with your unique interests, superpowers, and skills.",
          "Tweaking the articulation and positioning of your value proposition so that it stands out to the ideal client profile (ICP).",
          "Partnering with Fractional First or other leaders to cross-refer opportunities.",
          "Joining various community workshops and/or Fractional First coaching to accelerate your growth and to stabilize your lead flow."
        ]
      },
      acceptable: {
        situation: "Your current (XX)% utilization rate is acceptable, and your pipeline is developing. You are heading in the right direction, but need more stability.",
        recommendations: [
          "Systematizing your business development routine to make it less time-consuming.",
          "Focusing on nurturing the leads you have rather than just chasing new ones.",
          "Reviewing your pricing to ensure you aren't underpricing just to fill gaps, a common mistake at this stage that impacts long-term profitability.",
          "Implementing short, focused weekly time blocks for pipeline follow-ups and maintenance to actively smooth out the inconsistency.",
          "Engaging with Fractional First coaching to master conversion techniques and establish a more stable, predictable pipeline."
        ]
      },
      good: {
        situation: "Your current (XX)% utilization rate is strong, and your pipeline is showing promise. You are doing well, but it feels a bit chaotic.",
        recommendations: [
          "Being more selective with new leads, focusing on \"ideal\" clients.",
          "Dedicating Friday afternoons to pipeline maintenance and follow-ups.",
          "Preventing client delivery from bleeding into your sales time.",
          "Leveraging your current work to create case studies that attract inbound interest.",
          "Leveraging Fractional First resources to optimize your time management."
        ]
      },
      great: {
        situation: "Your current (XX)% utilization rate is great, though your pipeline remains inconsistent. You risk burnout if you don't manage this carefully.",
        recommendations: [
          "Pricing your limited availability at a premium.",
          "Blocking specific time on your calendar for BD, even when busy.",
          "Using your high utilization as social proof: \"I'm fully booked.\"",
          "Outsourcing the more task-oriented stuff to free up time, possibly with the help of Fractional First.",
          "Extending current contracts rather than finding net-new clients.",
          "Referring weak or non-ideal leads to Fractional First to earn a referral fee while you focus on the highest-value opportunities."
        ]
      },
      excellent: {
        situation: "Your current (XX)% utilization rate is exceptional, but your inconsistent pipeline is a risk. You might be over-servicing clients.",
        recommendations: [
          "Maintaining consistency in BD to avoid dropping the ball.",
          "Using your high utilization as social proof: \"I'm fully booked.\"",
          "Outsourcing the more task-oriented stuff to free up time, possibly with the help of Fractional First.",
          "Referring weak leads to Fractional First to earn a fee."
        ]
      }
    },
    // Steady
    good: {
      'very-low': {
        situation: "Your current (XX)% utilization rate is low, but you have a steady flow of qualified leads. You are in a prime position to convert leads with confidence and leverage.",
        recommendations: [
          "Maintaining confidence in your pricing and implementing a strategic, moderate rate increase for new clients.",
          "Strictly qualifying leads to focus only on best-fit clients with long-term partnership potential.",
          "Productizing your service offerings or building templates to increase efficiency and margin on delivery.",
          "Reviewing and automating parts of your sales process to make lead conversion more efficient and less time-consuming.",
          "Leveraging Fractional First coaching to refine your closing techniques."
        ]
      },
      acceptable: {
        situation: "Your current (XX)% utilization rate is acceptable, and your pipeline is steady. You have found a sustainable rhythm, but the time is right to shift from maintenance to optimization to increase profitability.",
        recommendations: [
          "Systematizing your core BD efforts (e.g., weekly content posting, quarterly check-ins) to ensure the steady flow doesn't dry up when you ramp up delivery.",
          "Productizing your services (e.g., creating a standard 30-day assessment or template package) for better delivery efficiency and higher margins.",
          "Being more selective with new opportunities, focusing on projects that provide the best case studies, highest profit, or strongest referral potential.",
          "Setting a moderate rate increase for your next new client to test the market and establish a higher baseline for your fees."
        ]
      },
      good: {
        situation: "Your current (XX)% utilization rate is strong, supported by a steady pipeline. You are in a very healthy state; the time for optimization and leverage is now.",
        recommendations: [
          "Systematically increasing your rates for new clients.",
          "Evaluating your rates for new clients, as your high demand and steady pipeline may justify a premium price point.",
          "Productizing your core service offerings to increase efficiency and margin, allowing you to grow without adding more hours.",
          "Setting clear, non-negotiable boundaries to protect your BD and personal time from sales and delivery creep.",
          "Being highly selective with new projects, only accepting those that align with your highest long-term goals or provide excellent case studies."
        ]
      },
      great: {
        situation: "Your current (XX)% utilization rate is high, and your pipeline remains steady. You are approaching a bottleneck.",
        recommendations: [
          "Referring excess work to Fractional First to earn referral fees.",
          "Increasing prices to naturally manage demand.",
          "Moving away from \"hours for dollars\" toward value-based or flat-fee pricing.",
          "Referring excess demand to Fractional First to earn a referral fee."
        ]
      },
      excellent: {
        situation: "Your current (XX)% utilization rate is maxed out, and you have steady leads. Supply and demand are in your favor.",
        recommendations: [
          "Raising rates immediately for any new inquiries.",
          "Switching to \"passive attraction\" BD (content/referrals) versus active outreach.",
          "Referring excess demand to Fractional First to earn a referral fee."
        ]
      }
    },
    // Strong
    excellent: {
      'very-low': {
        situation: "Your current (XX)% utilization rate is low, but your pipeline is strong. You are poised for a rapid increase in workload.",
        recommendations: [
          "Maintaining confidence in your sales conversations.",
          "Auditing your pricing before signing new contracts; perhaps you want to engage with 1-2 clients who can provide a stable base at the current price.",
          "Qualifying leads to focus exclusively on the highest-margin, best-fit clients with significant long-term potential.",
          "Productizing your service offering (e.g., creating a fixed-scope assessment or playbook) to scale your impact and decouple income from hours.",
          "Referring excess, non-ideal leads to Fractional First or trusted partners to earn a referral fee while preserving your focus."
        ]
      },
      acceptable: {
        situation: "Your current (XX)% utilization rate is healthy, and your pipeline is strong. You have the luxury of choice and are well-positioned for strategic growth.",
        recommendations: [
          "Assessing upcoming leads for optimal cultural fit and best-case-study potential before you commit to signing them.",
          "Preparing to onboard new clients efficiently and building systems now so you don't get overwhelmed when you shift to a higher utilization band.",
          "Considering moderate rate increases, but initially dialing it back to \"maintenance mode\" (e.g., focused content and network-nurturing instead of aggressive outreach).",
          "Nudging your rates up for all new incoming leads, as your strong demand justifies a higher price point."
        ]
      },
      good: {
        situation: "Your current (XX)% utilization rate is strong, supported by a robust pipeline. This is the \"Fractional Dream\" scenario.",
        recommendations: [
          "Building a waitlist to increase your perceived value.",
          "Cycling out lower-paying clients—referring them to Fractional First to earn a fee.",
          "Focusing on relationship building and high-leverage networking.",
          "Elevating your service offering from \"hours for dollars\" to productized, high-value packages that further decouple your time from your income.",
          "Supporting the community of fractional leaders by sharing your experience."
        ]
      },
      great: {
        situation: "Your current (XX)% utilization rate and pipeline are both very strong. You are operating at peak performance.",
        recommendations: [
          "Raising your rates for all new incoming leads.",
          "Being ruthless with your time management and prioritization.",
          "Assembling a bigger team to handle the load, possibly with the help of Fractional First.",
          "Elevating your service offering from \"hours for dollars\" to productized, high-value packages that further decouple your time from your income.",
          "Referring excess demand to Fractional First to earn a referral fee."
        ]
      },
      excellent: {
        situation: "Your current (XX)% utilization rate is maxed out, and you have healthy demand. You are in excellent performance.",
        recommendations: [
          "Raising rates to capitalize on demand.",
          "Assembling a bigger team, possibly with the help of Fractional First, to scale your delivery.",
          "Referring excess demand to Fractional First to monetize your overflow via referral fees.",
          "Helping the community of fractional leaders by sharing your experience."
        ]
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
