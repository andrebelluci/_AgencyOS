type WhatsAppClickPayload = {
  public_key: string;
  conversation_id: string;
};

export function trackWhatsAppClickClient(payload: WhatsAppClickPayload): void {
  const body = JSON.stringify(payload);
  const url = "/api/chat/whatsapp-click";

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon(url, blob)) {
      return;
    }
  }

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Non-blocking analytics — opening WhatsApp must not depend on this call.
  });
}
