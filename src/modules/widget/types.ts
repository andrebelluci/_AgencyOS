import type { QuickActionConfig } from "@/lib/widget/quick-actions";
import type { WidgetTheme } from "@/lib/widget/theme";

export type WidgetPublicConfig = {
  public_key: string;
  company_name: string;
  assistant_label: string;
  welcome_message: string;
  initial_message: string;
  primary_color: string;
  theme: WidgetTheme;
  logo_url: string | null;
  quick_actions: Array<{
    label: string;
    type: QuickActionConfig["type"];
    url: string;
  }>;
};
