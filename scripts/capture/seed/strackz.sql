-- Run on the StrackZ project against the demo user only (Alex Demo). Idempotent.
insert into public.imported_transactions (user_id, external_id, account_name, account_type, description, amount, type, date, provider_category, suggested_category_id, state) values
('274f3717-3062-4561-b010-f648741e993b','demo-imp-001','Banco Exemplo','BANK','Padaria do Largo',27.90,'expense','2026-11-12','Food and drinks','a9736a5a-db76-49e1-91dd-12b9a1226eb0','pending'),
('274f3717-3062-4561-b010-f648741e993b','demo-imp-002','Banco Exemplo','CREDIT','Café Aurora',18.50,'expense','2026-11-11','Restaurants','999b345b-c05a-4415-b874-e0985b1b3933','pending'),
('274f3717-3062-4561-b010-f648741e993b','demo-imp-003','Banco Exemplo','BANK','Transferência recebida Leo Martins',350.00,'income','2026-11-10','Transfers','8de66773-c9e3-4fc2-8e86-4a787f8d0179','pending'),
('274f3717-3062-4561-b010-f648741e993b','demo-imp-004','Banco Exemplo','CREDIT','Torra Clara',64.00,'expense','2026-11-09','Shopping','a1df5ada-0ac6-4627-bb6f-8615ee4c3869','pending'),
('274f3717-3062-4561-b010-f648741e993b','demo-imp-005','Banco Exemplo','BANK','Passagem Metrô',9.20,'expense','2026-11-08','Transport','385f8048-226d-4b02-a197-c5edd3988f29','pending'),
('274f3717-3062-4561-b010-f648741e993b','demo-imp-006','Banco Exemplo','CREDIT','Cinema Centro',42.00,'expense','2026-11-07','Entertainment','da2db76f-93ab-48b2-afd8-9c963a818201','pending')
on conflict (user_id, external_id) do nothing;
