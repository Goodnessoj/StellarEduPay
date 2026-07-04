# StellarEduPay Operator Runbooks

These runbooks cover the main operational failures for the async payment path: Redis or queue outage, Horizon outage, Mongo or database outage, stuck payments, key rotation, and restore.

## General Incident Steps

1. Open an incident record with time, environment, reporter, and affected tenants.
2. Assign an incident commander, API operator, database operator, and communications owner.
3. Freeze non-essential deployments.
4. Preserve logs, queue state, deployment SHA, and database snapshot metadata.
5. Decide whether to run in read-only mode, maintenance mode, or full recovery mode.

## Redis Or Queue Down

Symptoms: payment requests are accepted but not processed, workers cannot dequeue jobs, retry counts stop changing, or queue health checks fail.

Response: put payment creation into read-only mode if jobs cannot be durably enqueued, stop failing workers if they increase load, check connection strings and capacity, confirm queued jobs are preserved, and restart workers after health is restored.

Recovery checks: no duplicate jobs for the same idempotency key, dead-letter queue reviewed, stuck payments retried or marked manual-review, and user-visible status is accurate.

## Horizon Or Stellar Network Down

Symptoms: transaction submission fails or times out, ledger reads are delayed, payments remain submitted or unknown, or reconciliation jobs fail across many tenants.

Response: stop new submissions if failures are widespread, keep reconciliation retries with bounded backoff, switch to an approved backup endpoint only if configured, and do not mark unknown payments as failed until ledger status is confirmed.

## Mongo Or Database Down

Symptoms: API cannot load sessions, tenants, or payments; workers cannot persist status changes; audit event writes fail.

Response: stop new payment writes, stop workers before they perform external writes that cannot be persisted, preserve logs and metrics, restore service or fail over, and run integrity checks before re-enabling workers.

## Stuck Payments

Triage payment ID, tenant ID, user ID, idempotency key, amount, asset, destination, current state, last worker attempt, transaction hash, and last Horizon response.

Procedure: if a transaction hash exists, query Stellar/Horizon directly. If confirmed, update payment state with an audit reason. If failed, mark failed with the failure reason. If no hash exists and no transfer occurred, retry from queued state. If state is ambiguous, keep manual-review and do not retry automatically.

## Key Rotation

Rotate JWT or session secrets, webhook secrets, database credentials, queue credentials, deployment tokens, and Stellar signing credentials when compromise is suspected, operator membership changes, or the scheduled interval expires.

Rotation order: create replacement secret, deploy dual-read support if required, rotate provider-side secret, redeploy API and workers, revoke old secret, verify operations, and record rotation time and operator.

## Restore Procedure

1. Stop API writes and workers.
2. Create a forensic snapshot of the current database.
3. Restore the latest known-good backup into staging.
4. Run migrations and integrity checks against staging.
5. Compare restored payments with on-chain transaction state.
6. Decide whether to promote the backup or repair selected records.
7. Communicate RPO impact before production promotion.
8. Resume workers only after database and queue state are consistent.
