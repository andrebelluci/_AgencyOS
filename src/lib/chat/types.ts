export type ChatUiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "complete" | "streaming" | "error";
};

export type ChatWidgetConfig = {
  publicKey: string;
  companyName: string;
  welcomeMessage: string;
  primaryColor?: string | null;
  whatsapp?: string | null;
};
