create or replace function public.mocomo_create_child(p_name text)
returns uuid language plpgsql security invoker set search_path = public as $$
declare v_id uuid;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if length(trim(p_name)) not between 1 and 30 then raise exception 'Invalid name'; end if;
 insert into public.profiles(id) values(auth.uid()) on conflict(id) do nothing;
 insert into public.child_profiles(parent_id,display_name) values(auth.uid(),trim(p_name)) returning id into v_id;
 insert into public.world_state(child_id) values(v_id);
 insert into public.parent_settings(child_id) values(v_id);
 return v_id;
end; $$;
revoke all on function public.mocomo_create_child(text) from public, anon;
grant execute on function public.mocomo_create_child(text) to authenticated;

create or replace function public.mocomo_record_memory(p_id uuid,p_child uuid,p_type text,p_game text,p_character text,p_payload jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare v_event public.memory_events; v_inserted boolean;
begin
 if auth.uid() is null or not exists(select 1 from public.child_profiles where id=p_child and parent_id=auth.uid()) then raise exception 'Not authorized'; end if;
 if p_type not in ('PLAY','DISCOVER','CREATE','MEET','REST') then raise exception 'Invalid event'; end if;
 if p_character is null or p_character not in ('moco','sui','ren','toto','mogu','kira','pon','roo','muku','moyan') then raise exception 'Invalid character'; end if;
 if not coalesce(((p_type='MEET' and p_game is null) or (p_type='PLAY' and p_game in ('jump','kitchen')) or (p_type='DISCOVER' and p_game='seek') or (p_type='CREATE' and p_game='rainbow') or (p_type='REST' and p_game='rest')),false) then raise exception 'Invalid game'; end if;
 if p_payload is null or jsonb_typeof(p_payload)<>'object' or octet_length(p_payload::text)>4096 then raise exception 'Invalid payload'; end if;
 insert into public.memory_events(id,child_id,event_type,game_id,character_id,payload)
 values(p_id,p_child,p_type,p_game,p_character,p_payload) on conflict(id) do nothing returning * into v_event;
 v_inserted := found;
 if not v_inserted then
  select * into v_event from public.memory_events where id=p_id and child_id=p_child;
  if not found then raise exception 'Event conflict'; end if;
  return to_jsonb(v_event);
 end if;
 insert into public.world_state(child_id,stars,rainbow_paths,rest_clouds)
 values(p_child,case when p_type in ('DISCOVER','MEET') then 1 else 0 end,case when p_type='CREATE' then 1 else 0 end,case when p_type='REST' then 1 else 0 end)
 on conflict(child_id) do update set stars=world_state.stars+excluded.stars,rainbow_paths=world_state.rainbow_paths+excluded.rainbow_paths,rest_clouds=world_state.rest_clouds+excluded.rest_clouds,updated_at=now();
 if p_type='CREATE' then insert into public.creations(id,child_id,kind,data) values(p_id,p_child,'rainbow',p_payload); end if;
 if p_game is not null then insert into public.play_sessions(id,child_id,game_id,ended_at,metadata) values(p_id,p_child,p_game,now(),p_payload); end if;
 return to_jsonb(v_event);
end; $$;
revoke all on function public.mocomo_record_memory(uuid,uuid,text,text,text,jsonb) from public,anon;
grant execute on function public.mocomo_record_memory(uuid,uuid,text,text,text,jsonb) to authenticated;
