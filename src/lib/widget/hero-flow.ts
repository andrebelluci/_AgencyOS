export const HERO_FLOW_FIELDS = [
  "service",
  "city",
  "deadline",
  "name",
  "phone",
] as const;

export type HeroFlowField = (typeof HERO_FLOW_FIELDS)[number];

export type HeroFlowStepType = "choice" | "text";

export type HeroFlowOption = {
  label: string;
  value: string;
};

export type HeroFlowStepConfig = {
  id: string;
  type: HeroFlowStepType;
  field: HeroFlowField;
  question: string;
  placeholder?: string;
  options?: HeroFlowOption[];
  optionsSource?: "services";
};

export type HeroFlowConfig = {
  enabled: boolean;
  welcomeMessage: string;
  completionMessage: string;
  steps: HeroFlowStepConfig[];
};

export const DEFAULT_HERO_DEADLINE_OPTIONS: HeroFlowOption[] = [
  { label: "Urgente (esta semana)", value: "urgente" },
  { label: "Até 30 dias", value: "30_dias" },
  { label: "1 a 3 meses", value: "1_3_meses" },
  { label: "Sem pressa", value: "sem_pressa" },
];

export const DEFAULT_HERO_SERVICE_OPTIONS: HeroFlowOption[] = [
  { label: "Orçamento / consulta", value: "orcamento" },
  { label: "Reforma", value: "reforma" },
  { label: "Acabamento", value: "acabamento" },
  { label: "Outro", value: "outro" },
];

export const DEFAULT_HERO_WELCOME_MESSAGE =
  "Olá! Vou fazer algumas perguntas rápidas para entender sua necessidade.";

export const DEFAULT_HERO_COMPLETION_MESSAGE =
  "Perfeito! Registramos seu interesse. Fale conosco pelo WhatsApp para avançar com seu projeto.";

export function buildDefaultHeroFlowSteps(
  services: string[] = [],
): HeroFlowStepConfig[] {
  const serviceOptions =
    services.length > 0
      ? services.map((service) => ({ label: service, value: service }))
      : DEFAULT_HERO_SERVICE_OPTIONS;

  return [
    {
      id: "service",
      type: "choice",
      field: "service",
      question: "Qual serviço você procura?",
      options: serviceOptions,
    },
    {
      id: "city",
      type: "text",
      field: "city",
      question: "Em qual cidade está sua obra?",
      placeholder: "Ex: Campinas",
    },
    {
      id: "deadline",
      type: "choice",
      field: "deadline",
      question: "Qual seu prazo?",
      options: DEFAULT_HERO_DEADLINE_OPTIONS,
    },
    {
      id: "name",
      type: "text",
      field: "name",
      question: "Qual seu nome?",
      placeholder: "Seu nome",
    },
    {
      id: "phone",
      type: "text",
      field: "phone",
      question: "Qual seu WhatsApp?",
      placeholder: "(19) 99999-9999",
    },
  ];
}

export function buildDefaultHeroFlowConfig(
  services: string[] = [],
): HeroFlowConfig {
  return {
    enabled: true,
    welcomeMessage: DEFAULT_HERO_WELCOME_MESSAGE,
    completionMessage: DEFAULT_HERO_COMPLETION_MESSAGE,
    steps: buildDefaultHeroFlowSteps(services),
  };
}

export function resolveHeroFlowConfig(
  stored: HeroFlowConfig | null | undefined,
  services: string[] = [],
): HeroFlowConfig {
  const defaults = buildDefaultHeroFlowConfig(services);

  if (!stored) {
    return defaults;
  }

  const steps =
    stored.steps?.length > 0
      ? stored.steps.map((step) => {
          if (step.optionsSource === "services") {
            const serviceOptions =
              services.length > 0
                ? services.map((service) => ({
                    label: service,
                    value: service,
                  }))
                : DEFAULT_HERO_SERVICE_OPTIONS;

            return {
              ...step,
              options: serviceOptions,
            };
          }

          return step;
        })
      : defaults.steps;

  return {
    enabled: stored.enabled ?? defaults.enabled,
    welcomeMessage: stored.welcomeMessage?.trim() || defaults.welcomeMessage,
    completionMessage:
      stored.completionMessage?.trim() || defaults.completionMessage,
    steps,
  };
}

export type HeroFlowAnswers = Partial<Record<HeroFlowField, string>>;

export type HeroFlowRuntimeStep = {
  id: string;
  type: HeroFlowStepType;
  field: HeroFlowField;
  question: string;
  placeholder?: string;
  options?: HeroFlowOption[];
};

export function resolveStepOptions(
  step: HeroFlowStepConfig,
  services: string[],
): HeroFlowOption[] {
  if (step.optionsSource === "services") {
    return services.length > 0
      ? services.map((service) => ({ label: service, value: service }))
      : DEFAULT_HERO_SERVICE_OPTIONS;
  }

  return step.options ?? [];
}

export function toRuntimeStep(
  step: HeroFlowStepConfig,
  services: string[],
): HeroFlowRuntimeStep {
  return {
    id: step.id,
    type: step.type,
    field: step.field,
    question: step.question,
    placeholder: step.placeholder,
    options:
      step.type === "choice" ? resolveStepOptions(step, services) : undefined,
  };
}

export function getNextStepIndex(
  steps: HeroFlowStepConfig[],
  answers: HeroFlowAnswers,
): number {
  return steps.findIndex((step) => !answers[step.field]?.trim());
}

export function getCurrentRuntimeStep(
  config: HeroFlowConfig,
  answers: HeroFlowAnswers,
  services: string[],
): HeroFlowRuntimeStep | null {
  const index = getNextStepIndex(config.steps, answers);

  if (index < 0) {
    return null;
  }

  return toRuntimeStep(config.steps[index]!, services);
}

export function isHeroFlowComplete(
  config: HeroFlowConfig,
  answers: HeroFlowAnswers,
): boolean {
  return getNextStepIndex(config.steps, answers) < 0;
}

export function validateHeroAnswer(
  field: HeroFlowField,
  value: string,
): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Informe uma resposta.";
  }

  if (field === "phone") {
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length < 10) {
      return "Informe um telefone válido.";
    }
  }

  if (field === "name" && trimmed.length < 2) {
    return "Informe seu nome.";
  }

  return null;
}

export function formatDeadlineLabel(value: string): string {
  const match = DEFAULT_HERO_DEADLINE_OPTIONS.find(
    (option) => option.value === value,
  );
  return match?.label ?? value;
}

export function buildLeadNotesFromHeroAnswers(
  answers: HeroFlowAnswers,
): string {
  const parts: string[] = [];

  if (answers.service) {
    parts.push(`Serviço: ${answers.service}`);
  }

  if (answers.deadline) {
    parts.push(`Prazo: ${formatDeadlineLabel(answers.deadline)}`);
  }

  parts.push("Origem: hero conversacional");

  return parts.join(" | ");
}
