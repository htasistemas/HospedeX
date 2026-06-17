CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE reservation_status AS ENUM (
  'draft',
  'confirmed',
  'guaranteed',
  'checked_in',
  'checked_out',
  'cancelled',
  'no_show',
  'waitlisted'
);

CREATE TYPE reservation_origin AS ENUM (
  'direct',
  'phone',
  'whatsapp',
  'website',
  'booking_engine',
  'ota',
  'corporate',
  'event',
  'walk_in'
);

CREATE TYPE room_operational_status AS ENUM (
  'free',
  'occupied',
  'reserved',
  'cleaning',
  'inspected',
  'maintenance',
  'blocked',
  'out_of_order'
);

CREATE TABLE room_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL,
  name varchar(120) NOT NULL,
  code varchar(30) NOT NULL,
  capacity_adults int NOT NULL CHECK (capacity_adults >= 1),
  capacity_children int NOT NULL DEFAULT 0 CHECK (capacity_children >= 0),
  base_rate numeric(12, 2) NOT NULL CHECK (base_rate >= 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, code)
);

CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL,
  room_type_id uuid NOT NULL REFERENCES room_types(id),
  number varchar(20) NOT NULL,
  floor varchar(20),
  status room_operational_status NOT NULL DEFAULT 'free',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, number)
);

CREATE TABLE rate_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL,
  name varchar(120) NOT NULL,
  type varchar(40) NOT NULL,
  room_type_id uuid NOT NULL REFERENCES room_types(id),
  base_rate numeric(12, 2) NOT NULL CHECK (base_rate >= 0),
  dynamic_rules jsonb NOT NULL DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE group_reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL,
  name varchar(160) NOT NULL,
  company_id uuid,
  event_name varchar(160),
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  blocked_room_ids uuid[] NOT NULL DEFAULT '{}',
  rooming_list jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (check_out_date > check_in_date)
);

CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL,
  code varchar(30) NOT NULL,
  guest_id uuid NOT NULL,
  guest_name varchar(160) NOT NULL,
  room_type_id uuid NOT NULL REFERENCES room_types(id),
  room_id uuid REFERENCES rooms(id),
  group_reservation_id uuid REFERENCES group_reservations(id),
  adults int NOT NULL CHECK (adults >= 1),
  children int NOT NULL DEFAULT 0 CHECK (children >= 0),
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  origin reservation_origin NOT NULL,
  rate_plan_id uuid NOT NULL REFERENCES rate_plans(id),
  daily_rate numeric(12, 2) NOT NULL CHECK (daily_rate >= 0),
  total_amount numeric(12, 2) NOT NULL CHECK (total_amount >= 0),
  currency char(3) NOT NULL DEFAULT 'BRL',
  status reservation_status NOT NULL DEFAULT 'confirmed',
  notes text,
  overbooking_authorized_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, code),
  CHECK (check_out_date > check_in_date)
);

CREATE TABLE waitlist_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL,
  reservation_id uuid NOT NULL REFERENCES reservations(id),
  room_type_id uuid NOT NULL REFERENCES room_types(id),
  priority int NOT NULL DEFAULT 100,
  reason varchar(160) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reservation_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL,
  reservation_id uuid NOT NULL REFERENCES reservations(id),
  action varchar(80) NOT NULL,
  actor_id uuid,
  before jsonb NOT NULL DEFAULT '{}',
  after jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL,
  actor_id uuid,
  action varchar(80) NOT NULL,
  entity_name varchar(80) NOT NULL,
  entity_id uuid NOT NULL,
  before jsonb NOT NULL DEFAULT '{}',
  after jsonb NOT NULL DEFAULT '{}',
  correlation_id varchar(120) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_rooms_tenant_type ON rooms (tenant_id, room_type_id);
CREATE INDEX idx_reservations_tenant_room_period ON reservations (tenant_id, room_id, check_in_date, check_out_date);
CREATE INDEX idx_reservations_tenant_type_period ON reservations (tenant_id, room_type_id, check_in_date, check_out_date);
CREATE INDEX idx_reservations_tenant_status ON reservations (tenant_id, status);
CREATE INDEX idx_audit_logs_entity ON audit_logs (tenant_id, entity_name, entity_id);

CREATE OR REPLACE FUNCTION prevent_cross_tenant_reservation_room()
RETURNS trigger AS $$
BEGIN
  IF NEW.room_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM rooms WHERE rooms.id = NEW.room_id AND rooms.tenant_id = NEW.tenant_id
  ) THEN
    RAISE EXCEPTION 'room_id pertence a outro tenant';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reservations_same_tenant_room
BEFORE INSERT OR UPDATE ON reservations
FOR EACH ROW EXECUTE FUNCTION prevent_cross_tenant_reservation_room();
