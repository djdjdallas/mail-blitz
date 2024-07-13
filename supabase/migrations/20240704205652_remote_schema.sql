create table "public"."email_tracking" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "email" character varying not null,
    "tracked" boolean default false,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "opened_at" timestamp with time zone
);


CREATE UNIQUE INDEX email_tracking_pkey ON public.email_tracking USING btree (id);

alter table "public"."email_tracking" add constraint "email_tracking_pkey" PRIMARY KEY using index "email_tracking_pkey";

alter table "public"."email_tracking" add constraint "email_tracking_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."email_tracking" validate constraint "email_tracking_user_id_fkey";

grant delete on table "public"."email_tracking" to "anon";

grant insert on table "public"."email_tracking" to "anon";

grant references on table "public"."email_tracking" to "anon";

grant select on table "public"."email_tracking" to "anon";

grant trigger on table "public"."email_tracking" to "anon";

grant truncate on table "public"."email_tracking" to "anon";

grant update on table "public"."email_tracking" to "anon";

grant delete on table "public"."email_tracking" to "authenticated";

grant insert on table "public"."email_tracking" to "authenticated";

grant references on table "public"."email_tracking" to "authenticated";

grant select on table "public"."email_tracking" to "authenticated";

grant trigger on table "public"."email_tracking" to "authenticated";

grant truncate on table "public"."email_tracking" to "authenticated";

grant update on table "public"."email_tracking" to "authenticated";

grant delete on table "public"."email_tracking" to "service_role";

grant insert on table "public"."email_tracking" to "service_role";

grant references on table "public"."email_tracking" to "service_role";

grant select on table "public"."email_tracking" to "service_role";

grant trigger on table "public"."email_tracking" to "service_role";

grant truncate on table "public"."email_tracking" to "service_role";

grant update on table "public"."email_tracking" to "service_role";


