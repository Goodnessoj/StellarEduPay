# Issue Intake Path

StellarEduPay accepts contribution and operations issues through GitHub Issues in this repository. This page defines the intake path so operators, maintainers, and contributors know where to file reports and what information to include.

## Where To File

Use GitHub Issues for bugs in frontend, backend API, worker, queue, webhook, database, Horizon/Stellar integration, documentation gaps, operator runbook updates, and feature requests.

Do not paste secrets, private keys, production tokens, user private data, or unreleased vulnerability details into public issues.

## Security-Sensitive Reports

If a report includes a live exploit, secret, private user data, or a way to move funds without authorization, do not file full details publicly. Open only a minimal public tracking issue if needed and contact maintainers through the private channel documented by the project owner.

## Bug Report Template

- Environment: local, staging, testnet, or production.
- Component: frontend, backend API, worker, queue, webhook, database, Horizon/Stellar.
- Expected behavior.
- Actual behavior.
- Reproduction steps.
- Safe request ID, payment ID, tenant ID, or transaction hash if available.
- Screenshots or logs with secrets removed.

## Operational Issue Template

- Incident time window in UTC.
- Affected tenants or users, if safe to share.
- Dependency involved: Redis, Horizon, Mongo, webhook provider, SSE, deployment, or signing.
- Current user impact.
- Actions already taken.
- Whether writes or workers are paused.

## Maintainer Triage

Maintainers should tag incoming issues by area, severity, status, and contributor fit. Payment, custody, authorization, tenant-isolation, or webhook issues should be reviewed before assignment.
