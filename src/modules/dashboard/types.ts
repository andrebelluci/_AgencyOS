export type DashboardMetrics = {
  totalConversations: number;
  totalLeads: number;
  leadsThisWeek: number;
};

export type ConversionPeriod = "7d" | "30d";

export type ConversionFunnelMetrics = {
  period: ConversionPeriod;
  chatSessions: number;
  messages: number;
  leads: number;
  whatsappClicks: number;
};
