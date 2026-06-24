"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import { faqFormSchema, type FaqFormValues } from "@/modules/knowledge/schema";
import type { FaqItem } from "@/modules/knowledge/types";

import {
  createFaqAction,
  deleteFaqAction,
  updateFaqAction,
} from "./actions";

type FaqManagerProps = {
  faqs: FaqItem[];
};

const emptyValues: FaqFormValues = {
  question: "",
  answer: "",
};

export function FaqManager({ faqs }: FaqManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: emptyValues,
  });

  const startCreate = () => {
    setEditingId(null);
    setServerError(null);
    setSuccess(false);
    reset(emptyValues);
  };

  const startEdit = (faq: FaqItem) => {
    setEditingId(faq.id);
    setServerError(null);
    setSuccess(false);
    reset({
      question: faq.question,
      answer: faq.answer,
    });
  };

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = editingId
        ? await updateFaqAction(editingId, data)
        : await createFaqAction(data);

      if (result.error) {
        setServerError(result.error);
        return;
      }

      setSuccess(true);
      setEditingId(null);
      reset(emptyValues);
      router.refresh();
    });
  });

  const handleDelete = (id: string) => {
    if (!window.confirm("Excluir esta pergunta frequente?")) {
      return;
    }

    setServerError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await deleteFaqAction(id);

      if (result.error) {
        setServerError(result.error);
        return;
      }

      if (editingId === id) {
        setEditingId(null);
        reset(emptyValues);
      }

      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{editingId ? "Editar FAQ" : "Nova FAQ"}</CardTitle>
          <CardDescription>
            Cadastre perguntas e respostas para o assistente consultar.
          </CardDescription>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Pergunta</Label>
              <Input
                id="question"
                placeholder="Qual o prazo de entrega?"
                disabled={isPending}
                aria-invalid={Boolean(errors.question)}
                {...register("question")}
              />
              {errors.question ? (
                <p className="text-sm text-destructive" role="alert">
                  {errors.question.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Resposta</Label>
              <Textarea
                id="answer"
                rows={4}
                placeholder="O prazo médio é de 7 a 10 dias úteis após aprovação."
                disabled={isPending}
                aria-invalid={Boolean(errors.answer)}
                {...register("answer")}
              />
              {errors.answer ? (
                <p className="text-sm text-destructive" role="alert">
                  {errors.answer.message}
                </p>
              ) : null}
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
                FAQ salva com sucesso.
              </p>
            ) : null}
          </CardContent>

          <CardFooter className="gap-2 border-t-0 bg-transparent">
            {editingId ? (
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={startCreate}
              >
                Cancelar
              </Button>
            ) : null}
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Salvando…"
                : editingId
                  ? "Atualizar"
                  : "Adicionar"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">
          Perguntas cadastradas ({faqs.length})
        </h2>

        {faqs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma FAQ cadastrada ainda.
          </p>
        ) : (
          <ul className="space-y-3">
            {faqs.map((faq) => (
              <li key={faq.id}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {faq.answer}
                    </p>
                  </CardContent>
                  <CardFooter className="gap-2 border-t-0 bg-transparent pt-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => startEdit(faq)}
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleDelete(faq.id)}
                    >
                      Excluir
                    </Button>
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
