--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Homebrew)
-- Dumped by pg_dump version 16.3 (Homebrew)

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
        -- Insert user role with role_id as 1 and role_name as 'user'
        INSERT INTO users.roles (user_id, role_id, role_name)
        VALUES (NEW.uuid, 1, 'user') -- Ensuring 'user_id' links to 'uuid', and setting both 'role_id' and 'role_name'
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
        INSERT INTO users.profile (user_id, username, email, first_name, last_name)
        VALUES (NEW.uuid, NEW.username, NEW.email, NEW.first_name, NEW.last_name)
        ON CONFLICT (user_id) DO UPDATE
        SET username = EXCLUDED.username, email = EXCLUDED.email, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name;
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
    username text NOT NULL,
    password text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    email_confirmed boolean DEFAULT false NOT NULL,
    email_token uuid,
    last_email_sent timestamp with time zone,
    email_token_expire timestamp with time zone,
    signup_method character varying(255)
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
    artist_creator_name text,
    phone_number text,
    gender text,
    date_of_birth date,
    city text,
    state text,
    country text,
    user_type text,
    occupation text,
    preferred_language text,
    marketing_consent boolean
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
599dbd10-921e-43d4-9446-3f0ef2cd3c35	ce326991-cd9e-4c72-abde-45dd7cfc80fd	297149dd-2bc0-9585-ddbf-fbded0b96de8	c0bf53d5-ce3e-31cb-de48-45155b61c5b3	2024-03-04 04:25:06.005899+09	2024-03-04 04:25:06.005899+09	2024-04-03 04:25:06.027+09	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36	inactive
5472c4db-b569-4e07-906b-077cf0b3f3ad	ce326991-cd9e-4c72-abde-45dd7cfc80fd	05c642c3-52ce-4778-bc14-4f75472e93b4	9613dcbb-9473-403e-94e2-f0e286701414	2024-03-04 04:25:18.479194+09	2024-03-04 04:25:18.479194+09	2024-04-03 04:25:18.478+09	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36	inactive
bdbe8b5d-6a59-4e62-946d-6a204fac119c	ce326991-cd9e-4c72-abde-45dd7cfc80fd	436f8236-b2de-4875-ba21-beeadb2a9562	a77bf1d9-b940-4617-9e95-09ce166459e2	2024-03-17 15:07:58.687815+09	2024-03-17 15:07:58.687815+09	2024-04-16 15:07:58.478+09	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36	inactive
28506791-d769-4017-a598-687c78590556	ce326991-cd9e-4c72-abde-45dd7cfc80fd	7978bf8c-f576-4c2d-9ed7-1f2032745816	7eeb084a-ac2e-4fe2-bc16-b5e3aa81f0f2	2024-03-21 21:56:10.298707+09	2024-03-21 21:56:10.298707+09	2024-04-20 21:56:10.298+09	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36	inactive
88657f44-fb70-4b18-8512-af7e1d958117	ce326991-cd9e-4c72-abde-45dd7cfc80fd	26d6d83c-acfb-4def-94df-f1b584fbd0c2	cc835048-efee-4a78-91f1-7799f44e4fbe	2024-04-01 22:09:11.278782+09	2024-04-01 22:09:11.278782+09	2024-05-01 22:09:10.312+09	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36	active
073d6e72-5fb7-492e-8145-63228ed00fde	42955622-2e39-4b16-b874-25808ac06329	a368bd9c-00eb-461d-ab82-7233de63ec1e	fca5c711-1338-45dd-820d-03d2fcbbb602	2024-05-11 00:30:54.715019+09	2024-05-11 00:30:54.715019+09	2024-06-10 00:30:54.714+09	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36	active
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: abe
--

COPY auth.users (id, uuid, first_name, last_name, email, username, password, created_at, email_confirmed, email_token, last_email_sent, email_token_expire, signup_method) FROM stdin;
7	ce326991-cd9e-4c72-abde-45dd7cfc80fd	Abraham	Ahn	satmorningrain@gmail.com	meekah	$2b$10$TsnLTxSWzfTekkJEgNtrgOzhuIpS13Nnbs23Oe3luqlBMrSJ2VhsK	2024-03-04 04:24:54.418+09	t	7bf412c0-25f1-4c79-9cfe-612aa0a401e3	2024-03-04 04:24:55.652518+09	2024-03-04 04:39:54.418+09	email
8	1bf143ad-217b-44d7-93af-37c2ca813b0d	Lou	Sassle	kidchivalry@gmail.com	lousassle	$2b$10$G8iO8M3YmYa34Y0o01uX6ORAVtxgIxoZUnjAVOqxGD82JftfWadM.	2024-05-04 11:21:39.582+09	f	e2ebab89-2dc4-4d9f-b2e2-bab9f62b4d84	2024-05-04 11:21:40.877932+09	2024-05-04 11:36:39.582+09	email
9	42955622-2e39-4b16-b874-25808ac06329	Floris	Melse	florismelse@gmail.com	crest	$2b$10$BxMR42.fXXH.8UAdkEbdLuF/Mxjy4uZUAv/dFGDnXNT8cGZX866R6	2024-05-11 00:30:23.609+09	f	93307025-ace1-4c6e-a82f-70a489c69e28	2024-05-11 00:30:25.047433+09	2024-05-11 00:45:23.609+09	email
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

COPY users.profile (user_id, username, email, first_name, last_name, artist_creator_name, phone_number, gender, date_of_birth, city, state, country, user_type, occupation, preferred_language, marketing_consent) FROM stdin;
ce326991-cd9e-4c72-abde-45dd7cfc80fd	meekah	satmorningrain@gmail.com	Abraham	Ahn	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
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
1	ce326991-cd9e-4c72-abde-45dd7cfc80fd	user
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

SELECT pg_catalog.setval('auth.users_id_seq', 21, true);


--
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: users; Owner: abe
--

SELECT pg_catalog.setval('users.roles_role_id_seq', 29, true);


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
-- Name: users users_username_key; Type: CONSTRAINT; Schema: auth; Owner: abe
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


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
-- Name: profile_email_idx; Type: INDEX; Schema: users; Owner: abe
--

CREATE INDEX profile_email_idx ON users.profile USING btree (email);


--
-- Name: profile_user_id_idx; Type: INDEX; Schema: users; Owner: abe
--

CREATE INDEX profile_user_id_idx ON users.profile USING btree (user_id);


--
-- Name: profile_username_idx; Type: INDEX; Schema: users; Owner: abe
--

CREATE INDEX profile_username_idx ON users.profile USING btree (username);


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

