"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PdfDocumentListItem } from "@/modules/knowledge/types";

import { uploadPdfAction } from "./actions";
import { PdfDocumentList } from "./pdf-document-list";

type PdfUploadProps = {
  documents: PdfDocumentListItem[];
};

export function PdfUpload({ documents }: PdfUploadProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);
    setSuccess(false);

    const file = inputRef.current?.files?.[0];
    if (!file) {
      setServerError("Selecione um arquivo PDF.");
      return;
    }

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadPdfAction(formData);

      if (result.error) {
        setServerError(result.error);
        return;
      }

      setSuccess(true);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Upload de PDF</CardTitle>
          <CardDescription>
            Envie documentos para indexação semântica na base de conhecimento.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pdf-file">Arquivo PDF</Label>
              <Input
                id="pdf-file"
                ref={inputRef}
                type="file"
                accept="application/pdf"
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground">
                Máximo 10 MB. O texto será extraído, dividido em trechos e
                indexado.
              </p>
            </div>

            {serverError ? (
              <p className="text-sm text-destructive" role="alert">
                {serverError}
              </p>
            ) : null}

            {success ? (
              <p
                className="text-sm text-green-700 dark:text-green-400"
                role="status"
              >
                PDF processado com sucesso.
              </p>
            ) : null}
          </CardContent>

          <CardFooter className="border-t-0 bg-transparent">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Processando…" : "Enviar PDF"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <PdfDocumentList documents={documents} />
    </div>
  );
}
