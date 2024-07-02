create sequence "public"."email_stats_id_seq";

create sequence "public"."email_templates_id_seq";

create sequence "public"."new_events_id_seq";

create sequence "public"."recent_campaigns_id_seq";

create table "public"."email_stats" (
    "id" integer not null default nextval('email_stats_id_seq'::regclass),
    "total_emails_sent" integer not null,
    "open_rate" numeric(5,2) not null,
    "click_through_rate" numeric(5,2) not null,
    "conversion_rate" numeric(5,2) not null,
    "created_at" timestamp without time zone default now()
);


create table "public"."email_templates" (
    "id" integer not null default nextval('email_templates_id_seq'::regclass),
    "title" character varying(255) not null,
    "description" text not null,
    "subject" character varying(255) not null,
    "body" text not null,
    "tone" character varying(50),
    "image_url" character varying(255),
    "created_at" timestamp without time zone default now()
);


create table "public"."new_events" (
    "id" integer not null default nextval('new_events_id_seq'::regclass),
    "title" text not null,
    "start_time" timestamp without time zone not null,
    "end_time" timestamp without time zone not null,
    "description" text
);


create table "public"."recent_campaigns" (
    "id" integer not null default nextval('recent_campaigns_id_seq'::regclass),
    "name" character varying(255) not null,
    "sent" integer not null,
    "open_rate" numeric(5,2) not null,
    "click_through" numeric(5,2) not null,
    "conversions" numeric(5,2) not null,
    "created_at" timestamp without time zone default now()
);


alter sequence "public"."email_stats_id_seq" owned by "public"."email_stats"."id";

alter sequence "public"."email_templates_id_seq" owned by "public"."email_templates"."id";

alter sequence "public"."new_events_id_seq" owned by "public"."new_events"."id";

alter sequence "public"."recent_campaigns_id_seq" owned by "public"."recent_campaigns"."id";

CREATE UNIQUE INDEX email_stats_pkey ON public.email_stats USING btree (id);

CREATE UNIQUE INDEX email_templates_pkey ON public.email_templates USING btree (id);

CREATE UNIQUE INDEX new_events_pkey ON public.new_events USING btree (id);

CREATE UNIQUE INDEX recent_campaigns_pkey ON public.recent_campaigns USING btree (id);

alter table "public"."email_stats" add constraint "email_stats_pkey" PRIMARY KEY using index "email_stats_pkey";

alter table "public"."email_templates" add constraint "email_templates_pkey" PRIMARY KEY using index "email_templates_pkey";

alter table "public"."new_events" add constraint "new_events_pkey" PRIMARY KEY using index "new_events_pkey";

alter table "public"."recent_campaigns" add constraint "recent_campaigns_pkey" PRIMARY KEY using index "recent_campaigns_pkey";

grant delete on table "public"."email_stats" to "anon";

grant insert on table "public"."email_stats" to "anon";

grant references on table "public"."email_stats" to "anon";

grant select on table "public"."email_stats" to "anon";

grant trigger on table "public"."email_stats" to "anon";

grant truncate on table "public"."email_stats" to "anon";

grant update on table "public"."email_stats" to "anon";

grant delete on table "public"."email_stats" to "authenticated";

grant insert on table "public"."email_stats" to "authenticated";

grant references on table "public"."email_stats" to "authenticated";

grant select on table "public"."email_stats" to "authenticated";

grant trigger on table "public"."email_stats" to "authenticated";

grant truncate on table "public"."email_stats" to "authenticated";

grant update on table "public"."email_stats" to "authenticated";

grant delete on table "public"."email_stats" to "service_role";

grant insert on table "public"."email_stats" to "service_role";

grant references on table "public"."email_stats" to "service_role";

grant select on table "public"."email_stats" to "service_role";

grant trigger on table "public"."email_stats" to "service_role";

grant truncate on table "public"."email_stats" to "service_role";

grant update on table "public"."email_stats" to "service_role";

grant delete on table "public"."email_templates" to "anon";

grant insert on table "public"."email_templates" to "anon";

grant references on table "public"."email_templates" to "anon";

grant select on table "public"."email_templates" to "anon";

grant trigger on table "public"."email_templates" to "anon";

grant truncate on table "public"."email_templates" to "anon";

grant update on table "public"."email_templates" to "anon";

grant delete on table "public"."email_templates" to "authenticated";

grant insert on table "public"."email_templates" to "authenticated";

grant references on table "public"."email_templates" to "authenticated";

grant select on table "public"."email_templates" to "authenticated";

grant trigger on table "public"."email_templates" to "authenticated";

grant truncate on table "public"."email_templates" to "authenticated";

grant update on table "public"."email_templates" to "authenticated";

grant delete on table "public"."email_templates" to "service_role";

grant insert on table "public"."email_templates" to "service_role";

grant references on table "public"."email_templates" to "service_role";

grant select on table "public"."email_templates" to "service_role";

grant trigger on table "public"."email_templates" to "service_role";

grant truncate on table "public"."email_templates" to "service_role";

grant update on table "public"."email_templates" to "service_role";

grant delete on table "public"."new_events" to "anon";

grant insert on table "public"."new_events" to "anon";

grant references on table "public"."new_events" to "anon";

grant select on table "public"."new_events" to "anon";

grant trigger on table "public"."new_events" to "anon";

grant truncate on table "public"."new_events" to "anon";

grant update on table "public"."new_events" to "anon";

grant delete on table "public"."new_events" to "authenticated";

grant insert on table "public"."new_events" to "authenticated";

grant references on table "public"."new_events" to "authenticated";

grant select on table "public"."new_events" to "authenticated";

grant trigger on table "public"."new_events" to "authenticated";

grant truncate on table "public"."new_events" to "authenticated";

grant update on table "public"."new_events" to "authenticated";

grant delete on table "public"."new_events" to "service_role";

grant insert on table "public"."new_events" to "service_role";

grant references on table "public"."new_events" to "service_role";

grant select on table "public"."new_events" to "service_role";

grant trigger on table "public"."new_events" to "service_role";

grant truncate on table "public"."new_events" to "service_role";

grant update on table "public"."new_events" to "service_role";

grant delete on table "public"."recent_campaigns" to "anon";

grant insert on table "public"."recent_campaigns" to "anon";

grant references on table "public"."recent_campaigns" to "anon";

grant select on table "public"."recent_campaigns" to "anon";

grant trigger on table "public"."recent_campaigns" to "anon";

grant truncate on table "public"."recent_campaigns" to "anon";

grant update on table "public"."recent_campaigns" to "anon";

grant delete on table "public"."recent_campaigns" to "authenticated";

grant insert on table "public"."recent_campaigns" to "authenticated";

grant references on table "public"."recent_campaigns" to "authenticated";

grant select on table "public"."recent_campaigns" to "authenticated";

grant trigger on table "public"."recent_campaigns" to "authenticated";

grant truncate on table "public"."recent_campaigns" to "authenticated";

grant update on table "public"."recent_campaigns" to "authenticated";

grant delete on table "public"."recent_campaigns" to "service_role";

grant insert on table "public"."recent_campaigns" to "service_role";

grant references on table "public"."recent_campaigns" to "service_role";

grant select on table "public"."recent_campaigns" to "service_role";

grant trigger on table "public"."recent_campaigns" to "service_role";

grant truncate on table "public"."recent_campaigns" to "service_role";

grant update on table "public"."recent_campaigns" to "service_role";


