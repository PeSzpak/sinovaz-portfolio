-- Fictional data for the local SgymZ demo. Run with: psql -v bruno=<uuid> -v clara=<uuid> -f sgymz.sql
-- Bruno is the first sign-up and so the admin. Idempotent: wipes the app tables, keeps the default exercise library.
set timezone to 'America/Sao_Paulo';
truncate public.exercise_logs, public.workout_logs, public.change_requests, public.user_programs,
  public.workout_exercises, public.workouts, public.workout_programs cascade;
update public.users set full_name = 'Bruno Reis' where id = :'bruno';
update public.users set full_name = 'Clara Nunes', weekly_goal = 3 where id = :'clara';

-- psql does not expand variables inside $$, so they travel as settings.
select set_config('demo.bruno', :'bruno', false), set_config('demo.clara', :'clara', false);

do $$
declare
  p uuid; w uuid; l uuid; we record; wk record; n int; d int; sess int := 0;
  clara uuid := current_setting('demo.clara')::uuid; bruno uuid := current_setting('demo.bruno')::uuid;
  plan jsonb := '[
    {"name":"Treino A","ex":["Agachamento livre","Leg press 45°","Elevação pélvica","Mesa flexora","Panturrilha em pé"]},
    {"name":"Treino B","ex":["Puxada frontal","Remada baixa","Rosca direta","Rosca martelo","Abdominal na polia"]},
    {"name":"Treino C","ex":["Supino inclinado com halteres","Desenvolvimento com halteres","Elevação lateral","Tríceps na polia","Prancha"]}
  ]';
begin
  insert into public.workout_programs (name, description, created_by) values ('ABC de força', 'Três treinos por semana, carga progressiva.', bruno) returning id into p;
  insert into public.user_programs (user_id, program_id, assigned_by) values (clara, p, bruno);

  for wk in select * from jsonb_array_elements(plan) with ordinality as t(j, i) loop
    insert into public.workouts (program_id, name, order_index) values (p, wk.j->>'name', wk.i::int) returning id into w;
    n := 0;
    for we in select e.id, e.name from jsonb_array_elements_text(wk.j->'ex') as x(name) join public.exercises e on e.name = x.name and e.is_default loop
      n := n + 1;
      insert into public.workout_exercises (workout_id, exercise_id, order_index, warmup_sets, prep_sets, working_sets, reps, rest_seconds)
        values (w, we.id, n, case when n = 1 then 1 else 0 end, 0, 3, '10-12', 60);
    end loop;
  end loop;

  -- three weeks of history, Monday/Wednesday/Friday style, ending yesterday
  for d in reverse 21..1 loop
    continue when extract(isodow from current_date - d) not in (1, 3, 5) and d <> 1;
    sess := sess + 1;
    select id into w from public.workouts where program_id = p and order_index = (sess - 1) % 3 + 1;
    insert into public.workout_logs (user_id, workout_id, program_id, workout_name, started_at, completed_at, duration_seconds, difficulty_rating, notes)
      values (clara, w, p, (select name from public.workouts where id = w),
        (current_date - d) + time '18:10', (current_date - d) + time '19:02', 3120 - (sess % 4) * 90, 3 + sess % 3, null)
      returning id into l;
    insert into public.exercise_logs (workout_log_id, workout_exercise_id, exercise_id, exercise_name, set_type, set_number, weight, reps)
      select l, x.id, x.exercise_id, e.name, 'working', s, 20 + x.order_index * 6 + (sess / 3) * 2, 12 - (s - 1)
      from public.workout_exercises x join public.exercises e on e.id = x.exercise_id, generate_series(1, 3) s
      where x.workout_id = w;
  end loop;

  insert into public.change_requests (user_id, workout_id, message) values
    (clara, (select id from public.workouts where program_id = p and order_index = 1), 'Posso trocar o leg press por hack squat? Meu joelho incomoda no leg.');
end $$;
