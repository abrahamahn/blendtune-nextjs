--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Ubuntu 16.2-1.pgdg23.10+1)
-- Dumped by pg_dump version 16.2 (Ubuntu 16.2-1.pgdg23.10+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: abe
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO abe;

--
-- Name: users; Type: SCHEMA; Schema: -; Owner: abe
--

CREATE SCHEMA users;


ALTER SCHEMA users OWNER TO abe;

--
-- Name: update_roles_on_email_confirmed(); Type: FUNCTION; Schema: auth; Owner: abe
--

CREATE FUNCTION auth.update_roles_on_email_confirmed() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.email_confirmed THEN
        -- Insert user role with default 'user' role_name
        INSERT INTO users.roles (user_id, role_name)
        VALUES (NEW.uuid, 'user')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION auth.update_roles_on_email_confirmed() OWNER TO abe;

--
-- Name: update_user_profile_on_email_confirmed(); Type: FUNCTION; Schema: auth; Owner: abe
--

CREATE FUNCTION auth.update_user_profile_on_email_confirmed() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.email_confirmed = TRUE AND OLD.email_confirmed IS DISTINCT FROM NEW.email_confirmed THEN
        INSERT INTO users.profile (user_id, email, first_name, last_name)
        VALUES (NEW.uuid, NEW.email, NEW.first_name, NEW.last_name)
        ON CONFLICT (user_id) DO UPDATE
        SET email = EXCLUDED.email, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION auth.update_user_profile_on_email_confirmed() OWNER TO abe;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: abe
--

CREATE TABLE auth.sessions (
    session_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    session_token uuid NOT NULL,
    refresh_token uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    expires_at timestamp with time zone,
    ip_address character varying(255),
    user_agent text,
    status character varying(50) DEFAULT 'active'::character varying
);


ALTER TABLE auth.sessions OWNER TO abe;

--
-- Name: users; Type: TABLE; Schema: auth; Owner: abe
--

CREATE TABLE auth.users (
    id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    email_confirmed boolean DEFAULT false NOT NULL,
    email_token uuid,
    last_email_sent timestamp with time zone,
    email_token_expire timestamp with time zone
);


ALTER TABLE auth.users OWNER TO abe;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: auth; Owner: abe
--

CREATE SEQUENCE auth.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.users_id_seq OWNER TO abe;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: abe
--

ALTER SEQUENCE auth.users_id_seq OWNED BY auth.users.id;


--
-- Name: activity; Type: TABLE; Schema: users; Owner: abe
--

CREATE TABLE users.activity (
);


ALTER TABLE users.activity OWNER TO abe;

--
-- Name: billing; Type: TABLE; Schema: users; Owner: abe
--

CREATE TABLE users.billing (
);


ALTER TABLE users.billing OWNER TO abe;

--
-- Name: custom_orders; Type: TABLE; Schema: users; Owner: abe
--

CREATE TABLE users.custom_orders (
);


ALTER TABLE users.custom_orders OWNER TO abe;

--
-- Name: custom_playlists; Type: TABLE; Schema: users; Owner: abe
--

CREATE TABLE users.custom_playlists (
);


ALTER TABLE users.custom_playlists OWNER TO abe;

--
-- Name: profile; Type: TABLE; Schema: users; Owner: abe
--

CREATE TABLE users.profile (
    user_id uuid NOT NULL,
    username text,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone_number text,
    gender text,
    date_of_birth date,
    occupation text,
    city text,
    state text,
    country text,
    preferred_language text
);


ALTER TABLE users.profile OWNER TO abe;

--
-- Name: purchases; Type: TABLE; Schema: users; Owner: abe
--

CREATE TABLE users.purchases (
);


ALTER TABLE users.purchases OWNER TO abe;

--
-- Name: roles; Type: TABLE; Schema: users; Owner: abe
--

CREATE TABLE users.roles (
    role_id integer NOT NULL,
    user_id uuid,
    role_name character varying(50) NOT NULL
);


ALTER TABLE users.roles OWNER TO abe;

--
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: users; Owner: abe
--

CREATE SEQUENCE users.roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE users.roles_role_id_seq OWNER TO abe;

--
-- Name: roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: abe
--

ALTER SEQUENCE users.roles_role_id_seq OWNED BY users.roles.role_id;


--
-- Name: social_media; Type: TABLE; Schema: users; Owner: abe
--

CREATE TABLE users.social_media (
);


ALTER TABLE users.social_media OWNER TO abe;

--
-- Name: subscription; Type: TABLE; Schema: users; Owner: abe
--

CREATE TABLE users.subscription (
);


ALTER TABLE users.subscription OWNER TO abe;

--
-- Name: user_lyrics; Type: TABLE; Schema: users; Owner: abe
--

CREATE TABLE users.user_lyrics (
);


ALTER TABLE users.user_lyrics OWNER TO abe;

--
-- Name: users id; Type: DEFAULT; Schema: auth; Owner: abe
--

ALTER TABLE ONLY auth.users ALTER COLUMN id SET DEFAULT nextval('auth.users_id_seq'::regclass);


--
-- Name: roles role_id; Type: DEFAULT; Schema: users; Owner: abe
--

ALTER TABLE ONLY users.roles ALTER COLUMN role_id SET DEFAULT nextval('users.roles_role_id_seq'::regclass);


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: abe
--

COPY auth.sessions (session_id, user_id, session_token, refresh_token, created_at, last_accessed_at, expires_at, ip_address, user_agent, status) FROM stdin;
a573b58b-34ed-4e0f-a834-fd5d33b9e079	62a78633-a295-4e6f-8dc5-e95f80a76e20	203e4a27-d484-ca9b-1fa5-f6751076fa30	9186004a-8727-4cd6-8b58-9a0a4adb22a0	2024-02-29 09:24:59.601504+00	2024-02-29 09:24:59.601504+00	2024-03-30 09:24:59.614+00	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0	active
1f5c9ed3-f838-4cc1-b4fc-371c5628bd1d	27ff8415-03b1-4fe5-8028-e9150ed58585	f6bca9d7-661b-3235-bf9d-fe8f7dcae515	4fef6eed-b4ca-33a9-636c-dbc376e49da9	2024-02-29 09:26:27.172662+00	2024-02-29 09:26:27.172662+00	2024-03-30 09:26:27.197+00	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36	inactive
0265f24a-4847-4190-9a65-d3be7539e372	27ff8415-03b1-4fe5-8028-e9150ed58585	6098eb43-dd73-4bde-910c-f79f5658ebc3	a0792a29-b6dc-4b02-8500-19a2b0cf53d7	2024-03-01 13:46:27.593911+00	2024-03-01 13:46:27.593911+00	2024-03-31 13:46:27.593+00	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36	inactive
668057f2-05f4-4591-a757-e6eec6ace51a	27ff8415-03b1-4fe5-8028-e9150ed58585	c99cc28c-69d2-4edb-ba88-ad391a740341	1d2f2b6e-91b6-4f92-9bfe-5f30155cde74	2024-03-01 13:47:52.309946+00	2024-03-01 13:47:52.309946+00	2024-03-31 13:47:52.309+00	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36	inactive
77830d7d-383b-4c19-ab9e-c6b8b831b0f7	27ff8415-03b1-4fe5-8028-e9150ed58585	477c5f5d-2399-448a-a09d-244ff9570add	d5193916-bec3-4a90-9496-05c30936c951	2024-03-01 13:49:13.419956+00	2024-03-01 13:49:13.419956+00	2024-03-31 13:49:13.419+00	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36	inactive
25962795-8b52-4f97-9107-f1ee0eace8b4	27ff8415-03b1-4fe5-8028-e9150ed58585	530b8f50-a785-4d44-9110-d18666eef797	2cb40733-eb44-4c37-8e81-88b7e005eb79	2024-03-01 13:49:18.455116+00	2024-03-01 13:49:18.455116+00	2024-03-31 13:49:18.454+00	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36	inactive
d6c587a9-d40a-4d42-9c5d-b55fac823ec3	27ff8415-03b1-4fe5-8028-e9150ed58585	15da44d6-082e-49cc-be84-71da4cb75be6	a8dbc5e6-c612-45af-a43b-38ee88e73aee	2024-03-01 13:49:22.68846+00	2024-03-01 13:49:22.68846+00	2024-03-31 13:49:22.687+00	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36	inactive
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: abe
--

COPY auth.users (id, uuid, first_name, last_name, email, password, created_at, email_confirmed, email_token, last_email_sent, email_token_expire) FROM stdin;
15	62a78633-a295-4e6f-8dc5-e95f80a76e20	Dennis	Gu	dennismgu@outlook.com	$2b$10$.pmZwSTjd76timvnxfgnZefcnIc7/SFUVkPlaWcr90FQ/iiUOfIDi	2024-02-29 09:22:02.609+00	t	91cff37f-c5f8-4743-af78-2f3e4caa9cdf	2024-02-29 09:22:04.325139+00	2024-02-29 09:37:02.609+00
16	27ff8415-03b1-4fe5-8028-e9150ed58585	Abraham	Ahn	satmorningrain@gmail.com	$2b$10$m0GCD7ToyHuvHHmKVdCBjO9f1T2N1Lz7z/Kz1bSwA8CEQ3bfNcLwa	2024-02-29 09:26:18.175+00	t	6abe12be-8825-493b-ad19-ac0352b3a9c1	2024-02-29 09:26:19.135639+00	2024-02-29 09:41:18.175+00
\.


--
-- Data for Name: activity; Type: TABLE DATA; Schema: users; Owner: abe
--

COPY users.activity  FROM stdin;
\.


--
-- Data for Name: billing; Type: TABLE DATA; Schema: users; Owner: abe
--

COPY users.billing  FROM stdin;
\.


--
-- Data for Name: custom_orders; Type: TABLE DATA; Schema: users; Owner: abe
--

COPY users.custom_orders  FROM stdin;
\.


--
-- Data for Name: custom_playlists; Type: TABLE DATA; Schema: users; Owner: abe
--

COPY users.custom_playlists  FROM stdin;
\.


--
-- Data for Name: profile; Type: TABLE DATA; Schema: users; Owner: abe
--

COPY users.profile (user_id, username, email, first_name, last_name, phone_number, gender, date_of_birth, occupation, city, state, country, preferred_language) FROM stdin;
62a78633-a295-4e6f-8dc5-e95f80a76e20	\N	dennismgu@outlook.com	Dennis	Gu	\N	\N	\N	\N	\N	\N	\N	\N
27ff8415-03b1-4fe5-8028-e9150ed58585	\N	satmorningrain@gmail.com	Abraham	Ahn	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: purchases; Type: TABLE DATA; Schema: users; Owner: abe
--

COPY users.purchases  FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: users; Owner: abe
--

COPY users.roles (role_id, user_id, role_name) FROM stdin;
25	62a78633-a295-4e6f-8dc5-e95f80a76e20	user
26	27ff8415-03b1-4fe5-8028-e9150ed58585	user
\.


--
-- Data for Name: social_media; Type: TABLE DATA; Schema: users; Owner: abe
--

COPY users.social_media  FROM stdin;
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: users; Owner: abe
--

COPY users.subscription  FROM stdin;
\.


--
-- Data for Name: user_lyrics; Type: TABLE DATA; Schema: users; Owner: abe
--

COPY users.user_lyrics  FROM stdin;
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: abe
--

SELECT pg_catalog.setval('auth.users_id_seq', 16, true);


--
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: users; Owner: abe
--

SELECT pg_catalog.setval('users.roles_role_id_seq', 26, true);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: abe
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (session_id);


--
-- Name: sessions sessions_refresh_token_key; Type: CONSTRAINT; Schema: auth; Owner: abe
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_refresh_token_key UNIQUE (refresh_token);


--
-- Name: sessions sessions_session_token_key; Type: CONSTRAINT; Schema: auth; Owner: abe
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_session_token_key UNIQUE (session_token);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: auth; Owner: abe
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: abe
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_uuid_key; Type: CONSTRAINT; Schema: auth; Owner: abe
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_uuid_key UNIQUE (uuid);


--
-- Name: profile profile_email_key; Type: CONSTRAINT; Schema: users; Owner: abe
--

ALTER TABLE ONLY users.profile
    ADD CONSTRAINT profile_email_key UNIQUE (email);


--
-- Name: profile profile_user_id_key; Type: CONSTRAINT; Schema: users; Owner: abe
--

ALTER TABLE ONLY users.profile
    ADD CONSTRAINT profile_user_id_key UNIQUE (user_id);


--
-- Name: profile profile_username_key; Type: CONSTRAINT; Schema: users; Owner: abe
--

ALTER TABLE ONLY users.profile
    ADD CONSTRAINT profile_username_key UNIQUE (username);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: users; Owner: abe
--

ALTER TABLE ONLY users.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- Name: roles roles_user_id_unique; Type: CONSTRAINT; Schema: users; Owner: abe
--

ALTER TABLE ONLY users.roles
    ADD CONSTRAINT roles_user_id_unique UNIQUE (user_id);


--
-- Name: roles unique_user_role; Type: CONSTRAINT; Schema: users; Owner: abe
--

ALTER TABLE ONLY users.roles
    ADD CONSTRAINT unique_user_role UNIQUE (user_id, role_name);


--
-- Name: sessions_expires_at_idx; Type: INDEX; Schema: auth; Owner: abe
--

CREATE INDEX sessions_expires_at_idx ON auth.sessions USING btree (expires_at);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: abe
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: users trigger_update_user_profile_if_confirmed; Type: TRIGGER; Schema: auth; Owner: abe
--

CREATE TRIGGER trigger_update_user_profile_if_confirmed AFTER UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION auth.update_user_profile_on_email_confirmed();


--
-- Name: users update_roles_trigger; Type: TRIGGER; Schema: auth; Owner: abe
--

CREATE TRIGGER update_roles_trigger AFTER UPDATE OF email_confirmed ON auth.users FOR EACH ROW EXECUTE FUNCTION auth.update_roles_on_email_confirmed();


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: abe
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(uuid) ON DELETE CASCADE;


--
-- Name: roles roles_user_id_fkey; Type: FK CONSTRAINT; Schema: users; Owner: abe
--

ALTER TABLE ONLY users.roles
    ADD CONSTRAINT roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(uuid);


--
-- PostgreSQL database dump complete
--

