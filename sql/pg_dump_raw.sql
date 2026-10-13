--
-- PostgreSQL database dump
--

\restrict 2TxeUnm8ESHb2hc1Jpx2Ib4lHC04tTWGw3RCXCvGhEj1n9oMuLkY1fq0O9quyyF

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'AUTHOR',
    'GUEST'
);


--
-- Name: UploadKind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UploadKind" AS ENUM (
    'AVATAR',
    'WALLPAPER',
    'OTHER'
);


--
-- Name: UploadStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UploadStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AdminLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AdminLog" (
    id integer NOT NULL,
    "adminId" integer NOT NULL,
    action text NOT NULL,
    "targetType" text,
    "targetId" text,
    detail text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip text,
    ua text
);


--
-- Name: AdminLog_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."AdminLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: AdminLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."AdminLog_id_seq" OWNED BY public."AdminLog".id;


--
-- Name: AdminSession; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AdminSession" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    until timestamp(3) without time zone NOT NULL
);


--
-- Name: AdminSession_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."AdminSession_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: AdminSession_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."AdminSession_id_seq" OWNED BY public."AdminSession".id;


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "postId" integer NOT NULL,
    "userId" integer,
    "guestName" text
);


--
-- Name: CommentBan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CommentBan" (
    id integer NOT NULL,
    "userId" integer,
    ip text,
    until timestamp(3) without time zone NOT NULL,
    reason text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: CommentBan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."CommentBan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: CommentBan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."CommentBan_id_seq" OWNED BY public."CommentBan".id;


--
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- Name: Favorite; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Favorite" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "postId" integer NOT NULL,
    "userId" integer NOT NULL
);


--
-- Name: Favorite_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Favorite_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Favorite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Favorite_id_seq" OWNED BY public."Favorite".id;


--
-- Name: Like; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Like" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "postId" integer NOT NULL,
    "userId" integer NOT NULL
);


--
-- Name: Like_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Like_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Like_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Like_id_seq" OWNED BY public."Like".id;


--
-- Name: LoginCode; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LoginCode" (
    id integer NOT NULL,
    email text NOT NULL,
    code text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: LoginCode_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."LoginCode_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: LoginCode_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."LoginCode_id_seq" OWNED BY public."LoginCode".id;


--
-- Name: PageView; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PageView" (
    id integer NOT NULL,
    route text NOT NULL,
    slug text,
    at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer,
    "postId" integer,
    ip text
);


--
-- Name: PageView_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PageView_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: PageView_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PageView_id_seq" OWNED BY public."PageView".id;


--
-- Name: Post; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Post" (
    id integer NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    excerpt text,
    content text NOT NULL,
    tags text[],
    "publishedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'published'::text NOT NULL,
    "scheduledAt" timestamp(3) without time zone,
    "authorId" integer NOT NULL
);


--
-- Name: Post_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Post_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Post_id_seq" OWNED BY public."Post".id;


--
-- Name: RateLimit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RateLimit" (
    id integer NOT NULL,
    ip text NOT NULL,
    date text NOT NULL,
    count integer DEFAULT 0 NOT NULL,
    "lastAt" timestamp(3) without time zone
);


--
-- Name: RateLimit_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."RateLimit_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: RateLimit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."RateLimit_id_seq" OWNED BY public."RateLimit".id;


--
-- Name: SiteSettings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SiteSettings" (
    id integer DEFAULT 1 NOT NULL,
    title text NOT NULL,
    subtitle text,
    "seoDescription" text,
    announcement text,
    "allowGuestComment" boolean DEFAULT true NOT NULL,
    "allowRegistration" boolean DEFAULT true NOT NULL
);


--
-- Name: TagDef; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TagDef" (
    id integer NOT NULL,
    name text NOT NULL,
    color text,
    bg text,
    border text,
    hidden boolean DEFAULT false NOT NULL
);


--
-- Name: TagDef_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."TagDef_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: TagDef_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."TagDef_id_seq" OWNED BY public."TagDef".id;


--
-- Name: Upload; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Upload" (
    id integer NOT NULL,
    "userId" integer,
    kind public."UploadKind" NOT NULL,
    filename text NOT NULL,
    url text NOT NULL,
    status public."UploadStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "originalName" text,
    mime text NOT NULL,
    size integer NOT NULL
);


--
-- Name: Upload_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Upload_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Upload_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Upload_id_seq" OWNED BY public."Upload".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text,
    name text,
    role public."Role" DEFAULT 'GUEST'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    avatar text,
    signature text,
    xp integer DEFAULT 0 NOT NULL,
    "statsDate" text,
    "postsToday" integer DEFAULT 0,
    "xpToday" integer DEFAULT 0,
    "lastCommentAt" timestamp(3) without time zone
);


--
-- Name: UserBan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserBan" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    until timestamp(3) without time zone NOT NULL,
    reason text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    permanent boolean DEFAULT false NOT NULL
);


--
-- Name: UserBan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."UserBan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: UserBan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."UserBan_id_seq" OWNED BY public."UserBan".id;


--
-- Name: UserLikedAward; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserLikedAward" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    title text NOT NULL
);


--
-- Name: UserLikedAward_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."UserLikedAward_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: UserLikedAward_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."UserLikedAward_id_seq" OWNED BY public."UserLikedAward".id;


--
-- Name: UserPreference; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserPreference" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    wallpaper text,
    opacity double precision,
    theme text,
    "fontSize" text
);


--
-- Name: UserPreference_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."UserPreference_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: UserPreference_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."UserPreference_id_seq" OWNED BY public."UserPreference".id;


--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: AdminLog id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AdminLog" ALTER COLUMN id SET DEFAULT nextval('public."AdminLog_id_seq"'::regclass);


--
-- Name: AdminSession id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AdminSession" ALTER COLUMN id SET DEFAULT nextval('public."AdminSession_id_seq"'::regclass);


--
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- Name: CommentBan id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommentBan" ALTER COLUMN id SET DEFAULT nextval('public."CommentBan_id_seq"'::regclass);


--
-- Name: Favorite id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Favorite" ALTER COLUMN id SET DEFAULT nextval('public."Favorite_id_seq"'::regclass);


--
-- Name: Like id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Like" ALTER COLUMN id SET DEFAULT nextval('public."Like_id_seq"'::regclass);


--
-- Name: LoginCode id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LoginCode" ALTER COLUMN id SET DEFAULT nextval('public."LoginCode_id_seq"'::regclass);


--
-- Name: PageView id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PageView" ALTER COLUMN id SET DEFAULT nextval('public."PageView_id_seq"'::regclass);


--
-- Name: Post id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Post" ALTER COLUMN id SET DEFAULT nextval('public."Post_id_seq"'::regclass);


--
-- Name: RateLimit id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RateLimit" ALTER COLUMN id SET DEFAULT nextval('public."RateLimit_id_seq"'::regclass);


--
-- Name: TagDef id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TagDef" ALTER COLUMN id SET DEFAULT nextval('public."TagDef_id_seq"'::regclass);


--
-- Name: Upload id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Upload" ALTER COLUMN id SET DEFAULT nextval('public."Upload_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: UserBan id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserBan" ALTER COLUMN id SET DEFAULT nextval('public."UserBan_id_seq"'::regclass);


--
-- Name: UserLikedAward id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserLikedAward" ALTER COLUMN id SET DEFAULT nextval('public."UserLikedAward_id_seq"'::regclass);


--
-- Name: UserPreference id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserPreference" ALTER COLUMN id SET DEFAULT nextval('public."UserPreference_id_seq"'::regclass);


--
-- Data for Name: AdminLog; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (1, 1, 'upload_reject', 'upload', '41', '/uploads/1763960824268-r9f39wkjex.ogg', '2025-11-24 14:35:34.479', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (2, 1, 'upload_reject', 'upload', '35', '/uploads/1763650758875-on4gztde40s.jpg', '2025-11-24 14:35:37.135', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (3, 1, 'upload_reject', 'upload', '42', '/uploads/1763960837934-c5q3kwpkvh6.mp3', '2025-11-24 14:50:38.111', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (4, 1, 'upload_approve', 'upload', '39', '/uploads/1763960803272-e4150ixixo.jpg', '2025-11-25 13:24:53.713', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (5, 1, 'upload_approve', 'upload', '59', '/uploads/1764050475799-lsv11njjja.jpg', '2025-11-25 13:24:54.233', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (6, 1, 'upload_approve', 'upload', '58', '/uploads/1764050275455-5uqlwavr9g9.jpg', '2025-11-25 13:24:55.296', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (7, 1, 'upload_approve', 'upload', '52', '/uploads/1764049302277-pmuordrjbd.mp3', '2025-11-25 13:24:55.966', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (8, 1, 'upload_approve', 'upload', '51', '/uploads/1764049280359-bz0990tx60a.jpg', '2025-11-25 13:24:56.468', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (9, 1, 'upload_approve', 'upload', '40', '/uploads/1763960810785-6czw09ct843.jpg', '2025-11-25 13:24:56.942', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (10, 1, 'upload_approve', 'upload', '38', '/uploads/1763960803242-5o0ko7q90dr.jpg', '2025-11-25 13:24:57.35', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (11, 1, 'upload_approve', 'upload', '34', '/uploads/1763650758855-z62z2lk3z8b.jpg', '2025-11-25 13:24:57.787', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (12, 1, 'upload_approve', 'upload', '33', '/uploads/1763650758813-3emd1dburkn.jpg', '2025-11-25 13:24:58.285', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (13, 1, 'upload_approve', 'upload', '32', '/uploads/1763650743034-wcytb9d8ybd.mp3', '2025-11-25 13:24:59.481', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (14, 1, 'upload_approve', 'upload', '31', '/uploads/1763650739606-04ccir5kqrsx.ogg', '2025-11-25 13:25:00.309', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (15, 1, 'upload_approve', 'upload', '30', '/uploads/1763649529732-gol3w81e96f.ogg', '2025-11-25 13:25:00.703', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (16, 1, 'upload_approve', 'upload', '29', '/uploads/1763649523588-5mbknpcgjj8.ogg', '2025-11-25 13:25:01.1', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (17, 1, 'upload_approve', 'upload', '28', '/uploads/1763649487926-b9h06p4sok8.jpg', '2025-11-25 13:25:01.872', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (18, 1, 'upload_approve', 'upload', '27', '/uploads/1763649377726-oc1y2pgeyp.jpg', '2025-11-25 13:25:02.528', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (19, 1, 'upload_approve', 'upload', '26', '/uploads/1763649377695-c7tibm2mroq.png', '2025-11-25 13:25:02.892', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (20, 1, 'upload_approve', 'upload', '25', '/uploads/1763649377679-eksbyndd67v.png', '2025-11-25 13:25:03.507', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (21, 1, 'upload_approve', 'upload', '24', '/uploads/1763649333213-2h5meaxblpp.ogg', '2025-11-25 13:25:04.167', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (22, 1, 'upload_approve', 'upload', '23', '/uploads/1763649323098-4y8kw29gva5.mp3', '2025-11-25 13:25:04.793', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (23, 1, 'upload_approve', 'upload', '13', '/uploads/1763535506731-2t2wchpabdd.ogg', '2025-11-25 13:25:05.202', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (24, 1, 'upload_approve', 'upload', '11', '/uploads/1763289381287-09zgul5v5c89.jpg', '2025-11-25 13:25:05.888', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (25, 1, 'upload_approve', 'upload', '10', '/uploads/1763201624399-4z42t9z6g5s.png', '2025-11-25 13:25:06.283', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (26, 1, 'upload_approve', 'upload', '9', '/uploads/1763201621543-7zr5xoe91l5.jpg', '2025-11-25 13:25:06.684', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (27, 1, 'upload_approve', 'upload', '8', '/uploads/1763201616908-weti6mooy4s.jpg', '2025-11-25 13:25:07.061', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (28, 1, 'upload_approve', 'upload', '6', '/uploads/1763201005375-nrsviyeezzr.png', '2025-11-25 13:25:07.796', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (29, 1, 'post_delete', 'post', '测试测试喵', '测试测试喵', '2025-11-26 11:47:11.806', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (30, 1, 'comment_ban', 'comment', '8', 'until=2025-11-26T12:24:32.393Z; reason=测试一下封禁喵，忍一下', '2025-11-26 12:21:32.396', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (31, 1, 'comment_ban', 'comment', '8', 'until=2025-11-26T12:30:20.040Z; reason=测试一下封禁原因喵，你就忍忍吧', '2025-11-26 12:25:20.042', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (32, 1, 'comment_ban', 'comment', '8', 'until=2025-11-26T14:14:19.732Z; reason=', '2025-11-26 13:14:19.734', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (33, 1, 'comment_ban', 'comment', '8', 'until=2025-11-26T14:14:23.332Z; reason=', '2025-11-26 13:14:23.333', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (34, 1, 'user_ban', 'user', '2', 'until=2025-11-26T14:16:10.647Z; reason=', '2025-11-26 13:16:10.648', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (35, 1, 'user_unban', 'user', '2', NULL, '2025-11-26 13:16:15.123', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (36, 1, 'user_ban', 'user', '8', 'until=2025-11-26T13:20:34.709Z; reason=测试一下，辛苦啦！', '2025-11-26 13:18:34.71', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (37, 1, 'user_ban', 'user', '8', 'until=2025-11-26T14:23:45.536Z; reason=', '2025-11-26 13:23:45.537', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (38, 1, 'user_unban', 'user', '8', NULL, '2025-11-26 13:23:46.871', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (39, 1, 'user_ban', 'user', '8', 'until=2125-11-02T13:50:41.205Z; reason=再见了所有的MaruAya2x', '2025-11-26 13:50:41.207', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (40, 1, 'user_unban', 'user', '8', NULL, '2025-11-26 13:52:33.159', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (41, 1, 'user_ban', 'user', '8', 'until=2025-11-26T14:52:43.442Z; reason=异常行为', '2025-11-26 13:52:43.444', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (42, 1, 'user_unban', 'user', '8', NULL, '2025-11-26 13:53:07.651', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (43, 1, 'user_ban', 'user', '8', 'until=2125-11-02T14:08:19.280Z; permanent=1; reason=奉献一生吧！Maru', '2025-11-26 14:08:19.282', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (44, 1, 'user_unban', 'user', '8', NULL, '2025-11-26 14:09:21.9', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (45, 1, 'user_delete', 'user', '20', 'delete user 20', '2025-11-26 14:26:42.909', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (46, 1, 'update_site_settings', 'settings', NULL, '{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}', '2025-11-27 07:40:16.311', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (47, 1, 'update_site_settings', 'settings', NULL, '{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}', '2025-11-27 07:46:50.557', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (48, 1, 'update_site_settings', 'settings', NULL, '{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}', '2025-11-27 07:47:13.8', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (49, 1, 'update_site_settings', 'settings', NULL, '{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}', '2025-11-27 07:50:48.202', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (50, 1, 'update_site_settings', 'settings', NULL, '{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}', '2025-11-27 07:50:55.901', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (51, 1, 'update_site_settings', 'settings', NULL, '{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}', '2025-11-27 07:53:00.098', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (52, 1, 'update_site_settings', 'settings', NULL, '{"title":"MaruBlog","allowGuestComment":false,"allowRegistration":true}', '2025-11-27 07:53:29.259', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (53, 1, 'update_site_settings', 'settings', NULL, '{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}', '2025-11-27 07:53:50.394', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (54, 1, 'update_site_settings', 'settings', NULL, '{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":false}', '2025-11-27 07:53:51.982', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (55, 1, 'update_site_settings', 'settings', NULL, '{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}', '2025-11-27 07:54:29.97', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (56, 1, 'update_site_settings', 'settings', NULL, '{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":false}', '2025-11-27 07:54:32.604', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (57, 1, 'update_site_settings', 'settings', NULL, '{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}', '2025-11-27 07:55:02.611', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (58, 1, 'user_delete', 'user', '23', 'delete user 23', '2025-11-30 04:50:57.842', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (59, 1, 'user_delete', 'user', '22', 'delete user 22', '2025-11-30 04:51:01.309', NULL, NULL);
INSERT INTO public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) VALUES (60, 1, 'user_delete', 'user', '21', 'delete user 21', '2025-11-30 04:55:57.094', NULL, NULL);


--
-- Data for Name: AdminSession; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."AdminSession" (id, "userId", until) VALUES (1, 1, '2025-11-30 07:28:00.307');


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (1, '当然可以', '2025-11-14 03:15:57.292', 1, 1, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (2, '如果你愿意的话', '2025-11-14 04:49:16.636', 1, 1, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (3, '我觉得游戏这种东西还是算了吧', '2025-11-14 08:26:23.129', 1, NULL, '很明显我没登录');
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (4, '如果我是你的超级英雄~', '2025-11-14 09:58:49.208', 3, 3, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (5, '这是为什么呢？', '2025-11-14 10:16:49.256', 3, 5, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (6, '我喜欢你', '2025-11-14 10:17:05.738', 3, 5, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (7, '我是谁~', '2025-11-14 10:19:12.222', 3, 5, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (8, '那我问你', '2025-11-14 11:01:01.664', 1, 6, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (9, '我是你爹', '2025-11-14 11:01:10.272', 1, 6, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (10, '全世界我都可以放弃~', '2025-11-14 12:25:55.774', 3, 1, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (11, '我需要医疗兵！', '2025-11-14 12:26:11.881', 2, 1, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (12, '666还有打跑', '2025-11-14 12:42:26.013', 1, 7, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (13, '我觉得这是因为这玩意还没上线，你在切号自娱自乐罢了', '2025-11-14 12:49:07.924', 4, 1, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (14, '哇哇哇艾玛的脚！', '2025-11-14 14:10:53.891', 6, 1, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (15, 'woshinidie', '2025-11-14 14:16:05.791', 7, NULL, 'ffds');
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (16, '我喜欢你', '2025-11-14 14:28:28.847', 4, 8, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (17, '哇哇，直接秒狙了', '2025-11-14 14:28:53.864', 6, 8, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (18, '这标签还挺好', '2025-11-14 14:30:20.871', 7, 8, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (19, '那你就修吧', '2025-11-14 15:10:00.584', 8, 8, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (20, '那你就修吧', '2025-11-14 15:10:42.646', 8, 1, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (21, '这个好好笑哈哈', '2025-11-15 10:04:40.175', 9, 1, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (22, '嗯嗯，那还行。', '2025-11-15 10:14:19.937', 10, 1, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (23, '1.原来还要自己拼
2.梅露露很可爱
3.我只是试验一下有没有Markdown', '2025-11-15 10:17:59.064', 9, 1, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (24, '带吧，多带', '2025-11-15 10:21:16.882', 10, 8, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (25, '3', '2025-11-16 10:36:57.177', 11, 8, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (26, '333', '2025-11-16 10:37:09.89', 11, 8, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (27, '直接发没问题啊……那确实要修一阵子了', '2025-11-17 11:40:26.533', 14, 1, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (29, '做的好差！', '2025-11-19 07:03:58.731', 17, 1, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (30, '我了个ke-ta', '2025-11-24 06:31:12.568', 22, 16, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (31, '111', '2025-11-25 05:37:59.947', 17, 8, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (32, '为什么频率会高呢好难猜啊', '2025-11-25 05:38:21.872', 17, 8, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (33, '哇这个好可爱', '2025-11-26 12:24:32.785', 23, 8, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (34, '不错不错', '2025-11-26 13:52:52.682', 23, NULL, '匿名');
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (35, '我草我是访客', '2025-11-27 07:53:56.198', 23, NULL, '匿名');
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (36, '可爱捏', '2025-11-27 08:16:06.683', 23, 20, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (41, '抱歉喵', '2025-11-28 14:58:01.799', 24, 1, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (44, '看看会不会出错', '2025-11-29 08:10:30.33', 26, 1, NULL);
INSERT INTO public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") VALUES (45, 'jungle爱好者你赢了', '2025-11-30 04:41:59.225', 17, 8, NULL);


--
-- Data for Name: CommentBan; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Favorite; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Favorite" (id, "createdAt", "postId", "userId") VALUES (1, '2025-11-16 10:33:58.398', 10, 1);
INSERT INTO public."Favorite" (id, "createdAt", "postId", "userId") VALUES (2, '2025-11-16 10:53:44.719', 7, 8);
INSERT INTO public."Favorite" (id, "createdAt", "postId", "userId") VALUES (3, '2025-11-27 08:16:08.304', 23, 20);
INSERT INTO public."Favorite" (id, "createdAt", "postId", "userId") VALUES (5, '2025-11-27 14:23:19.521', 24, 1);


--
-- Data for Name: Like; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (1, '2025-11-14 12:31:40.818', 3, 1);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (2, '2025-11-14 12:31:42.066', 2, 1);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (3, '2025-11-14 13:32:18.982', 6, 1);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (4, '2025-11-14 14:31:22.734', 4, 8);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (5, '2025-11-14 14:55:30.304', 6, 8);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (6, '2025-11-15 10:04:12.663', 9, 8);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (7, '2025-11-15 10:04:42.287', 9, 1);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (8, '2025-11-16 10:37:20.697', 8, 8);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (9, '2025-11-16 10:54:34.17', 12, 8);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (10, '2025-11-17 08:03:46.242', 10, 1);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (11, '2025-11-17 08:18:09.77', 7, 1);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (12, '2025-11-17 08:18:28.355', 5, 1);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (13, '2025-11-19 07:04:01.941', 17, 1);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (14, '2025-11-19 08:39:39.687', 4, 1);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (15, '2025-11-20 14:39:58.542', 21, 1);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (16, '2025-11-24 06:45:32.173', 12, 1);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (18, '2025-11-25 05:34:46.351', 11, 8);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (19, '2025-11-27 08:16:07.822', 23, 20);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (22, '2025-11-27 14:22:58.311', 24, 1);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (28, '2025-11-27 14:26:14.997', 17, 8);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (29, '2025-11-27 14:26:28.387', 24, 8);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (30, '2025-11-27 14:27:07.939', 22, 8);
INSERT INTO public."Like" (id, "createdAt", "postId", "userId") VALUES (37, '2025-11-30 06:57:46.852', 26, 1);


--
-- Data for Name: LoginCode; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."LoginCode" (id, email, code, "createdAt") VALUES (20, '13376478644@16', '462669', '2025-11-30 06:01:11.731');


--
-- Data for Name: PageView; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (1, '/post/不知道该干什么发个音乐', '不知道该干什么发个音乐', '2025-11-27 08:15:29.89', NULL, 23, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (2, '/post/不知道该干什么发个音乐', '不知道该干什么发个音乐', '2025-11-27 08:15:43.885', NULL, 23, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (3, '/post/不知道该干什么发个音乐', '不知道该干什么发个音乐', '2025-11-27 08:16:02.691', 20, 23, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (4, '/post/修哭了才发现是next自己的问题qaq', '修哭了才发现是next自己的问题qaq', '2025-11-28 09:48:35.848', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (5, '/post/修哭了才发现是next自己的问题qaq', '修哭了才发现是next自己的问题qaq', '2025-11-28 09:48:35.849', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (6, '/post/代码测试', '代码测试', '2025-11-28 09:48:45.007', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (7, '/post/修哭了才发现是next自己的问题qaq', '修哭了才发现是next自己的问题qaq', '2025-11-28 09:48:57.22', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (8, '/post/welcome', 'welcome', '2025-11-28 09:49:07.361', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (9, '/post/更新一点op', '更新一点op', '2025-11-28 09:49:20.997', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (10, '/post/被要求过来试用上传图片了', '被要求过来试用上传图片了', '2025-11-28 09:49:32.356', 8, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (11, '/post/被要求过来试用上传图片了', '被要求过来试用上传图片了', '2025-11-28 09:49:32.378', 8, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (12, '/post/123123', '123123', '2025-11-28 09:51:38.41', 8, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (13, '/post/更新一点op', '更新一点op', '2025-11-28 10:03:46.909', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (14, '/post/更新一点op', '更新一点op', '2025-11-28 10:03:55.009', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (15, '/post/更新一点op', '更新一点op', '2025-11-28 10:04:00.932', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (16, '/post/123123', '123123', '2025-11-28 10:04:08.762', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (17, '/post/出现新的标签啦', '出现新的标签啦', '2025-11-28 11:12:35.725', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (18, '/post/出现新的标签啦', '出现新的标签啦', '2025-11-28 13:21:46.621', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (19, '/post/更新一点op', '更新一点op', '2025-11-28 14:57:17.462', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (20, '/post/更新一点op', '更新一点op', '2025-11-28 14:58:14.849', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (29, '/post/我只能', '我只能', '2025-11-29 08:10:36.914', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (30, '/post/我只能', '我只能', '2025-11-30 04:42:08.525', 8, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (31, '/post/我只能', '我只能', '2025-11-30 04:43:57.164', 8, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (21, '/post/1342', '1342', '2025-11-29 05:05:41.504', NULL, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (22, '/post/1342', '1342', '2025-11-29 06:22:38.797', NULL, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (23, '/post/1342', '1342', '2025-11-29 06:22:42.32', NULL, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (24, '/post/132412341234', '132412341234', '2025-11-29 06:23:09.301', NULL, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (25, '/post/更新一点op', '更新一点op', '2025-11-29 06:25:11.844', NULL, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (26, '/post/更新一点op', '更新一点op', '2025-11-29 06:25:11.895', NULL, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (27, '/post/1342', '1342', '2025-11-29 06:25:17.74', NULL, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (28, '/post/我只能', '我只能', '2025-11-29 08:04:48.097', NULL, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (32, '/post/我喜欢你', '我喜欢你', '2025-11-30 06:48:04.706', 24, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (33, '/post/我喜欢你', '我喜欢你', '2025-11-30 06:48:31.971', 24, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (34, '/post/我喜欢你', '我喜欢你', '2025-11-30 06:48:35.234', 24, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (35, '/post/更新一点op', '更新一点op', '2025-11-30 06:48:43.312', 24, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (36, '/post/发点美图测试', '发点美图测试', '2025-11-30 06:48:58.093', 24, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (37, '/post/发点美图测试', '发点美图测试', '2025-11-30 06:49:01.565', 24, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (38, '/post/被要求过来试用上传图片了', '被要求过来试用上传图片了', '2025-11-30 06:50:03.465', 24, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (39, '/post/123123', '123123', '2025-11-30 06:54:14.158', 24, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (40, '/post/修哭了才发现是next自己的问题qaq', '修哭了才发现是next自己的问题qaq', '2025-11-30 06:54:32.221', 8, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (41, '/post/welcome', 'welcome', '2025-11-30 06:54:39.396', 8, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (42, '/post/不知道该干什么发个音乐', '不知道该干什么发个音乐', '2025-11-30 06:54:53.305', 8, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (43, '/post/second', 'second', '2025-11-30 06:55:00.941', 8, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (44, '/post/我喜欢你', '我喜欢你', '2025-11-30 06:55:14.893', 8, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (45, '/post/我喜欢你', '我喜欢你', '2025-11-30 06:55:14.983', 8, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (46, '/post/测试一下上传音频', '测试一下上传音频', '2025-11-30 06:55:17.412', 8, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (47, '/post/修哭了才发现是next自己的问题qaq', '修哭了才发现是next自己的问题qaq', '2025-11-30 06:56:17.65', 8, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (48, '/post/我喜欢你', '我喜欢你', '2025-11-30 06:58:38.238', 1, NULL, '::1');
INSERT INTO public."PageView" (id, route, slug, at, "userId", "postId", ip) VALUES (49, '/post/修哭了才发现是next自己的问题qaq', '修哭了才发现是next自己的问题qaq', '2025-11-30 07:57:21.733', 8, NULL, '::1');


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (1, '测试', '测试', '谁有多余 api？', '有没有打炮的，寄两管意大利炮过来', '{科技}', '2025-11-13 11:00:52.434', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (2, '测试2', '测试2', '谁有多余家庭位置？', '嘿，拿好你的医箱', '{游戏}', '2025-11-13 11:03:11.118', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (3, '1', '你是海上的轮船', '11', '如果', '{}', '2025-11-14 08:51:56.861', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (4, '新人报道', '新人报道', '这个地方有什么能干的吗？', '我怎么感觉这地方怪冷清的', '{生活}', '2025-11-14 12:48:17.366', 'published', NULL, 8);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (5, '让我看看', '让我看看', NULL, '# H1 标题
## H2 标题
### H3 标题
#### H4 标题
##### H5 标题
###### H6 标题', '{}', '2025-11-14 13:05:22.67', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (6, '测试一下提供的所有markdown按钮', '测试一下提供的所有Markdown按钮', '测试测试一下吗', '**我喜欢你的冷态度**

_我的滑板鞋_

致敬传奇 `printf()` 最伟大的函数

```c
int main()
{
  return 0;
}
```
# H1
##### H5
- 无序1
- 无序2
- 无序3
1. 有序1
2. 有序2
3. 有序3

[这不是我的阿b链接吗](https://space.bilibili.com/165571665)

![这是我们魔审里最可爱的角色](https://img.moegirl.org.cn/common/c/ca/%E6%A8%B1%E7%BE%BD%E8%89%BE%E7%8E%9B.png)', '{}', '2025-11-14 13:26:11.896', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (7, '这是测试标签的', '这是测试标签的', '没啥好说的。', 'lololol', '{编程,音乐,绘画,科技,生活,闲谈,其他,原神}', '2025-11-14 13:45:01.837', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (8, '已经深夜了吗', '已经深夜了吗……', '纯粹发牢骚', '可我还在疯狂修代码……
# 骗你的，其实电脑快没电就去睡觉了', '{生活}', '2025-11-14 15:09:44.645', 'published', NULL, 8);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (9, '被要求过来试用上传图片了', '被要求过来试用上传图片了', NULL, '
![图片](/uploads/1763201005375-nrsviyeezzr.png)
', '{}', '2025-11-15 10:04:04.924', 'published', NULL, 8);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (10, '再试一下这个上传的', '再试一下这个上传的', NULL, '
![图片](/uploads/1763201616908-weti6mooy4s.jpg)

![图片](/uploads/1763201621543-7zr5xoe91l5.jpg)

![图片](/uploads/1763201624399-4z42t9z6g5s.png)
', '{}', '2025-11-15 10:14:03.564', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (11, '水水经验', '水水经验', '早日成为射命丸！', '**骗你的，经验要求太高不想当射命丸**
![图片](/uploads/1763289381287-09zgul5v5c89.jpg)
', '{}', '2025-11-16 10:36:45.894', 'published', NULL, 8);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (12, '测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要', '测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要', '测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要', '我喜欢你', '{}', '2025-11-16 10:45:06.611', 'published', NULL, 8);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (13, '我看看我的首页会不会保存草稿', '我看看我的首页会不会保存草稿', '我看看我的首页会不会保存草稿', '1111', '{}', '2025-11-17 11:24:23.397', 'draft', NULL, 8);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (14, '看看直接发呢', '看看直接发呢', '企鹅人', '12341234', '{}', '2025-11-17 11:40:00.271', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (15, '发个草稿试试', '发个草稿试试？', '111', '1234', '{}', '2025-11-17 11:53:26.18', 'draft', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (16, '最后测试定时发布', '最后测试定时发布！', '当然后面还要测试那个啦……', '123', '{}', '2025-11-17 12:57:04.342', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (18, '测试一下草稿', '测试一下草稿', NULL, '怎么草稿删了已发布的文章也会删掉啊……', '{}', '2025-11-19 08:29:04.035', 'draft', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (19, '代码测试', '代码测试？', '不变色啊……', '
```
#include<stdio.h>

int main()
{
  printf("helloworld!");
  return 0;
}
```

**要是这代码块也能变颜色就好了**', '{}', '2025-11-19 08:33:07.169', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (20, '123123', '123123', '123123123', '
<div className="card" data-audio>
  <div>🎵 我了个op啊.mp3</div>
  <audio controls src="/uploads/1763649323098-4y8kw29gva5.mp3" preload="none" style={{width:''100%''}} />
</div>

<div className="card" data-audio>
  <div>🎵 Little love.ogg</div>
  <audio controls src="/uploads/1763649333213-2h5meaxblpp.ogg" preload="none" style={{width:''100%''}} />
</div>

![图片](/uploads/1763649377679-eksbyndd67v.png)

![图片](/uploads/1763649377695-c7tibm2mroq.png)

![图片](/uploads/1763649377726-oc1y2pgeyp.jpg)
', '{}', '2025-11-20 14:36:23.389', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (17, '测试一下上传音频', '测试一下上上的传音频', NULL, '最近在写那个……羽管键琴相关的音乐，感觉这种乐器已经跟魔女绑定上来了wwww，明面上说是测试音频其实是想让大伙听听歌吗（
<div className="card" data-audio>
  <div>🎵 majocombat.ogg</div>
  <audio controls src="/uploads/1763535506731-2t2wchpabdd.ogg" preload="none" style={{width:''100%''}} />
</div>
', '{音乐}', '2025-11-19 06:59:16.317', 'published', NULL, 8);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (22, '发点美图测试', '发点美美的图测试！', '挖奥ke-ta太好看啦', '
<div className="card" data-audio>
  <div>🎵 Mischievians.ogg</div>
  <audio controls src="/uploads/1763650739606-04ccir5kqrsx.ogg" preload="none" style={{width:''100%''}} />
</div>

<div className="card" data-audio>
  <div>🎵 我了个op啊.mp3</div>
  <audio controls src="/uploads/1763650743034-wcytb9d8ybd.mp3" preload="none" style={{width:''100%''}} />
</div>

![图片](/uploads/1763650758813-3emd1dburkn.jpg)

![图片](/uploads/1763650758855-z62z2lk3z8b.jpg)

![图片](/uploads/1763650758875-on4gztde40s.jpg)
', '{}', '2025-11-20 14:59:43.759', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (23, '不知道该干什么发个音乐', '不知道干什么，发个音乐', '蹭经验来了吗', '
![图片](/uploads/1764049280359-bz0990tx60a.jpg)

<div className="card" data-audio>
  <div>🎵 SoftFlow02.mp3</div>
  <audio controls src="/uploads/1764049302277-pmuordrjbd.mp3" preload="none" style={{width:''100%''}} />
</div>

这首我觉得有感觉但是没啥编排……缺知识了应该是', '{}', '2025-11-25 05:42:03.27', 'published', NULL, 8);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (21, '修哭了才发现是next自己的问题qaq', '都修哭了才发现是NEXT自己的问题！QAQ', '我去你丫的', '
![图片](/uploads/1763649487926-b9h06p4sok8.jpg)

<div className="card" data-audio>
  <div>🎵 Shopping.ogg</div>
  <audio controls src="/uploads/1763649523588-5mbknpcgjj8.ogg" preload="none" style={{width:''100%''}} />
</div>
看看中间能不能插点字体
<div className="card" data-audio>
  <div>🎵 Shuffle.ogg</div>
  <audio controls src="/uploads/1763649529732-gol3w81e96f.ogg" preload="none" style={{width:''100%''}} />
</div>
', '{}', '2025-11-20 14:39:00.424', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (24, '更新一点op', '更新一点op！', '什么时候写完这首歌啊……', '
![图片](/uploads/1764242447320-r1kwofiw6d8.jpg)

<div className="card" data-audio>
  <div>🎵 我了个op啊.ogg</div>
  <audio controls src="/uploads/1764242460354-kemsaec7zrf.ogg" preload="none" style={{width:''100%''}} />
</div>


后面电吉他气笑了！不过还有机会去修缮这个问题……', '{}', '2025-11-27 11:21:13.195', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (26, '出现新的标签啦', '出现新的标签啦', '这个暂时不想分享', '因为还在划水中哈哈哈', '{写作}', '2025-11-28 11:12:34.846', 'published', NULL, 1);
INSERT INTO public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") VALUES (30, '我喜欢你', '我喜欢你', '我喜欢歌姬', '
![图片](/uploads/1764485270186-0vbodhcm4sqb.jpg)

<div className="card" data-audio>
  <div>🎵 soSad.mp3</div>
  <audio controls src="/uploads/1764485275643-qnz1i1zz7yj.mp3" preload="none" style={{width:''100%''}} />
</div>

我靠

<div className="card" data-audio>
  <div>🎵 神仙都嫌弃咱们屯.mp3</div>
  <audio controls src="/uploads/1764485279579-dk41uy4ibe.mp3" preload="none" style={{width:''100%''}} />
</div>
', '{音乐,绘画,写作}', '2025-11-30 06:48:04.18', 'published', NULL, 24);


--
-- Data for Name: RateLimit; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: SiteSettings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."SiteSettings" (id, title, subtitle, "seoDescription", announcement, "allowGuestComment", "allowRegistration") VALUES (1, 'MaruBlog', '畅所欲言！', '编程交流绘画交流音乐交流生活吹水', '目前站点还在完善，望海涵喵~！', true, true);


--
-- Data for Name: TagDef; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."TagDef" (id, name, color, bg, border, hidden) VALUES (1, '编程', '#b3f0c7', 'rgba(34,197,94,.12)', 'rgba(34,197,94,.35)', false);
INSERT INTO public."TagDef" (id, name, color, bg, border, hidden) VALUES (2, '音乐', '#ffc2cc', 'rgba(244,63,94,.12)', 'rgba(244,63,94,.35)', false);
INSERT INTO public."TagDef" (id, name, color, bg, border, hidden) VALUES (3, '绘画', '#ffe7a3', 'rgba(234,179,8,.12)', 'rgba(234,179,8,.35)', false);
INSERT INTO public."TagDef" (id, name, color, bg, border, hidden) VALUES (4, '科技', '#bfe1ff', 'rgba(59,130,246,.12)', 'rgba(59,130,246,.35)', false);
INSERT INTO public."TagDef" (id, name, color, bg, border, hidden) VALUES (5, '生活', '#ffbfdf', 'rgba(236,72,153,.12)', 'rgba(236,72,153,.35)', false);
INSERT INTO public."TagDef" (id, name, color, bg, border, hidden) VALUES (6, '闲谈', '#d7c8ff', 'rgba(139,92,246,.12)', 'rgba(139,92,246,.35)', false);
INSERT INTO public."TagDef" (id, name, color, bg, border, hidden) VALUES (7, '其他', '#d1d5db', 'rgba(107,114,128,.12)', 'rgba(107,114,128,.35)', false);
INSERT INTO public."TagDef" (id, name, color, bg, border, hidden) VALUES (8, '写作', '#bb7777', '#3a2c31', '#bb7777', false);


--
-- Data for Name: Upload; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (1, 4, 'AVATAR', '1763114801107-dkmmrn5cudi.jpg', '/uploads/1763114801107-dkmmrn5cudi.jpg', 'APPROVED', '2025-11-14 10:06:41.11', '2ed32104bf5722ed4aec4dc68e506817.jpg', 'image/jpeg', 436107);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (2, 1, 'AVATAR', '1763121234777-mgondlqjtks.jpg', '/uploads/1763121234777-mgondlqjtks.jpg', 'APPROVED', '2025-11-14 11:53:54.779', 'avatar.jpg', 'image/jpeg', 68536);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (3, 8, 'AVATAR', '1763124446237-bejtgt1atei.jpg', '/uploads/1763124446237-bejtgt1atei.jpg', 'APPROVED', '2025-11-14 12:47:26.238', 'avatar.jpg', 'image/jpeg', 67463);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (4, 8, 'OTHER', '1763201005375-nrsviyeezzr.png', '/uploads/1763201005375-nrsviyeezzr.png', 'APPROVED', '2025-11-15 10:03:25.377', 'ab4e85cb13d9b04fa9506f13be1a4f0c.png', 'image/png', 237050);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (5, 1, 'OTHER', '1763201616908-weti6mooy4s.jpg', '/uploads/1763201616908-weti6mooy4s.jpg', 'APPROVED', '2025-11-15 10:13:36.91', '24ad67c7995713f56b88b0b0e3d83645507565989.jpg', 'image/jpeg', 628920);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (6, 1, 'OTHER', '1763201621543-7zr5xoe91l5.jpg', '/uploads/1763201621543-7zr5xoe91l5.jpg', 'APPROVED', '2025-11-15 10:13:41.545', '2ed32104bf5722ed4aec4dc68e506817.jpg', 'image/jpeg', 436107);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (7, 1, 'OTHER', '1763201624399-4z42t9z6g5s.png', '/uploads/1763201624399-4z42t9z6g5s.png', 'APPROVED', '2025-11-15 10:13:44.4', 'ab4e85cb13d9b04fa9506f13be1a4f0c.png', 'image/png', 237050);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (8, 8, 'OTHER', '1763289381287-09zgul5v5c89.jpg', '/uploads/1763289381287-09zgul5v5c89.jpg', 'APPROVED', '2025-11-16 10:36:21.289', 'Tonic_Triangle封面.jpg', 'image/jpeg', 1505414);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (9, 8, 'OTHER', '1763535506731-2t2wchpabdd.ogg', '/uploads/1763535506731-2t2wchpabdd.ogg', 'APPROVED', '2025-11-19 06:58:26.733', 'majocombat.ogg', 'audio/ogg', 3786234);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (10, 1, 'OTHER', '1763649323098-4y8kw29gva5.mp3', '/uploads/1763649323098-4y8kw29gva5.mp3', 'APPROVED', '2025-11-20 14:35:23.1', '我了个op啊.mp3', 'audio/mpeg', 2190594);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (11, 1, 'OTHER', '1763649333213-2h5meaxblpp.ogg', '/uploads/1763649333213-2h5meaxblpp.ogg', 'APPROVED', '2025-11-20 14:35:33.216', 'Little love.ogg', 'audio/ogg', 2721207);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (12, 1, 'OTHER', '1763649377679-eksbyndd67v.png', '/uploads/1763649377679-eksbyndd67v.png', 'APPROVED', '2025-11-20 14:36:17.68', '6987c14b-4e5b-4020-9139-64d0df911683.png', 'image/png', 28663);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (13, 1, 'OTHER', '1763649377695-c7tibm2mroq.png', '/uploads/1763649377695-c7tibm2mroq.png', 'APPROVED', '2025-11-20 14:36:17.697', 'ab4e85cb13d9b04fa9506f13be1a4f0c.png', 'image/png', 237050);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (14, 1, 'OTHER', '1763649377726-oc1y2pgeyp.jpg', '/uploads/1763649377726-oc1y2pgeyp.jpg', 'APPROVED', '2025-11-20 14:36:17.728', 'base.jpg', 'image/jpeg', 513430);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (15, 1, 'OTHER', '1763649487926-b9h06p4sok8.jpg', '/uploads/1763649487926-b9h06p4sok8.jpg', 'APPROVED', '2025-11-20 14:38:07.928', '2ed32104bf5722ed4aec4dc68e506817.jpg', 'image/jpeg', 436107);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (16, 1, 'OTHER', '1763649523588-5mbknpcgjj8.ogg', '/uploads/1763649523588-5mbknpcgjj8.ogg', 'APPROVED', '2025-11-20 14:38:43.59', 'Shopping.ogg', 'audio/ogg', 1175117);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (17, 1, 'OTHER', '1763649529732-gol3w81e96f.ogg', '/uploads/1763649529732-gol3w81e96f.ogg', 'APPROVED', '2025-11-20 14:38:49.734', 'Shuffle.ogg', 'audio/ogg', 3342905);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (18, 1, 'OTHER', '1763650739606-04ccir5kqrsx.ogg', '/uploads/1763650739606-04ccir5kqrsx.ogg', 'APPROVED', '2025-11-20 14:58:59.608', 'Mischievians.ogg', 'audio/ogg', 1850311);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (19, 1, 'OTHER', '1763650743034-wcytb9d8ybd.mp3', '/uploads/1763650743034-wcytb9d8ybd.mp3', 'APPROVED', '2025-11-20 14:59:03.036', '我了个op啊.mp3', 'audio/mpeg', 2190594);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (20, 1, 'OTHER', '1763650758813-3emd1dburkn.jpg', '/uploads/1763650758813-3emd1dburkn.jpg', 'APPROVED', '2025-11-20 14:59:18.815', 'Konachan.com - 194216 2girls blonde_hair book bow breasts hat ke-ta kirisame_marisa long_hair patchouli_knowledge purple_eyes purple_hair scan shoujo_ai sleeping touhou.jpg', 'image/jpeg', 956515);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (21, 1, 'OTHER', '1763650758855-z62z2lk3z8b.jpg', '/uploads/1763650758855-z62z2lk3z8b.jpg', 'APPROVED', '2025-11-20 14:59:18.858', 'Konachan.com - 194217 bow brown_hair camera flowers hat ke-ta red_eyes scan shameimaru_aya short_hair touhou.jpg', 'image/jpeg', 971918);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (22, 8, 'OTHER', '1764049280359-bz0990tx60a.jpg', '/uploads/1764049280359-bz0990tx60a.jpg', 'APPROVED', '2025-11-25 05:41:20.361', 'Konachan.com - 316375 aqua_eyes aqua_hair bloomers blush cirno dress fairy fang moon night sky stairs tamafurin touhou wings.jpg', 'image/jpeg', 1538989);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (23, 8, 'OTHER', '1764049302277-pmuordrjbd.mp3', '/uploads/1764049302277-pmuordrjbd.mp3', 'APPROVED', '2025-11-25 05:41:42.279', 'SoftFlow02.mp3', 'audio/mpeg', 4305258);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (25, 8, 'WALLPAPER', '1764050475799-lsv11njjja.jpg', '/uploads/1764050475799-lsv11njjja.jpg', 'APPROVED', '2025-11-25 06:01:15.801', 'Konachan.com - 161636 bloomers bow brown_eyes brown_hair dress fairy ke-ta long_hair scan socks star_sapphire touhou wings.jpg', 'image/jpeg', 253490);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (29, 8, 'OTHER', '1764323606737-ppu946ae9zs.ogg', '/uploads/1764323606737-ppu946ae9zs.ogg', 'PENDING', '2025-11-28 09:53:26.739', 'maychr.ogg', 'audio/ogg', 441702);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (30, 8, 'OTHER', '1764323655653-m1cfj3fxmim.jpg', '/uploads/1764323655653-m1cfj3fxmim.jpg', 'PENDING', '2025-11-28 09:54:15.655', '24ad67c7995713f56b88b0b0e3d83645507565989.jpg', 'image/jpeg', 628920);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (31, 8, 'OTHER', '1764323678380-fvpay10ihfe.ogg', '/uploads/1764323678380-fvpay10ihfe.ogg', 'PENDING', '2025-11-28 09:54:38.383', 'Speculation.ogg', 'audio/ogg', 2915746);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (33, 8, 'OTHER', '1764324609622-6ouhsj09qbq.jpg', '/uploads/1764324609622-6ouhsj09qbq.jpg', 'PENDING', '2025-11-28 10:10:09.625', 'cutYoumu..jpg', 'image/jpeg', 383076);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (36, 1, 'WALLPAPER', '1764327107661-pfhfd26z3ug.jpg', '/uploads/1764327107661-pfhfd26z3ug.jpg', 'PENDING', '2025-11-28 10:51:47.665', 'street.jpg', 'image/jpeg', 280232);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (41, 24, 'AVATAR', '1764483124547-0y6bbkzsmign.jpg', '/uploads/1764483124547-0y6bbkzsmign.jpg', 'PENDING', '2025-11-30 06:12:04.551', 'avatar.jpg', 'image/jpeg', 32063);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (42, 24, 'AVATAR', '1764483134383-qteta9lvgdk.jpg', '/uploads/1764483134383-qteta9lvgdk.jpg', 'PENDING', '2025-11-30 06:12:14.386', 'avatar.jpg', 'image/jpeg', 85810);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (43, 24, 'AVATAR', '1764483329046-zywygy4kysc.jpg', '/uploads/1764483329046-zywygy4kysc.jpg', 'PENDING', '2025-11-30 06:15:29.049', 'avatar.jpg', 'image/jpeg', 35517);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (44, 24, 'AVATAR', '1764483769486-28tq7fvtjj9.jpg', '/uploads/1764483769486-28tq7fvtjj9.jpg', 'PENDING', '2025-11-30 06:22:49.489', 'avatar.jpg', 'image/jpeg', 36329);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (51, 24, 'AVATAR', '1764485216625-a79dpehere5.jpg', '/uploads/1764485216625-a79dpehere5.jpg', 'PENDING', '2025-11-30 06:46:56.628', 'avatar.jpg', 'image/jpeg', 36298);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (52, 24, 'OTHER', '1764485270186-0vbodhcm4sqb.jpg', '/uploads/1764485270186-0vbodhcm4sqb.jpg', 'PENDING', '2025-11-30 06:47:50.189', 'CVV@9(LOGD2V0POY{`@[OBG_tmb.jpg', 'image/jpeg', 258285);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (53, 24, 'OTHER', '1764485275643-qnz1i1zz7yj.mp3', '/uploads/1764485275643-qnz1i1zz7yj.mp3', 'PENDING', '2025-11-30 06:47:55.646', 'soSad.mp3', 'audio/mpeg', 1931041);
INSERT INTO public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) VALUES (54, 24, 'OTHER', '1764485279579-dk41uy4ibe.mp3', '/uploads/1764485279579-dk41uy4ibe.mp3', 'PENDING', '2025-11-30 06:47:59.583', '神仙都嫌弃咱们屯.mp3', 'audio/mpeg', 2838848);


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (2, NULL, '匿名用户5380', 'GUEST', '2025-11-13 10:57:27.104', NULL, NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (3, NULL, '我是假人1', 'GUEST', '2025-11-14 09:53:47.41', NULL, NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (4, NULL, '我是假人2', 'GUEST', '2025-11-14 09:59:10.941', '/uploads/1763114801107-dkmmrn5cudi.jpg', NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (5, NULL, NULL, 'GUEST', '2025-11-14 10:16:22.886', NULL, NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (6, NULL, 'marubot01', 'GUEST', '2025-11-14 11:00:32.193', NULL, NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (7, NULL, '13', 'GUEST', '2025-11-14 12:42:06.479', NULL, NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (9, NULL, '12412341234', 'GUEST', '2025-11-14 14:12:41.807', NULL, NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (10, NULL, '132412341234', 'GUEST', '2025-11-14 14:13:24.905', NULL, NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (11, NULL, '12412341234', 'GUEST', '2025-11-14 14:13:36.056', NULL, NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (12, NULL, NULL, 'AUTHOR', '2025-11-14 14:26:52.76', NULL, NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (13, '2947119343@gmail.com', NULL, 'AUTHOR', '2025-11-16 04:14:31.842', NULL, NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (14, 'a2947119343gmail.com', NULL, 'AUTHOR', '2025-11-23 14:58:35.177', NULL, NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (15, '114514@163.com', NULL, 'AUTHOR', '2025-11-23 15:00:05.797', NULL, NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (16, NULL, '匿名用户9203', 'GUEST', '2025-11-24 06:24:29.526', NULL, NULL, 0, '2025-11-24', 0, 0, '2025-11-24 06:31:12.566');
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (17, NULL, 'adsf123', 'GUEST', '2025-11-25 01:56:58.691', NULL, NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (18, NULL, '匿名用户1962', 'GUEST', '2025-11-25 05:29:37.509', NULL, NULL, 0, NULL, 0, 0, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (19, 'a294711943@gmail.com', NULL, 'AUTHOR', '2025-11-26 12:21:53.41', NULL, NULL, 50, '2025-11-26', 1, 50, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (20, NULL, '可爱呢', 'GUEST', '2025-11-27 08:15:59.503', NULL, NULL, 0, '2025-11-27', 0, 0, '2025-11-27 08:16:06.68');
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (24, '13376478644@163.com', 'MaruAya22', 'AUTHOR', '2025-11-30 06:11:18.336', '/uploads/1764485216625-a79dpehere5.jpg', 'MaruMaru~', 50, '2025-11-30', 1, 50, NULL);
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (1, '2947119343@qq.com', 'MaruAya20', 'ADMIN', '2025-11-13 10:57:11.682', '/uploads/1763121234777-mgondlqjtks.jpg', 'kiang', 0, '2025-11-17', 0, 0, '2025-11-29 08:10:30.33');
INSERT INTO public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") VALUES (8, 'a2947119343@gmail.com', 'MaruAya21', 'AUTHOR', '2025-11-14 12:46:44.401', '/uploads/1763124446237-bejtgt1atei.jpg', 'Kurobe Nonoka', 620, '2025-11-30', 0, 40, '2025-11-30 04:41:59.225');


--
-- Data for Name: UserBan; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: UserLikedAward; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (1, 1, '再试一下这个上传的');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (2, 1, '这是测试标签的');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (3, 1, '让我看看');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (4, 1, '测试');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (5, 1, '测试一下定时后发布会怎么样');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (6, 1, '测试一下上传音频');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (7, 1, '新人报道');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (8, 1, '测试点赞后删除');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (9, 1, '测试一下给自己点赞');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (10, 1, '修哭了才发现是next自己的问题qaq');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (11, 1, '测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (12, 8, '测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (13, 8, '测试一下上传音频');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (14, 8, '水水经验');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (15, 20, '不知道该干什么发个音乐');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (16, 1, '更新一点op');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (17, 8, '更新一点op');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (18, 8, '发点美图测试');
INSERT INTO public."UserLikedAward" (id, "userId", title) VALUES (23, 1, '出现新的标签啦');


--
-- Data for Name: UserPreference; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."UserPreference" (id, "userId", wallpaper, opacity, theme, "fontSize") VALUES (2, 8, '/uploads/1764050475799-lsv11njjja.jpg', 0.91, NULL, NULL);
INSERT INTO public."UserPreference" (id, "userId", wallpaper, opacity, theme, "fontSize") VALUES (1, 1, '/uploads/1764327107661-pfhfd26z3ug.jpg', 0.48, NULL, NULL);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('5f7bc48a-5057-445c-8f59-4f557bc0f3c5', 'd63ac1c8fa6ddf870ba244c4ce5ecd6ceb8c2a23fc5088d8b975d62724304c62', '2025-11-27 17:43:03.847446+08', '20251127094303_init_marublog', NULL, NULL, '2025-11-27 17:43:03.795529+08', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('02244ff4-0f55-4d14-85d9-e24879048e0f', '3bc1d88990d940c2a86d32aa876ef2550e7e73ae0f641ef5c44fe6e3471d4042', '2025-11-27 17:46:09.42863+08', '20251127094609_init_marublog', NULL, NULL, '2025-11-27 17:46:09.424981+08', 1);


--
-- Name: AdminLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."AdminLog_id_seq"', 60, true);


--
-- Name: AdminSession_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."AdminSession_id_seq"', 1, true);


--
-- Name: CommentBan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."CommentBan_id_seq"', 11, true);


--
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 45, true);


--
-- Name: Favorite_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Favorite_id_seq"', 8, true);


--
-- Name: Like_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Like_id_seq"', 37, true);


--
-- Name: LoginCode_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."LoginCode_id_seq"', 22, true);


--
-- Name: PageView_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PageView_id_seq"', 49, true);


--
-- Name: Post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Post_id_seq"', 30, true);


--
-- Name: RateLimit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."RateLimit_id_seq"', 1, false);


--
-- Name: TagDef_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."TagDef_id_seq"', 9, true);


--
-- Name: Upload_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Upload_id_seq"', 54, true);


--
-- Name: UserBan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."UserBan_id_seq"', 1, false);


--
-- Name: UserLikedAward_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."UserLikedAward_id_seq"', 23, true);


--
-- Name: UserPreference_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."UserPreference_id_seq"', 6, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."User_id_seq"', 24, true);


--
-- Name: AdminLog AdminLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AdminLog"
    ADD CONSTRAINT "AdminLog_pkey" PRIMARY KEY (id);


--
-- Name: AdminSession AdminSession_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AdminSession"
    ADD CONSTRAINT "AdminSession_pkey" PRIMARY KEY (id);


--
-- Name: CommentBan CommentBan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommentBan"
    ADD CONSTRAINT "CommentBan_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Favorite Favorite_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Favorite"
    ADD CONSTRAINT "Favorite_pkey" PRIMARY KEY (id);


--
-- Name: Like Like_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_pkey" PRIMARY KEY (id);


--
-- Name: LoginCode LoginCode_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LoginCode"
    ADD CONSTRAINT "LoginCode_pkey" PRIMARY KEY (id);


--
-- Name: PageView PageView_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PageView"
    ADD CONSTRAINT "PageView_pkey" PRIMARY KEY (id);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: RateLimit RateLimit_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RateLimit"
    ADD CONSTRAINT "RateLimit_pkey" PRIMARY KEY (id);


--
-- Name: SiteSettings SiteSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SiteSettings"
    ADD CONSTRAINT "SiteSettings_pkey" PRIMARY KEY (id);


--
-- Name: TagDef TagDef_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TagDef"
    ADD CONSTRAINT "TagDef_pkey" PRIMARY KEY (id);


--
-- Name: Upload Upload_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Upload"
    ADD CONSTRAINT "Upload_pkey" PRIMARY KEY (id);


--
-- Name: UserBan UserBan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserBan"
    ADD CONSTRAINT "UserBan_pkey" PRIMARY KEY (id);


--
-- Name: UserLikedAward UserLikedAward_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserLikedAward"
    ADD CONSTRAINT "UserLikedAward_pkey" PRIMARY KEY (id);


--
-- Name: UserPreference UserPreference_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserPreference"
    ADD CONSTRAINT "UserPreference_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Favorite_postId_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Favorite_postId_userId_key" ON public."Favorite" USING btree ("postId", "userId");


--
-- Name: Like_postId_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Like_postId_userId_key" ON public."Like" USING btree ("postId", "userId");


--
-- Name: LoginCode_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "LoginCode_email_key" ON public."LoginCode" USING btree (email);


--
-- Name: Post_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Post_slug_key" ON public."Post" USING btree (slug);


--
-- Name: RateLimit_ip_date_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "RateLimit_ip_date_key" ON public."RateLimit" USING btree (ip, date);


--
-- Name: TagDef_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TagDef_name_key" ON public."TagDef" USING btree (name);


--
-- Name: Upload_url_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Upload_url_key" ON public."Upload" USING btree (url);


--
-- Name: UserPreference_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "UserPreference_userId_key" ON public."UserPreference" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: AdminLog AdminLog_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AdminLog"
    ADD CONSTRAINT "AdminLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AdminSession AdminSession_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AdminSession"
    ADD CONSTRAINT "AdminSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CommentBan CommentBan_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommentBan"
    ADD CONSTRAINT "CommentBan_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Favorite Favorite_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Favorite"
    ADD CONSTRAINT "Favorite_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Favorite Favorite_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Favorite"
    ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Like Like_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Like Like_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PageView PageView_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PageView"
    ADD CONSTRAINT "PageView_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PageView PageView_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PageView"
    ADD CONSTRAINT "PageView_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Post Post_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Upload Upload_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Upload"
    ADD CONSTRAINT "Upload_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserBan UserBan_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserBan"
    ADD CONSTRAINT "UserBan_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserLikedAward UserLikedAward_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserLikedAward"
    ADD CONSTRAINT "UserLikedAward_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserPreference UserPreference_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserPreference"
    ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict 2TxeUnm8ESHb2hc1Jpx2Ib4lHC04tTWGw3RCXCvGhEj1n9oMuLkY1fq0O9quyyF

