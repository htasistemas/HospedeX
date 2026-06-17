# HospedeX Network

Plataforma operacional multi-tenant para hoteis, moteis, pousadas, resorts e demais negocios de hospedagem.

## Fundacao tecnica

- Frontend: React, TypeScript, Tailwind e Shadcn/UI.
- Backend: Node.js, NestJS, TypeScript e PostgreSQL.
- Arquitetura: Clean Architecture, SOLID e DDD.
- Multi-tenancy: todo agregado operacional possui `tenant_id`.
- Compliance operacional: auditoria, logs, permissoes por perfil e trilha de alteracoes.

## Modulo implementado nesta etapa

O primeiro modulo estruturado e o de Reservas. A documentacao tecnica completa esta em:

- [docs/reservations-module.md](docs/reservations-module.md)
- [docs/reservations-erd.md](docs/reservations-erd.md)
- [apps/api/database/migrations/001_create_reservations.sql](apps/api/database/migrations/001_create_reservations.sql)

## Comandos

```bash
pnpm install
pnpm db:up
pnpm test
pnpm dev:api
pnpm dev:web
```

Ambiente local de teste:

- Frontend: http://localhost:5173
- Backend Swagger: http://localhost:3000/docs
- Tenant de desenvolvimento: `00000000-0000-0000-0000-000000000001`

Se o Docker Desktop nao estiver rodando, use a API em memoria:

```bash
pnpm dev:api:memory
```
