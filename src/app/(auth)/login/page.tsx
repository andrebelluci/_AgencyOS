import { LoginForm } from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/dashboard";

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
          <p className="text-sm text-muted-foreground">
            Acesse o painel do Agency OS
          </p>
        </div>

        {params.error ? (
          <p className="text-center text-sm text-destructive" role="alert">
            Não foi possível concluir a autenticação. Tente novamente.
          </p>
        ) : null}

        <LoginForm next={next} />
      </div>
    </div>
  );
}
