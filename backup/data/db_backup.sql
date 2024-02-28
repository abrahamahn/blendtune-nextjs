--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE abe;
ALTER ROLE abe WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN NOREPLICATION NOBYPASSRLS;

--
-- User Configurations
--

--
-- User Config "abe"
--

ALTER ROLE abe SET search_path TO 'meekah';








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Homebrew)
-- Dumped by pg_dump version 16.2 (Homebrew)

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
-- PostgreSQL database dump complete
--

--
-- Database "blendtune_tracks" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Homebrew)
-- Dumped by pg_dump version 16.2 (Homebrew)

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
-- Name: blendtune_tracks; Type: DATABASE; Schema: -; Owner: abe
--

CREATE DATABASE blendtune_tracks WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE blendtune_tracks OWNER TO abe;

\connect blendtune_tracks

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
    track_catalog text DEFAULT ''::text NOT NULL,
    track_title text DEFAULT ''::text,
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
    section_10 text
);


ALTER TABLE meekah.track_arrangement OWNER TO abe;

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
    catalog text,
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
    file_purchased_mp3 text,
    file_purchased_wav text,
    file_track_stems text
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
    instrument_1 text,
    instrument_category_1 text,
    instrument_2 text,
    instrument_category_2 text,
    instrument_3 text,
    instrument_category_3 text,
    instrument_4 text,
    instrument_category_4 text,
    instrument_5 text,
    instrument_category_5 text
);


ALTER TABLE meekah.track_info OWNER TO abe;

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
-- Data for Name: track_arrangement; Type: TABLE DATA; Schema: meekah; Owner: abe
--

COPY meekah.track_arrangement (id, track_catalog, track_title, time_1, section_1, time_2, section_2, time_3, section_3, time_4, section_4, time_5, section_5, time_6, section_6, time_7, section_7, time_8, section_8, time_9, section_9, time_10, section_10) FROM stdin;
1	MKH001	Enemy	0:00	Intro	0:13	Chorus 1	0:40	Verse 1	0:56	Pre-Chorus 1	1:08	Chorus 2	1:36	Verse 2	2:03	Pre-Chorus 2	2:30	Chorus 2	2:58	Outro	\N	\N
2	MKH002	Trapped	0:00	Intro	0:09	Chorus 1B	0:30	Chorus 1B	0:52	Verse 1A	1:12	Verse 1B	1:34	Chorus 2A	1:55	Chorus 2B	2:16	Bridge	2:38	Chorus 3	3:00	Outro
3	MKH003	Overdose	0:00	Intro	0:04	Chorus 1	0:28	Verse 1	0:55	Pre-Chorus 1	1:20	Chorus 2	1:47	Verse 2	2:12	Pre-Chorus 2	2:30	Chorus 3	\N	Outro	\N	\N
4	MKH004	Higher	0:00	Intro	0:10	Chorus 1	0:34	Verse 1	0:58	Chorus 2	1:21	Verse 2	1:45	Chorus 3	2:09	Verse 3	2:33	Chorus 4A	2:57	Chorus 4B	\N	\N
5	MKH005	Dream	0:00	Intro	0:10	Chorus 1	0:34	Verse 1	0:58	Chorus 2	1:21	Verse 2	1:45	Chorus 3	2:09	Verse 3	2:33	Chorus 4A	2:57	Chorus 4B	\N	\N
6	MKH006	Hustle	0:00	Intro	0:08	Chorus 1	0:28	Verse 1	0:48	Pre-Chorus 1	1:08	Chorus 2	1:29	Verse 2	1:59	Pre-Chorus 2	2:08	Chorus 3A	2:30	Chorus 3B	2:50	Outro
7	MKH007	Dive	0:00	Intro	0:08	Verse	0:27	Pre-Chorus	0:46	Chorus 1	1:05	Verse 2	1:43	Pre-Chorus 2	2:02	Chorus 2	2:22	Birdge	2:42	Pre-Chorus	3:00	Chorus 3
8	MKH008	Quitter	0:00	Intro	0:04	Chorus 1	0:26	Verse 1A	0:50	Verse 1B	1:14	Verse 1C	1:24	Hook 2	1:48	Verse 2	2:22	Outro	\N	\N	\N	\N
9	MKH009	Crown	0:00	Intro	0:11	Chorus 1	0:39	Verse 1	1:07	Pre-Chorus 1	1:21	Chorus 2	1:48	Verse 2	2:18	Pre-Chorus 2	2:32	Chorus 3A	2:46	Chorus 3B	3:11	Outro
10	MKH010	Fly	0:00	Intro	0:09	Verse 1	0:31	Pre-Chorus 1	0:53	Chorus 1	1:17	Verse 2A	1:40	Verse 2B	2:02	Pre-Chorus 2	2:23	Chorus 3A	2:44	Chorus 3B	3:07	Outro
11	MKH011	Dragon	0:00	Intro	0:10	Chorus 1	0:20	Verse 1	0:30	Pre-Chorus 1	0:40	Chorus 2	0:58	Verse 2	1:09	Pre-Chorus 2	1:18	Chorus 3	1:38	Outro	\N	\N
12	MKH012	Dope	0:00	Intro	0:04	Verse 1A	0:31	Verse 1B	0:58	Pre-Chorus 1	1:13	Chorus 1	1:40	Verse 2	2:08	Pre-Chorus 2	2:21	Chorus 2	2:49	Outro	\N	\N
13	MKH013	Silence	0:00	Intro	0:10	Chorus 1	0:39	Verse 1	1:05	Pre-Chorus 1	1:20	Chorus 2	1:45	Verse 2	2:15	Pre-Chorus 2	2:28	Chorus 3	2:55	Outro	\N	\N
14	MKH014	Astroworld	0:00	Intro	0:10	Chorus 1	0:37	Verse 1	1:02	Pre-Chorus 1	1:15	Chorus 2A	1:38	Chorus 2B	2:05	Verse 2	2:33	Outro	\N	\N	\N	\N
15	MKH015	Kiki	0:00	Intro	0:08	Chorus 1	0:29	Verse 1	0:50	Pre-Chorus 1	1:12	Chorus 2	1:33	Verse 2	1:53	Pre-Chorus 2	2:15	Chorus 3	2:36	Outro	\N	\N
16	MKH016	Sicko	0:00	Intro	0:08	Chorus 1	0:29	Verse 1	0:50	Pre-Chorus 1	1:10	Chorus 2	1:30	Verse 2	1:52	Pre-Chorus 2	2:12	Chorus 3	2:32	Bridge	2:50	Outro
17	MKH017	God	0:00	Intro	0:11	Pre-Chorus 1	0:41	Chorus 1	1:05	Verse 2	1:34	Pre-Chorus 2	1:45	Chorus 2	2:15	Bridge	2:41	Chorus 3	3:09	Outro	\N	\N
18	MKH018	Gang	0:00	Intro	0:10	Chorus 1	0:35	Verse 1	0:48	Pre-Chorus 1	1:00	Chorus 2	1:25	Verse 2	1:38	Pre-Chorus 2	1:49	Chorus 3	2:01	Verse 3	2:26	Pre-Chorus 3
19	MKH019	Hard	0:00	Intro	0:04	Chorus 1	0:26	Verse 1	0:50	Pre-Chorus 1	1:13	Chorus 2	1:36	Verse 2	1:59	Pre-Chorus 2	2:22	Chorus 3A	2:45	Chorus 3B	3:09	Outro
20	MKH020	Bed	0:00	Intro	0:08	Chorus 1	0:29	Verse 1	0:50	Pre-Chorus 1	1:10	Chorus 2	1:30	Verse 2	1:52	Pre-Chorus 2	2:12	Chorus 3	2:32	Bridge	2:50	Outro
21	MKH021	Mango	0:00	Intro	0:03	Chorus 1	0:34	Verse 1	0:51	Chorus 2	1:26	Verse 2	1:42	Chorus 3	2:16	Bridge	2:32	Chorus 4	3:26	Outro	\N	\N
22	MKH022	Summer	0:00	Intro	0:03	Chorus 1	0:25	Verse 1	0:48	Pre-Chorus 1	1:10	Chorus 2	1:32	Verse 2	1:55	Pre-Chorus 2	2:20	Chorus 3	2:40	Outro	\N	\N
23	MKH023	Buddha	0:00	Intro	0:05	Chorus 1	0:20	Verse 1	0:50	Pre-Chorus 1	1:04	Chorus 2	1:19	Verse 2	2:02	Chorus 3	2:18	Verse 3	2:47	Chorus 4	\N	Outro
24	MKH024	Weekend	0:00	Intro	0:06	Chorus 1	0:48	Verse 1	1:28	Chorus 2	2:06	Verse 2	2:47	Chorus 3	3:28	Outro	\N	\N	\N	\N	\N	\N
25	MKH025	Ocean	0:00	Intro	0:04	Chorus 1	0:18	Verse 1	0:43	Pre-Chorus 1	0:57	Chorus 2	1:26	Verse 2	1:53	Pre-Chorus 2	2:07	Chorus 3	2:36	Bridge	3:02	Chorus 4
26	MKH026	Coca	0:00	Intro	0:06	Chorus 1	0:34	Verse 1	1:01	Pre-Chorus 1	1:15	Chorus 2	1:42	Verse 2	2:10	Pre-Chorus 2	2:24	Chorus 3	2:51	Outro	\N	\N
27	MKH027	Blossom	0:00	Intro	0:11	Chorus 1	0:32	Verse 1	0:54	Pre-Chorus 1	1:15	Chorus 2	1:37	Verse 2	1:58	Pre-Chorus 2	2:20	Chorus 3	3:02	Outro	\N	\N
28	MKH028	Karma	0:00	Intro	0:13	Chorus 1	0:41	Verse 1	1:09	Pre-Chorus 1	1:22	Chorus 2	1:49	Verse 2	2:16	Pre-Chorus 2	2:30	Chorus 3	2:58	Outro	\N	\N
29	MKH029	Millionaire	0:00	Intro	0:06	Chorus 1	0:34	Verse 1	1:01	Pre-Chorus 1	1:15	Chorus 2	1:42	Verse 2	2:10	Pre-Chorus 2	2:24	Chorus 3	2:51	Outro	\N	\N
30	MKH030	Versace	0:00	Intro	0:10	Chorus 1	0:30	Verse 1	0:50	Bridge 1	1:10	Chorus 2	1:30	Verse 2	1:50	Pre-Chorus 2	2:10	Chorus 3	2:30	Bridge 3	2:50	Chorus 4A
31	MKH031	Rhythm	0:00	Intro	0:17	Verse 1	0:53	Pre-Chorus 1	1:10	Chorus 1	1:29	Interlude 1	1:46	Verse 2	2:20	Pre-Chorus 2	2:40	Chorus 2	3:15	Outro	\N	\N
32	MKH032	Origin	0:00	Intro	0:12	Chorus 1	0:37	Verse 1A	1:02	Verse 1B	1:14	Pre-Chorus 1	1:25	Chorus 2	1:50	Verse 2A	2:17	Verse 2B	2:29	Pre-Chorus 2	2:42	Chorus 3A
33	MKH033	Ride	0:00	Intro	0:06	Verse 1	0:30	Pre-Chorus 1	0:42	Chorus 1	1:05	Verse 2	1:30	Pre-Chorus 2	1:42	Chorus 2	2:05	Verse 3	2:30	Pre-Chorus 3	2:42	Chorus 3A
34	MKH034	Metro	0:00	Intro	0:06	Chorus 1	0:28	Verse 1	0:51	Pre-Chorus 1	1:14	Chorus 2	1:36	Verse 2	2:00	Pre-Chorus 2	2:22	Chorus 3A	2:45	Bridge 	3:08	Chorus 3B
35	MKH035	Feeling	0:00	Intro	0:19	Chorus 1	0:36	Verse 1	0:54	Pre-Chorus 1	1:11	Chorus 2	1:29	Verse 2	1:45	Verse 2	2:04	Pre-Chorus 2	2:22	Chorus 3A	2:39	Chorus 3B
36	MKH036	Mermaid	0:00	Intro	0:09	Verse 1	0:45	Pre-Chorus 1	1:04	Chorus 1	1:40	Verse 2	2:17	Pre-Chorus 2	2:35	Chorus 2A	3:12	Chorus 2B	3:30	Outro	\N	\N
37	MKH037	Water	0:00	Intro	0:06	Chorus 1	0:28	Verse 1	0:50	Chorus 1	1:13	Verse 2	1:36	Chorus 2	1:58	Verse 3	2:21	Chorus 3A	2:43	Chorus 3B	3:06	Outro
38	MKH038	Free	0:00	Intro	0:05	Chorus 1	0:29	Verse 1	0:53	Chorus 2	1:17	Verse 2	1:41	Chorus 3	2:05	Verse 3	2:29	Chorus 4	2:53	Outro	\N	\N
39	MKH039	Love	0:00	Intro	0:04	Chorus 1	0:42	Verse 1	1:20	Chorus 2	1:59	Verse 2	2:28	Chorus 3	3:16	Outro	\N	\N	\N	\N	\N	\N
40	MKH040	Down	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
41	MKH041	Paradise	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
42	MKH042	Savage	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
43	MKH043	Sunkist	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
44	MKH044	Comme	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
45	MKH045	Drive	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
46	MKH046	Popstar	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
47	MKH047	Japan	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
48	MKH048	Psychedelic	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
49	MKH049	Shark	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
50	MKH050	Burn	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
51	MKH051	Money	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
52	MKH052	Killer	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
53	MKH053	Rapstar	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
54	MKH054	Lambo	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
55	MKH055	Kanga	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
56	MKH056	Suite	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
57	MKH057	Africa	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
58	MKH058	Dark	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
59	MKH059	Bad	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
60	MKH060	Final	0:00	Intro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: track_creator; Type: TABLE DATA; Schema: meekah; Owner: abe
--

COPY meekah.track_creator (id, track_catalog, track_title, publisher, collaborator, name_1, producer_1, songwriter_1, ipi_1, split_1, name_2, producer_2, songwriter_2, ipi_2, split_2, name_3, producer_3, songwriter_3, ipi_3, split_3) FROM stdin;
1	MKH001	Enemy	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	MKH002	Trapped	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	MKH003	Overdose	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	MKH004	Higher	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	MKH005	Dream	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	MKH006	Hustle	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7	MKH007	Dive	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8	MKH008	Quitter	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	MKH009	Crown	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
10	MKH010	Fly	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
11	MKH011	Dragon	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
12	MKH012	Dope	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
13	MKH013	Silence	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14	MKH014	Astroworld	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
15	MKH015	Kiki	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
16	MKH016	Sicko	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
17	MKH017	God	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
18	MKH018	Gang	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
22	MKH022	Summer	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
20	MKH020	Bed	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
21	MKH021	Mango	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
19	MKH019	Hard	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
23	MKH023	Buddha	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
24	MKH024	Weekend	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
25	MKH025	Ocean	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
26	MKH026	Coca	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
27	MKH027	Blossom	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
28	MKH028	Karma	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
29	MKH029	Millionaire	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
30	MKH030	Versace	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
31	MKH031	Rhythm	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
32	MKH032	Origin	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
33	MKH033	Ride	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
34	MKH034	Metro	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
35	MKH035	Feeling	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
36	MKH036	Mermaid	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
37	MKH037	Water	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
38	MKH038	Free	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
39	MKH039	Love	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
40	MKH040	Down	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
41	MKH041	Paradise	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
42	MKH042	Savage	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
43	MKH043	Sunkist	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
44	MKH044	Comme	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
45	MKH045	Drive	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
46	MKH046	Popstar	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
47	MKH047	Japan	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
48	MKH048	Psychedelic	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
49	MKH049	Shark	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
50	MKH050	Burn	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
51	MKH051	Money	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
52	MKH052	Killer	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
53	MKH053	Rapstar	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
54	MKH054	Lambo	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
55	MKH055	Kanga	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
56	MKH056	Suite	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
57	MKH057	Africa	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
58	MKH058	Dark	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
59	MKH059	Bad	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
60	MKH060	Final	Songtrust	1	AHN ABRAHAM JOONGWHAN	t	t	789929253	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: track_exclusive; Type: TABLE DATA; Schema: meekah; Owner: abe
--

COPY meekah.track_exclusive (id, catalog, track_title, exclusive, artist_name, email, country_code, phone_number, address_1, address_2, city, state, country, zip_code, management, management_email) FROM stdin;
4	MKH004	Higher	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	MKH005	Dream	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	MKH006	Hustle	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7	MKH007	Dive	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8	MKH008	Quitter	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	MKH009	Crown	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
10	MKH010	Fly	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
11	MKH011	Dragon	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
12	MKH012	Dope	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
13	MKH013	Silence	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14	MKH014	Astroworld	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
15	MKH015	Kiki	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
16	MKH016	Sicko	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
17	MKH017	God	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
18	MKH018	Gang	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
19	MKH019	Hard	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
20	MKH020	Bed	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
21	MKH021	Mango	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
22	MKH022	Summer	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
23	MKH023	Buddha	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
24	MKH024	Weekend	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
25	MKH025	Ocean	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
26	MKH026	Coca	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
27	MKH027	Blossom	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
28	MKH028	Karma	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
29	MKH029	Millionaire	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
30	MKH030	Versace	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
31	MKH031	Rhythm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
32	MKH032	Origin	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
33	MKH033	Ride	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
34	MKH034	Metro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
35	MKH035	Feeling	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
36	MKH036	Mermaid	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
37	MKH037	Water	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
38	MKH038	Free	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
39	MKH039	Love	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
40	MKH040	Down	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
41	MKH041	Paradise	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
42	MKH042	Savage	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
43	MKH043	Sunkist	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
44	MKH044	Comme	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
45	MKH045	Drive	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
46	MKH046	Popstar	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
47	MKH047	Japan	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
48	MKH048	Psychedelic	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
49	MKH049	Shark	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
50	MKH050	Burn	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
51	MKH051	Money	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
52	MKH052	Killer	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
53	MKH053	Rapstar	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
54	MKH054	Lambo	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
55	MKH055	Kanga	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
56	MKH056	Suite	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
57	MKH057	Africa	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
58	MKH058	Dark	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
59	MKH059	Bad	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
60	MKH060	Final	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
61	MKH061	Space	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
62	MKH062	Playa	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	MKH001	Enemy	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	MKH002	Trapped	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	MKH003	Overdose	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: track_file; Type: TABLE DATA; Schema: meekah; Owner: abe
--

COPY meekah.track_file (id, track_catalog, track_title, file_public, file_purchased_mp3, file_purchased_wav, file_track_stems) FROM stdin;
2	mkh002_trapped_tag.mp3	mkh002_trapped_purchased.mp3	mkh002_trapped_track_stems.zip	mkh002_trapped_purchased.wav	Trapped	MKH002
3	mkh003_overdose_tag.mp3	mkh003_overdose_purchased.mp3	mkh003_overdose_track_stems.zip	mkh003_overdose_purchased.wav	Overdose	MKH003
4	mkh004_higher_tag.mp3	mkh004_higher_purchased.mp3	mkh004_higher_track_stems.zip	mkh004_higher_purchased.wav	Higher	MKH004
5	mkh005_dream_tag.mp3	mkh005_dream_purchased.mp3	mkh005_dream_track_stems.zip	mkh005_dream_purchased.wav	Dream	MKH005
7	mkh007_dive_tag.mp3	mkh007_dive_purchased.mp3	mkh007_dive_track_stems.zip	mkh007_dive_purchased.wav	Dive	MKH007
8	mkh008_quitter_tag.mp3	mkh008_quitter_purchased.mp3	mkh008_quitter_track_stems.zip	mkh008_quitter_purchased.wav	Quitter	MKH008
9	mkh009_crown_tag.mp3	mkh009_crown_purchased.mp3	mkh009_crown_track_stems.zip	mkh009_crown_purchased.wav	Crown	MKH009
10	mkh010_fly_tag.mp3	mkh010_fly_purchased.mp3	mkh010_fly_track_stems.zip	mkh010_fly_purchased.wav	Fly	MKH010
11	mkh011_dragon_tag.mp3	mkh011_dragon_purchased.mp3	mkh011_dragon_track_stems.zip	mkh011_dragon_purchased.wav	Dragon	MKH011
12	mkh012_dope_tag.mp3	mkh012_dope_purchased.mp3	mkh012_dope_track_stems.zip	mkh012_dope_purchased.wav	Dope	MKH012
13	mkh013_silence_tag.mp3	mkh013_silence_purchased.mp3	mkh013_silence_track_stems.zip	mkh013_silence_purchased.wav	Silence	MKH013
14	mkh014_astroworld_tag.mp3	mkh014_astroworld_purchased.mp3	mkh014_astroworld_track_stems.zip	mkh014_astroworld_purchased.wav	Astroworld	MKH014
15	mkh015_kiki_tag.mp3	mkh015_kiki_purchased.mp3	mkh015_kiki_track_stems.zip	mkh015_kiki_purchased.wav	Kiki	MKH015
16	mkh016_sicko_tag.mp3	mkh016_sicko_purchased.mp3	mkh016_sicko_track_stems.zip	mkh016_sicko_purchased.wav	Sicko	MKH016
17	mkh017_god_tag.mp3	mkh017_god_purchased.mp3	mkh017_god_track_stems.zip	mkh017_god_purchased.wav	God	MKH017
18	mkh018_gang_tag.mp3	mkh018_gang_purchased.mp3	mkh018_gang_track_stems.zip	mkh018_gang_purchased.wav	Gang	MKH018
19	mkh019_hard_tag.mp3	mkh019_hard_purchased.mp3	mkh019_hard_track_stems.zip	mkh019_hard_purchased.wav	Hard	MKH019
20	mkh020_bed_tag.mp3	mkh020_bed_purchased.mp3	mkh020_bed_track_stems.zip	mkh020_bed_purchased.wav	Bed	MKH020
21	mkh021_mango_tag.mp3	mkh021_mango_purchased.mp3	mkh021_mango_track_stems.zip	mkh021_mango_purchased.wav	Mango	MKH021
24	mkh024_weekend_tag.mp3	mkh024_weekend_purchased.mp3	mkh024_weekend_track_stems.zip	mkh024_weekend_purchased.wav	Weekend	MKH024
25	mkh025_ocean_tag.mp3	mkh025_ocean_purchased.mp3	mkh025_ocean_track_stems.zip	mkh025_ocean_purchased.wav	Ocean	MKH025
26	mkh026_coca_tag.mp3	mkh026_coca_purchased.mp3	mkh026_coca_track_stems.zip	mkh026_coca_purchased.wav	Coca	MKH026
28	mkh028_karma_tag.mp3	mkh028_karma_purchased.mp3	mkh028_karma_track_stems.zip	mkh028_karma_purchased.wav	Karma	MKH028
29	mkh029_millionaire_tag.mp3	mkh029_millionaire_purchased.mp3	mkh029_millionaire_track_stems.zip	mkh029_millionaire_purchased.wav	Millionaire	MKH029
30	mkh030_versace_tag.mp3	mkh030_versace_purchased.mp3	mkh030_versace_track_stems.zip	mkh030_versace_purchased.wav	Versace	MKH030
31	mkh031_rhythm_tag.mp3	mkh031_rhythm_purchased.mp3	mkh031_rhythm_track_stems.zip	mkh031_rhythm_purchased.wav	Rhythm	MKH031
32	mkh032_origin_tag.mp3	mkh032_origin_purchased.mp3	mkh032_origin_track_stems.zip	mkh032_origin_purchased.wav	Origin	MKH032
34	mkh034_metro_tag.mp3	mkh034_metro_purchased.mp3	mkh034_metro_track_stems.zip	mkh034_metro_purchased.wav	Metro	MKH034
36	mkh036_mermaid_tag.mp3	mkh036_mermaid_purchased.mp3	mkh036_mermaid_track_stems.zip	mkh036_mermaid_purchased.wav	Mermaid	MKH036
39	mkh039_love_tag.mp3	mkh039_love_purchased.mp3	mkh039_love_track_stems.zip	mkh039_love_purchased.wav	Love	MKH039
38	mkh038_free_tag.mp3	mkh038_free_purchased.mp3	mkh038_free_track_stems.zip	mkh038_free_purchased.wav	Free	MKH038
40	mkh040_down_tag.mp3	mkh040_down_purchased.mp3	mkh040_down_track_stems.zip	mkh040_down_purchased.wav	Down	MKH040
42	mkh042_savage_tag.mp3	mkh042_savage_purchased.mp3	mkh042_savage_track_stems.zip	mkh042_savage_purchased.wav	Savage	MKH042
43	mkh043_sunkist_tag.mp3	mkh043_sunkist_purchased.mp3	mkh043_sunkist_track_stems.zip	mkh043_sunkist_purchased.wav	Sunkist	MKH043
44	mkh044_comme_tag.mp3	mkh044_comme_purchased.mp3	mkh044_comme_track_stems.zip	mkh044_comme_purchased.wav	Comme	MKH044
45	mkh045_drive_tag.mp3	mkh045_drive_purchased.mp3	mkh045_drive_track_stems.zip	mkh045_drive_purchased.wav	Drive	MKH045
48	mkh048_psychedelic_tag.mp3	mkh048_psychedelic_purchased.mp3	mkh048_psychedelic_track_stems.zip	mkh048_psychedelic_purchased.wav	Psychedelic	MKH048
49	mkh049_shark_tag.mp3	mkh049_shark_purchased.mp3	mkh049_shark_track_stems.zip	mkh049_shark_purchased.wav	Shark	MKH049
50	mkh050_burn_tag.mp3	mkh050_burn_purchased.mp3	mkh050_burn_track_stems.zip	mkh050_burn_purchased.wav	Burn	MKH050
51	mkh051_money_tag.mp3	mkh051_money_purchased.mp3	mkh051_money_track_stems.zip	mkh051_money_purchased.wav	Money	MKH051
53	mkh053_rapstar_tag.mp3	mkh053_rapstar_purchased.mp3	mkh053_rapstar_track_stems.zip	mkh053_rapstar_purchased.wav	Rapstar	MKH053
54	mkh054_lambo_tag.mp3	mkh054_lambo_purchased.mp3	mkh054_lambo_track_stems.zip	mkh054_lambo_purchased.wav	Lambo	MKH054
55	mkh055_kanga_tag.mp3	mkh055_kanga_purchased.mp3	mkh055_kanga_track_stems.zip	mkh055_kanga_purchased.wav	Kanga	MKH055
56	mkh056_suite_tag.mp3	mkh056_suite_purchased.mp3	mkh056_suite_track_stems.zip	mkh056_suite_purchased.wav	Suite	MKH056
58	mkh058_dark_tag.mp3	mkh058_dark_purchased.mp3	mkh058_dark_track_stems.zip	mkh058_dark_purchased.wav	Dark	MKH058
59	mkh059_bad_tag.mp3	mkh059_bad_purchased.mp3	mkh059_bad_track_stems.zip	mkh059_bad_purchased.wav	Bad	MKH059
60	mkh060_final_tag.mp3	mkh060_final_purchased.mp3	mkh060_final_track_stems.zip	mkh060_final_purchased.wav	Final	MKH060
1	mkh001_enemy_tag.mp3	mkh001_enemy_purchased.mp3	mkh001_enemy_track_stems.zip	mkh001_enemy_purchased.wav	Enemey	MKH001
6	mkh006_hustle_tag.mp3	mkh006_hustle_purchased.mp3	mkh006_hustle_track_stems.zip	mkh006_hustle_purchased.wav	Hustle	MKH006
22	mkh022_summer_tag.mp3	mkh022_summer_purchased.mp3	mkh022_summer_track_stems.zip	mkh022_summer_purchased.wav	Summer	MKH022
23	mkh023_buddha_tag.mp3	mkh023_buddha_purchased.mp3	mkh023_buddha_track_stems.zip	mkh023_buddha_purchased.wav	Buddha	MKH023
27	mkh027_blossom_tag.mp3	mkh027_blossom_purchased.mp3	mkh027_blossom_track_stems.zip	mkh027_blossom_purchased.wav	Blossom	MKH027
33	mkh033_ride_tag.mp3	mkh033_ride_purchased.mp3	mkh033_ride_track_stems.zip	mkh033_ride_purchased.wav	Ride	MKH033
35	mkh035_feeling_tag.mp3	mkh035_feeling_purchased.mp3	mkh035_feeling_track_stems.zip	mkh035_feeling_purchased.wav	Feeling	MKH035
37	mkh037_water_tag.mp3	mkh037_water_purchased.mp3	mkh037_water_track_stems.zip	mkh037_water_purchased.wav	Water	MKH037
41	mkh041_paradise_tag.mp3	mkh041_paradise_purchased.mp3	mkh041_paradise_track_stems.zip	mkh041_paradise_purchased.wav	Paradise	MKH041
46	mkh046_popstar_tag.mp3	mkh046_popstar_purchased.mp3	mkh046_popstar_track_stems.zip	mkh046_popstar_purchased.wav	Popstar	MKH046
47	mkh047_japan_tag.mp3	mkh047_japan_purchased.mp3	mkh047_japan_track_stems.zip	mkh047_japan_purchased.wav	Japan	MKH047
52	mkh052_killer_tag.mp3	mkh052_killer_purchased.mp3	mkh052_killer_track_stems.zip	mkh052_killer_purchased.wav	Killer	MKH052
57	mkh057_africa_tag.mp3	mkh057_africa_purchased.mp3	mkh057_africa_track_stems.zip	mkh057_africa_purchased.wav	Africa	MKH057
\.


--
-- Data for Name: track_info; Type: TABLE DATA; Schema: meekah; Owner: abe
--

COPY meekah.track_info (id, release, file_public, track_catalog, track_title, track_producer, duration, bpm, note, scale, main_genre_1, sub_genre_1, main_genre_2, sub_genre_2, related_artist_1, related_artist_2, related_artist_3, mood_1, mood_2, mood_3, instrument_1, instrument_category_1, instrument_2, instrument_category_2, instrument_3, instrument_category_3, instrument_4, instrument_category_4, instrument_5, instrument_category_5) FROM stdin;
52	2019-01-31	mkh052_killer.ogg	mkh052	Killer	Meekah	03:12	95	C	major	Hiphop	Rap	Hiphop	Trap	Drake	J.Cole	Goldlink	Energetic	Bouncy	Agreesive	Drum	Hiphop	Bass	808	Keyboard	Rhodes	Synth	Arp	Woodwind	Flute
53	2019-02-04	mkh053_rapstar.ogg	mkh053	Rapstar	Meekah	05:03	76	Eb	minor	Hiphop	Trap	Hiphop	Rap	Migos	Offset	Quavo	Energetic	Dark	Bouncy	Drum	808	Bass	808	Keyboard	Synth	Woodwind	Flute	Keyboard	Mallet
55	2019-03-25	mkh055_kanga.ogg	mkh055	Kanga	Meekah	02:40	120	G	major	Hiphop	Rap	Afrobeat	Pop	Chance The Rapper	6ix9ine	Wizkid	Energetic	Bouncy	Happy	Drum	Hiphop	Bass	808	Percussion	Steel Drum	Synth	Arp	\N	\N
56	2019-04-08	mkh056_suite.ogg	mkh056	Suite	Meekah	03:36	80	F	minor	Hiphop	Rap	R&B	Pop	Kap G	NBA Youngboy	Ski The Slump God	Energetic	Smooth	Groovy	Drum	Hiphop	Bass	808	Keyboard	Rhodes	Synth	Pluck	\N	\N
58	2019-04-10	mkh058_dark.ogg	mkh058	Dark	Meekah	02:45	75	G	major	Hiphop	Trap	\N	\N	Migos	Pewee Longway	Offset	Energetic	Dark	Mellow	Drum	808	Bass	808	Synth	Ambient	Keyboard	Bell	\N	\N
59	2019-04-11	mkh059_bad.ogg	mkh059	Bad	Meekah	04:28	75	D	major	Hiphop	Trap	\N	\N	Migos	Drake	Lil Uzi Vert	Energetic	Dark	Agressive	Drum	808	Bass	808	Synth	Saw	Synth	Sine	Pad	Ambient
60	2019-04-12	mkh060_final.ogg	mkh060	Final	Meekah	03:00	85	G#	minor	Hiphop	Trap	\N	\N	Migos	Drake	Meek Mill	Energetic	Dark	Groovy	Drum	Hiphop	Bass	808	Keyboard	Bell	Keyboard	Mallet	\N	\N
6	2018-06-02	mkh006_hustle.mp3	mkh006	Hustle	Meekah	03:28	95	G	minor	Hiphop	Trap	Pop	R&B	RIch The Kid	Migos	Jay Critch	Mellow	Relaxed	Epic	Drum	808	Bass	808	Guitar	Electric	Synth	Pluck	Synth	Lead
8	2018-06-14	mkh008_quitter.mp3	mkh008	Quitter	Meekah	02:42	83	A	minor	Hiphop	Trap	\N	\N	Lil Yachty	Youngboy Never Broke Again	Drake	Dirty	Energetic	Dark	Drum	808	Bass	808	String	Koto	Woodwind	Flute	\N	\N
10	2018-06-16	mkh010_fly.mp3	mkh010	Fly	Meekah	03:34	69	G	major	Pop	Ballad	R&B	Pop	ZAYN	Lauv	Troye Sivan	Mellow	Peaceful	Loved	Drum	808	Bass	808	Guitar	Electric	Piano	Acoustic	Synth	Pad
13	2018-07-28	mkh013_silence.mp3	mkh013	Silence	Meekah	03:12	70	A	minor	Hiphop	Trap	Pop	R&B	Juice WRLD	Xxxtentacion	Polo G	Mellow	Energetic	Aggressive	Drum	808	Bass	Electric	Bass	Roland 808	Guitar	Electric	Synth	Lead
14	2018-08-20	mkh014_astroworld.mp3	mkh014	Astroworld	Meekah	02:59	75	F#	major	Hiphop	Trap	Pop	R&B	Travis Scott	Drake	Playboy Carti	Mellow	Energetic	Aggressive	Drum	808	Bass	808	Synth	Pad	Synth	Lead	\N	\N
18	2018-08-25	mkh018_gang.mp3	mkh018	Gang	Meekah	03:18	80	E	minor	Hiphop	Trap	\N	\N	Smokepurpp	Lil Pump	Young Thug	Dirty	Energetic	Agreesive	Drum	808	Bass	808	String	Harp	Synth	Lead	\N	\N
19	2018-08-28	mkh019_hard.mp3	mkh019	Hard	Meekah	03:22	83	C	major	Hiphop	Pop	Pop	R&B	Goldlink	Kaytranada	JID	Happy	Moody	Energetic	Drum	808	Bass	808	Keyboard	Rhodes	Synth	Juno	Brass	Trumpet
15	2018-08-21	mkh015_kiki.mp3	mkh015	Kiki	Meekah	02:59	91	C	major	Hiphop	Trap	Pop	R&B	Drake	Tory Lanez	Jack Harlow	Mellow	Energetic	Loved	Drum	808	Bass	808	Keyboard	Rhodes	Synth	Pluck	\N	\N
27	2018-10-16	mkh027_blossom.mp3	mkh027	Blossom	Meekah	03:25	89	G	minor	Hiphop	Boombap	\N	\N	Jay-Z	Kanye West	Logic	Aggressive	Energetic	Epic	Drum	Acoustic	Bass	808	String	Orchestra	Guitar	Electronic	String	Harp
28	2018-10-17	mkh028_karma.mp3	mkh028	Karma	Meekah	03:12	70	E	minor	R&B	\N	Hiphop	\N	24Hrs	Ty Dolla Sign	Tory Lanez	Love	Mellow	Bouncy	Drum	808	Bass	808	Keyboard	Rhodes	Bass	Pluck	Guitar	Electronic
29	2018-10-18	mkh029_millionaire.mp3	mkh029	Millionaire	Meekah	03:05	70	G	minor	Hiphop	Club	Electronic	Bass	Chris Brown	Baauer	Gesaffelstein	Dark	Aggressive	Energetic	Drum	808	Bass	808	Synth	Mono	Synth	Lead	\N	\N
30	2018-10-19	mkh030_versace.mp3	mkh030	Versace	Meekah	03:50	96	A	minor	Pop	Funk	Pop	Retro	The Weeknd	Daft Punk	Gesaffelstein	Energetic	Aggressive	Confident	Drum	Retro	Bass	Synth	Synth	Pad	Vox	Pad	String	Orchestra
33	2018-10-22	mkh033_ride.mp3	mkh033	Ride	Meekah	03:30	80	B	minor	Hip-Hop	Trap	\N	\N	OT Genesis	Migos	Gucci Mane	Dark	Bouncy	Energetic	Drum	808	Bass	808	Piano	Acoustic	\N	\N	\N	\N
42	2018-11-03	mkh042_savage.mp3	mkh042	Savage	Meekah	03:44	74	D	minor	Hiphop	Trap	\N	\N	Migos	21 Savage	Lil Pump	Mellow	Ambient	Agressive	Drum	Hiphop	Bass	808	Synth	Chord	Synth	Lead	Synth	Lead
44	2018-11-12	mkh044_comme.mp3	mkh044	Comme	Meekah	03:37	84	B	minor	Hiphop	Trap	\N	\N	Migos	Pierre Bourne	Drake	Energetic	Dark	Dirty	Drum	808	Bass	808	Synth	Pluck	Keyboard	Mallet	\N	\N
5	2018-05-28	mkh005_dream.mp3	mkh005	Dream	Meekah	03:28	90	G#	minor	Hiphop	Trap	\N	\N	Drake	Lil Baby	Jack Harlow	Mellow	Energetic	Ambient	Drum	808	Bass	808	Piano	Acoustic	Synth	Pad	\N	\N
23	2018-09-13	mkh023_buddha.mp3	mkh023	Buddha	Meekah	03:19	65	E	minor	Hiphop	Trap	\N	\N	Migos	Gucci Mane	Drake	Dark	Dirty	Energetic	Drum	808	Bass	808	Synth	Sine	Synth	Lead	\N	\N
24	2018-09-14	mkh024_weekend.mp3	mkh024	Weekend	Meekah	03:50	98	C#	minor	R&B	Ballad	Hiphop	\N	Bryson Tiller	PARTYNEXTDOOR	Drake	Dark	Dirty	Energetic	Drum	Digital	Bass	Reese	Sample	Synth	Synth	Pad	\N	\N
34	2018-10-23	mkh034_metro.mp3	mkh034	Metro	Meekah	04:05	84	A	minor	R&B	Future	Electronic	Future	The Weekend	Flume	Jon Bellion	Smooth	Groovy	Moody	Drum	Digital	Bass	Synth	Guitar	Electric	Keyboard	Synth	\N	\N
36	2018-10-23	mkh036_mermaid.mp3	mkh036	Mermaid	Meekah	03:39	105	C	major	Reggaeton	Pop	Dancehall	Pop	Wizkid	Mystro	Davido	Happy	Bouncy	Loved	Drum	Reggaeton	Bass	808	Synth	Sine	Synth	Pluck	Synth	Pad
37	2018-10-25	mkh037_water.mp3	mkh037	Water	Meekah	03:17	75	E	major	Hiphop	Trap	Pop	\N	Drake	Gunna	CashMoneyAP	Groovy	Happy	Mellow	Drum	Hiphop	Bass	808	Synth	Pad	Synth	Pluck	Woodwind	Flute
38	2018-10-26	mkh038_freemp3	mkh038	Free	Meekah	03:06	80	F#	minor	Hiphop	Trap	\N	\N	Gunna	Gunna	Lil Skies	Groovy	Ambient	Mellow	Drum	Hiphop	Bass	808	Bass	Electric	Keyboard	Rhodes	Synth	Lead
48	2018-11-28	mkh048_psychedelic.mp3	mkh048	Psychedelic	Meekah	03:12	84	F#	minor	Hiphop	Trap	Hiphop	Ambient	Kendrick Lamar	Tyler the Creator	J Cole	Mellow	Ambient	Energetic	Drum	808	Bass	808	Synth	Pad	Percussion	808	Synth	Saw
49	2018-11-30	mkh049_shark.mp3	mkh049	Shark	Meekah	03:45	66	C	minor	Hiphop	Trap	Hiphop	Club	Lil Pump	Smokepurpp	Xxxtentacion	Energetic	Dirty	Fun	Drum	808	Bass	808	Piano	Acoustic	Synth	Pluck	Synth	Analog
2	2018-05-29	mkh002_trapped.mp3	mkh002	Trapped	Meekah	03:22	90	F	minor	Hiphop	Trap	Pop	R&B	Juice WRLD	The Kid Laroi	Lil Uzi Vert	Mellow	Sentimental	Sad	Drum	808	Bass	808	Guitar	Digital	Synth	Pluck	Synth	Pad
9	2018-06-15	mkh009_crown.mp3	mkh009	Crown	Meekah	03:28	69	D	minor	Hiphop	Trap	R&B	Pop	Post Malone	Ty Dolla $ign	Young Thug	Mellow	Energetic	Loved	Drum	808	Bass	808	Keyboard	Juno	Brass	Hit	Synth	Pad
20	2018-08-24	mkh020_bed.mp3	mkh020	Bed	Meekah	03:23	80	G#	minor	R&B	Pop	\N	\N	Chris Brown	Usher	Tyga	Moody	Chill	Loved	Drum	808	Bass	808	Keyboard	Rhodes	Synth	Pluck	\N	\N
26	2018-10-13	mkh026_coca.mp3	mkh026	Coca	Meekah	03:05	70	F	major	Hiphop	Trap	Pop	R&B	Post Malone	Ty Dolla Sign	Troye Sivan	Mellow	Aggressive	Ambient	Drum	808	Bass	808	Synth	Pad	Synth	Pluck	\N	\N
31	2018-10-21	mkh031_rhythm.mp3	mkh031	Rhythm	Meekah	03:33	108	B	minor	Afrobeat	Pop	Dancehall	Pop	Wizkid	Mystro	Rema	Groovy	Mellow	Relaxed	Drum	Digital	Piano	Acoustic	Percussion	Pluck	Keyboard	Mallet	Guitar	Electric
32	2018-10-22	mkh032_origin.mp3	mkh032	Origin	Meekah	03:44	77	F	minor	Pop	R&B	Electronic	Future Bass	The Weeknd	Flume	Icytwat	Dark	Agressive	Energetic	Drum	Digital	Keyboard	Synth	Synth	Future	Bass	Reese	Percussion	808
41	2018-11-02	mkh041_paradise.mp3	mkh041	Paradise	Meekah	03:25	102	C	major	Pop	K-Pop	R&B	Synth	Ally	Gray	Terror Jr	Mellow	Love	Moody	Drum	Pop	Bass	Pluck	Keyboard	Synth	Synth	Sine	Synth	Pluck
46	2018-11-23	mkh046_popstar.mp3	mkh046	Popstar	Meekah	03:17	112	A	major	Pop	Midtempo	Pop	Dance	Majid Jordan	Michael Jackson	BTS	Mellow	Bouncy	Loved	Drum	Dance	Bass	Sine	Keyboard	Juno	Synth	Sine Pluck	Guitar	Electric
1	2018-06-01	mkh001_enemy.mp3	mkh001	Enemy	Meekah	03:25	75	E	minor	Hiphop	Trap	\N	\N	Drake	Blocboy JB	Young Thug	Dirty	Energetic	Evil	Drum	808	Bass	808	Piano	Acoustic	Synth	Lead	Synth	Pad
3	2018-05-30	mkh003_overdose.mp3	mkh003	Overdose	Meekah	03:08	80	C#	minor	Pop	R&B	Pop	Ballad	Post Malone	Khalid	Lauv	Mellow	Sentimental	Loved	Drum	Digital	Bass	808	Keyboard	Juno	String	Koto	Synth	Lead
4	2018-05-31	mkh004_higher.mp3	mkh004	Higher	Meekah	03:24	80	G	minor	Hiphop	Trap	\N	\N	A$AP Rocky	Skepta	ARAP Ferg	Dirty	Energetic	Celebration	Drum	808	Bass	808	Woodwind	Flute	String	Orchestra	\N	\N
7	2018-06-13	mkh007_dive.mp3	mkh007	Dive	Meekah	04:00	100	A	major	Pop	R&B	Reggaeton	Pop	French Montana	Justin Bieber	Maluma	Mellow	Bouncy	Happy	Drum	Digital	Bass	808	Synth	Pluck	Synth Pad	Ambient	\N	\N
11	2018-06-16	mkh011_dragon.mp3	mkh011	Dragon	Meekah	02:03	100	Eb	major	Hiphop	Trap	Electronic	Bass	Baauer	G-Dragon	M.I.A.	Aggressive	Energetic	Dirty	Drum	909	Bass	Sine	Bass	Grimey	Synth	Pluck	String	Koto
12	2018-06-16	mkh012_dope.mp3	mkh012	Dope	Meekah	03:05	70	D	major	Hiphop	R&B	Electronic	Dubstep	Diplo	Lil Xan	Xxxtentacion	Mellow	Energetic	Aggressive	Drum	Digital	Bass	Sine	Synth	Juno	Synth	Pad	Keyboard	Digital
16	2018-08-22	mkh016_sicko.mp3	mkh016	Sicko	Meekah	03:03	80	F	minor	Hiphop	Trap	Electronic	Dubstep	Travis Scott	Skrillex	Xxxtencion	Dirty	Energetic	Aggressive	Drum	808	Bass	808	Bass	Serum	Synth	Serum	String	Koto
17	2018-08-23	mkh017_god.mp3	mkh017	God	Meekah	03:39	70	F#	minor	Hiphop	R&B	Pop	R&B	Travis Scott	Clams Casino	Playboy Carti	Dark	Ambient	Moody	Drum	808	Bass	808	Bass	Pluck	Guitar	Electric	Synth	Lead
21	2018-08-29	mkh021_mango.mp3	mkh021	Mango	Meekah	03:24:00	115	F#	major	Hiphop	Rap	Pop	R&B	Goldlink	Logic	Drake	Energetic	Mellow	Moody	Drum	Digital	Bass	808	Synth	Pad	Synth	Juno	Synth	Pluck
22	2018-09-07	mkh022_summer.mp3	mkh022	Summer	Meekah	03:29	85	F	minor	Hiphop	Trap	Pop	R&B	Migos	Childish Gambino	Lil Baby	Dark	Emo	Energetic	Drum	808	Bass	808	Guitar	Electric	Keyboard	Synth	Sample	Audio
25	2018-10-11	mkh025_ocean.mp3	mkh025	Ocean	Meekah	03:46	70	E	minor	Pop	Ballad	R&B	Ballad	Ty Dolla Sign	24Hrs	Khalid	Mellow	Ambient	Loved	Drum	Digital	Bass	808	Keyboard	Rhodes	Synth	Pluck	String	Orchestra
35	2018-10-23	mkh035_feeling.mp3	mkh035	Feeling	Meekah	03:22	110	G	major	Pop	Funk	Funk	G-Funk	Bruno Mars	Snoop Dogg	Nate Dogg	Happy	Bouncy	Groovy	Drum	G-Funk	Bass	Minimoog	Guitar	Electric	Keyboard	Rhodes	Synth	Pluck
39	2018-10-28	mkh039_love.mp3	mkh039	Love	Meekah	03:26	100	A	minor	Hiphop	Pop	R&B	Pop	Chris Brown	Drake	DJ Khaled	Bouncy	Dark	Mellow	Drum	Hiphop	Bass	808	Bass	Pluck	Keyboard	Organ	Guitar	Electric
40	2018-10-29	mkh040_down.mp3	mkh040	Down	Meekah	04:24	80	A	minor	Hiphop	Trap	R&B	Pop	Tory Lanez	DPR Live	Drake	Energetic	Mellow	Ambient	Drum	Pop	Bass	808	Keyboard	Rhodes	Synth	Arp	Synth	Pluck
43	2018-11-08	mkh043_sunkist.mp3	mkh043	Sunkist	Meekah	03:07	92	F	minor	Pop	R&B	Hiphop	Pop	Post Malone	Swae Lee	Young Thug	Mellow	Loved	Energetic	Drum	Pop	Bass	Reese	Guitar	Electric	Keyboard	Rhodes	Percussion	Analog
45	2018-11-17	mkh045_drive.mp3	mkh045	Drive	Meekah	03:05	70	G	major	R&B	Pop	Hiphop	Ambient	Post Malone	Pierre Bourne	Ty Dolla $ign	Groovy	Ambient	Mellow	Drum	808	Bass	808	Keyboard	Rhode	Guitar	Muted	Percussion	808
47	2018-11-26	mkh047_japan.mp3	mkh047	Japan	Meekah	03:45	84	F#	minor	Hiphop	Trap	Hiphop	Club	A$AP Ferg	Travis Scott	Drake	Energetic	Bouncy	Loved	Drum	808	Bass	808	Piano	Acoustic	Woodwind	Flute	String	Koto
50	2018-12-07	mkh050_burn.mp3	mkh050	Burn	Meekah	03:40	87	F	minor	Hiphop	Trap	\N	\N	Migos	Quavo	Offset	Energetic	Dirty	Bouncy	Drum	Hiphop	Bass	808	Keyboard	Synth	Synth	Lead	Percussion	Acoustic
51	2019-01-24	mkh051_money.mp3	mkh051	Money	Meekah	03:15	98	G	minor	R&B	Pop	Pop	Electronic	The Weeknd	Gesaffelstein	Daft Punk	Energetic	Dark	Ambient	Drum	808	Bass	808	Keyboard	Synth	Synth	Analog	Keyboard	Organ
54	2019-02-22	mkh054_lambo.ogg	mkh054	Lambo	Meekah	03:10	76	D	minor	Hiphop	Trap	Electronic	Dubstep	Lil Pump	Skrillex	Rick Ross	Energetic	Hard	Agressive	Drum	Hiphop	Bass	808	Keyboard	Juno	Synth	Chord	Synth	Dubstep
57	2019-04-09	mkh057_africa.ogg	mkh057	Africa	Meekah	03:27	102	G	major	Afrobeat	Pop	\N	\N	Davido	Wizkid	Mystro	Energetic	Happy	Groovy	Drum	Afrobeat	Bass	808	Keyboard	Mallet	Keyboard	Rhodes	Synth	Lead
\.


--
-- Data for Name: track_sample; Type: TABLE DATA; Schema: meekah; Owner: abe
--

COPY meekah.track_sample (id, track_catalog, track_title, sample_file_1, sample_pack_1, sample_author_1, sample_royalty_free_1, sample_clearance_1, sample_file_2, sample_pack_2, sample_author_2, sample_royalty_free_2, sample_clearance_2, sample_file_3, sample_pack_3, sample_author_3, sample_royalty_free_3, sample_clearance_3, sample_file_4, sample_pack_4, sample_author_4, sample_royalty_free_4, sample_clearance_4, sample_file_5, sample_pack_5, sample_author_5, sample_royalty_free_5, sample_clearance_5) FROM stdin;
1	MKH001	Enemy	BPM070TrapMan_Em_Piano.wav	Dirty South Wars 2	Prime Loops	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	MKH002	Trapped	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	MKH003	Overdose	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	MKH004	Higher	CHS_93_Gm_Flute.wav	Hip Hop Shadows Vol. 1	Loopmasters	t	t	Dl1_75_Cm_Orch_Filter_Skanks.wav	Dubmatrix Presents - Dub Invaders	Loopmasters	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	MKH005	Dream	OSHI_melody_loop_out_of_place_98_G#.wav	OSHI's Care Package	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	MKH006	Hustle	420_V2_Melodic_Loop_90_WordsCantSay_All_Gm.wav	4:20 The Smokers Kit Vol. 2	CAPSUN ProAudio	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7	MKH007	Dive	NAS_90_Emaj7_Ocean_Choir_a.wav	Natural Selection	Loopmasters	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8	MKH008	Quitter	DBM_SDT_DOINGTHEMOST_GUZHENG_100BPM_A-MINOR.wav	Sonic Dope Trap 1	DopeBoyzMuzic	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	MKH009	Crown	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
10	MKH010	Fly	PL_CEDMV3_02_Muted_Guitar_C#_128_Wet	Commercial EDM Vocals Vol. 3	Producer Loops	t	t	Melody 056 - 85 bpm (F).wav	Commercial EDM Vocals Vol. 3	Producer Loops	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
11	MKH011	Dragon	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
12	MKH012	Dope	MYRNE_synth_loop_redux_sines_140_D#maj.wav	MYRNE: Myrcury Sample Pack	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
13	MKH013	Silence	CRNKN_guitar_loop_shoe_gaze_01_145_Amin.wav	CRNKN: Sounds Across the Board	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14	MKH014	Astroworld	OSHI_melody_loop_dreamzzz_141_F#.wav	OSHI's Care Package	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
15	MKH015	Kiki	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
19	MKH019	Hard	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
16	MKH016	Sicko	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
17	MKH017	God	CLF_90_LoFi_PrayerKeys_F#m.wav	Lo-Fi Soul & Future Beats	CAPSUN ProAudio	t	t	RS1_Cryer_Stem_Lead_Guitar_F#m_120.wav	Roseway Studio Sessions Vol. 1 - Future Electronica	CAPSUN ProAudio	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
18	MKH018	Gang	GNEALZ_melodic_loop_smoke_purpp_layer_150_Amin.wav	Gnealz: That's It Right There Sample Pack	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
20	MKH020	Bed	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
21	MKH021	Mango	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
22	MKH022	Summer	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
23	MKH023	Buddha	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
24	MKH024	Weekend	SWD_Guitar_120_Sunken_C#m.wav	Soulful Waves & Dream Trap	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
25	MKH025	Ocean	BLUE_HAWAII_chord_loop_rising_124_Emin.wav	Blue Hawaii: Very Emotional Sounds	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
26	MKH026	Coca	\N	\N	\N	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
27	MKH027	Blossom	LOOP - 90BPM - Ally Strings.wav	\nKaran Kanchan Presents J-Trap\nMelody Rhythmix Vol. 2	Unknown	t	t	OSKAR_FLOOD_melody_loop_guitar_drunk_95bpm_F#min.wav	Oskar Flood Sample Pack	Splice\n	t	t	RARE_percussion_Zither_Asia_dope_Amin_94_loop7.wav	Rare Percussion	Splice	t	t	Acolyte_-_Welcome_Sensei_.wav	Acolyte	TRUE	t	\N	\N	\N	\N	\N	\N
28	MKH028	Karma	ALEX_LUSTIG_synth_loop_deep_so_smooth_rhodes_90_Dbmin.wav	Ale Lustig: Lost Sounds Sample Pack	Splice	t	t	WCG_70_guitar_stack_the_greatest_dancer_bass_Em.wav	Ocean Ave: West Coast Guitars	Capsun ProAudio	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
29	MKH029	Millionaire	DUBBEL_DUTCH_synth_loop_dark_matter_100_Gmin.wav	Dubbell Dutch: Rare Earth Elements	Splice	t	t	SLIINK_vocal_loop_siren_G#min.wav	Dj Sliink: Deep From Jersey	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
30	MKH030	Versace	JOSH_J_guitar_loop_stizzy_105_Gm.wav	Josh J.: Guitar is Dead Sample Pack	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
31	MKH031	Rhythm	KRS_chord_loop_construction_riddim_06_chord_110_Cmin.wav	krs.: Build a Vybz Drum Kit	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
32	MKH032	Origin	CT2_140_Fm_Pad_Lick.wav	CAPSUN Presents Chill Trap & Future Bass	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
33	MKH033	Ride	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
34	MKH034	Metro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
35	MKH035	Feeling	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
36	MKH036	Mermaid	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
37	MKH037	Water	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
38	MKH038	Free	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
39	MKH039	Love	WCG_90_guitar_lead_hydro_bounce_Fm.wav	Ocean Ave: West Coast Guitars	Splice	t	t	DBM_SDRNB_HYPNOTIZED_LOWVOX_94BPM.wav	Sonice Dope R&B	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
40	MKH040	Down	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
41	MKH041	Paradise	SCVNGR_synth_bouncy_stabs_02_108_C.wav	Scavanger Hunt - Future Nostalgia	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
42	MKH042	Savage	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
43	MKH043	Sunkist	TRHZ_guitar_loop_sexychords_91_E.wav	Electric Soul - Guitar Loops and Riffs by Treehouz	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
44	MKH044	Comme	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
45	MKH045	Dive	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
46	MKH046	Popstar	LENNO_guitar_loop_wide_funk_107_Cmin_v2.wav	Lenno Sample Pack	Splice	t	t	OSKAR_FLOOD_melody_loop_viamimice_110_Amaj.wav	Oskar Flood Sample Pack	Splice	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
47	MKH047	Japan	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
48	MKH048	Psychedelic	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
49	MKH049	Shark	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
50	MKH050	Burn	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
51	MKH051	Money	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
52	MKH052	Killer	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
53	MKH053	Rapstar	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
54	MKH054	Lambo	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
55	MKH055	Kanga	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
56	MKH056	Suite	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
57	MKH057	Africa	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
58	MKH058	Dark	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
59	MKH059	Bad	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
60	MKH060	Final	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


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
    ADD CONSTRAINT track_exclusive_catalog_key UNIQUE (catalog);


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
-- PostgreSQL database dump complete
--

--
-- Database "blendtune_users" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Homebrew)
-- Dumped by pg_dump version 16.2 (Homebrew)

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
-- Name: blendtune_users; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE blendtune_users WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE blendtune_users OWNER TO postgres;

\connect blendtune_users

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
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: abe
--

COPY auth.users (id, uuid, first_name, last_name, email, password, created_at, email_confirmed, email_token, last_email_sent, email_token_expire) FROM stdin;
14	dde014f3-3abd-4ed8-b4fc-159db196e6e7	Abraham	Ahn	satmorningrain@gmail.com	$2b$10$bljeXhJia9TjSO8/253dy.B.NmPoFBxXncWPbjF1hKZ7VP9Bz/eA.	2024-02-27 01:21:23.77+09	f	1886c414-d0fe-4d13-8d8e-50ec2cf6c528	2024-02-27 01:21:27.240136+09	2024-02-27 01:36:23.77+09
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

SELECT pg_catalog.setval('auth.users_id_seq', 14, true);


--
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: users; Owner: abe
--

SELECT pg_catalog.setval('users.roles_role_id_seq', 23, true);


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
-- Name: DATABASE blendtune_users; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON DATABASE blendtune_users TO abe;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Homebrew)
-- Dumped by pg_dump version 16.2 (Homebrew)

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
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

