# Modulo 1 - Reservas

## Objetivo

O modulo de Reservas e o centro de controle comercial e operacional da hospedagem. Ele controla disponibilidade, reservas individuais, reservas de grupo, overbooking autorizado, lista de espera, historico, auditoria e movimentacoes feitas no mapa hoteleiro.

## Entidades

- `RoomType`: categoria do quarto, capacidade, tarifa base e status ativo.
- `Room`: unidade fisica, numero, andar, categoria e status operacional.
- `RatePlan`: tarifario por categoria, incluindo regras dinamicas.
- `Reservation`: agregado principal da reserva individual.
- `GroupReservation`: bloqueio de multiplos quartos, rooming list, empresas e eventos.
- `WaitlistEntry`: fila operacional quando nao ha disponibilidade.
- `ReservationHistory`: historico funcional de alteracoes da reserva.
- `AuditLog`: auditoria tecnica obrigatoria para toda movimentacao.

## Banco PostgreSQL

A estrutura esta definida em `apps/api/database/migrations/001_create_reservations.sql`.

Padroes obrigatorios aplicados:

- Todas as tabelas operacionais possuem `tenant_id`.
- Indices por tenant e periodo nas consultas de disponibilidade.
- Checks de datas e valores monetarios.
- Trigger de protecao contra relacionamento de quarto de outro tenant.
- Auditoria em tabela propria com `actor_id`, `correlation_id`, `before` e `after`.

## APIs REST

Base path: `/reservations`

| Metodo | Rota | Permissao | Finalidade |
| --- | --- | --- | --- |
| `GET` | `/reservations/availability` | `reservations:view` | Mapa de disponibilidade por dia, semana, quinzena ou mes |
| `POST` | `/reservations` | `reservations:create` | Cria reserva individual |
| `POST` | `/reservations/groups` | `reservations:group:create` | Contrato de reserva de grupo |
| `PATCH` | `/reservations/:id/move` | `reservations:move` | Move reserva entre quartos ou datas |
| `DELETE` | `/reservations/:id` | `reservations:cancel` | Cancela reserva |

Headers obrigatorios:

- `x-tenant-id`: tenant atual.
- `Authorization`: token JWT quando a autenticacao for conectada.
- `x-correlation-id`: recomendado para rastreabilidade.

## DTOs

- `CreateReservationDto`: hospede, categoria, quarto opcional, quantidade de hospedes, datas, origem, tarifa, observacoes e autorizacao de overbooking.
- `MoveReservationDto`: quarto e novo periodo.
- `CreateGroupReservationDto`: nome do grupo, empresa, evento, periodo, quartos bloqueados e rooming list.
- `AvailabilityQueryDto`: modo de visualizacao, data inicial, categoria e pesquisa.

## Casos de Uso

- `CreateReservationUseCase`
  - Valida categoria e capacidade.
  - Valida quarto quando informado.
  - Consulta conflitos por periodo.
  - Decide disponibilidade, overbooking ou lista de espera.
  - Calcula total por noites.
  - Persiste e audita.

- `MoveReservationUseCase`
  - Recalcula periodo.
  - Bloqueia colisao em drag-and-drop.
  - Persiste before/after em auditoria.

- `CancelReservationUseCase`
  - Bloqueia cancelamento de reserva em hospedagem ou encerrada.
  - Audita a alteracao.

## Regras de Negocio

- Check-out deve ser posterior ao check-in.
- Reserva deve possuir pelo menos um adulto.
- Criancas nao podem ser negativas.
- Categoria deve suportar a quantidade de hospedes.
- Quarto em manutencao, bloqueado ou interditado nao recebe reserva.
- Reserva futura pode ser movida; reserva em hospedagem segue fluxo de recepcao.
- Overbooking exige permissao `reservations:overbook` na camada de produto antes de expor o controle visual.
- Sem disponibilidade e sem overbooking, a reserva vira `waitlisted`.
- Todas as alteracoes relevantes geram auditoria.

## Permissoes

- `reservations:view`
- `reservations:create`
- `reservations:update`
- `reservations:cancel`
- `reservations:move`
- `reservations:overbook`
- `reservations:group:create`
- `reservations:waitlist:manage`

## Layout das Telas

### Mapa de Disponibilidade

- Toolbar fixa com filtros por categoria, periodo e busca.
- Segmento de visualizacao: dia, semana, quinzena e mes.
- Grade por quarto nas linhas e datas nas colunas.
- Cores operacionais consistentes:
  - Livre: verde discreto.
  - Ocupado: azul.
  - Reservado: amarelo.
  - Limpeza: ciano.
  - Manutencao: vermelho.
  - Bloqueado/interditado: cinza escuro.
- Cards de reserva arrastaveis com hospede, codigo e periodo.

### Reserva Individual

- Dados do hospede.
- Hospedagem e categoria.
- Tarifario.
- Observacoes.
- Painel lateral com disponibilidade e total estimado.

### Reserva de Grupo

- Cabecalho com empresa/evento.
- Bloqueio de quartos.
- Rooming list editavel.
- Conversao de bloqueios em reservas individuais.

## Fluxos Completos

1. Usuario abre mapa de disponibilidade.
2. Seleciona periodo e categoria.
3. Cria reserva individual ou bloqueio de grupo.
4. Sistema valida capacidade, disponibilidade e status operacional do quarto.
5. Sistema calcula tarifa e registra reserva.
6. Caso nao haja disponibilidade:
   - com autorizacao: gera overbooking auditado;
   - sem autorizacao: inclui em lista de espera.
7. Alteracoes por drag-and-drop acionam `PATCH /reservations/:id/move`.
8. Cancelamentos acionam auditoria com estado anterior e posterior.

## Testes Automatizados

Cobertura inicial:

- Periodo invalido.
- Calculo de noites.
- Capacidade da categoria.
- Decisao de disponibilidade.
- Overbooking controlado.
- Lista de espera.

## Swagger

Disponivel em `/docs` quando a API estiver rodando. Todos os endpoints do modulo possuem tags, summaries e DTOs com metadados.

## Proximos passos tecnicos

- Criar read model materializado para disponibilidade por periodo.
- Implementar persistencia completa de reservas de grupo.
- Conectar autenticacao JWT real e RBAC por tenant.
- Adicionar eventos de dominio para atualizar recepcao, governanca e BI.
