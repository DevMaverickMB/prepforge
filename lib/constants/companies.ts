export interface CompanySeed {
  name: string;
  tier: "tier_1" | "tier_2" | "tier_3";
  careers_page_url: string;
}

export const COMPANIES_SEED: CompanySeed[] = [
  // Tier 1
  { name: "Google India", tier: "tier_1", careers_page_url: "https://careers.google.com" },
  { name: "Microsoft India", tier: "tier_1", careers_page_url: "https://careers.microsoft.com" },
  { name: "Amazon India", tier: "tier_1", careers_page_url: "https://amazon.jobs" },
  { name: "Meta India", tier: "tier_1", careers_page_url: "https://metacareers.com" },
  { name: "Nvidia India", tier: "tier_1", careers_page_url: "https://nvidia.com/careers" },
  { name: "Flipkart", tier: "tier_1", careers_page_url: "https://flipkartcareers.com" },
  { name: "Uber India", tier: "tier_1", careers_page_url: "https://uber.com/careers" },
  { name: "Databricks", tier: "tier_1", careers_page_url: "https://databricks.com/careers" },
  { name: "Adobe India", tier: "tier_1", careers_page_url: "https://adobe.com/careers" },

  // Tier 2
  { name: "Salesforce India", tier: "tier_2", careers_page_url: "https://salesforce.com/careers" },
  { name: "Walmart Global Tech", tier: "tier_2", careers_page_url: "https://careers.walmart.com" },
  { name: "Goldman Sachs India", tier: "tier_2", careers_page_url: "https://goldmansachs.com/careers" },
  { name: "JPMorgan India", tier: "tier_2", careers_page_url: "https://careers.jpmorgan.com" },
  { name: "Target Tech India", tier: "tier_2", careers_page_url: "https://target.com/careers" },
  { name: "Razorpay", tier: "tier_2", careers_page_url: "https://razorpay.com/careers" },
  { name: "PhonePe", tier: "tier_2", careers_page_url: "https://phonepe.com/careers" },
  { name: "Swiggy", tier: "tier_2", careers_page_url: "https://careers.swiggy.com" },
  { name: "Meesho", tier: "tier_2", careers_page_url: "https://meesho.io/careers" },
  { name: "Visa India", tier: "tier_2", careers_page_url: "https://visa.com/careers" },
  { name: "American Express India", tier: "tier_2", careers_page_url: "https://americanexpress.com/careers" },
  { name: "Jio Platforms", tier: "tier_2", careers_page_url: "https://jio.com/careers" },
  { name: "Palantir", tier: "tier_2", careers_page_url: "https://palantir.com/careers" },
  { name: "Snowflake", tier: "tier_2", careers_page_url: "https://snowflake.com/careers" },
  { name: "McKinsey QuantumBlack", tier: "tier_2", careers_page_url: "https://mckinsey.com/careers" },
  { name: "BCG X", tier: "tier_2", careers_page_url: "https://bcg.com/careers" },
];
