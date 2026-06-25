"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PdfDocumentListItem } from "@/modules/knowledge/types";

import { deletePdfAction, reindexPdfAction } from "./actions";

type PdfDocumentListProps = {
  documents: PdfDocumentListItem[];
};

const statusLabels: Record<PdfDocumentListItem["status"], string> = {
  pending: "Pendente",
  processing: "Processando",
  ready: "Pronto",
  failed: "Falhou",
};

const statusClassNames: Record<PdfDocumentListItem["status"], string> = {
  pending: "text-amber-700 dark:text-amber-400",
  processing: "text-blue-700 dark:text-blue-400",
  ready: "text-green-700 dark:text-green-400",
  failed: "text-destructive",
};

export function PdfDocumentList({ documents }: PdfDocumentListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Excluir o documento "${title}"?`)) {
      return;
    }

    setError(null);
    setActiveId(id);

    startTransition(async () => {
      const result = await deletePdfAction(id);

      if (result.error) {
        setError(result.error);
        setActiveId(null);
        return;
      }

      setActiveId(null);
      router.refresh();
    });
  };

  const handleReindex = (id: string) => {
    setError(null);
    setActiveId(id);

    startTransition(async () => {
      const result = await reindexPdfAction(id);

      if (result.error) {
        setError(result.error);
        setActiveId(null);
        return;
      }

      setActiveId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-medium">
        Documentos PDF ({documents.length})
      </h2>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {documents.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum PDF enviado ainda.
        </p>
      ) : (
        <ul className="space-y-3">
          {documents.map((document) => {
            const isActive = isPending && activeId === document.id;
            const canReindex =
              document.fileUrl !== null &&
              document.status !== "processing" &&
              document.status !== "pending";

            return (
              <li key={document.id}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{document.title}</CardTitle>
                    <CardDescription>
                      Enviado em {document.createdAtLabel}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={`font-medium ${statusClassNames[document.status]}`}
                      >
                        {statusLabels[document.status]}
                      </span>
                    </p>
                  </CardContent>
                  <CardFooter className="gap-2 border-t-0 bg-transparent pt-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPending || !canReindex}
                      onClick={() => handleReindex(document.id)}
                    >
                      {isActive ? "Reindexando…" : "Reindexar"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleDelete(document.id, document.title)}
                    >
                      Excluir
                    </Button>
                  </CardFooter>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
