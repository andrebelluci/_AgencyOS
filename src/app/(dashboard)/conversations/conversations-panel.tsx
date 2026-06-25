"use client";

import { useEffect, useState, useTransition } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CONVERSATION_STATUS_LABELS } from "@/modules/conversations/constants";
import type {
  ConversationListItem,
  MessageListItem,
} from "@/modules/conversations/types";

import { getConversationMessagesAction } from "./actions";
import { ConversationMessage } from "./conversation-message";

type ConversationsPanelProps = {
  conversations: ConversationListItem[];
};

function truncateVisitorId(visitorId: string): string {
  if (visitorId.length <= 12) {
    return visitorId;
  }

  return `${visitorId.slice(0, 8)}…`;
}

function formatEmpty(value: string | null | undefined): string {
  return value?.trim() ? value : "—";
}

export function ConversationsPanel({ conversations }: ConversationsPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageListItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedId,
  );

  const openConversation = (conversationId: string) => {
    setSelectedId(conversationId);
    setMessages([]);
    setLoadError(null);

    startTransition(async () => {
      const result = await getConversationMessagesAction(conversationId);

      if (result.error) {
        setLoadError(result.error);
        return;
      }

      setMessages(result.messages ?? []);
    });
  };

  const closeDrawer = () => {
    setSelectedId(null);
    setMessages([]);
    setLoadError(null);
  };

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  if (conversations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="text-sm font-medium">Nenhuma conversa ainda</p>
        <p className="mt-1 text-sm text-muted-foreground">
          As conversas do assistente virtual aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visitante</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Iniciada em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conversations.map((conversation) => (
              <TableRow
                key={conversation.id}
                className="cursor-pointer"
                data-state={
                  selectedId === conversation.id ? "selected" : undefined
                }
                onClick={() => openConversation(conversation.id)}
              >
                <TableCell className="font-mono text-sm">
                  {truncateVisitorId(conversation.visitorId)}
                </TableCell>
                <TableCell>{formatEmpty(conversation.leadName)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      conversation.status === "active" ? "default" : "secondary"
                    }
                  >
                    {CONVERSATION_STATUS_LABELS[conversation.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {conversation.startedAtLabel}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedId ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Fechar histórico"
            className="absolute inset-0 bg-black/40"
            onClick={closeDrawer}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Histórico da conversa"
            className="relative z-10 flex h-full w-full max-w-lg flex-col border-l bg-background shadow-xl"
          >
            <header className="flex items-start justify-between gap-4 border-b px-4 py-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Histórico da conversa</h2>
                {selectedConversation ? (
                  <p className="text-sm text-muted-foreground">
                    Visitante{" "}
                    <span className="font-mono">
                      {truncateVisitorId(selectedConversation.visitorId)}
                    </span>
                    {selectedConversation.leadName
                      ? ` · ${selectedConversation.leadName}`
                      : ""}
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={closeDrawer}
                aria-label="Fechar"
              >
                <X className="size-4" />
              </Button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {isPending ? (
                <p className="text-sm text-muted-foreground">
                  Carregando mensagens…
                </p>
              ) : loadError ? (
                <p className="text-sm text-destructive">{loadError}</p>
              ) : messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma mensagem nesta conversa.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((message) => (
                    <ConversationMessage key={message.id} message={message} />
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
