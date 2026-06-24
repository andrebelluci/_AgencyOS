-- ISSUE-020 — knowledge_documents + knowledge_chunks with pgvector

CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TYPE "public"."knowledge_document_status" AS ENUM('pending', 'processing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."knowledge_document_type" AS ENUM('faq', 'pdf', 'text');--> statement-breakpoint
CREATE TABLE "knowledge_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"title" text NOT NULL,
	"type" "knowledge_document_type" NOT NULL,
	"file_url" text,
	"status" "knowledge_document_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"content" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"embedding" vector(1536),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "knowledge_documents" ADD CONSTRAINT "knowledge_documents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_document_id_knowledge_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."knowledge_documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "knowledge_documents_tenant_id_idx" ON "knowledge_documents" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "knowledge_documents_status_idx" ON "knowledge_documents" USING btree ("status");--> statement-breakpoint
CREATE INDEX "knowledge_chunks_tenant_id_idx" ON "knowledge_chunks" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "knowledge_chunks_document_id_idx" ON "knowledge_chunks" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "knowledge_chunks_embedding_hnsw_idx" ON "knowledge_chunks" USING hnsw ("embedding" vector_cosine_ops);
