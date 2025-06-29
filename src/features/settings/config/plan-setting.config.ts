type PlanSettingValue = number | string | boolean;

export const planSetting: Record<
  string,
  {
    starter: PlanSettingValue;
    pro: PlanSettingValue;
    premium: PlanSettingValue;
  }
> = {
  numberOfPostsToScrapePerDay: {
    starter: 20,
    pro: 50,
    premium: 100,
  },
  tagAuthor: {
    starter: false,
    pro: true,
    premium: true,
  },
  engagementThreshold: {
    starter: false,
    pro: false,
    premium: true,
  },
  scrapeRules: {
    starter: false,
    pro: true,
    premium: true,
  },
  commentRules: {
    starter: false,
    pro: true,
    premium: true,
  },
};
