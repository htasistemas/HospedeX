CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE status_reserva AS ENUM ('draft', 'confirmed', 'guaranteed', 'checked_in', 'checked_out', 'cancelled', 'no_show', 'waitlisted');
CREATE TYPE origem_reserva AS ENUM ('direct', 'phone', 'whatsapp', 'website', 'booking_engine', 'ota', 'corporate', 'event', 'walk_in');
CREATE TYPE status_operacional_quarto AS ENUM ('free', 'occupied', 'reserved', 'cleaning', 'inspected', 'maintenance', 'blocked', 'out_of_order');
CREATE TYPE status_conta AS ENUM ('aberta', 'paga', 'vencida', 'cancelada');
CREATE TYPE tipo_movimento_estoque AS ENUM ('entrada', 'saida', 'transferencia', 'inventario', 'ajuste');

CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome varchar(160) NOT NULL,
  documento varchar(30),
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE propriedades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  nome varchar(160) NOT NULL,
  tipo varchar(40) NOT NULL,
  documento varchar(30),
  telefone varchar(30),
  email varchar(160),
  endereco jsonb NOT NULL DEFAULT '{}',
  horario_checkin time NOT NULL DEFAULT '13:00',
  horario_checkout time NOT NULL DEFAULT '12:00',
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE perfis (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  nome varchar(80) NOT NULL,
  descricao varchar(180),
  permissoes text[] NOT NULL DEFAULT '{}',
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, nome)
);

CREATE TABLE usuarios (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  perfil_id uuid REFERENCES perfis(id),
  nome varchar(160) NOT NULL,
  email varchar(160) NOT NULL,
  senha_hash varchar(255) NOT NULL,
  telefone varchar(30),
  ativo boolean NOT NULL DEFAULT true,
  ultimo_login_em timestamptz,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, email)
);

CREATE TABLE tipos_quarto (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  nome varchar(120) NOT NULL,
  code varchar(30) NOT NULL,
  capacidade_adultos int NOT NULL CHECK (capacidade_adultos >= 1),
  capacidade_criancas int NOT NULL DEFAULT 0 CHECK (capacidade_criancas >= 0),
  tarifa_base numeric(12, 2) NOT NULL CHECK (tarifa_base >= 0),
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, code)
);

CREATE TABLE quartos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  tipo_quarto_id uuid NOT NULL REFERENCES tipos_quarto(id),
  numero varchar(20) NOT NULL,
  andar varchar(20),
  status status_operacional_quarto NOT NULL DEFAULT 'free',
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, numero)
);

CREATE TABLE hospedes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  nome varchar(160) NOT NULL,
  email varchar(160),
  telefone varchar(30),
  documento varchar(40),
  data_nascimento date,
  endereco jsonb NOT NULL DEFAULT '{}',
  preferencias jsonb NOT NULL DEFAULT '{}',
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE empresas_conveniadas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  razao_social varchar(180) NOT NULL,
  nome_fantasia varchar(160),
  documento varchar(30),
  email varchar(160),
  telefone varchar(30),
  limite_credito numeric(12, 2) NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE planos_tarifarios (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  nome varchar(120) NOT NULL,
  tipo varchar(40) NOT NULL,
  tipo_quarto_id uuid NOT NULL REFERENCES tipos_quarto(id),
  tarifa_base numeric(12, 2) NOT NULL CHECK (tarifa_base >= 0),
  regras_dinamicas jsonb NOT NULL DEFAULT '{}',
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reservas_grupo (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  nome varchar(160) NOT NULL,
  empresa_id uuid REFERENCES empresas_conveniadas(id),
  nome_evento varchar(160),
  data_entrada date NOT NULL,
  data_saida date NOT NULL,
  quartos_bloqueados_ids uuid[] NOT NULL DEFAULT '{}',
  lista_hospedes jsonb NOT NULL DEFAULT '[]',
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  CHECK (data_saida > data_entrada)
);

CREATE TABLE reservas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  code varchar(30) NOT NULL,
  hospede_id uuid NOT NULL REFERENCES hospedes(id),
  nome_hospede varchar(160) NOT NULL,
  tipo_quarto_id uuid NOT NULL REFERENCES tipos_quarto(id),
  quarto_id uuid REFERENCES quartos(id),
  reserva_grupo_id uuid REFERENCES reservas_grupo(id),
  adultos int NOT NULL CHECK (adultos >= 1),
  criancas int NOT NULL DEFAULT 0 CHECK (criancas >= 0),
  data_entrada date NOT NULL,
  data_saida date NOT NULL,
  origem origem_reserva NOT NULL,
  plano_tarifario_id uuid NOT NULL REFERENCES planos_tarifarios(id),
  tarifa_diaria numeric(12, 2) NOT NULL CHECK (tarifa_diaria >= 0),
  valor_total numeric(12, 2) NOT NULL CHECK (valor_total >= 0),
  moeda char(3) NOT NULL DEFAULT 'BRL',
  status status_reserva NOT NULL DEFAULT 'confirmed',
  observacoes text,
  overbooking_autorizado_por uuid REFERENCES usuarios(id),
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, code),
  CHECK (data_saida > data_entrada)
);

CREATE TABLE lista_espera (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  reserva_id uuid NOT NULL REFERENCES reservas(id),
  tipo_quarto_id uuid NOT NULL REFERENCES tipos_quarto(id),
  prioridade int NOT NULL DEFAULT 100,
  motivo varchar(160) NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE historico_reservas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  reserva_id uuid NOT NULL REFERENCES reservas(id),
  acao varchar(80) NOT NULL,
  ator_id uuid REFERENCES usuarios(id),
  antes jsonb NOT NULL DEFAULT '{}',
  depois jsonb NOT NULL DEFAULT '{}',
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE checkins (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  reserva_id uuid NOT NULL REFERENCES reservas(id),
  usuario_id uuid REFERENCES usuarios(id),
  tipo varchar(30) NOT NULL,
  documentos_ocr jsonb NOT NULL DEFAULT '[]',
  acompanhantes jsonb NOT NULL DEFAULT '[]',
  veiculos jsonb NOT NULL DEFAULT '[]',
  assinatura_url text,
  foto_url text,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE checkouts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  reserva_id uuid NOT NULL REFERENCES reservas(id),
  usuario_id uuid REFERENCES usuarios(id),
  valor_total numeric(12, 2) NOT NULL DEFAULT 0,
  forma_pagamento varchar(40),
  conferencia jsonb NOT NULL DEFAULT '{}',
  fechado_em timestamptz,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE limpezas_quarto (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  quarto_id uuid NOT NULL REFERENCES quartos(id),
  responsavel_id uuid REFERENCES usuarios(id),
  status varchar(40) NOT NULL,
  checklist jsonb NOT NULL DEFAULT '{}',
  fotos jsonb NOT NULL DEFAULT '[]',
  observacoes text,
  iniciado_em timestamptz,
  finalizado_em timestamptz,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE chamados_manutencao (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  quarto_id uuid REFERENCES quartos(id),
  titulo varchar(160) NOT NULL,
  descricao text,
  prioridade varchar(30) NOT NULL,
  status varchar(40) NOT NULL,
  tecnico_id uuid REFERENCES usuarios(id),
  historico jsonb NOT NULL DEFAULT '[]',
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE financeiro_contas_receber (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  reserva_id uuid REFERENCES reservas(id),
  empresa_id uuid REFERENCES empresas_conveniadas(id),
  descricao varchar(180) NOT NULL,
  valor numeric(12, 2) NOT NULL,
  vencimento date NOT NULL,
  status status_conta NOT NULL DEFAULT 'aberta',
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE financeiro_contas_pagar (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  fornecedor varchar(180) NOT NULL,
  categoria varchar(80) NOT NULL,
  descricao varchar(180) NOT NULL,
  valor numeric(12, 2) NOT NULL,
  vencimento date NOT NULL,
  status status_conta NOT NULL DEFAULT 'aberta',
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE financeiro_contas_bancarias (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  banco varchar(80) NOT NULL,
  agencia varchar(20),
  conta varchar(30),
  saldo numeric(12, 2) NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE produtos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  nome varchar(160) NOT NULL,
  categoria varchar(80) NOT NULL,
  preco_venda numeric(12, 2) NOT NULL DEFAULT 0,
  custo numeric(12, 2) NOT NULL DEFAULT 0,
  estoque_minimo numeric(12, 3) NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE estoque_movimentos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  produto_id uuid NOT NULL REFERENCES produtos(id),
  tipo tipo_movimento_estoque NOT NULL,
  quantidade numeric(12, 3) NOT NULL,
  origem varchar(80),
  destino varchar(80),
  observacoes text,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE pdv_vendas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  setor varchar(60) NOT NULL,
  origem varchar(60) NOT NULL,
  reserva_id uuid REFERENCES reservas(id),
  quarto_id uuid REFERENCES quartos(id),
  empresa_id uuid REFERENCES empresas_conveniadas(id),
  valor_total numeric(12, 2) NOT NULL DEFAULT 0,
  status varchar(40) NOT NULL DEFAULT 'aberta',
  criado_em timestamptz NOT NULL DEFAULT now(),
  fechado_em timestamptz
);

CREATE TABLE pdv_itens_venda (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  venda_id uuid NOT NULL REFERENCES pdv_vendas(id),
  produto_id uuid REFERENCES produtos(id),
  descricao varchar(160) NOT NULL,
  quantidade numeric(12, 3) NOT NULL,
  valor_unitario numeric(12, 2) NOT NULL,
  valor_total numeric(12, 2) NOT NULL
);

CREATE TABLE relatorios_gerenciais (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  nome varchar(160) NOT NULL,
  modulo varchar(60) NOT NULL,
  filtros jsonb NOT NULL DEFAULT '{}',
  formato varchar(20) NOT NULL,
  criado_por uuid REFERENCES usuarios(id),
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE bi_indicadores (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  indicador varchar(80) NOT NULL,
  valor numeric(14, 4) NOT NULL,
  periodo_inicio date NOT NULL,
  periodo_fim date NOT NULL,
  dimensoes jsonb NOT NULL DEFAULT '{}',
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE logs_auditoria (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  ator_id uuid REFERENCES usuarios(id),
  acao varchar(80) NOT NULL,
  entidade_nome varchar(80) NOT NULL,
  entidade_id uuid NOT NULL,
  antes jsonb NOT NULL DEFAULT '{}',
  depois jsonb NOT NULL DEFAULT '{}',
  correlation_id varchar(120) NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_quartos_tenant_tipo ON quartos (tenant_id, tipo_quarto_id);
CREATE INDEX idx_reservas_tenant_quarto_periodo ON reservas (tenant_id, quarto_id, data_entrada, data_saida);
CREATE INDEX idx_reservas_tenant_tipo_periodo ON reservas (tenant_id, tipo_quarto_id, data_entrada, data_saida);
CREATE INDEX idx_reservas_tenant_status ON reservas (tenant_id, status);
CREATE INDEX idx_logs_auditoria_entidade ON logs_auditoria (tenant_id, entidade_nome, entidade_id);
CREATE INDEX idx_contas_receber_tenant_status ON financeiro_contas_receber (tenant_id, status, vencimento);
CREATE INDEX idx_contas_pagar_tenant_status ON financeiro_contas_pagar (tenant_id, status, vencimento);

CREATE OR REPLACE FUNCTION impedir_quarto_de_outro_tenant()
RETURNS trigger AS $$
BEGIN
  IF NEW.quarto_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM quartos WHERE quartos.id = NEW.quarto_id AND quartos.tenant_id = NEW.tenant_id
  ) THEN
    RAISE EXCEPTION 'quarto_id pertence a outro tenant';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reservas_mesmo_tenant_quarto
BEFORE INSERT OR UPDATE ON reservas
FOR EACH ROW EXECUTE FUNCTION impedir_quarto_de_outro_tenant();
