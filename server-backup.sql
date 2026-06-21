--
-- PostgreSQL database cluster dump
--

-- Started on 2026-06-21 19:02:56

\restrict kuM2reA4la3d2M2ezexvuFdkd4ZJnxhhgLzEIZvLH25Wv6UUaWtEBttZCm2q7eu

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:WAk2Mdd/mSqVYmhWfPbsBA==$dWVFjQ1T7dbBEQjANcjM2ghzOOaN6MSPZ3Xuv07i9oM=:gKz8a9Oa0msWcpazRM3cNjFkN7dT8eeNl1l4BpkZMDc=';

--
-- User Configurations
--








\unrestrict kuM2reA4la3d2M2ezexvuFdkd4ZJnxhhgLzEIZvLH25Wv6UUaWtEBttZCm2q7eu

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

\restrict yQNzWaNJRswSX1zObKNqpl0IVaQj4iahWy1d2R0s0op0Wrn4ECqqwMkNWDNNYGF

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-21 19:02:56

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2026-06-21 19:02:56

--
-- PostgreSQL database dump complete
--

\unrestrict yQNzWaNJRswSX1zObKNqpl0IVaQj4iahWy1d2R0s0op0Wrn4ECqqwMkNWDNNYGF

--
-- Database "EvaluationsDB" dump
--

--
-- PostgreSQL database dump
--

\restrict b5N9peatYpqi8iWY54jdaToXMQmLlPzZGF0QYoWCp1q7YEv2XCPxOemQIWoDABK

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-21 19:02:56

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5065 (class 1262 OID 16703)
-- Name: EvaluationsDB; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "EvaluationsDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'German_Germany.1252';


ALTER DATABASE "EvaluationsDB" OWNER TO postgres;

\unrestrict b5N9peatYpqi8iWY54jdaToXMQmLlPzZGF0QYoWCp1q7YEv2XCPxOemQIWoDABK
\connect "EvaluationsDB"
\restrict b5N9peatYpqi8iWY54jdaToXMQmLlPzZGF0QYoWCp1q7YEv2XCPxOemQIWoDABK

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 17107)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 881 (class 1247 OID 17253)
-- Name: evaluation_run_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.evaluation_run_status AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public.evaluation_run_status OWNER TO postgres;

--
-- TOC entry 878 (class 1247 OID 17240)
-- Name: portfolio_exposure_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.portfolio_exposure_type AS ENUM (
    'COUNTRY',
    'INDUSTRY',
    'ASSET_CLASS'
);


ALTER TYPE public.portfolio_exposure_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 17169)
-- Name: evaluation_runs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluation_runs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    status public.evaluation_run_status DEFAULT 'PENDING'::public.evaluation_run_status NOT NULL,
    user_id character varying(128),
    input_snapshot jsonb,
    ai_advisory jsonb,
    agent_outputs jsonb,
    ai_model character varying(128),
    prompt_version character varying(64),
    evaluation_version character varying(64) DEFAULT '1'::character varying NOT NULL,
    error_message text,
    completed_at timestamp with time zone,
    portfolio_id character varying(128) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.evaluation_runs OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17146)
-- Name: portfolio_evaluations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio_evaluations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    run_id uuid NOT NULL,
    total_value double precision NOT NULL,
    risk_score double precision NOT NULL,
    volatility_score double precision NOT NULL,
    concentration_risk double precision NOT NULL,
    diversification_score double precision NOT NULL
);


ALTER TABLE public.portfolio_evaluations OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 17125)
-- Name: portfolio_exposures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio_exposures (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    evaluation_id uuid CONSTRAINT "portfolio_exposures_evaluationId_not_null" NOT NULL,
    type public.portfolio_exposure_type NOT NULL,
    name character varying(128) NOT NULL,
    weight double precision NOT NULL
);


ALTER TABLE public.portfolio_exposures OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17136)
-- Name: portfolio_stress_tests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio_stress_tests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    scenario character varying(128) NOT NULL,
    evaluation_id uuid NOT NULL,
    loss_percent double precision NOT NULL
);


ALTER TABLE public.portfolio_stress_tests OWNER TO postgres;

--
-- TOC entry 5059 (class 0 OID 17169)
-- Dependencies: 223
-- Data for Name: evaluation_runs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evaluation_runs (id, status, user_id, input_snapshot, ai_advisory, agent_outputs, ai_model, prompt_version, evaluation_version, error_message, completed_at, portfolio_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5058 (class 0 OID 17146)
-- Dependencies: 222
-- Data for Name: portfolio_evaluations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portfolio_evaluations (id, run_id, total_value, risk_score, volatility_score, concentration_risk, diversification_score) FROM stdin;
\.


--
-- TOC entry 5056 (class 0 OID 17125)
-- Dependencies: 220
-- Data for Name: portfolio_exposures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portfolio_exposures (id, evaluation_id, type, name, weight) FROM stdin;
\.


--
-- TOC entry 5057 (class 0 OID 17136)
-- Dependencies: 221
-- Data for Name: portfolio_stress_tests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portfolio_stress_tests (id, scenario, evaluation_id, loss_percent) FROM stdin;
\.


--
-- TOC entry 4899 (class 2606 OID 17158)
-- Name: portfolio_evaluations PK_3aa8038f4712d0e46a155c5272a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_evaluations
    ADD CONSTRAINT "PK_3aa8038f4712d0e46a155c5272a" PRIMARY KEY (id);


--
-- TOC entry 4893 (class 2606 OID 17135)
-- Name: portfolio_exposures PK_b5f01d907bb540f7f05ba5901af; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_exposures
    ADD CONSTRAINT "PK_b5f01d907bb540f7f05ba5901af" PRIMARY KEY (id);


--
-- TOC entry 4896 (class 2606 OID 17145)
-- Name: portfolio_stress_tests PK_bc3181c7b7616cc8cc2776390b2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_stress_tests
    ADD CONSTRAINT "PK_bc3181c7b7616cc8cc2776390b2" PRIMARY KEY (id);


--
-- TOC entry 4903 (class 2606 OID 17186)
-- Name: evaluation_runs PK_fbeb1f5d29c74ecda426e2e98f5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_runs
    ADD CONSTRAINT "PK_fbeb1f5d29c74ecda426e2e98f5" PRIMARY KEY (id);


--
-- TOC entry 4901 (class 2606 OID 17213)
-- Name: portfolio_evaluations UQ_af1859bbf44fbc1dc21424fb72e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_evaluations
    ADD CONSTRAINT "UQ_af1859bbf44fbc1dc21424fb72e" UNIQUE (run_id);


--
-- TOC entry 4904 (class 1259 OID 17270)
-- Name: idx_evaluation_runs_portfolio_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_evaluation_runs_portfolio_created ON public.evaluation_runs USING btree (portfolio_id, created_at);


--
-- TOC entry 4905 (class 1259 OID 17269)
-- Name: idx_evaluation_runs_status_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_evaluation_runs_status_created ON public.evaluation_runs USING btree (status, created_at);


--
-- TOC entry 4894 (class 1259 OID 17267)
-- Name: idx_portfolio_exposures_evaluation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_portfolio_exposures_evaluation_id ON public.portfolio_exposures USING btree (evaluation_id);


--
-- TOC entry 4897 (class 1259 OID 17268)
-- Name: idx_portfolio_stress_tests_evaluation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_portfolio_stress_tests_evaluation_id ON public.portfolio_stress_tests USING btree (evaluation_id);


--
-- TOC entry 4908 (class 2606 OID 17281)
-- Name: portfolio_evaluations fk_portfolio_evaluations_run; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_evaluations
    ADD CONSTRAINT fk_portfolio_evaluations_run FOREIGN KEY (run_id) REFERENCES public.evaluation_runs(id) ON DELETE CASCADE;


--
-- TOC entry 4906 (class 2606 OID 17271)
-- Name: portfolio_exposures fk_portfolio_exposures_evaluation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_exposures
    ADD CONSTRAINT fk_portfolio_exposures_evaluation FOREIGN KEY (evaluation_id) REFERENCES public.portfolio_evaluations(id) ON DELETE CASCADE;


--
-- TOC entry 4907 (class 2606 OID 17276)
-- Name: portfolio_stress_tests fk_portfolio_stress_tests_evaluation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_stress_tests
    ADD CONSTRAINT fk_portfolio_stress_tests_evaluation FOREIGN KEY (evaluation_id) REFERENCES public.portfolio_evaluations(id) ON DELETE CASCADE;


-- Completed on 2026-06-21 19:02:57

--
-- PostgreSQL database dump complete
--

\unrestrict b5N9peatYpqi8iWY54jdaToXMQmLlPzZGF0QYoWCp1q7YEv2XCPxOemQIWoDABK

--
-- Database "PortfoliosDB" dump
--

--
-- PostgreSQL database dump
--

\restrict uEEibnmMuVR43kWrXtQ9YNQ9ewXYny8pIRi5nlPP0kSGrqMPjTcRKXV1WSThBxf

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-21 19:02:57

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5047 (class 1262 OID 16701)
-- Name: PortfoliosDB; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "PortfoliosDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'German_Germany.1252';


ALTER DATABASE "PortfoliosDB" OWNER TO postgres;

\unrestrict uEEibnmMuVR43kWrXtQ9YNQ9ewXYny8pIRi5nlPP0kSGrqMPjTcRKXV1WSThBxf
\connect "PortfoliosDB"
\restrict uEEibnmMuVR43kWrXtQ9YNQ9ewXYny8pIRi5nlPP0kSGrqMPjTcRKXV1WSThBxf

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 17079)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16869)
-- Name: assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    symbol text NOT NULL,
    name text NOT NULL,
    asset_class text NOT NULL,
    currency text NOT NULL,
    exchange text,
    last_price numeric(20,8),
    last_price_updated_at timestamp with time zone,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.assets OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16889)
-- Name: holdings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.holdings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portfolio_id uuid NOT NULL,
    asset_id uuid NOT NULL,
    quantity numeric(20,8) NOT NULL,
    average_purchase_price numeric(20,8) NOT NULL,
    purchase_date date NOT NULL
);


ALTER TABLE public.holdings OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16851)
-- Name: portfolios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    owner_type text NOT NULL,
    name text NOT NULL,
    base_currency text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.portfolios OWNER TO postgres;

--
-- TOC entry 5040 (class 0 OID 16869)
-- Dependencies: 221
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assets (id, symbol, name, asset_class, currency, exchange, last_price, last_price_updated_at, metadata, created_at, updated_at) FROM stdin;
57d7cbb9-d1bf-4a5a-b1dc-d250bee57aa8	BTC	Bitcoin	crypto	USD	\N	\N	\N	{"blockchain": "bitcoin", "circulating_supply": 19700000}	2026-06-20 12:32:50.502537+02	2026-06-20 12:32:50.502537+02
19a886f9-f5bd-4b78-be05-8d7825ee40c7	DE0001102580	German Bund 2034	bond	EUR	XETRA	\N	\N	{"issuer": "Bundesrepublik Deutschland", "coupon_rate": 2.5, "maturity_date": "2034-08-15"}	2026-06-20 12:32:50.502537+02	2026-06-20 12:32:50.502537+02
506e96cb-c186-4c22-8eeb-1a7fcf7dae1b	LU0064600964	Fidelity Global Technology Fund	fund	USD	\N	\N	\N	{"isin": "LU0064600964", "fund_type": "mutual", "fund_house": "Fidelity", "management_fee": 1.5}	2026-06-20 12:34:27.831954+02	2026-06-20 12:34:27.831954+02
ee9fb426-6368-4412-be80-9e5fc7beb0be	XAU	Gold (Spot)	commodity	USD	\N	\N	\N	{"unit": "troy_ounce", "category": "precious_metal", "delivery_type": "spot"}	2026-06-20 12:34:27.831954+02	2026-06-20 12:34:27.831954+02
899917d0-fe17-44ac-a7f5-39364fbe24ab	EUR_CASH	Euro Cash	cash	EUR	\N	\N	\N	{"interest_rate": 0.0}	2026-06-20 12:34:27.831954+02	2026-06-20 12:34:27.831954+02
062181c5-e775-48b3-80e3-244e61ebcae5	AAPL	Apple Inc.	equity	USD	NASDAQ	290.00000000	2026-06-21 00:25:00+02	{"isin": "US0378331005", "sector": "Technology", "market_cap_tier": "mega"}	2026-06-20 12:32:50.502537+02	2026-06-20 12:32:50.502537+02
47e08034-7faf-48a3-979b-008807552d59	VWCE	Vanguard FTSE All-World UCITS ETF	etf	EUR	XETRA	114.56000000	2026-06-21 00:25:00+02	{"ter": 0.22, "isin": "IE00BK5BQT80", "replication": "physical", "benchmark_index": "FTSE All-World"}	2026-06-20 12:34:27.831954+02	2026-06-20 12:34:27.831954+02
\.


--
-- TOC entry 5041 (class 0 OID 16889)
-- Dependencies: 222
-- Data for Name: holdings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.holdings (id, portfolio_id, asset_id, quantity, average_purchase_price, purchase_date) FROM stdin;
3e060840-79e1-4d63-96d9-c7d7889b0b61	cc89eb9e-ab1f-4c6c-a831-0b8c21841189	062181c5-e775-48b3-80e3-244e61ebcae5	4.50000000	198.56000000	2026-06-21
8081a006-8a2c-4d1d-b53e-5f598f9b4eb7	cc89eb9e-ab1f-4c6c-a831-0b8c21841189	47e08034-7faf-48a3-979b-008807552d59	10.00000000	120.00000000	2026-06-21
\.


--
-- TOC entry 5039 (class 0 OID 16851)
-- Dependencies: 220
-- Data for Name: portfolios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portfolios (id, user_id, owner_type, name, base_currency, created_at) FROM stdin;
cc89eb9e-ab1f-4c6c-a831-0b8c21841189	0d64778c-b1e3-4b9c-846c-c1a9da3815ce	user	Retirement Savings	EUR	2026-06-20 23:26:14.360001+02
\.


--
-- TOC entry 4885 (class 2606 OID 16886)
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- TOC entry 4889 (class 2606 OID 16903)
-- Name: holdings holdings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.holdings
    ADD CONSTRAINT holdings_pkey PRIMARY KEY (id);


--
-- TOC entry 4882 (class 2606 OID 16866)
-- Name: portfolios portfolios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_pkey PRIMARY KEY (id);


--
-- TOC entry 4886 (class 1259 OID 17095)
-- Name: IDX_2f4f9915c4b755588d01fee50b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_2f4f9915c4b755588d01fee50b" ON public.holdings USING btree (portfolio_id);


--
-- TOC entry 4880 (class 1259 OID 17094)
-- Name: IDX_57fba72db5ac40768b40f0ecfa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_57fba72db5ac40768b40f0ecfa" ON public.portfolios USING btree (user_id);


--
-- TOC entry 4887 (class 1259 OID 17096)
-- Name: IDX_86bd4fa60281cf5d395c41164e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_86bd4fa60281cf5d395c41164e" ON public.holdings USING btree (asset_id);


--
-- TOC entry 4883 (class 1259 OID 17093)
-- Name: IDX_9b4bd5b9c6fe49cd3b4342fb91; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_9b4bd5b9c6fe49cd3b4342fb91" ON public.assets USING btree (symbol);


--
-- TOC entry 4890 (class 2606 OID 17097)
-- Name: holdings FK_2f4f9915c4b755588d01fee50be; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.holdings
    ADD CONSTRAINT "FK_2f4f9915c4b755588d01fee50be" FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id) ON DELETE CASCADE;


--
-- TOC entry 4891 (class 2606 OID 17102)
-- Name: holdings FK_86bd4fa60281cf5d395c41164ee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.holdings
    ADD CONSTRAINT "FK_86bd4fa60281cf5d395c41164ee" FOREIGN KEY (asset_id) REFERENCES public.assets(id);


-- Completed on 2026-06-21 19:02:57

--
-- PostgreSQL database dump complete
--

\unrestrict uEEibnmMuVR43kWrXtQ9YNQ9ewXYny8pIRi5nlPP0kSGrqMPjTcRKXV1WSThBxf

--
-- Database "UsersDB" dump
--

--
-- PostgreSQL database dump
--

\restrict 7jq7OeuXWop4X1YC0hk7C33CagHLm7Six5lI9hwfmpSBhtrgOegJFFg5nkQBwth

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-21 19:02:57

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5049 (class 1262 OID 16702)
-- Name: UsersDB; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "UsersDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'German_Germany.1252';


ALTER DATABASE "UsersDB" OWNER TO postgres;

\unrestrict 7jq7OeuXWop4X1YC0hk7C33CagHLm7Six5lI9hwfmpSBhtrgOegJFFg5nkQBwth
\connect "UsersDB"
\restrict 7jq7OeuXWop4X1YC0hk7C33CagHLm7Six5lI9hwfmpSBhtrgOegJFFg5nkQBwth

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16987)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 866 (class 1247 OID 16705)
-- Name: user_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_status AS ENUM (
    'active',
    'disabled',
    'locked'
);


ALTER TYPE public.user_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16736)
-- Name: corporates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.corporates (
    user_id integer NOT NULL,
    corporate_name character varying(150) NOT NULL,
    company_reg_no character varying(50),
    vat_id character varying(50)
);


ALTER TABLE public.corporates OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16916)
-- Name: persons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.persons (
    user_id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    date_of_birth date NOT NULL,
    tax_id character varying(50),
    tax_residence_country character(2),
    risk_class character(1),
    investment_horizon integer
);


ALTER TABLE public.persons OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16712)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    public_id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying NOT NULL,
    password_hash character varying(255) CONSTRAINT users_password_not_null NOT NULL,
    role character varying DEFAULT 'user'::character varying NOT NULL,
    status public.user_status DEFAULT 'active'::public.user_status NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16711)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 5042 (class 0 OID 16736)
-- Dependencies: 222
-- Data for Name: corporates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.corporates (user_id, corporate_name, company_reg_no, vat_id) FROM stdin;
4	VW Financial Services AG	HRB12345B	DE123456789
5	Siemens Trading Services AG	ABC12345A	DE142456789
8	Munva Trading AG	123255	B2532
10	BMW Trading AG	123255	B2532
12	BBS Trading AG	123255	B2532
\.


--
-- TOC entry 5043 (class 0 OID 16916)
-- Dependencies: 223
-- Data for Name: persons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.persons (user_id, first_name, last_name, date_of_birth, tax_id, tax_residence_country, risk_class, investment_horizon) FROM stdin;
1	Cagan	Aytac	2005-05-04	12345674891234	DE	A	5
3	Ali	Atac	1005-05-04	12345674891234	DE	B	3
9	Cagan	Aytac	2005-04-05	12345	DE	A	5
11	Susanne	Klatten	1966-01-05	12345	DE	A	5
\.


--
-- TOC entry 5041 (class 0 OID 16712)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, public_id, email, password_hash, role, status, created_at, updated_at) FROM stdin;
1	79e2fa95-db01-47a4-b7a0-8b38cb3da507	cagan.aytac09@gmail.com	adsfasfasfsaf	user	active	2026-06-13 13:40:39.146928	2026-06-13 13:40:39.146928
3	c91f57c2-aea9-4265-8a5a-bc7336ec471c	cagan.ayjjtac09@gmail.com	adsfasfasfsaf	user	active	2026-06-13 13:41:14.591441	2026-06-13 13:41:14.591441
4	9010225f-9121-49af-92f4-bcdbf5a53f57	cagan.ayjjhhhhtac09@gmail.com	adsfasfasfsaf	user	active	2026-06-13 13:41:17.410762	2026-06-13 13:41:17.410762
5	6a2e0b16-ecba-425a-9283-8354b0e004f6	cagan.ayjjhhhhvvvvtac09@gmail.com	adsfasfasfsaf	user	active	2026-06-13 13:41:18.776468	2026-06-13 13:41:18.776468
6	2858f0f4-eb44-4b67-9232-8dec87723c9f	cagan.ayjjhhhhvvvvvvvvtac09@gmail.com	adsfasfasfsaf	user	active	2026-06-13 13:41:19.974091	2026-06-13 13:41:19.974091
8	d6d866dd-ced9-44ec-a717-666851b739d4	trading@munva.com	$2b$12$At2nZT4nmvjKuf9u7YD9geHXKVsGZa/SaiAvUdIL/xpAGWzVOpKM6	user	active	2026-06-14 21:14:45.125414	2026-06-14 21:14:45.125414
9	b2a14469-cb33-4370-ac16-d862f6dff163	cagan@munva.com	$2b$12$f/eMNXpdKgBV.2xoV1wXhuOcw58GUKBTh543waVaQGLKgv0EC07JO	user	active	2026-06-14 21:23:50.640731	2026-06-14 21:41:00.017
10	8a5442c7-e813-4516-b197-a29b4e72115c	trading@bmw.com	$2b$12$e4e04sS5qtxglmiSNx6LvOQTcT3i.dcBrz4mAPd8k0.Nwsj7f1VvC	user	active	2026-06-14 23:48:31.90438	2026-06-14 23:48:31.90438
11	0d64778c-b1e3-4b9c-846c-c1a9da3815ce	susanne@bmw.com	$2b$12$gsq2j9ab.WO8gXebXvdMFO5HYw7J9q3Jy2WWaaPqhapasJYQq6OmG	user	active	2026-06-14 23:51:07.038788	2026-06-14 23:51:07.038788
12	7f3ae1fb-6086-4583-8168-71595f5f5e05	trading@bbs-fredenberg.eu	$2b$12$6v29ODwSI4kyUlyD.zJFDeldtK5jykYROE97/b7UFE4tU2AmW8zki	user	active	2026-06-15 10:23:42.176054	2026-06-15 10:25:26.286
\.


--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 12, true);


--
-- TOC entry 4888 (class 2606 OID 16742)
-- Name: corporates corporates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corporates
    ADD CONSTRAINT corporates_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4890 (class 2606 OID 16924)
-- Name: persons persons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persons
    ADD CONSTRAINT persons_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4885 (class 2606 OID 16733)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4883 (class 1259 OID 16734)
-- Name: users_email_uq; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_uq ON public.users USING btree (email);


--
-- TOC entry 4886 (class 1259 OID 16735)
-- Name: users_public_id_uq; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_public_id_uq ON public.users USING btree (public_id);


--
-- TOC entry 4891 (class 2606 OID 16743)
-- Name: corporates corporates_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corporates
    ADD CONSTRAINT corporates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4892 (class 2606 OID 16925)
-- Name: persons persons_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persons
    ADD CONSTRAINT persons_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-06-21 19:02:57

--
-- PostgreSQL database dump complete
--

\unrestrict 7jq7OeuXWop4X1YC0hk7C33CagHLm7Six5lI9hwfmpSBhtrgOegJFFg5nkQBwth

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict U5JmwUcMfhyB2HoJQI5nIFybQOuN77GsYoJTgAuwEFXRm3vyiWUTD1u9iom7US5

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-21 19:02:57

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16440)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 867 (class 1247 OID 16452)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'user',
    'moderator',
    'admin'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- TOC entry 873 (class 1247 OID 16656)
-- Name: user_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_status AS ENUM (
    'active',
    'disabled',
    'locked'
);


ALTER TYPE public.user_status OWNER TO postgres;

--
-- TOC entry 870 (class 1247 OID 16605)
-- Name: users_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_status_enum AS ENUM (
    'active',
    'disabled',
    'locked'
);


ALTER TYPE public.users_status_enum OWNER TO postgres;

--
-- TOC entry 234 (class 1255 OID 16489)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16971)
-- Name: corporates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.corporates (
    user_id integer NOT NULL,
    corporate_name character varying(150) NOT NULL,
    company_reg_no character varying(50),
    vat_id character varying(50)
);


ALTER TABLE public.corporates OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16978)
-- Name: persons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.persons (
    user_id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    date_of_birth date NOT NULL,
    tax_id character varying(50),
    tax_residence_country character(2),
    risk_class character(1),
    investment_horizon integer
);


ALTER TABLE public.persons OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16945)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "publicId" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    "passwordHash" character varying NOT NULL,
    role character varying DEFAULT 'user'::character varying NOT NULL,
    status public.users_status_enum DEFAULT 'active'::public.users_status_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16942)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 5049 (class 0 OID 16971)
-- Dependencies: 222
-- Data for Name: corporates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.corporates (user_id, corporate_name, company_reg_no, vat_id) FROM stdin;
\.


--
-- TOC entry 5050 (class 0 OID 16978)
-- Dependencies: 223
-- Data for Name: persons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.persons (user_id, first_name, last_name, date_of_birth, tax_id, tax_residence_country, risk_class, investment_horizon) FROM stdin;
\.


--
-- TOC entry 5048 (class 0 OID 16945)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "publicId", email, "passwordHash", role, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 4899 (class 2606 OID 16986)
-- Name: persons PK_114ed4a43ad36502663f8fde31a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persons
    ADD CONSTRAINT "PK_114ed4a43ad36502663f8fde31a" PRIMARY KEY (user_id);


--
-- TOC entry 4897 (class 2606 OID 16977)
-- Name: corporates PK_5cdc2ec0cdaba0d3bfc39211c7a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corporates
    ADD CONSTRAINT "PK_5cdc2ec0cdaba0d3bfc39211c7a" PRIMARY KEY (user_id);


--
-- TOC entry 4893 (class 2606 OID 16966)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 4895 (class 2606 OID 16968)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 4890 (class 1259 OID 16969)
-- Name: IDX_9099c98f00a1b5aca6b8f7f04a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_9099c98f00a1b5aca6b8f7f04a" ON public.users USING btree ("publicId");


--
-- TOC entry 4891 (class 1259 OID 16970)
-- Name: IDX_97672ac88f789774dd47f7c8be; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON public.users USING btree (email);


-- Completed on 2026-06-21 19:02:58

--
-- PostgreSQL database dump complete
--

\unrestrict U5JmwUcMfhyB2HoJQI5nIFybQOuN77GsYoJTgAuwEFXRm3vyiWUTD1u9iom7US5

-- Completed on 2026-06-21 19:02:58

--
-- PostgreSQL database cluster dump complete
--

