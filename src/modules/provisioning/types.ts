export type ProvisionTenantInput = {
  companyName: string;
  slug?: string;
  ownerEmail: string;
  ownerPassword: string;
  ownerName?: string;
};

export type ProvisionTenantResult = {
  tenantId: string;
  slug: string;
  publicKey: string;
  ownerAuthId: string;
  ownerEmail: string;
  ownerPassword: string;
  /** `true` when a new tenant row was inserted; `false` when slug already existed. */
  created: boolean;
};

export class ProvisioningError extends Error {
  constructor(
    message: string,
    readonly code:
      | "INVALID_INPUT"
      | "AUTH_FAILED"
      | "DB_FAILED"
      | "OWNER_CONFLICT",
  ) {
    super(message);
    this.name = "ProvisioningError";
  }
}
