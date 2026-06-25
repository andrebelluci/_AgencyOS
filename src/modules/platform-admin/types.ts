export type PlatformMetrics = {
  totalTenants: number;
  leadsLast7Days: number;
  conversationsLast7Days: number;
  messagesLast7Days: number;
};

export type TenantListItem = {
  id: string;
  name: string;
  slug: string;
  publicKey: string;
  status: "active" | "inactive";
  createdAt: Date;
};
