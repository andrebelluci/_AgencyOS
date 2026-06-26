import type { QuickActionConfig } from "@/lib/widget/quick-actions";

export type WidgetPublicConfig = {
  public_key: string;
  company_name: string;
  welcome_message: string;
  initial_message: string;
  primary_color: string;
  logo_url: string | null;
  quick_actions: Array<{
    label: string;
    type: QuickActionConfig["type"];
    url: string;
  }>;
};
