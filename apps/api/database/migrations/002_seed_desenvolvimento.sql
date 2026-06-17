INSERT INTO tenants (id, nome, documento, ativo)
VALUES ('00000000-0000-0000-0000-000000000001', 'HospedeX Desenvolvimento', '00000000000100', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO propriedades (id, tenant_id, nome, tipo, email, horario_checkin, horario_checkout)
VALUES ('00000000-0000-4000-8000-000000000101', '00000000-0000-0000-0000-000000000001', 'Hotel Centro', 'hotel', 'admin@hospedex.com.br', '13:00', '12:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO perfis (id, tenant_id, nome, descricao, permissoes)
VALUES (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '00000000-0000-0000-0000-000000000001',
  'Administrador',
  'Acesso completo ao ambiente de desenvolvimento',
  ARRAY[
    'reservations:view',
    'reservations:create',
    'reservations:update',
    'reservations:cancel',
    'reservations:move',
    'reservations:overbook',
    'reservations:group:create',
    'reservations:waitlist:manage'
  ]
)
ON CONFLICT (tenant_id, nome) DO NOTHING;

INSERT INTO usuarios (id, tenant_id, perfil_id, nome, email, senha_hash, ativo)
VALUES (
  '99999999-9999-4999-8999-999999999999',
  '00000000-0000-0000-0000-000000000001',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'Administrador HospedeX',
  'admin@hospedex.com.br',
  'dev:admin123',
  true
)
ON CONFLICT (tenant_id, email) DO NOTHING;

INSERT INTO tipos_quarto (id, tenant_id, nome, code, capacidade_adultos, capacidade_criancas, tarifa_base, ativo)
VALUES
  ('11111111-1111-4111-8111-111111111101', '00000000-0000-0000-0000-000000000001', 'Standard', 'STD', 2, 1, 280.00, true),
  ('11111111-1111-4111-8111-111111111102', '00000000-0000-0000-0000-000000000001', 'Luxo', 'LUX', 2, 2, 420.00, true),
  ('11111111-1111-4111-8111-111111111103', '00000000-0000-0000-0000-000000000001', 'Master', 'MST', 3, 2, 650.00, true)
ON CONFLICT (tenant_id, code) DO NOTHING;

INSERT INTO quartos (id, tenant_id, tipo_quarto_id, numero, andar, status, ativo)
VALUES
  ('22222222-2222-4222-8222-222222222101', '00000000-0000-0000-0000-000000000001', '11111111-1111-4111-8111-111111111101', '101', '1', 'free', true),
  ('22222222-2222-4222-8222-222222222102', '00000000-0000-0000-0000-000000000001', '11111111-1111-4111-8111-111111111101', '102', '1', 'free', true),
  ('22222222-2222-4222-8222-222222222201', '00000000-0000-0000-0000-000000000001', '11111111-1111-4111-8111-111111111102', '201', '2', 'cleaning', true),
  ('22222222-2222-4222-8222-222222222301', '00000000-0000-0000-0000-000000000001', '11111111-1111-4111-8111-111111111103', '301', '3', 'maintenance', true)
ON CONFLICT (tenant_id, numero) DO NOTHING;

INSERT INTO hospedes (id, tenant_id, nome, email, telefone, documento)
VALUES
  ('44444444-4444-4444-8444-444444444444', '00000000-0000-0000-0000-000000000001', 'Hospede Teste', 'hospede@teste.com', '(11) 99999-0000', '12345678900')
ON CONFLICT (id) DO NOTHING;

INSERT INTO planos_tarifarios (id, tenant_id, nome, tipo, tipo_quarto_id, tarifa_base, regras_dinamicas, ativo)
VALUES
  ('33333333-3333-4333-8333-333333333101', '00000000-0000-0000-0000-000000000001', 'Tarifa Flex Standard', 'flexible', '11111111-1111-4111-8111-111111111101', 280.00, '{}', true),
  ('33333333-3333-4333-8333-333333333102', '00000000-0000-0000-0000-000000000001', 'Tarifa Flex Luxo', 'flexible', '11111111-1111-4111-8111-111111111102', 420.00, '{}', true),
  ('33333333-3333-4333-8333-333333333103', '00000000-0000-0000-0000-000000000001', 'Tarifa Flex Master', 'flexible', '11111111-1111-4111-8111-111111111103', 650.00, '{}', true)
ON CONFLICT (id) DO NOTHING;
