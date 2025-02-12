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
-- Name: meekah; Type: SCHEMA; Schema: -; Owner: abe
--

CREATE SCHEMA meekah;


ALTER SCHEMA meekah OWNER TO abe;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: track_arrangement; Type: TABLE; Schema: meekah; Owner: abe
--

CREATE TABLE meekah.track_arrangement (
    id integer NOT NULL,
    track_catalog text,
    track_title text,
    time_1 text,
    section_1 text,
    time_2 text,
    section_2 text,
    time_3 text,
    section_3 text,
    time_4 text,
    section_4 text,
    time_5 text,
    section_5 text,
    time_6 text,
    section_6 text,
    time_7 text,
    section_7 text,
    time_8 text,
    section_8 text,
    time_9 text,
    section_9 text,
    time_10 text,
    section_10 text,
    time_11 text,
    section_11 text,
    time_12 text,
    section_12 text
);


ALTER TABLE meekah.track_arrangement OWNER TO abe;

--
-- Name: track_arrangement_id_seq; Type: SEQUENCE; Schema: meekah; Owner: abe
--

CREATE SEQUENCE meekah.track_arrangement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE meekah.track_arrangement_id_seq OWNER TO abe;

--
-- Name: track_arrangement_id_seq; Type: SEQUENCE OWNED BY; Schema: meekah; Owner: abe
--

ALTER SEQUENCE meekah.track_arrangement_id_seq OWNED BY meekah.track_arrangement.id;


--
-- Name: track_creator; Type: TABLE; Schema: meekah; Owner: abe
--

CREATE TABLE meekah.track_creator (
    id integer NOT NULL,
    track_catalog text DEFAULT ''::text,
    track_title text DEFAULT ''::text,
    publisher text,
    collaborator bigint,
    name_1 text,
    producer_1 boolean,
    songwriter_1 boolean,
    ipi_1 bigint,
    split_1 integer,
    name_2 text,
    producer_2 boolean,
    songwriter_2 boolean,
    ipi_2 bigint,
    split_2 integer,
    name_3 text,
    producer_3 boolean,
    songwriter_3 boolean,
    ipi_3 bigint,
    split_3 integer
);


ALTER TABLE meekah.track_creator OWNER TO abe;

--
-- Name: track_exclusive; Type: TABLE; Schema: meekah; Owner: abe
--

CREATE TABLE meekah.track_exclusive (
    id integer NOT NULL,
    track_catalog text,
    track_title text,
    exclusive boolean,
    artist_name text,
    email text,
    country_code text,
    phone_number text,
    address_1 text,
    address_2 text,
    city text,
    state text,
    country text,
    zip_code text,
    management text,
    management_email text
);


ALTER TABLE meekah.track_exclusive OWNER TO abe;

--
-- Name: track_file; Type: TABLE; Schema: meekah; Owner: abe
--

CREATE TABLE meekah.track_file (
    id integer NOT NULL,
    track_catalog text,
    track_title text,
    file_public text,
    file_mp3 text,
    file_wav text,
    file_stems text
);


ALTER TABLE meekah.track_file OWNER TO abe;

--
-- Name: track_info; Type: TABLE; Schema: meekah; Owner: abe
--

CREATE TABLE meekah.track_info (
    id integer NOT NULL,
    release date,
    file_public text,
    track_catalog text,
    track_title text,
    track_producer text,
    duration text,
    bpm bigint,
    note text,
    scale text,
    main_genre_1 text,
    sub_genre_1 text,
    main_genre_2 text,
    sub_genre_2 text,
    related_artist_1 text,
    related_artist_2 text,
    related_artist_3 text,
    mood_1 text,
    mood_2 text,
    mood_3 text,
    region_1 text,
    region_2 text,
    region_3 text
);


ALTER TABLE meekah.track_info OWNER TO abe;

--
-- Name: track_instruments; Type: TABLE; Schema: meekah; Owner: abe
--

CREATE TABLE meekah.track_instruments (
    id integer NOT NULL,
    track_catalog character varying(255),
    track_title character varying(255),
    instrument_1 character varying(255),
    category_1 character varying(255),
    instrument_2 character varying(255),
    category_2 character varying(255),
    instrument_3 character varying(255),
    category_3 character varying(255),
    instrument_4 character varying(255),
    category_4 character varying(255),
    instrument_5 character varying(255),
    category_5 character varying(255),
    instrument_6 character varying(255),
    category_6 character varying(255),
    instrument_7 character varying(255),
    category_7 character varying(255)
);


ALTER TABLE meekah.track_instruments OWNER TO abe;

--
-- Name: track_instruments_id_seq; Type: SEQUENCE; Schema: meekah; Owner: abe
--

CREATE SEQUENCE meekah.track_instruments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE meekah.track_instruments_id_seq OWNER TO abe;

--
-- Name: track_instruments_id_seq; Type: SEQUENCE OWNED BY; Schema: meekah; Owner: abe
--

ALTER SEQUENCE meekah.track_instruments_id_seq OWNED BY meekah.track_instruments.id;


--
-- Name: track_release; Type: TABLE; Schema: meekah; Owner: abe
--

CREATE TABLE meekah.track_release (
    id integer NOT NULL,
    release_date date,
    release_file character varying(255),
    isrc character varying(20),
    iswc character varying(20),
    title character varying(255),
    album character varying(255),
    artist character varying(255)
);


ALTER TABLE meekah.track_release OWNER TO abe;

--
-- Name: track_release_id_seq; Type: SEQUENCE; Schema: meekah; Owner: abe
--

CREATE SEQUENCE meekah.track_release_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE meekah.track_release_id_seq OWNER TO abe;

--
-- Name: track_release_id_seq; Type: SEQUENCE OWNED BY; Schema: meekah; Owner: abe
--

ALTER SEQUENCE meekah.track_release_id_seq OWNED BY meekah.track_release.id;


--
-- Name: track_sample; Type: TABLE; Schema: meekah; Owner: abe
--

CREATE TABLE meekah.track_sample (
    id integer NOT NULL,
    track_catalog text,
    track_title text,
    sample_file_1 text,
    sample_pack_1 text,
    sample_author_1 text,
    sample_royalty_free_1 boolean,
    sample_clearance_1 boolean,
    sample_file_2 text,
    sample_pack_2 text,
    sample_author_2 text,
    sample_royalty_free_2 boolean,
    sample_clearance_2 boolean,
    sample_file_3 text,
    sample_pack_3 text,
    sample_author_3 text,
    sample_royalty_free_3 boolean,
    sample_clearance_3 boolean,
    sample_file_4 text,
    sample_pack_4 text,
    sample_author_4 text,
    sample_royalty_free_4 boolean,
    sample_clearance_4 boolean,
    sample_file_5 text,
    sample_pack_5 text,
    sample_author_5 text,
    sample_royalty_free_5 boolean,
    sample_clearance_5 boolean
);


ALTER TABLE meekah.track_sample OWNER TO abe;

--
-- Name: track_arrangement id; Type: DEFAULT; Schema: meekah; Owner: abe
--

ALTER TABLE ONLY meekah.track_arrangement ALTER COLUMN id SET DEFAULT nextval('meekah.track_arrangement_id_seq'::regclass);


--
-- Name: track_instruments id; Type: DEFAULT; Schema: meekah; Owner: abe
--

ALTER TABLE ONLY meekah.track_instruments ALTER COLUMN id SET DEFAULT nextval('meekah.track_instruments_id_seq'::regclass);


--
-- Name: track_release id; Type: DEFAULT; Schema: meekah; Owner: abe
--

ALTER TABLE ONLY meekah.track_release ALTER COLUMN id SET DEFAULT nextval('meekah.track_release_id_seq'::regclass);


--
-- Data for Name: track_arrangement; Type: TABLE DATA; Schema: meekah; Owner: abe
--

COPY meekah.track_arrangement (id, track_catalog, track_title, time_1, section_1, time_2, section_2, time_3, section_3, time_4, section_4, time_5, section_5, time_6, section_6, time_7, section_7, time_8, section_8, time_9, section_9, time_10, section_10, time_11, section_11, time_12, section_12) FROM stdin;
6	mkh006	Hustle	0:00	Intro	0:09	Chorus	0:30	Verse	0:50	Pre-Chorus	1:10	Chorus	1:30	Verse	2:00	Pre-Chorus	2:11	Chorus A	2:31	Chorus B	\N	\N	\N	\N	\N	\N
38	mkh038	Free	0:00	Intro	0:06	Chorus	0:29	Verse	0:53	Chorus	1:18	Verse	1:42	Chorus	2:06	Verse	2:30	Chorus	2:53	Outro	\N	\N	\N	\N	\N	\N
8	mkh008	Quitter	0:00	Intro	0:06	Chorus	0:29	Verse	0:52	Verse	1:16	Verse	1:26	Hook	1:50	Chorus	2:13	Chorus	\N	\N	\N	\N	\N	\N	\N	\N
10	mkh010	Fly	0:00	Intro	0:12	Verse	0:35	Pre-Chorus	0:59	Chorus	1:22	Verse A	1:45	Verse B	2:09	Pre-Chorus	2:32	Chorus A	2:56	Chorus B	\N	\N	\N	\N	\N	\N
13	mkh013	Silence	0:00	Intro	0:10	Chorus	0:39	Verse	1:05	Pre-Chorus	1:20	Chorus	1:45	Verse	2:15	Pre-Chorus	2:28	Chorus	\N	\N	\N	\N	\N	\N	\N	\N
14	mkh014	Astroworld	0:00	Intro	0:10	Chorus	0:37	Verse	1:02	Pre-Chorus	1:15	Chorus A	1:38	Chorus B	2:05	Verse	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
18	mkh018	Gang	0:00	Intro	0:13	Chorus	0:52	Verse	1:40	Pre-Chorus	1:52	Chorus	2:05	Pre-Chorus	2:17	Chorus	2:30	Bridge	2:42	Chorus	\N	\N	\N	\N	\N	\N
7	mkh007	Dive	0:00	Intro	0:10	Verse	0:29	Pre-Chorus	0:48	Chorus	1:07	Verse	1:45	Pre-Chorus	2:04	Chorus	2:24	Birdge	2:44	Pre-Chorus	3:02	Chorus	\N	Outro	\N	\N
36	mkh036	Mermaid	0:00	Intro	0:18	Verse	0:45	Pre-Chorus	1:04	Chorus	1:40	Verse	2:17	Verse	2:35	Chorus A	3:12	Chorus B	3:30	Outro	\N	\N	\N	\N	\N	\N
37	mkh037	Water	0:00	Intro	0:05	Chorus	0:28	Verse	0:50	Chorus	1:13	Verse	1:36	Pre-Chorus	1:58	Verse	2:21	Chorus A	2:43	Chorus B	3:06	Outro	3:06	\N	\N	\N
48	mkh048	Psychedelic	0:00	Intro	0:12	Chorus	0:36	Verse	1:00	Chorus	1:24	Chorus	1:47	Verse	2:12	Verse	2:36	Chorus	3:00	Chorus	\N	\N	\N	Chorus	3:26	Outro
19	mkh019	Hard	0:00	Intro	0:04	Chorus	0:26	Verse	0:50	Pre-Chorus	1:13	Chorus	1:36	Verse	1:59	Pre-Chorus	2:22	Chorus A	2:45	Chorus B	\N	\N	\N	\N	\N	\N
15	mkh015	Kiki	0:00	Intro	0:08	Chorus	0:29	Verse	0:50	Pre-Chorus	1:12	Chorus	1:33	Verse	1:53	Pre-Chorus	2:15	Chorus	\N	\N	\N	\N	\N	\N	\N	\N
52	mkh052	Killer	0:00	Intro	0:10	Verse	0:30	Pre-Chorus	0:50	Chorus	1:31	Chorus	1:51	Verse	2:11	Chorus	2:52	Outro	\N	Verse	\N	\N	\N	Chorus	4:50	Outro
43	mkh043	Sunkist	0:00	Intro	0:20	Verse	0:41	Chorus	1:02	Verse	1:23	Pre-Chorus	1:44	Chorus	2:05	Bridge	2:26	Chorus A	3:46	Outro	\N	\N	\N	\N	\N	\N
45	mkh045	Drive	0:00	Intro	0:07	Verse	0:24	Pre-Chorus	1:02	Pre-Chorus	1:15	Verse	1:43	Pre-Chorus	2:10	Pre-Chorus	2:24	Chorus	2:51	Outro	\N	\N	\N	\N	\N	\N
5	mkh005	Dream	0:00	Intro	0:10	Verse	0:32	Pre-Chorus	0:53	Chorus	1:15	Verse	1:36	Pre-Chorus	1:57	Chorus	2:40	Bridge	3:01	Chorus	\N	\N	\N	\N	\N	\N
23	mkh023	Buddha	0:00	Intro	0:07	Chorus	0:22	Pre-Chorus	0:36	Chorus	0:51	Verse	1:06	Pre-Chorus	1:21	Chorus	1:36	Verse	1:50	Pre-Chorus	2:05	Chorus	2:05	Outro	\N	\N
12	mkh012	Dope	0:00	Intro	0:04	Verse A	0:31	Verse B	0:58	Pre-Chorus	1:13	Chorus	1:40	Verse	2:08	Pre-Chorus	2:21	Chorus	\N	\N	\N	\N	\N	\N	\N	\N
49	mkh049	Shark	0:00	Intro	0:07	Chorus	0:21	Verse	0:49	Pre-Chorus	1:04	Verse	1:18	Chorus	1:46	Pre-Chorus	2:00	Chorus	2:15	\N	2:43	Pre-Chorus	2:43	Outro	\N	\N
2	mkh002	Trapped	0:00	Intro	0:10	Chorus A	0:31	Chorus B	0:53	Verse A	1:14	Verse B	1:36	Chorus A	1:57	Chorus B	2:18	Bridge	2:39	Chorus	\N	\N	\N	\N	\N	\N
29	mkh029	Millionaire	0:00	Intro	0:06	Chorus	0:34	Verse	1:01	Pre-Chorus	1:15	Chorus	1:42	Verse	2:10	Pre-Chorus	2:24	Chorus	2:51	Outro	\N	\N	\N	\N	\N	\N
30	mkh030	Versace	0:00	Intro	0:10	Chorus	0:30	Verse	0:50	Pre-Chorus	1:10	Chorus	1:30	Verse	1:50	Pre-Chorus	2:10	Chorus	2:30	Bridge	2:50	Chorus	2:50	Outro	\N	\N
33	mkh033	Ride	0:00	Intro	0:06	Verse	0:30	Pre-Chorus	0:42	Chorus	1:05	Verse	1:30	Verse	1:42	Chorus	2:05	Verse	2:30	Pre-Chorus	2:42	Chorus A	2:42	Chorus B	\N	\N
42	mkh042	Savage	0:00	Verse	0:06	Pre-Chorus	0:32	Chorus B	0:57	Pre-Chorus	1:23	Pre-Chorus	1:48	Chorus	2:14	Pre-Chorus	2:40	Chorus A	3:05	Chorus B	\N	\N	\N	\N	\N	\N
44	mkh044	Comme	0:00	Intro	0:11	Chorus	0:34	Verse	0:57	Verse	1:20	Chorus	1:42	Verse	2:05	Verse	2:28	Pre-Chorus	2:51	Chorus	3:14	Outro	3:14	\N	\N	\N
22	mkh022	Summer	0:00	Intro	0:05	Chorus	0:28	Verse	0:50	Pre-Chorus	1:13	Chorus	1:36	Verse	1:58	Pre-Chorus	2:21	Chorus	2:43	Outro	\N	\N	\N	\N	\N	\N
25	mkh025	Ocean	0:00	Intro	0:06	Chorus	0:20	Verse	0:45	Pre-Chorus	1:01	Chorus	1:29	Verse	1:56	Pre-Chorus	2:10	Chorus	2:37	Bridge	3:05	Chorus	3:05	Outro	\N	\N
35	mkh035	Feeling	0:00	Intro	0:01	Chorus	0:37	Verse	0:54	Pre-Chorus	1:11	Verse	1:46	Pre-Chorus	2:04	Pre-Chorus	2:22	Chorus A	2:39	Chorus B	2:57	Outro	2:57	\N	\N	\N
39	mkh039	Love	0:00	Intro	0:04	Chorus	0:46	Verse	1:07	Chorus	1:48	Verse	2:29	Chorus	3:16	Outro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
40	mkh040	Down	0:00	Intro	0:12	Verse A	1:00	Verse B	1:48	Chorus	2:36	Chorus A	3:24	Chorus B	4:12	Outro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
24	mkh024	Weekend	0:00	Intro	0:10	Chorus	0:48	Verse	1:30	Chorus	2:10	Verse	2:50	Chorus	3:30	Outro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
34	mkh034	Metro	0:00	Intro	0:06	Chorus	0:28	Verse	0:51	Pre-Chorus	1:14	Chorus	1:36	Verse	2:00	Pre-Chorus	2:22	Chorus	2:45	Bridge	3:08	Chorus	3:08	Outro	\N	\N
21	mkh021	Mango	0:00	Intro	0:05	Chorus	0:39	Verse	0:55	Pre-Chorus	1:12	Chorus	1:29	Verse	1:46	Pre-Chorus	2:02	Chorus	2:19	Bridge	2:36	Chorus A	2:36	Chorus B	3:08	Outro
27	mkh027	Blossom	0:00	Intro	0:10	Chorus	0:32	Verse	0:54	Pre-Chorus	1:15	Chorus	1:37	Verse	1:58	Pre-Chorus	2:20	Chorus	3:02	Outro	\N	\N	\N	\N	\N	\N
28	mkh028	Karma	0:00	Intro	0:13	Chorus	0:41	Verse	1:09	Pre-Chorus	1:22	Chorus	1:49	Verse	2:16	Pre-Chorus	2:30	Chorus	2:58	Outro	\N	\N	\N	\N	\N	\N
16	mkh016	Sicko	0:00	Intro	0:10	Chorus	0:37	Verse A	1:01	Verse B	1:25	Chorus A	1:37	Chorus B	1:49	Bridge	2:13	Chorus A	2:37	Chorus B	\N	\N	\N	\N	\N	\N
17	mkh017	God	0:00	Intro	0:15	Verse	0:30	Pre-Chorus	0:43	Chorus	1:12	Verse	1:40	Pre-Chorus	1:54	Chorus	2:22	Bridge	2:50	Chorus A	3:19	Chorus B	3:02	Outro	\N	\N
47	mkh047	Japan	0:00	Intro	0:11	Chorus	0:33	Verse	1:19	Chorus	1:41	Verse	2:26	Chorus	2:49	Verse	3:34	Outro	\N	Outro	\N	\N	\N	\N	\N	\N
50	mkh050	Burn	0:00	Intro	0:11	Verse	0:33	Verse	0:55	Chorus	1:17	Verse	1:36	Pre-Chorus	2:01	Verse	2:23	Chorus	2:45	Outro	3:07	Chorus	3:07	\N	\N	\N
51	mkh051	Money	0:00	Intro	0:10	Verse	0:29	Pre-Chorus	0:49	Chorus	1:08	Verse	1:27	Pre-Chorus	1:48	Chorus	2:07	Bridge	2:27	Verse	3:06	Outro	3:06	\N	\N	\N
53	mkh053	Rapstar	0:00	Intro	0:11	Chorus	0:38	Verse	1:03	Pre-Chorus	1:28	Verse	1:54	Pre-Chorus	2:19	Pre-Chorus	2:44	Chorus	3:09	Chorus	3:34	Pre-Chorus	3:34	\N	\N	\N
56	mkh056	Suite	0:00	Intro	0:24	Chorus	0:47	Verse	1:12	Pre-Chorus	1:36	Section 4	2:00	Section 5	2:24	Pre-Chorus	2:48	Chorus	3:12	Chorus	\N	\N	\N	Outro	\N	\N
9	mkh009	Crown	0:00	Intro	0:14	Chorus	0:42	Verse	1:09	Pre-Chorus	1:23	Chorus	1:51	Verse	1:59	Pre-Chorus	2:33	Chorus A	2:47	Chorus B	\N	\N	\N	\N	\N	\N
20	mkh020	Bed	0:00	Intro	0:08	Chorus	0:29	Verse	0:50	Pre-Chorus	1:10	Chorus	1:30	Verse	1:52	Pre-Chorus	2:12	Chorus	2:32	Bridge	\N	\N	\N	\N	\N	\N
26	mkh026	Coca	0:00	Intro	0:06	Chorus	0:34	Verse	1:01	Pre-Chorus	1:15	Chorus	1:42	Verse	2:10	Pre-Chorus	2:24	Chorus	2:51	Outro	\N	\N	\N	\N	\N	\N
31	mkh031	Rhythm	0:00	Intro	0:17	Verse	0:53	Pre-Chorus	1:10	Chorus	1:29	Interlude	1:46	Verse	2:20	Pre-Chorus	2:40	Chorus	3:15	Outro	\N	\N	\N	\N	\N	\N
32	mkh032	Origin	0:00	Intro	0:12	Chorus	0:37	Verse	1:14	Pre-Chorus	1:27	Chorus	1:52	Pre-Chorus	2:29	Pre-Chorus	2:42	Chorus	3:07	Outro	\N	\N	\N	\N	3:06	Outro
46	mkh046	Popstar	0:00	Intro	0:08	Chorus	0:25	Verse	0:42	Chorus	0:59	Verse	1:16	Chorus	1:32	Chorus	2:06	Bridge	2:23	Chorus	2:57	Outro	2:57	\N	\N	\N
1	mkh001	Enemy	0:00	Intro	0:13	Chorus	0:41	Verse	0:55	Pre-Chorus	1:08	Chorus	1:36	Verse	2:03	Pre-Chorus	2:30	Chorus	\N	\N	\N	\N	\N	\N	\N	\N
3	mkh003	Overdose	0:00	Intro	0:06	Chorus	0:31	Verse	0:57	Pre-Chorus	1:23	Chorus	1:48	Verse	2:14	Pre-Chorus	2:39	Chorus	\N	\N	\N	\N	\N	\N	\N	\N
4	mkh004	Higher	0:00	Intro	0:11	Chorus	0:35	Verse	0:59	Chorus	1:23	Verse	1:47	Chorus	2:11	Verse	2:35	Chorus A	2:59	Chorus B	\N	\N	\N	\N	\N	\N
41	mkh041	Paradise	0:00	Intro	0:09	Chorus	0:28	Verse	0:47	Pre-Chorus	1:05	Chorus	1:24	Verse	1:43	Verse A	2:02	Verse B	2:21	Pre-Chorus	2:40	Chorus A	2:40	Chorus B	3:17	Outro
11	mkh011	Dragon	0:00	Intro	0:03	Chorus	0:22	Verse	0:32	Pre-Chorus	0:42	Chorus	1:02	Verse	1:12	Pre-Chorus	1:22	Chorus	\N	\N	\N	\N	\N	\N	\N	\N
54	mkh054	Lambo	0:00	Intro	0:07	Verse	0:35	Pre-Chorus	0:49	Chorus	1:03	Chorus	1:32	Verse	1:46	Chorus	2:00	Bridge	2:14	\N	2:42	Outro	2:42	\N	\N	\N
55	mkh055	Kanga	0:00	Intro	0:08	Chorus	0:24	Verse	0:56	Pre-Chorus	1:12	Chorus	1:28	Verse	2:00	Pre-Chorus	2:16	Chorus	2:32	Verse	\N	\N	\N	\N	\N	\N
57	mkh057	Africa	0:00	Intro	0:19	Section 1	0:37	Section 2	0:56	Section 3	1:15	Verse	1:34	Chorus	1:53	Section 6	2:12	Section 7	2:30	Outro	2:49	Section 9	2:49	\N	\N	\N
58	mkh058	Dark	0:00	Intro	0:07	Chorus	0:37	Verse	1:06	Chorus	1:36	Section 4	2:05	Section 5	2:35	Outro	\N	\N	\N	Outro	\N	\N	\N	Outro	\N	\N
59	mkh059	Bad	0:00	Intro	0:12	Section 1	0:38	Section 2	1:04	Section 3	1:29	Chorus	1:55	Verse	2:20	Section 6	2:46	Section 7	3:12	Section 8	3:37	Section 9	3:37	\N	\N	\N
60	mkh060	Final	0:00	Intro	0:11	Chorus	0:34	Verse	0:56	Pre-Chorus	1:19	Chorus	1:41	Verse	2:04	Pre-Chorus	2:26	Chorus	2:49	Outro	\N	\N	\N	\N	\N	\N
62	mkh062	Playa	0:00	Intro	0:19	Chorus	0:39	Verse	1:18	Pre-Chorus	1:38	Chorus	1:57	Verse	2:36	Pre-Chorus	2:56	Chorus	3:15	Outro	\N	\N	\N	\N	\N	\N
61	mkh061	Space	0:00	Intro	0:21	Chorus	0:42	Verse	1:04	Pre-Chorus	1:25	Chorus	1:46	Verse	2:08	Pre-Chorus	2:29	Chorus	2:50	Outro	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: track_creator; Type: TABLE DATA; Schema: meekah; Owner: abe
--

COPY meekah.track_creator (id, track_catalog, track_title, publisher, collaborator, name_1, producer_1, songwriter_1, ipi_1, split_1, name_2, producer_2, songwriter_2, ipi_2, split_2, name_3, producer_3, songwriter_3, ipi_3, split_3) FROM stdin;
1	mkh001	Enemy	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	mkh002	Trapped	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	mkh003	Overdose	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	mkh004	Higher	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	mkh005	Dream	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	mkh006	Hustle	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7	mkh007	Dive	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8	mkh008	Quitter	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	mkh009	Crown	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
10	mkh010	Fly	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
11	mkh011	Dragon	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
12	mkh012	Dope	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
13	mkh013	Silence	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14	mkh014	Astroworld	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
15	mkh015	Kiki	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
16	mkh016	Sicko	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
17	mkh017	God	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
18	mkh018	Gang	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
22	mkh022	Summer	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
20	mkh020	Bed	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
21	mkh021	Mango	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
19	mkh019	Hard	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
23	mkh023	Buddha	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
24	mkh024	Weekend	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
25	mkh025	Ocean	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
26	mkh026	Coca	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
27	mkh027	Blossom	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
28	mkh028	Karma	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
29	mkh029	Millionaire	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
30	mkh030	Versace	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
31	mkh031	Rhythm	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
32	mkh032	Origin	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
33	mkh033	Ride	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
34	mkh034	Metro	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
35	mkh035	Feeling	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
36	mkh036	Mermaid	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
37	mkh037	Water	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
38	mkh038	Free	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
39	mkh039	Love	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
40	mkh040	Down	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
41	mkh041	Paradise	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
42	mkh042	Savage	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
43	mkh043	Sunkist	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
44	mkh044	Comme	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
45	mkh045	Drive	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
46	mkh046	Popstar	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
47	mkh047	Japan	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
48	mkh048	Psychedelic	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
49	mkh049	Shark	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
50	mkh050	Burn	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
51	mkh051	Money	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
52	mkh052	Killer	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
53	mkh053	Rapstar	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
54	mkh054	Lambo	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
55	mkh055	Kanga	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
56	mkh056	Suite	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
57	mkh057	Africa	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
58	mkh058	Dark	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
59	mkh059	Bad	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
60	mkh060	Final	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
62	mkh062	Playa	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
61	mkh061	Space	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: track_exclusive; Type: TABLE DATA; Schema: meekah; Owner: abe
--

COPY meekah.track_exclusive (id, track_catalog, track_title, exclusive, artist_name, email, country_code, phone_number, address_1, address_2, city, state, country, zip_code, management, management_email) FROM stdin;
2	mkh002	Trapped	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	mkh003	Overdose	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	mkh005	Dream	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	mkh006	Hustle	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7	mkh007	Dive	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8	mkh008	Quitter	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	mkh009	Crown	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
10	mkh010	Fly	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
11	mkh011	Dragon	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
12	mkh012	Dope	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
13	mkh013	Silence	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14	mkh014	Astroworld	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
15	mkh015	Kiki	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
16	mkh016	Sicko	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
17	mkh017	God	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
19	mkh019	Hard	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
21	mkh021	Mango	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
29	mkh029	Millionaire	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
31	mkh031	Rhythm	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
33	mkh033	Ride	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
35	mkh035	Feeling	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
37	mkh037	Water	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
38	mkh038	Free	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
40	mkh040	Down	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
41	mkh041	Paradise	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
42	mkh042	Savage	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
44	mkh044	Comme	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
46	mkh046	Popstar	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	mkh001	Enemy	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	mkh004	Higher	t	Sameer Rai	decimusray@gmail.com	1	6509963369	998 Terrace Drive	\N	Los Altos	California	United States	94024	\N	\N
18	mkh018	Gang	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
20	mkh020	Bed	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
22	mkh022	Summer	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
23	mkh023	Buddha	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
24	mkh024	Weekend	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
59	mkh059	Bad	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
25	mkh025	Ocean	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
26	mkh026	Coca	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
27	mkh027	Blossom	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
28	mkh028	Karma	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
30	mkh030	Versace	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
32	mkh032	Origin	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
34	mkh034	Metro	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
36	mkh036	Mermaid	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
39	mkh039	Love	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
43	mkh043	Sunkist	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
45	mkh045	Drive	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
47	mkh047	Japan	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
48	mkh048	Psychedelic	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
49	mkh049	Shark	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
50	mkh050	Burn	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
51	mkh051	Money	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
52	mkh052	Killer	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
53	mkh053	Rapstar	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
54	mkh054	Lambo	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
55	mkh055	Kanga	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
56	mkh056	Suite	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
57	mkh057	Africa	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
58	mkh058	Dark	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
60	mkh060	Final	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
62	mkh062	Playa	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
61	mkh061	Space	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: track_file; Type: TABLE DATA; Schema: meekah; Owner: abe
--

COPY meekah.track_file (id, track_catalog, track_title, file_public, file_mp3, file_wav, file_stems) FROM stdin;
1	mkh001	Enemy	mkh001_enemy.ogg	mkh001_enemy.mp3	mkh001_enemy.wav	mkh001_enemy_track_stems.zip
2	mkh002	Trapped	mkh002_trapped.ogg	mkh002_trapped.mp3	mkh002_trapped.wav	mkh002_trapped_track_stems.zip
3	mkh003	Overdose	mkh003_overdose.ogg	mkh003_overdose.mp3	mkh003_overdose.wav	mkh003_overdose_track_stems.zip
4	mkh004	Higher	mkh004_higher.ogg	mkh004_higher.mp3	mkh004_higher.wav	mkh004_higher_track_stems.zip
5	mkh005	Dream	mkh005_dream.ogg	mkh005_dream.mp3	mkh005_dream.wav	mkh005_dream_track_stems.zip
6	mkh006	Hustle	mkh006_hustle.ogg	mkh006_hustle.mp3	mkh006_hustle.wav	mkh006_hustle_track_stems.zip
7	mkh007	Dive	mkh007_dive.ogg	mkh007_dive.mp3	mkh007_dive.wav	mkh007_dive_track_stems.zip
8	mkh008	Quitter	mkh008_quitter.ogg	mkh008_quitter.mp3	mkh008_quitter.wav	mkh008_quitter_track_stems.zip
9	mkh009	Crown	mkh009_crown.ogg	mkh009_crown.mp3	mkh009_crown.wav	mkh009_crown_track_stems.zip
10	mkh010	Fly	mkh010_fly.ogg	mkh010_fly.mp3	mkh010_fly.wav	mkh010_fly_track_stems.zip
11	mkh011	Dragon	mkh011_dragon.ogg	mkh011_dragon.mp3	mkh011_dragon.wav	mkh011_dragon_track_stems.zip
12	mkh012	Dope	mkh012_dope.ogg	mkh012_dope.mp3	mkh012_dope.wav	mkh012_dope_track_stems.zip
13	mkh013	Silence	mkh013_silence.ogg	mkh013_silence.mp3	mkh013_silence.wav	mkh013_silence_track_stems.zip
14	mkh014	Astroworld	mkh014_astroworld.ogg	mkh014_astroworld.mp3	mkh014_astroworld.wav	mkh014_astroworld_track_stems.zip
15	mkh015	Kiki	mkh015_kiki.ogg	mkh015_kiki.mp3	mkh015_kiki.wav	mkh015_kiki_track_stems.zip
16	mkh016	Sicko	mkh016_sicko.ogg	mkh016_sicko.mp3	mkh016_sicko.wav	mkh016_sicko_track_stems.zip
17	mkh017	God	mkh017_god.ogg	mkh017_god.mp3	mkh017_god.wav	mkh017_god_track_stems.zip
18	mkh018	Gang	mkh018_gang.ogg	mkh018_gang.mp3	mkh018_gang.wav	mkh018_gang_track_stems.zip
19	mkh019	Hard	mkh019_hard.ogg	mkh019_hard.mp3	mkh019_hard.wav	mkh019_hard_track_stems.zip
20	mkh020	Bed	mkh020_bed.ogg	mkh020_bed.mp3	mkh020_bed.wav	mkh020_bed_track_stems.zip
21	mkh021	Mango	mkh021_mango.ogg	mkh021_mango.mp3	mkh021_mango.wav	mkh021_mango_track_stems.zip
22	mkh022	Summer	mkh022_summer.ogg	mkh022_summer.mp3	mkh022_summer.wav	mkh022_summer_track_stems.zip
23	mkh023	Buddha	mkh023_buddha.ogg	mkh023_buddha.mp3	mkh023_buddha.wav	mkh023_buddha_track_stems.zip
24	mkh024	Weekend	mkh024_weekend.ogg	mkh024_weekend.mp3	mkh024_weekend.wav	mkh024_weekend_track_stems.zip
25	mkh025	Ocean	mkh025_ocean.ogg	mkh025_ocean.mp3	mkh025_ocean.wav	mkh025_ocean_track_stems.zip
26	mkh026	Coca	mkh026_coca.ogg	mkh026_coca.mp3	mkh026_coca.wav	mkh026_coca_track_stems.zip
27	mkh027	Blossom	mkh027_blossom.ogg	mkh027_blossom.mp3	mkh027_blossom.wav	mkh027_blossom_track_stems.zip
28	mkh028	Karma	mkh028_karma.ogg	mkh028_karma.mp3	mkh028_karma.wav	mkh028_karma_track_stems.zip
29	mkh029	Millionaire	mkh029_millionaire.ogg	mkh029_millionaire.mp3	mkh029_millionaire.wav	mkh029_millionaire_track_stems.zip
30	mkh030	Versace	mkh030_versace.ogg	mkh030_versace.mp3	mkh030_versace.wav	mkh030_versace_track_stems.zip
31	mkh031	Rhythm	mkh031_rhythm.ogg	mkh031_rhythm.mp3	mkh031_rhythm.wav	mkh031_rhythm_track_stems.zip
32	mkh032	Origin	mkh032_origin.ogg	mkh032_origin.mp3	mkh032_origin.wav	mkh032_origin_track_stems.zip
33	mkh033	Ride	mkh033_ride.ogg	mkh033_ride.mp3	mkh033_ride.wav	mkh033_ride_track_stems.zip
34	mkh034	Metro	mkh034_metro.ogg	mkh034_metro.mp3	mkh034_metro.wav	mkh034_metro_track_stems.zip
35	mkh035	Feeling	mkh035_feeling.ogg	mkh035_feeling.mp3	mkh035_feeling.wav	mkh035_feeling_track_stems.zip
36	mkh036	Mermaid	mkh036_mermaid.ogg	mkh036_mermaid.mp3	mkh036_mermaid.wav	mkh036_mermaid_track_stems.zip
37	mkh037	Water	mkh037_water.ogg	mkh037_water.mp3	mkh037_water.wav	mkh037_water_track_stems.zip
38	mkh038	Free	mkh038_free.ogg	mkh038_free.mp3	mkh038_free.wav	mkh038_free_track_stems.zip
39	mkh039	Love	mkh039_love.ogg	mkh039_love.mp3	mkh039_love.wav	mkh039_love_track_stems.zip
40	mkh040	Down	mkh040_down.ogg	mkh040_down.mp3	mkh040_down.wav	mkh040_down_track_stems.zip
41	mkh041	Paradise	mkh041_paradise.ogg	mkh041_paradise.mp3	mkh041_paradise.wav	mkh041_paradise_track_stems.zip
42	mkh042	Savage	mkh042_savage.ogg	mkh042_savage.mp3	mkh042_savage.wav	mkh042_savage_track_stems.zip
43	mkh043	Sunkist	mkh043_sunkist.ogg	mkh043_sunkist.mp3	mkh043_sunkist.wav	mkh043_sunkist_track_stems.zip
44	mkh044	Comme	mkh044_comme.ogg	mkh044_comme.mp3	mkh044_comme.wav	mkh044_comme_track_stems.zip
45	mkh045	Drive	mkh045_drive.ogg	mkh045_drive.mp3	mkh045_drive.wav	mkh045_drive_track_stems.zip
46	mkh046	Popstar	mkh046_popstar.ogg	mkh046_popstar.mp3	mkh046_popstar.wav	mkh046_popstar_track_stems.zip
47	mkh047	Japan	mkh047_japan.ogg	mkh047_japan.mp3	mkh047_japan.wav	mkh047_japan_track_stems.zip
48	mkh048	Psychedelic	mkh048_psychedelic.ogg	mkh048_psychedelic.mp3	mkh048_psychedelic.wav	mkh048_psychedelic_track_stems.zip
49	mkh049	Shark	mkh049_shark.ogg	mkh049_shark.mp3	mkh049_shark.wav	mkh049_shark_track_stems.zip
50	mkh050	Burn	mkh050_burn.ogg	mkh050_burn.mp3	mkh050_burn.wav	mkh050_burn_track_stems.zip
51	mkh051	Money	mkh051_money.ogg	mkh051_money.mp3	mkh051_money.wav	mkh051_money_track_stems.zip
52	mkh052	Killer	mkh052_killer.ogg	mkh052_killer.mp3	mkh052_killer.wav	mkh052_killer_track_stems.zip
53	mkh053	Rapstar	mkh053_rapstar.ogg	mkh053_rapstar.mp3	mkh053_rapstar.wav	mkh053_rapstar_track_stems.zip
54	mkh054	Lambo	mkh054_lambo.ogg	mkh054_lambo.mp3	mkh054_lambo.wav	mkh054_lambo_track_stems.zip
55	mkh055	Kanga	mkh055_kanga.ogg	mkh055_kanga.mp3	mkh055_kanga.wav	mkh055_kanga_track_stems.zip
56	mkh056	Suite	mkh056_suite.ogg	mkh056_suite.mp3	mkh056_suite.wav	mkh056_suite_track_stems.zip
57	mkh057	Africa	mkh057_africa.ogg	mkh057_africa.mp3	mkh057_africa.wav	mkh057_africa_track_stems.zip
58	mkh058	Dark	mkh058_dark.ogg	mkh058_dark.mp3	mkh058_dark.wav	mkh058_dark_track_stems.zip
59	mkh059	Bad	mkh059_bad.ogg	mkh059_bad.mp3	mkh059_bad.wav	mkh059_bad_track_stems.zip
60	mkh060	Final	mkh060_final.ogg	mkh060_final.mp3	mkh060_final.wav	mkh060_final_track_stems.zip
62	mkh062	Playa	mkh062_playa.ogg	mkh062_playa.mp3	mkh062_playa.wav	mkh062_playa_track_stems.zip
61	mkh061	Space	mkh061_space.ogg	mkh061_space.mp3	mkh061_space.wav	mkh061_space_track_stems.zip
\.


--
-- Data for Name: track_info; Type: TABLE DATA; Schema: meekah; Owner: abe
--

COPY meekah.track_info (id, release, file_public, track_catalog, track_title, track_producer, duration, bpm, note, scale, main_genre_1, sub_genre_1, main_genre_2, sub_genre_2, related_artist_1, related_artist_2, related_artist_3, mood_1, mood_2, mood_3, region_1, region_2, region_3) FROM stdin;
49	2018-11-30	mkh049_shark.ogg	mkh049	Shark	Meekah	3:44	66	C	minor	Hiphop	Trap	Rap	Trap	Lil Pump	Smokepurpp	\N	Energetic	Dirty	Fun	American	Universal	\N
32	2018-10-22	mkh032_origin.ogg	mkh032	Origin	Meekah	3:43	77	F	minor	Pop	Synth	Electronic	Future Bass	Flume	icytwat	\N	Dark	Aggressive	Energetic	Universal	American	\N
48	2018-11-28	mkh048_psychedelic.ogg	mkh048	Psychedelic	Meekah	3:12	84	F#	minor	Hiphop	Trap	Rap	Trap	Kendrick Lamar	Tyler the Creator	\N	Mellow	Ambient	Energetic	Universal	\N	\N
2	2018-05-29	mkh002_trapped.ogg	mkh002	Trapped	Meekah	3:22	90	F	minor	Hiphop	Trap	Rap	Trap	Juice WRLD	Xxxtentacion	\N	Mellow	Sentimental	Sad	American	\N	\N
43	2018-11-08	mkh043_sunkist.ogg	mkh043	Sunkist	Meekah	3:07	92	F	minor	Pop	Synth	Hiphop	Pop	Post Malone	Swae Lee	\N	Mellow	Loved	Energetic	American	\N	\N
37	2018-10-25	mkh037_water.ogg	mkh037	Water	Meekah	3:26	75	E	major	Hiphop	Trap	Rap	Trap	Drake	Gunna	Cashmoney AP	Groovy	Happy	Mellow	American	\N	\N
31	2018-10-21	mkh031_rhythm.ogg	mkh031	Rhythm	Meekah	3:33	108	B	minor	Afrobeat	Pop	Dancehall	Pop	Wizkid	Mystro	Rema	Groovy	Mellow	Relaxed	Africa	\N	\N
9	2018-06-15	mkh009_crown.ogg	mkh009	Crown	Meekah	3:28	69	D	minor	Hiphop	Trap	Pop	Hiphop	Post Malone	Nicki Minaj	Young Thug	Mellow	Energetic	Loved	Universal	American	\N
40	2018-10-29	mkh040_down.ogg	mkh040	Down	Meekah	4:24	80	A	minor	R&B	Pop	Hiphop	Trap	Tory Lanez	PARTYNEXTDOOR	Chris Brown	Energetic	Mellow	Ambient	American	Universal	\N
47	2018-11-26	mkh047_japan.ogg	mkh047	Japan	Meekah	3:44	84	F#	minor	Hiphop	Trap	Rap	Trap	A$AP Ferg	Travis Scott	Drake	Energetic	Bouncy	Loved	American	Universal	\N
26	2018-10-13	mkh026_coca.ogg	mkh026	Coca	Meekah	3:12	69	F	major	Hiphop	Trap	Pop	Hiphop	Post Malone	Ty Dolla Sign	Bazzi	Mellow	Aggressive	Loved	American	Universal	\N
34	2018-10-23	mkh034_metro.ogg	mkh034	Metro	Meekah	4:08	84	A	minor	R&B	Progressive	Electronic	Future Bass	The Weekend	Flume	\N	Smooth	Groovy	Moody	Universal	\N	\N
12	2018-06-16	mkh012_dope.ogg	mkh012	Dope	Meekah	3:05	70	D	major	Hiphop	Lo-Fi	Lo-Fi	Electronic	Nujabes	Xxxtentacion	\N	Mellow	Energetic	Aggressive	Universal	\N	\N
24	2018-09-14	mkh024_weekend.ogg	mkh024	Weekend	Meekah	3:47	96	C#	minor	R&B	Ballad	Ballad	Pop	Bryson Tiller	PARTYNEXTDOOR	Drake	Dark	Dirty	Energetic	American	\N	\N
17	2018-08-23	mkh017_god.ogg	mkh017	God	Meekah	3:49	70	F#	minor	Pop	Synth	Electronic	Experimental	Travis Scott	Clams Casino	Art of Noise	Dark	Ambient	Moody	Universal	\N	\N
21	2018-08-29	mkh021_mango.ogg	mkh021	Mango	Meekah	3:30	115	F#	major	Pop	Synth	Electronic	2-Step	Goldlink	Anderson .Paak	Chance the Rapper	Energetic	Mellow	Moody	Universal	\N	\N
35	2018-10-23	mkh035_feeling.ogg	mkh035	Feeling	Meekah	3:29	110	G	major	Pop	Funk	Funk	G-Funk	Bruno Mars	Dr. Dre	Nate Dogg	Happy	Bouncy	Groovy	American	\N	\N
23	2018-09-13	mkh023_buddha.ogg	mkh023	Buddha	Meekah	3:19	65	E	minor	Hiphop	Trap	Rap	Trap	Migos	Gucci Mane	Drake	Dark	Dirty	Energetic	East Asian	American	\N
45	2018-11-17	mkh045_drive.ogg	mkh045	Drive	Meekah	3:05	70	G	major	R&B	Pop	Pop	Hiphop	Post Malone	Pierre Bourne	NAV	Groovy	Loved	Energetic	Universal	American	East Asian
25	2018-10-11	mkh025_ocean.ogg	mkh025	Ocean	Meekah	3:49	70	E	minor	Pop	R&B	Pop	Ballad	Ty Dolla Sign	Lauv	Khalid	Mellow	Ambient	Loved	East Asian	\N	\N
44	2018-11-12	mkh044_comme.ogg	mkh044	Comme	Meekah	3:37	84	B	minor	Hiphop	Trap	Rap	Trap	Migos	Pierre Bourne	Lil Uzi Vert	Energetic	Dark	Dirty	American	\N	\N
41	2018-11-02	mkh041_paradise.ogg	mkh041	Paradise	Meekah	3:27	102	C	major	Pop	Synth	Pop	K-Pop	Ariana Grande	Ally	Gray	Mellow	Love	Moody	Korean	American	\N
5	2018-05-28	mkh005_dream.ogg	mkh005	Dream	Meekah	3:25	90	G#	minor	Hiphop	Trap	Rap	Trap	Drake	Lil Baby	Kendrick Lamar	Mellow	Energetic	Ambient	Universal	American	\N
3	2018-05-30	mkh003_overdose.ogg	mkh003	Overdose	Meekah	3:08	75	C#	minor	Pop	R&B	Pop	Ballad	Khalid	Lauv	Bazzi	Mellow	Loved	Ambient	Asian	American	\N
13	2018-07-28	mkh013_silence.ogg	mkh013	Silence	Meekah	3:12	70	A	minor	Hiphop	Trap	R&B	Alternative	Juice WRLD	Travis Scott	Post Malone	Mellow	Energetic	Aggressive	American	Universal	\N
14	2018-08-20	mkh014_astroworld.ogg	mkh014	Astroworld	Meekah	2:59	75	Eb	minor	Hiphop	Trap	R&B	Pop	Juice WRLD	Travis Scott	Post Malone	Mellow	Energetic	Aggressive	American	Universal	\N
18	2018-08-25	mkh018_gang.ogg	mkh018	Gang	Meekah	3:18	80	E	minor	Hiphop	Trap	Rap	Trap	Smokepurpp	Lil Pump	Ski Mask the Slump God	Dirty	Energetic	Aggressive	American	East Asian	\N
15	2018-08-21	mkh015_kiki.ogg	mkh015	Kiki	Meekah	2:59	91	C	major	Hiphop	Trap	Pop	R&B	Drake	Jack Harlow	Chris Brown	Mellow	Energetic	Loved	American	Universal	\N
52	2019-01-31	mkh052_killer.ogg	mkh052	Killer	Meekah	3:14	95	C	minor	Hiphop	Pop	Hiphop	Boombap	Chance the Rapper	J. Cole	Goldlink	Energetic	Bouncy	Aggressive	Universal	American	\N
58	2019-04-10	mkh058_dark.ogg	mkh058	Dark	Meekah	2:42	75	E	minor	Hiphop	Trap	Rap	Trap	Migos	Pewee Longway	Youngboy NBA	Energetic	Dark	Mellow	American	Universal	\N
59	2019-04-11	mkh059_bad.ogg	mkh059	Bad	Meekah	4:32	75	B	minor	Hiphop	Trap	Rap	Trap	Migos	Pewee Longway	Drake	Energetic	Dark	Aggressive	American	Universal	\N
60	2019-04-12	mkh060_final.ogg	mkh060	Final	Meekah	3:00	85	G#	minor	Hiphop	Trap	Rap	Trap	Migos	Drake	Meek Mill	Energetic	Dark	Groovy	American	Universal	\N
11	2018-06-16	mkh011_dragon.ogg	mkh011	Dragon	Meekah	2:05	97	F#	minor	Hiphop	Trap	Electronic	Trap	Baauer	G-Dragon	M.I.A.	Aggressive	Energetic	Dirty	East Asian	American	South Asian
22	2018-09-07	mkh022_summer.ogg	mkh022	Summer	Meekah	3:31	85	F	minor	Hiphop	Trip-Hop	Rap	Trip-Hop	Childish Gambino	Nujabes	\N	Dark	Grateful	Energetic	East Asian	American	Universal
46	2018-11-23	mkh046_popstar.ogg	mkh046	Popstar	Meekah	3:15	110	A	major	Pop	Dance	Pop	Synth	Majid Jordan	Lenno	Michael Jackson	Mellow	Bouncy	Loved	Universal	American	\N
36	2018-10-23	mkh036_mermaid.ogg	mkh036	Mermaid	Meekah	3:44	105	C	major	Pop	Synth	Dancehall	Pop	Karol G	Bad Bunny	J Balvin	Happy	Bouncy	Loved	Universal	Latin	\N
28	2018-10-17	mkh028_karma.ogg	mkh028	Karma	Meekah	3:12	70	E	minor	R&B	Progressive	R&B	Pop	24Hrs	Ty Dolla Sign	Tory Lanez	Love	Mellow	Bouncy	American	Universal	\N
7	2018-06-13	mkh007_dive.ogg	mkh007	Dive	Meekah	4:00	100	A	major	Pop	Latin	Reggaeton	Pop	French Montana	Karl Wolf	Maluma	Mellow	Epic	Bouncy	Latin	American	\N
27	2018-10-16	mkh027_blossom.ogg	mkh027	Blossom	Meekah	3:25	89	G	minor	Hiphop	Boombap	Hiphop	Trap	Jay-Z	Nujabes	\N	Aggressive	Energetic	Epic	East Asian	American	\N
57	2019-04-09	mkh057_africa.ogg	mkh057	Africa	Meekah	3:27	102	G	minor	Afrobeat	Pop	Dancehall	Afrobeat	Davido	Wizkid	Rema	Energetic	Happy	Groovy	African	\N	\N
4	2018-05-31	mkh004_higher.ogg	mkh004	Higher	Meekah	3:30	80	G	minor	Hiphop	Trap	Rap	Trap	A$AP Rocky	Skepta	Playboy Carti	Dirty	Energetic	Celebration	American	\N	\N
1	2018-06-01	mkh001_enemy.ogg	mkh001	Enemy	Meekah	3:29	70	E	minor	Hiphop	Trap	Rap	Trap	Drake	Blocboy JB	Migos	Dirty	Energetic	Evil	American	\N	\N
16	2018-08-22	mkh016_sicko.ogg	mkh016	Sicko	Meekah	3:03	80	F	minor	Hiphop	Trap	Electronic	Dubstep	Skrillex	Travis Scott	Drake	Dirty	Energetic	Aggressive	East Asian	Universal	American
50	2018-12-07	mkh050_burn.ogg	mkh050	Burn	Meekah	3:45	87	F	minor	Hiphop	Trap	Rap	Trap	Migos	Drake	21 Savage	Energetic	Dirty	Bouncy	American	Universal	\N
51	2019-01-24	mkh051_money.ogg	mkh051	Money	Meekah	3:18	98	G	major	Pop	Synth	R&B	Progressive	The Weeknd	Gesaffelstein	Daft Punk	Energetic	Dark	Ambient	American	Universal	\N
39	2018-10-28	mkh039_love.ogg	mkh039	Love	Meekah	3:44	93	A	minor	R&B	Pop	Hiphop	Club	Chris Brown	Drake	Tyga	Bouncy	Dark	Mellow	American	\N	\N
6	2018-06-02	mkh006_hustle.ogg	mkh006	Hustle	Meekah	3:12	95	G	minor	Hiphop	Trap	Rap	Trap	RIch The Kid	Migos	Jay Critch	Mellow	Epic	Ambient	American	\N	\N
10	2018-06-16	mkh010_fly.ogg	mkh010	Fly	Meekah	3:42	82	G	major	Pop	R&B	R&B	Pop	ZAYN	Troye Sivan	Lauv	Mellow	Peaceful	Loved	American	European	Universal
54	2019-02-22	mkh054_lambo.ogg	mkh054	Lambo	Meekah	3:10	76	D	major	Hiphop	Trap	Electronic	Trap	Skrillex	Rick Ross	\N	Energetic	Hard	Aggressive	American	\N	\N
38	2018-10-26	mkh038_freemp3	mkh038	Free	Meekah	3:07	79	F#	minor	Hiphop	Trap	Rap	Trap	Lil Skies	Gunna	Cashmoney AP	Groovy	Ambient	Mellow	American	\N	\N
19	2018-08-28	mkh019_hard.ogg	mkh019	Hard	Meekah	3:22	83	C	major	Hiphop	Pop	Pop	Hiphop	Goldlink	Kaytranada	Smino	Happy	Moody	Energetic	Universal	\N	\N
53	2019-02-04	mkh053_rapstar.ogg	mkh053	Rapstar	Meekah	5:03	76	Eb	minor	Hiphop	Trap	Rap	Trap	Migos	Homies	Gucci Mane	Energetic	Dark	Bouncy	American	\N	\N
55	2019-03-25	mkh055_kanga.ogg	mkh055	Kanga	Meekah	2:40	120	G	minor	Hiphop	Club	Afrobeat	Pop	6ix9ine	Kanye West	Murdabeatz	Energetic	Bouncy	Happy	African	\N	\N
56	2019-04-08	mkh056_suite.ogg	mkh056	Suite	Meekah	3:37	80	F	major	R&B	Progressive	Pop	Hiphop	Ty Dolla Sign	The Weeknd	Post Malone	Energetic	Smooth	Groovy	Universal	\N	\N
8	2018-06-14	mkh008_quitter.ogg	mkh008	Quitter	Meekah	2:41	83	A	minor	Hiphop	Trap	Rap	Trap	Lil Yachty	Youngboy NBA	Higher Brothers	Dirty	Energetic	Evil	Asian	American	\N
33	2018-10-22	mkh033_ride.ogg	mkh033	Ride	Meekah	3:30	80	B	minor	Hip-Hop	Trap	Rap	Trap	OT Genesis	Migos	Gucci Mane	Dark	Bouncy	Energetic	American	\N	\N
42	2018-11-03	mkh042_savage.ogg	mkh042	Savage	Meekah	3:45	74	D	minor	Hiphop	Trap	Rap	Trap	Migos	21 Savage	Lil Pump	Mellow	Ambient	Loved	American	\N	\N
20	2018-08-24	mkh020_bed.ogg	mkh020	Bed	Meekah	3:20	80	G#	minor	Pop	R&B	R&B	Pop	Chris Brown	Tyga	Justin Bieber	Moody	Chill	Loved	American	\N	\N
29	2018-10-18	mkh029_millionaire.ogg	mkh029	Millionaire	Meekah	3:05	70	G	minor	Hiphop	Trap	Electronic	Trap	Xxxtentacion	Lil Uzi Vert	Ski Mask the Slump God	Dark	Aggressive	Energetic	Universal	American	European
30	2018-10-19	mkh030_versace.ogg	mkh030	Versace	Meekah	3:50	96	A	minor	Pop	R&B	Pop	Synth	The Weeknd	Daft Punk	Gesaffelstein	Energetic	Aggressive	Confident	Universal	American	European
62	2022-03-01	mkh062_playa.ogg	mkh062	Playa	Meekah	3:42	98	C	minor	Reggaeton	Pop	\N	\N	Bad Bunny	Maluma	Jhay Cortez	Mellow	Moody	Epic	Latin	\N	\N
61	2019-04-13	mkh061_space.ogg	mkh061	Space	Meekah	3:12	90	E	minor	Hiphop	Trap	Rap	Trap	The Weeknd	Metro Boomin	Kendrick Lamar	Energetic	Dark	Epic	American	Universal	\N
\.


--
-- Data for Name: track_instruments; Type: TABLE DATA; Schema: meekah; Owner: abe
--

COPY meekah.track_instruments (id, track_catalog, track_title, instrument_1, category_1, instrument_2, category_2, instrument_3, category_3, instrument_4, category_4, instrument_5, category_5, instrument_6, category_6, instrument_7, category_7) FROM stdin;
16	mkh016	Sicko	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
17	mkh017	God	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
18	mkh018	Gang	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
19	mkh019	Hard	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
20	mkh020	Bed	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
21	mkh021	Mango	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
22	mkh022	Summer	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
23	mkh023	Buddha	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
24	mkh024	Weekend	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
25	mkh025	Ocean	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
26	mkh026	Coca	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
27	mkh027	Blossom	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
28	mkh028	Karma	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
29	mkh029	Millionaire	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
30	mkh030	Versace	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
31	mkh031	Rhythm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
32	mkh032	Origin	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
33	mkh033	Ride	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
34	mkh034	Metro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
35	mkh035	Feeling	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
36	mkh036	Mermaid	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
37	mkh037	Water	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
38	mkh038	Free	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
39	mkh039	Love	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
40	mkh040	Down	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
41	mkh041	Paradise	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
42	mkh042	Savage	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
43	mkh043	Sunkist	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
44	mkh044	Comme	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
45	mkh045	Drive	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
46	mkh046	Popstar	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
47	mkh047	Japan	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
48	mkh048	Psychedelic	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
49	mkh049	Shark	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
50	mkh050	Burn	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
51	mkh051	Money	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
52	mkh052	Killer	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
53	mkh053	Rapstar	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
54	mkh054	Lambo	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
55	mkh055	Kanga	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
56	mkh056	Suite	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
57	mkh057	Africa	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
58	mkh058	Dark	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
59	mkh059	Bad	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
60	mkh060	Final	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
62	mkh062	Playa	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
61	mkh061	Space	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14	mkh014	Astroworld	Drum	808	Bass	808	Percussion	Cowbell	Synth Chord	Ambient	Synth Lead	Analog	\N	\N	\N	\N
15	mkh015	Kiki	Drum	808	Bass	808	Keyboard	Rhodes	Synth Arp	Sine	\N	\N	\N	\N	\N	\N
1	mkh001	Enemy	Drum	808	Bass	808	Piano	Acoustic	Synth Lead	Lead	\N	\N	\N	\N	\N	\N
2	mkh002	Trapped	Drum	808	Bass	808	Guitar	Acoustic	Synth Lead	Arpeggio	Pad	Celestial	\N	\N	\N	\N
3	mkh003	Overdose	Drum	Digital	Bass	808	Synth	Juno	String	Koto	Synth Lead	Sine	\N	\N	\N	\N
4	mkh004	Higher	Drum	808	Bass	808	Woodwind	Flute	Vox	Choir	String	Orchestra	\N	\N	\N	\N
5	mkh005	Dream	Drum	808	Bass	808	Piano	Acoustic	Synth Pad	Ammbient	\N	\N	\N	\N	\N	\N
6	mkh006	Hustle	Drum	808	Bass	808	Guitar	Electric	Synth Pluck	\N	Synth Lead	Sine	\N	\N	\N	\N
7	mkh007	Dive	Drum	Digital	Bass	Saw	Synth Pluck	Saw	Synth Pad	Ambient	\N	\N	\N	\N	\N	\N
8	mkh008	Quitter	Drum	808	Bass	808	String	Koto	\N	\N	\N	\N	\N	\N	\N	\N
9	mkh009	Crown	Drum	808	Bass	808	Synth Keyboard	Juno	Brass	Hit	Synth Pad	Ambient	\N	\N	\N	\N
10	mkh010	Fly	Drum	Digital	Bass	808	Guitar	Electric	Synth Pad	Saw	Piano	Acoustic	\N	\N	\N	\N
11	mkh011	Dragon	Drum	Digital	Bass	808	Bass	Pluck	String	Koto	\N	\N	\N	\N	\N	\N
12	mkh012	Dope	Drum	Digital	Bass	Synth	Synth Chord	Saw	Synth Pad	Ambient	\N	\N	\N	\N	\N	\N
13	mkh013	Silence	Drum	Digital	Bass	808	Bass	Electric	Guitar	Electric	Synth Lead	Analog	\N	\N	\N	\N
\.


--
-- Data for Name: track_release; Type: TABLE DATA; Schema: meekah; Owner: abe
--

COPY meekah.track_release (id, release_date, release_file, isrc, iswc, title, album, artist) FROM stdin;
1	2018-06-01	mkh001_enemy.wav	QZHN62493212	T-930.805.700-3	Enemy	Shadow Fury	Meekah
2	2018-05-29	mkh002_trapped.wav	QZHN62493213	T-926.904.396-1	Trapped	Shadow Fury	Meekah
3	2018-05-30	mkh003_overdose.wav	QZHN62496236	T-926.904.397-2	Overdose	Echoes of the East	Meekah
4	2018-05-31	mkh004_higher.wav	QZHN72483997	T-305.315.716-3	Higher	Galactic Groove Catalyst	Meekah
5	2018-05-28	mkh005_dream.wav	QZHN62496230	T-926.904.406-6	Dream	Echoes of the East	Meekah
6	2018-06-02	mkh006_hustle.wav	QZHN72483998	T-305.320.376-8	Hustle	Galactic Groove Catalyst	Meekah
7	2018-06-13	mkh007_dive.wav	QZHN62495299	T-305.315.736-7	Dive	Starlights	Meekah
8	2018-06-14	mkh008_quitter.wav	QZHN62496233	T-926.904.395-0	Quitter	Echoes of the East	Meekah
9	2018-06-15	mkh009_crown.wav	QZHN72483999	T-925.311.846-6	Crown	Galactic Groove Catalyst	Meekah
10	2018-06-16	mkh010_fly.wav	QZHN72412201	T-305.320.372-4	Fly	Neon Nocturne	Meekah
11	2018-06-16	mkh011_dragon.wav	QZHN62496231	T-925.311.850-2	Dragon	Echoes of the East	Meekah
12	2018-06-16	mkh012_dope.wav	QZHN62493723	T-305.315.604-6	Dope	Digital Dystopia	Meekah
13	2018-07-28	mkh013_silence.wav	QZHN62493214	T-305.315.616-0	Silence	Shadow Fury	Meekah
14	2018-08-20	mkh014_astroworld.wav	QZHN72412197	T-305.315.631-9	Astroworld	Neon Nocturne	Meekah
54	2019-02-22	mkh054_lambo.wav	QZHN62493720	T-305.446.985-7	Lambo	Digital Dystopia	Meekah
55	2019-03-25	mkh055_kanga.wav	QZHN62495297	T-305.446.992-6	Kanga	Starlights	Meekah
56	2019-04-08	mkh056_suite.wav	QZHN72412192	T-305.447.002-5	Suite	Neon Nocturne	Meekah
57	2019-04-09	mkh057_africa.wav	QZHN62495298	T-305.447.005-8	Africa	Starlights	Meekah
58	2019-04-10	mkh058_dark.wav	QZHN62493220	T-305.640.744-0	Dark	Shadow Fury	Meekah
59	2019-04-11	mkh059_bad.wav	QZHN62493221	T-306.009.082-2	Bad	Shadow Fury	Meekah
60	2019-04-12	mkh060_final.wav	QZHN72484006	T-305.447.035-4	Final	Galactic Groove Catalyst	Meekah
52	2019-01-31	mkh052_killer.wav	QZHN72484004	T-305.447.228-1	Killer	Galactic Groove Catalyst	Meekah
53	2019-02-04	mkh053_rapstar.wav	QZHN72484005	T-305.447.194-8	Rapstar	Galactic Groove Catalyst	Meekah
47	2018-11-26	mkh047_japan.wav	QZHN62496232	T-305.447.170-0	Japan	Echoes of the East	Meekah
48	2018-11-28	mkh048_psychedelic.wav	QZHN62493219	T-305.447.188-0	Psychedelic	Shadow Fury	Meekah
49	2018-11-30	mkh049_shark.wav	QZHN72484003	T-305.447.184-6	Shark	Galactic Groove Catalyst	Meekah
50	2018-12-07	mkh050_burn.wav	QZHN62496235	T-305.447.168-6	Burn	Echoes of the East	Meekah
51	2019-01-24	mkh051_money.wav	QZHN72412199	T-305.447.200-9	Money	Neon Nocturne	Meekah
18	2018-08-25	mkh018_gang.wav	QZHN62496234	T-306.009.086-6	Gang	Echoes of the East	Meekah
15	2018-08-21	mkh015_kiki.wav	QZHN72484000	T-926.931.205-2	Kiki	Galactic Groove Catalyst	Meekah
16	2018-08-22	mkh016_sicko.wav	QZHN62493715	T-926.931.203-0	Sicko	Digital Dystopia	Meekah
17	2018-08-23	mkh017_god.wav	QZHN62493716	T-305.315.653-5	God	Digital Dystopia	Meekah
19	2018-08-28	mkh019_hard.wav	QZHN62495295	T-926.931.303-3	Hard	Starlights	Meekah
20	2018-08-24	mkh020_bed.wav	QZHN72412193	T-926.931.188-8	Bed	Neon Nocturne	Meekah
21	2018-08-29	mkh021_mango.wav	QZHN62493717	T-926.931.309-9	Mango	Digital Dystopia	Meekah
22	2018-09-07	mkh022_summer.wav	QZHN62493718	T-926.931.299-4	Summer	Digital Dystopia	Meekah
23	2018-09-13	mkh023_buddha.wav	QZHN62496229	T-305.315.594-1	Buddha	Echoes of the East	Meekah
24	2018-09-14	mkh024_weekend.wav	QZHN72412198	T-305.320.367-7	Weekend	Neon Nocturne	Meekah
25	2018-10-11	mkh025_ocean.wav	QZHN62496228	T-305.315.644-4	Ocean	Echoes of the East	Meekah
26	2018-10-13	mkh026_coca.wav	QZHN72484001	T-926.931.267-6	Coca	Galactic Groove Catalyst	Meekah
27	2018-10-16	mkh027_blossom.wav	QZHN62496237	T-926.931.272-3	Blossom	Echoes of the East	Meekah
28	2018-10-17	mkh028_karma.wav	QZHN72412194	T-926.931.317-9	Karma	Neon Nocturne	Meekah
29	2018-10-18	mkh029_millionaire.wav	QZHN62493719	T-305.315.629-5	Millionaire	Digital Dystopia	Meekah
30	2018-10-19	mkh030_versace.wav	QZHN62493721	T-926.931.301-1	Versace	Digital Dystopia	Meekah
31	2018-10-21	mkh031_rhythm.wav	QZHN62495296	T-305.315.615-9	Rhythm	Starlights	Meekah
32	2018-10-22	mkh032_origin.wav	QZHN62493724	T-305.315.644-4	Origin	Digital Dystopia	Meekah
33	2018-10-22	mkh033_ride.wav	QZHN62493215	T-926.931.290-5	Ride	Shadow Fury	Meekah
34	2018-10-23	mkh034_metro.wav	QZHN62493722	T-926.931.282-5	Metro	Digital Dystopia	Meekah
35	2018-10-23	mkh035_feeling.wav	QZHN62495294	T-926.931.283-6	Feeling	Starlights	Meekah
36	2018-10-23	mkh036_mermaid.wav	QZHN62495293	T-926.931.274-5	Mermaid	Starlights	Meekah
37	2018-10-25	mkh037_water.wav	QZHN72484002	T-926.931.270-1	Water	Galactic Groove Catalyst	Meekah
38	2018-10-26	mkh038_free.wav	QZHN62493216	T-926.931.344-2	Free	Shadow Fury	Meekah
39	2018-10-28	mkh039_love.wav	QZHN72412200	T-926.931.338-4	Love	Neon Nocturne	Meekah
40	2018-10-29	mkh040_down.wav	QZHN72412195	T-926.931.331-7	Down	Neon Nocturne	Meekah
41	2018-11-02	mkh041_paradise.wav	QZHN62495300	T-305.315.647-7	Paradise	Starlights	Meekah
42	2018-11-03	mkh042_savage.wav	QZHN62493217	T-926.931.376-0	Savage	Shadow Fury	Meekah
43	2018-11-08	mkh043_sunkist.wav	QZHN62495301	T-306.016.266-1	Sunkist	Starlights	Meekah
44	2018-11-12	mkh044_comme.wav	QZHN62493218	T-306.016.221-8	Comme	Shadow Fury	Meekah
45	2018-11-17	mkh045_drive.wav	QZHN72412196	T-305.320.339-3	Drive	Neon Nocturne	Meekah
46	2018-11-23	mkh046_popstar.wav	QZHN62495292	T-305.320.351-9	Popstar	Starlights	Meekah
62	2024-09-20	mkh062_playa.wav	\N	\N	Playa	\N	Meekah
61	2024-07-07	mkh061_space.wav	\N	\N	Space	\N	Meekah
\.


--
-- Data for Name: track_sample; Type: TABLE DATA; Schema: meekah; Owner: abe
--

COPY meekah.track_sample (id, track_catalog, track_title, sample_file_1, sample_pack_1, sample_author_1, sample_royalty_free_1, sample_clearance_1, sample_file_2, sample_pack_2, sample_author_2, sample_royalty_free_2, sample_clearance_2, sample_file_3, sample_pack_3, sample_author_3, sample_royalty_free_3, sample_clearance_3, sample_file_4, sample_pack_4, sample_author_4, sample_royalty_free_4, sample_clearance_4, sample_file_5, sample_pack_5, sample_author_5, sample_royalty_free_5, sample_clearance_5) FROM stdin;
1	mkh001	Enemy	BPM070TrapMan_Em_Piano.wav	Dirty South Wars 2	Prime Loops	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	mkh002	Trapped	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	mkh003	Overdose	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	mkh004	Higher	CHS_93_Gm_Flute.wav	Hip Hop Shadows Vol. 1	Loopmasters	t	t	Dl1_75_Cm_Orch_Filter_Skanks.wav	Dubmatrix Presents - Dub Invaders	Loopmasters	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	mkh005	Dream	OSHI_melody_loop_out_of_place_98_G#.wav	OSHI's Care Package	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	mkh006	Hustle	420_V2_Melodic_Loop_90_WordsCantSay_All_Gm.wav	4:20 The Smokers Kit Vol. 2	CAPSUN ProAudio	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7	mkh007	Dive	NAS_90_Emaj7_Ocean_Choir_a.wav	Natural Selection	Loopmasters	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8	mkh008	Quitter	DBM_SDT_DOINGTHEMOST_GUZHENG_100BPM_A-MINOR.wav	Sonic Dope Trap 1	DopeBoyzMuzic	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	mkh009	Crown	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
10	mkh010	Fly	PL_CEDMV3_02_Muted_Guitar_C#_128_Wet	Commercial EDM Vocals Vol. 3	Producer Loops	t	t	Melody 056 - 85 bpm (F).wav	Commercial EDM Vocals Vol. 3	Producer Loops	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
11	mkh011	Dragon	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
12	mkh012	Dope	MYRNE_synth_loop_redux_sines_140_D#maj.wav	MYRNE: Myrcury Sample Pack	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
13	mkh013	Silence	CRNKN_guitar_loop_shoe_gaze_01_145_Amin.wav	CRNKN: Sounds Across the Board	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14	mkh014	Astroworld	OSHI_melody_loop_dreamzzz_141_F#.wav	OSHI's Care Package	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
15	mkh015	Kiki	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
19	mkh019	Hard	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
16	mkh016	Sicko	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
17	mkh017	God	CLF_90_LoFi_PrayerKeys_F#m.wav	Lo-Fi Soul & Future Beats	CAPSUN ProAudio	t	t	RS1_Cryer_Stem_Lead_Guitar_F#m_120.wav	Roseway Studio Sessions Vol. 1 - Future Electronica	CAPSUN ProAudio	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
18	mkh018	Gang	GNEALZ_melodic_loop_smoke_purpp_layer_150_Amin.wav	Gnealz: That's It Right There Sample Pack	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
20	mkh020	Bed	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
21	mkh021	Mango	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
22	mkh022	Summer	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
23	mkh023	Buddha	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
24	mkh024	Weekend	SWD_Guitar_120_Sunken_C#m.wav	Soulful Waves & Dream Trap	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
25	mkh025	Ocean	BLUE_HAWAII_chord_loop_rising_124_Emin.wav	Blue Hawaii: Very Emotional Sounds	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
26	mkh026	Coca	\N	\N	\N	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
27	mkh027	Blossom	LOOP - 90BPM - Ally Strings.wav	\nKaran Kanchan Presents J-Trap\nMelody Rhythmix Vol. 2	Unknown	t	t	OSKAR_FLOOD_melody_loop_guitar_drunk_95bpm_F#min.wav	Oskar Flood Sample Pack	Splice\n	t	t	RARE_percussion_Zither_Asia_dope_Amin_94_loop7.wav	Rare Percussion	Splice	t	t	Acolyte_-_Welcome_Sensei_.wav	Acolyte	TRUE	t	\N	\N	\N	\N	\N	\N
28	mkh028	Karma	ALEX_LUSTIG_synth_loop_deep_so_smooth_rhodes_90_Dbmin.wav	Ale Lustig: Lost Sounds Sample Pack	Splice	t	t	WCG_70_guitar_stack_the_greatest_dancer_bass_Em.wav	Ocean Ave: West Coast Guitars	Capsun ProAudio	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
29	mkh029	Millionaire	DUBBEL_DUTCH_synth_loop_dark_matter_100_Gmin.wav	Dubbell Dutch: Rare Earth Elements	Splice	t	t	SLIINK_vocal_loop_siren_G#min.wav	Dj Sliink: Deep From Jersey	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
30	mkh030	Versace	JOSH_J_guitar_loop_stizzy_105_Gm.wav	Josh J.: Guitar is Dead Sample Pack	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	mkh001	Enemy	BPM070TrapMan_Em_Piano.wav	Dirty South Wars 2	Prime Loops	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	mkh002	Trapped	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	mkh003	Overdose	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	mkh004	Higher	CHS_93_Gm_Flute.wav	Hip Hop Shadows Vol. 1	Loopmasters	t	t	Dl1_75_Cm_Orch_Filter_Skanks.wav	Dubmatrix Presents - Dub Invaders	Loopmasters	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	mkh005	Dream	OSHI_melody_loop_out_of_place_98_G#.wav	OSHI's Care Package	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	mkh006	Hustle	420_V2_Melodic_Loop_90_WordsCantSay_All_Gm.wav	4:20 The Smokers Kit Vol. 2	CAPSUN ProAudio	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7	mkh007	Dive	NAS_90_Emaj7_Ocean_Choir_a.wav	Natural Selection	Loopmasters	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8	mkh008	Quitter	DBM_SDT_DOINGTHEMOST_GUZHENG_100BPM_A-MINOR.wav	Sonic Dope Trap 1	DopeBoyzMuzic	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	mkh009	Crown	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
10	mkh010	Fly	PL_CEDMV3_02_Muted_Guitar_C#_128_Wet	Commercial EDM Vocals Vol. 3	Producer Loops	t	t	Melody 056 - 85 bpm (F).wav	Commercial EDM Vocals Vol. 3	Producer Loops	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
11	mkh011	Dragon	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
12	mkh012	Dope	MYRNE_synth_loop_redux_sines_140_D#maj.wav	MYRNE: Myrcury Sample Pack	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
13	mkh013	Silence	CRNKN_guitar_loop_shoe_gaze_01_145_Amin.wav	CRNKN: Sounds Across the Board	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14	mkh014	Astroworld	OSHI_melody_loop_dreamzzz_141_F#.wav	OSHI's Care Package	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
15	mkh015	Kiki	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
19	mkh019	Hard	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
16	mkh016	Sicko	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
17	mkh017	God	CLF_90_LoFi_PrayerKeys_F#m.wav	Lo-Fi Soul & Future Beats	CAPSUN ProAudio	t	t	RS1_Cryer_Stem_Lead_Guitar_F#m_120.wav	Roseway Studio Sessions Vol. 1 - Future Electronica	CAPSUN ProAudio	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
18	mkh018	Gang	GNEALZ_melodic_loop_smoke_purpp_layer_150_Amin.wav	Gnealz: That's It Right There Sample Pack	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
20	mkh020	Bed	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
21	mkh021	Mango	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
22	mkh022	Summer	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
23	mkh023	Buddha	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
24	mkh024	Weekend	SWD_Guitar_120_Sunken_C#m.wav	Soulful Waves & Dream Trap	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
25	mkh025	Ocean	BLUE_HAWAII_chord_loop_rising_124_Emin.wav	Blue Hawaii: Very Emotional Sounds	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
26	mkh026	Coca	\N	\N	\N	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
27	mkh027	Blossom	LOOP - 90BPM - Ally Strings.wav	\nKaran Kanchan Presents J-Trap\nMelody Rhythmix Vol. 2	Unknown	t	t	OSKAR_FLOOD_melody_loop_guitar_drunk_95bpm_F#min.wav	Oskar Flood Sample Pack	Splice\n	t	t	RARE_percussion_Zither_Asia_dope_Amin_94_loop7.wav	Rare Percussion	Splice	t	t	Acolyte_-_Welcome_Sensei_.wav	Acolyte	TRUE	t	\N	\N	\N	\N	\N	\N
28	mkh028	Karma	ALEX_LUSTIG_synth_loop_deep_so_smooth_rhodes_90_Dbmin.wav	Ale Lustig: Lost Sounds Sample Pack	Splice	t	t	WCG_70_guitar_stack_the_greatest_dancer_bass_Em.wav	Ocean Ave: West Coast Guitars	Capsun ProAudio	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
29	mkh029	Millionaire	DUBBEL_DUTCH_synth_loop_dark_matter_100_Gmin.wav	Dubbell Dutch: Rare Earth Elements	Splice	t	t	SLIINK_vocal_loop_siren_G#min.wav	Dj Sliink: Deep From Jersey	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
30	mkh030	Versace	JOSH_J_guitar_loop_stizzy_105_Gm.wav	Josh J.: Guitar is Dead Sample Pack	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Name: track_arrangement_id_seq; Type: SEQUENCE SET; Schema: meekah; Owner: abe
--

SELECT pg_catalog.setval('meekah.track_arrangement_id_seq', 1, false);


--
-- Name: track_instruments_id_seq; Type: SEQUENCE SET; Schema: meekah; Owner: abe
--

SELECT pg_catalog.setval('meekah.track_instruments_id_seq', 60, true);


--
-- Name: track_release_id_seq; Type: SEQUENCE SET; Schema: meekah; Owner: abe
--

SELECT pg_catalog.setval('meekah.track_release_id_seq', 1, false);


--
-- Name: track_arrangement track_arrangement_pkey; Type: CONSTRAINT; Schema: meekah; Owner: abe
--

ALTER TABLE ONLY meekah.track_arrangement
    ADD CONSTRAINT track_arrangement_pkey PRIMARY KEY (id);


--
-- Name: track_creator track_creator_catalog_key; Type: CONSTRAINT; Schema: meekah; Owner: abe
--

ALTER TABLE ONLY meekah.track_creator
    ADD CONSTRAINT track_creator_catalog_key UNIQUE (track_catalog);


--
-- Name: track_creator track_creator_key; Type: CONSTRAINT; Schema: meekah; Owner: abe
--

ALTER TABLE ONLY meekah.track_creator
    ADD CONSTRAINT track_creator_key PRIMARY KEY (id);


--
-- Name: track_exclusive track_exclusive_catalog_key; Type: CONSTRAINT; Schema: meekah; Owner: abe
--

ALTER TABLE ONLY meekah.track_exclusive
    ADD CONSTRAINT track_exclusive_catalog_key UNIQUE (track_catalog);


--
-- Name: track_exclusive track_exclusive_pkey; Type: CONSTRAINT; Schema: meekah; Owner: abe
--

ALTER TABLE ONLY meekah.track_exclusive
    ADD CONSTRAINT track_exclusive_pkey PRIMARY KEY (id);


--
-- Name: track_file track_file_track_catalog_key; Type: CONSTRAINT; Schema: meekah; Owner: abe
--

ALTER TABLE ONLY meekah.track_file
    ADD CONSTRAINT track_file_track_catalog_key UNIQUE (track_catalog);


--
-- Name: track_file track_files_pkey; Type: CONSTRAINT; Schema: meekah; Owner: abe
--

ALTER TABLE ONLY meekah.track_file
    ADD CONSTRAINT track_files_pkey PRIMARY KEY (id);


--
-- Name: track_info track_info_catalog_key; Type: CONSTRAINT; Schema: meekah; Owner: abe
--

ALTER TABLE ONLY meekah.track_info
    ADD CONSTRAINT track_info_catalog_key UNIQUE (track_catalog);


--
-- Name: track_info track_info_id_key; Type: CONSTRAINT; Schema: meekah; Owner: abe
--

ALTER TABLE ONLY meekah.track_info
    ADD CONSTRAINT track_info_id_key PRIMARY KEY (id);


--
-- Name: track_instruments track_instruments_pkey; Type: CONSTRAINT; Schema: meekah; Owner: abe
--

ALTER TABLE ONLY meekah.track_instruments
    ADD CONSTRAINT track_instruments_pkey PRIMARY KEY (id);


--
-- Name: track_release track_release_pkey; Type: CONSTRAINT; Schema: meekah; Owner: abe
--

ALTER TABLE ONLY meekah.track_release
    ADD CONSTRAINT track_release_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

