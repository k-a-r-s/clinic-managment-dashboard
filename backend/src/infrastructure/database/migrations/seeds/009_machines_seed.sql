-- 009_machines_seed.sql
-- Seed initial machines data (8 rows) using sample from user
INSERT INTO public.machines (id, machine_id, manufacturer, model, status, last_maintenance_date, next_maintenance_date, is_active, room, created_at, updated_at)
VALUES
('6fb1f8d6-4b9f-4a3a-9e8b-1c9f0a1aa111','HD-MAC-101','Fresenius','4008S','out-of-service','2025-10-15','2026-01-15',false,'Room 3A','2025-10-15T09:00:00Z','2025-10-15T09:00:00Z'),
('98c2b62b-1811-4e8a-b3aa-12d1a7aab222','HD-MAC-102','Fresenius','4008S','available','2025-10-20','2026-01-20',true,'Room 3B','2025-10-20T09:15:00Z','2025-10-20T09:15:00Z'),
('b1f0a9aa-2cdd-4e29-8f11-33c3b3bb333','HD-MAC-103','Baxter','AK200','maintenance','2025-09-10','2025-12-10',true,'Room 2A','2025-09-10T07:00:00Z','2025-09-10T07:00:00Z'),
('a2d3f7c4-55ef-47b9-9a22-44d4c4cc444','HD-MAC-104','Fresenius','5008','available','2025-11-01','2026-02-01',true,'Room 2B','2025-11-01T08:30:00Z','2025-11-01T08:30:00Z'),
('d3a9b7ee-77b7-4f0e-9e33-55e5d5dd555','HD-MAC-105','Baxter','AK200','in-use','2025-10-25','2026-01-25',true,'Room 1C','2025-10-25T10:20:00Z','2025-10-25T10:20:00Z'),
('c4b6e3b8-88c8-4a8f-8f44-66f6e6ee666','HD-MAC-106','Fresenius','4008S','out-of-service','2025-08-15','2025-11-15',false,'Room 1A','2025-08-15T11:11:00Z','2025-08-15T11:11:00Z'),
('e5d7c4b9-99d9-4b9f-9f55-77g7f7ff777','HD-MAC-107','Baxter','5008','available','2025-11-05','2026-02-05',true,'Room 1B','2025-11-05T12:00:00Z','2025-11-05T12:00:00Z'),
('f6e8d5a0-1a1a-4c0a-8a66-88h8g8gg888','HD-MAC-108','Fresenius','5008','in-use','2025-10-10','2026-01-10',true,'Room 1A','2025-10-10T13:00:00Z','2025-10-10T13:00:00Z');
