# StellarEduPay Threat Model

This threat model uses STRIDE to document major risks for a multi-tenant, money-moving Stellar payment system.

## Scope

In scope: authentication, tenant isolation, payment creation, transaction submission, reconciliation, webhook ingestion, queue processing, operator actions, key rotation, database integrity, and audit logs.

## Assets

- User identities and sessions.
- Tenant configuration and payment policies.
- Payment records, transaction hashes, and audit events.
- Stellar signing keys or delegated signing credentials.
- Webhook secrets and provider credentials.
- Database backups.
- Operator accounts and deployment credentials.

## STRIDE Analysis

| Category | Risk | Impact | Mitigation |
| --- | --- | --- | --- |
| Spoofing | Stolen session or API token | Unauthorized payment requests | Short-lived sessions, secure cookies, token rotation, session revocation |
| Spoofing | Forged webhook callback | False payment confirmation | Verify signatures, timestamp tolerance, replay protection |
| Tampering | Client changes amount, asset, or destination | Funds sent incorrectly | Server-side validation, tenant policy checks, immutable audit event |
| Tampering | Queue payload replayed | Duplicate payment execution | Idempotency keys and worker-side revalidation |
| Repudiation | Operator changes payment state without trace | No accountability | Immutable audit events with operator identity and reason |
| Information Disclosure | Tenant data leaks across accounts | Privacy and compliance issue | Tenant-scoped queries and authorization tests |
| Information Disclosure | Secrets appear in logs | Credential compromise | Structured redaction, secret scanning, log access controls |
| Denial of Service | Redis or queue unavailable | Payments stuck or delayed | Write pause, retry queues, recovery runbooks |
| Denial of Service | Horizon unavailable | Unknown transaction status | Submission pause and reconciliation retry |
| Elevation of Privilege | User reaches admin actions | Unauthorized recovery or config changes | Role-based access control and admin audit log |

## Money-Moving Controls

- Every payment request must have a tenant, authenticated actor, idempotency key, amount, asset, destination, and purpose.
- Workers must reload canonical payment state before submitting a transaction.
- Reconciliation must tolerate duplicate callbacks and delayed ledger confirmation.
- Manual recovery must require an operator reason and produce an audit event.
- Refund or emergency actions must be reviewed by two operators when production funds are involved.

## Webhook Controls

Verify provider signatures before parsing business fields, reject callbacks outside the allowed timestamp window, store raw and normalized event IDs for deduplication, and never trust webhook state alone when on-chain state can be checked.

## Tenant Isolation Controls

Every query for user-visible payment data must include tenant scope. Tenant IDs must come from authenticated server-side context, not request body alone. Tests should cover cross-tenant reads, writes, webhook events, and SSE subscriptions.
