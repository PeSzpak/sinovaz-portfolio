-- Fictional data for the local TWS Score demo. Run with: psql -v ana=<uuid> -v leo=<uuid> -f tws.sql
-- Idempotent: wipes places, wishlist and members first, since reviews have no update or delete policy.
truncate public.places, public.wishlist, public.members cascade;

insert into public.members (email, nome, avatar_emoji, user_id) values
  ('ana.prado@example.com', 'Ana', '☕', :'ana'),
  ('leo.martins@example.com', 'Leo', '🍰', :'leo');

insert into public.places (id, nome, tipo, endereco, lat, lng, visitado_em, criado_por) values
  ('00000000-0000-4000-8000-000000000001', 'Café Aurora', 'cafe', 'Rua das Flores, 120, Centro, Curitiba', -25.4284, -49.2733, current_date - 3, :'ana'),
  ('00000000-0000-4000-8000-000000000002', 'Padaria do Largo', 'cafe', 'Largo da Ordem, 45, São Francisco, Curitiba', -25.4290, -49.2719, current_date - 1, :'leo'),
  ('00000000-0000-4000-8000-000000000003', 'Torra Clara', 'cafe', 'Rua Mateus Leme, 800, Centro Cívico, Curitiba', -25.4220, -49.2680, current_date - 9, :'ana'),
  ('00000000-0000-4000-8000-000000000004', 'Cantina Nonna Lia', 'restaurante', 'Rua Santa Cruz, 33, Santa Felicidade, Curitiba', -25.4020, -49.3170, current_date - 16, :'leo'),
  ('00000000-0000-4000-8000-000000000005', 'Casa Tupi', 'restaurante', 'Avenida Batel, 1500, Batel, Curitiba', -25.4430, -49.2800, current_date - 23, :'ana'),
  ('00000000-0000-4000-8000-000000000006', 'Doce Vento', 'cafe', 'Rua Trajano Reis, 210, São Francisco, Curitiba', -25.4310, -49.2750, current_date - 30, :'leo');

insert into public.reviews (place_id, autor_id, nota_geral, comida, ambiente, atendimento, preco, comentario) values
  ('00000000-0000-4000-8000-000000000001', :'ana', 5, 5, 5, 4, 4, 'O café coado na hora é o melhor da cidade.'),
  ('00000000-0000-4000-8000-000000000001', :'leo', 4, 5, 4, 5, 3, 'Pão de queijo perfeito. Voltaria amanhã.'),
  ('00000000-0000-4000-8000-000000000002', :'leo', 5, 5, 4, 5, 4, 'Folhado de amêndoas ainda quente. Tem que provar.'),
  ('00000000-0000-4000-8000-000000000003', :'ana', 4, 4, 5, 4, 4, 'Ambiente calmo, ótimo para ficar lendo.'),
  ('00000000-0000-4000-8000-000000000003', :'leo', 4, 4, 4, 4, 4, null),
  ('00000000-0000-4000-8000-000000000004', :'ana', 5, 5, 4, 5, 3, 'Massa fresca e porção generosa.'),
  ('00000000-0000-4000-8000-000000000004', :'leo', 5, 5, 5, 4, 3, null),
  ('00000000-0000-4000-8000-000000000005', :'ana', 3, 4, 3, 3, 2, 'Bom, mas achei caro pelo que serviram.'),
  ('00000000-0000-4000-8000-000000000006', :'leo', 4, 4, 5, 4, 4, 'Mesinhas na calçada, dia de sol.');

insert into public.wishlist (nome, tipo, observacao, criado_por) values
  ('Brasa Viva', 'restaurante', 'Indicação da Carol, fogo de chão.', :'leo'),
  ('Grão de Sal', 'cafe', 'Dizem que o cappuccino é cremoso.', :'ana'),
  ('Ateliê do Pão', 'cafe', null, :'ana');
