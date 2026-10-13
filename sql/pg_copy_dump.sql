--
-- PostgreSQL database dump
--

\restrict 8DQDkznkQs4U8XAf7jDOC2fz3LiOH7K9yOgPdmBKRLGDOuiZvnLQlrQsnsk1vTO

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
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, name, role, "createdAt", avatar, signature, xp, "statsDate", "postsToday", "xpToday", "lastCommentAt") FROM stdin;
2	\N	匿名用户5380	GUEST	2025-11-13 10:57:27.104	\N	\N	0	\N	0	0	\N
3	\N	我是假人1	GUEST	2025-11-14 09:53:47.41	\N	\N	0	\N	0	0	\N
4	\N	我是假人2	GUEST	2025-11-14 09:59:10.941	/uploads/1763114801107-dkmmrn5cudi.jpg	\N	0	\N	0	0	\N
5	\N	\N	GUEST	2025-11-14 10:16:22.886	\N	\N	0	\N	0	0	\N
6	\N	marubot01	GUEST	2025-11-14 11:00:32.193	\N	\N	0	\N	0	0	\N
7	\N	13	GUEST	2025-11-14 12:42:06.479	\N	\N	0	\N	0	0	\N
9	\N	12412341234	GUEST	2025-11-14 14:12:41.807	\N	\N	0	\N	0	0	\N
10	\N	132412341234	GUEST	2025-11-14 14:13:24.905	\N	\N	0	\N	0	0	\N
11	\N	12412341234	GUEST	2025-11-14 14:13:36.056	\N	\N	0	\N	0	0	\N
12	\N	\N	AUTHOR	2025-11-14 14:26:52.76	\N	\N	0	\N	0	0	\N
13	2947119343@gmail.com	\N	AUTHOR	2025-11-16 04:14:31.842	\N	\N	0	\N	0	0	\N
14	a2947119343gmail.com	\N	AUTHOR	2025-11-23 14:58:35.177	\N	\N	0	\N	0	0	\N
15	114514@163.com	\N	AUTHOR	2025-11-23 15:00:05.797	\N	\N	0	\N	0	0	\N
16	\N	匿名用户9203	GUEST	2025-11-24 06:24:29.526	\N	\N	0	2025-11-24	0	0	2025-11-24 06:31:12.566
17	\N	adsf123	GUEST	2025-11-25 01:56:58.691	\N	\N	0	\N	0	0	\N
18	\N	匿名用户1962	GUEST	2025-11-25 05:29:37.509	\N	\N	0	\N	0	0	\N
19	a294711943@gmail.com	\N	AUTHOR	2025-11-26 12:21:53.41	\N	\N	50	2025-11-26	1	50	\N
20	\N	可爱呢	GUEST	2025-11-27 08:15:59.503	\N	\N	0	2025-11-27	0	0	2025-11-27 08:16:06.68
24	13376478644@163.com	MaruAya22	AUTHOR	2025-11-30 06:11:18.336	/uploads/1764485216625-a79dpehere5.jpg	MaruMaru~	50	2025-11-30	1	50	\N
1	2947119343@qq.com	MaruAya20	ADMIN	2025-11-13 10:57:11.682	/uploads/1763121234777-mgondlqjtks.jpg	kiang	0	2025-11-17	0	0	2025-11-29 08:10:30.33
8	a2947119343@gmail.com	MaruAya21	AUTHOR	2025-11-14 12:46:44.401	/uploads/1763124446237-bejtgt1atei.jpg	Kurobe Nonoka	620	2025-11-30	0	40	2025-11-30 04:41:59.225
\.


--
-- Data for Name: AdminLog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AdminLog" (id, "adminId", action, "targetType", "targetId", detail, "createdAt", ip, ua) FROM stdin;
1	1	upload_reject	upload	41	/uploads/1763960824268-r9f39wkjex.ogg	2025-11-24 14:35:34.479	\N	\N
2	1	upload_reject	upload	35	/uploads/1763650758875-on4gztde40s.jpg	2025-11-24 14:35:37.135	\N	\N
3	1	upload_reject	upload	42	/uploads/1763960837934-c5q3kwpkvh6.mp3	2025-11-24 14:50:38.111	\N	\N
4	1	upload_approve	upload	39	/uploads/1763960803272-e4150ixixo.jpg	2025-11-25 13:24:53.713	\N	\N
5	1	upload_approve	upload	59	/uploads/1764050475799-lsv11njjja.jpg	2025-11-25 13:24:54.233	\N	\N
6	1	upload_approve	upload	58	/uploads/1764050275455-5uqlwavr9g9.jpg	2025-11-25 13:24:55.296	\N	\N
7	1	upload_approve	upload	52	/uploads/1764049302277-pmuordrjbd.mp3	2025-11-25 13:24:55.966	\N	\N
8	1	upload_approve	upload	51	/uploads/1764049280359-bz0990tx60a.jpg	2025-11-25 13:24:56.468	\N	\N
9	1	upload_approve	upload	40	/uploads/1763960810785-6czw09ct843.jpg	2025-11-25 13:24:56.942	\N	\N
10	1	upload_approve	upload	38	/uploads/1763960803242-5o0ko7q90dr.jpg	2025-11-25 13:24:57.35	\N	\N
11	1	upload_approve	upload	34	/uploads/1763650758855-z62z2lk3z8b.jpg	2025-11-25 13:24:57.787	\N	\N
12	1	upload_approve	upload	33	/uploads/1763650758813-3emd1dburkn.jpg	2025-11-25 13:24:58.285	\N	\N
13	1	upload_approve	upload	32	/uploads/1763650743034-wcytb9d8ybd.mp3	2025-11-25 13:24:59.481	\N	\N
14	1	upload_approve	upload	31	/uploads/1763650739606-04ccir5kqrsx.ogg	2025-11-25 13:25:00.309	\N	\N
15	1	upload_approve	upload	30	/uploads/1763649529732-gol3w81e96f.ogg	2025-11-25 13:25:00.703	\N	\N
16	1	upload_approve	upload	29	/uploads/1763649523588-5mbknpcgjj8.ogg	2025-11-25 13:25:01.1	\N	\N
17	1	upload_approve	upload	28	/uploads/1763649487926-b9h06p4sok8.jpg	2025-11-25 13:25:01.872	\N	\N
18	1	upload_approve	upload	27	/uploads/1763649377726-oc1y2pgeyp.jpg	2025-11-25 13:25:02.528	\N	\N
19	1	upload_approve	upload	26	/uploads/1763649377695-c7tibm2mroq.png	2025-11-25 13:25:02.892	\N	\N
20	1	upload_approve	upload	25	/uploads/1763649377679-eksbyndd67v.png	2025-11-25 13:25:03.507	\N	\N
21	1	upload_approve	upload	24	/uploads/1763649333213-2h5meaxblpp.ogg	2025-11-25 13:25:04.167	\N	\N
22	1	upload_approve	upload	23	/uploads/1763649323098-4y8kw29gva5.mp3	2025-11-25 13:25:04.793	\N	\N
23	1	upload_approve	upload	13	/uploads/1763535506731-2t2wchpabdd.ogg	2025-11-25 13:25:05.202	\N	\N
24	1	upload_approve	upload	11	/uploads/1763289381287-09zgul5v5c89.jpg	2025-11-25 13:25:05.888	\N	\N
25	1	upload_approve	upload	10	/uploads/1763201624399-4z42t9z6g5s.png	2025-11-25 13:25:06.283	\N	\N
26	1	upload_approve	upload	9	/uploads/1763201621543-7zr5xoe91l5.jpg	2025-11-25 13:25:06.684	\N	\N
27	1	upload_approve	upload	8	/uploads/1763201616908-weti6mooy4s.jpg	2025-11-25 13:25:07.061	\N	\N
28	1	upload_approve	upload	6	/uploads/1763201005375-nrsviyeezzr.png	2025-11-25 13:25:07.796	\N	\N
29	1	post_delete	post	测试测试喵	测试测试喵	2025-11-26 11:47:11.806	\N	\N
30	1	comment_ban	comment	8	until=2025-11-26T12:24:32.393Z; reason=测试一下封禁喵，忍一下	2025-11-26 12:21:32.396	\N	\N
31	1	comment_ban	comment	8	until=2025-11-26T12:30:20.040Z; reason=测试一下封禁原因喵，你就忍忍吧	2025-11-26 12:25:20.042	\N	\N
32	1	comment_ban	comment	8	until=2025-11-26T14:14:19.732Z; reason=	2025-11-26 13:14:19.734	\N	\N
33	1	comment_ban	comment	8	until=2025-11-26T14:14:23.332Z; reason=	2025-11-26 13:14:23.333	\N	\N
34	1	user_ban	user	2	until=2025-11-26T14:16:10.647Z; reason=	2025-11-26 13:16:10.648	\N	\N
35	1	user_unban	user	2	\N	2025-11-26 13:16:15.123	\N	\N
36	1	user_ban	user	8	until=2025-11-26T13:20:34.709Z; reason=测试一下，辛苦啦！	2025-11-26 13:18:34.71	\N	\N
37	1	user_ban	user	8	until=2025-11-26T14:23:45.536Z; reason=	2025-11-26 13:23:45.537	\N	\N
38	1	user_unban	user	8	\N	2025-11-26 13:23:46.871	\N	\N
39	1	user_ban	user	8	until=2125-11-02T13:50:41.205Z; reason=再见了所有的MaruAya2x	2025-11-26 13:50:41.207	\N	\N
40	1	user_unban	user	8	\N	2025-11-26 13:52:33.159	\N	\N
41	1	user_ban	user	8	until=2025-11-26T14:52:43.442Z; reason=异常行为	2025-11-26 13:52:43.444	\N	\N
42	1	user_unban	user	8	\N	2025-11-26 13:53:07.651	\N	\N
43	1	user_ban	user	8	until=2125-11-02T14:08:19.280Z; permanent=1; reason=奉献一生吧！Maru	2025-11-26 14:08:19.282	\N	\N
44	1	user_unban	user	8	\N	2025-11-26 14:09:21.9	\N	\N
45	1	user_delete	user	20	delete user 20	2025-11-26 14:26:42.909	\N	\N
46	1	update_site_settings	settings	\N	{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}	2025-11-27 07:40:16.311	\N	\N
47	1	update_site_settings	settings	\N	{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}	2025-11-27 07:46:50.557	\N	\N
48	1	update_site_settings	settings	\N	{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}	2025-11-27 07:47:13.8	\N	\N
49	1	update_site_settings	settings	\N	{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}	2025-11-27 07:50:48.202	\N	\N
50	1	update_site_settings	settings	\N	{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}	2025-11-27 07:50:55.901	\N	\N
51	1	update_site_settings	settings	\N	{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}	2025-11-27 07:53:00.098	\N	\N
52	1	update_site_settings	settings	\N	{"title":"MaruBlog","allowGuestComment":false,"allowRegistration":true}	2025-11-27 07:53:29.259	\N	\N
53	1	update_site_settings	settings	\N	{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}	2025-11-27 07:53:50.394	\N	\N
54	1	update_site_settings	settings	\N	{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":false}	2025-11-27 07:53:51.982	\N	\N
55	1	update_site_settings	settings	\N	{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}	2025-11-27 07:54:29.97	\N	\N
56	1	update_site_settings	settings	\N	{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":false}	2025-11-27 07:54:32.604	\N	\N
57	1	update_site_settings	settings	\N	{"title":"MaruBlog","allowGuestComment":true,"allowRegistration":true}	2025-11-27 07:55:02.611	\N	\N
58	1	user_delete	user	23	delete user 23	2025-11-30 04:50:57.842	\N	\N
59	1	user_delete	user	22	delete user 22	2025-11-30 04:51:01.309	\N	\N
60	1	user_delete	user	21	delete user 21	2025-11-30 04:55:57.094	\N	\N
\.


--
-- Data for Name: AdminSession; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AdminSession" (id, "userId", until) FROM stdin;
1	1	2025-11-30 07:28:00.307
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Post" (id, slug, title, excerpt, content, tags, "publishedAt", status, "scheduledAt", "authorId") FROM stdin;
1	测试	测试	谁有多余 api？	有没有打炮的，寄两管意大利炮过来	{科技}	2025-11-13 11:00:52.434	published	\N	1
2	测试2	测试2	谁有多余家庭位置？	嘿，拿好你的医箱	{游戏}	2025-11-13 11:03:11.118	published	\N	1
3	1	你是海上的轮船	11	如果	{}	2025-11-14 08:51:56.861	published	\N	1
4	新人报道	新人报道	这个地方有什么能干的吗？	我怎么感觉这地方怪冷清的	{生活}	2025-11-14 12:48:17.366	published	\N	8
5	让我看看	让我看看	\N	# H1 标题\n## H2 标题\n### H3 标题\n#### H4 标题\n##### H5 标题\n###### H6 标题	{}	2025-11-14 13:05:22.67	published	\N	1
6	测试一下提供的所有markdown按钮	测试一下提供的所有Markdown按钮	测试测试一下吗	**我喜欢你的冷态度**\n\n_我的滑板鞋_\n\n致敬传奇 `printf()` 最伟大的函数\n\n```c\nint main()\n{\n  return 0;\n}\n```\n# H1\n##### H5\n- 无序1\n- 无序2\n- 无序3\n1. 有序1\n2. 有序2\n3. 有序3\n\n[这不是我的阿b链接吗](https://space.bilibili.com/165571665)\n\n![这是我们魔审里最可爱的角色](https://img.moegirl.org.cn/common/c/ca/%E6%A8%B1%E7%BE%BD%E8%89%BE%E7%8E%9B.png)	{}	2025-11-14 13:26:11.896	published	\N	1
7	这是测试标签的	这是测试标签的	没啥好说的。	lololol	{编程,音乐,绘画,科技,生活,闲谈,其他,原神}	2025-11-14 13:45:01.837	published	\N	1
8	已经深夜了吗	已经深夜了吗……	纯粹发牢骚	可我还在疯狂修代码……\n# 骗你的，其实电脑快没电就去睡觉了	{生活}	2025-11-14 15:09:44.645	published	\N	8
9	被要求过来试用上传图片了	被要求过来试用上传图片了	\N	\n![图片](/uploads/1763201005375-nrsviyeezzr.png)\n	{}	2025-11-15 10:04:04.924	published	\N	8
10	再试一下这个上传的	再试一下这个上传的	\N	\n![图片](/uploads/1763201616908-weti6mooy4s.jpg)\n\n![图片](/uploads/1763201621543-7zr5xoe91l5.jpg)\n\n![图片](/uploads/1763201624399-4z42t9z6g5s.png)\n	{}	2025-11-15 10:14:03.564	published	\N	1
11	水水经验	水水经验	早日成为射命丸！	**骗你的，经验要求太高不想当射命丸**\n![图片](/uploads/1763289381287-09zgul5v5c89.jpg)\n	{}	2025-11-16 10:36:45.894	published	\N	8
12	测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要	测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要	测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要	我喜欢你	{}	2025-11-16 10:45:06.611	published	\N	8
13	我看看我的首页会不会保存草稿	我看看我的首页会不会保存草稿	我看看我的首页会不会保存草稿	1111	{}	2025-11-17 11:24:23.397	draft	\N	8
14	看看直接发呢	看看直接发呢	企鹅人	12341234	{}	2025-11-17 11:40:00.271	published	\N	1
15	发个草稿试试	发个草稿试试？	111	1234	{}	2025-11-17 11:53:26.18	draft	\N	1
16	最后测试定时发布	最后测试定时发布！	当然后面还要测试那个啦……	123	{}	2025-11-17 12:57:04.342	published	\N	1
18	测试一下草稿	测试一下草稿	\N	怎么草稿删了已发布的文章也会删掉啊……	{}	2025-11-19 08:29:04.035	draft	\N	1
19	代码测试	代码测试？	不变色啊……	\n```\n#include<stdio.h>\n\nint main()\n{\n  printf("helloworld!");\n  return 0;\n}\n```\n\n**要是这代码块也能变颜色就好了**	{}	2025-11-19 08:33:07.169	published	\N	1
20	123123	123123	123123123	\n<div className="card" data-audio>\n  <div>🎵 我了个op啊.mp3</div>\n  <audio controls src="/uploads/1763649323098-4y8kw29gva5.mp3" preload="none" style={{width:'100%'}} />\n</div>\n\n<div className="card" data-audio>\n  <div>🎵 Little love.ogg</div>\n  <audio controls src="/uploads/1763649333213-2h5meaxblpp.ogg" preload="none" style={{width:'100%'}} />\n</div>\n\n![图片](/uploads/1763649377679-eksbyndd67v.png)\n\n![图片](/uploads/1763649377695-c7tibm2mroq.png)\n\n![图片](/uploads/1763649377726-oc1y2pgeyp.jpg)\n	{}	2025-11-20 14:36:23.389	published	\N	1
17	测试一下上传音频	测试一下上上的传音频	\N	最近在写那个……羽管键琴相关的音乐，感觉这种乐器已经跟魔女绑定上来了wwww，明面上说是测试音频其实是想让大伙听听歌吗（\n<div className="card" data-audio>\n  <div>🎵 majocombat.ogg</div>\n  <audio controls src="/uploads/1763535506731-2t2wchpabdd.ogg" preload="none" style={{width:'100%'}} />\n</div>\n	{音乐}	2025-11-19 06:59:16.317	published	\N	8
22	发点美图测试	发点美美的图测试！	挖奥ke-ta太好看啦	\n<div className="card" data-audio>\n  <div>🎵 Mischievians.ogg</div>\n  <audio controls src="/uploads/1763650739606-04ccir5kqrsx.ogg" preload="none" style={{width:'100%'}} />\n</div>\n\n<div className="card" data-audio>\n  <div>🎵 我了个op啊.mp3</div>\n  <audio controls src="/uploads/1763650743034-wcytb9d8ybd.mp3" preload="none" style={{width:'100%'}} />\n</div>\n\n![图片](/uploads/1763650758813-3emd1dburkn.jpg)\n\n![图片](/uploads/1763650758855-z62z2lk3z8b.jpg)\n\n![图片](/uploads/1763650758875-on4gztde40s.jpg)\n	{}	2025-11-20 14:59:43.759	published	\N	1
23	不知道该干什么发个音乐	不知道干什么，发个音乐	蹭经验来了吗	\n![图片](/uploads/1764049280359-bz0990tx60a.jpg)\n\n<div className="card" data-audio>\n  <div>🎵 SoftFlow02.mp3</div>\n  <audio controls src="/uploads/1764049302277-pmuordrjbd.mp3" preload="none" style={{width:'100%'}} />\n</div>\n\n这首我觉得有感觉但是没啥编排……缺知识了应该是	{}	2025-11-25 05:42:03.27	published	\N	8
21	修哭了才发现是next自己的问题qaq	都修哭了才发现是NEXT自己的问题！QAQ	我去你丫的	\n![图片](/uploads/1763649487926-b9h06p4sok8.jpg)\n\n<div className="card" data-audio>\n  <div>🎵 Shopping.ogg</div>\n  <audio controls src="/uploads/1763649523588-5mbknpcgjj8.ogg" preload="none" style={{width:'100%'}} />\n</div>\n看看中间能不能插点字体\n<div className="card" data-audio>\n  <div>🎵 Shuffle.ogg</div>\n  <audio controls src="/uploads/1763649529732-gol3w81e96f.ogg" preload="none" style={{width:'100%'}} />\n</div>\n	{}	2025-11-20 14:39:00.424	published	\N	1
24	更新一点op	更新一点op！	什么时候写完这首歌啊……	\n![图片](/uploads/1764242447320-r1kwofiw6d8.jpg)\n\n<div className="card" data-audio>\n  <div>🎵 我了个op啊.ogg</div>\n  <audio controls src="/uploads/1764242460354-kemsaec7zrf.ogg" preload="none" style={{width:'100%'}} />\n</div>\n\n\n后面电吉他气笑了！不过还有机会去修缮这个问题……	{}	2025-11-27 11:21:13.195	published	\N	1
26	出现新的标签啦	出现新的标签啦	这个暂时不想分享	因为还在划水中哈哈哈	{写作}	2025-11-28 11:12:34.846	published	\N	1
30	我喜欢你	我喜欢你	我喜欢歌姬	\n![图片](/uploads/1764485270186-0vbodhcm4sqb.jpg)\n\n<div className="card" data-audio>\n  <div>🎵 soSad.mp3</div>\n  <audio controls src="/uploads/1764485275643-qnz1i1zz7yj.mp3" preload="none" style={{width:'100%'}} />\n</div>\n\n我靠\n\n<div className="card" data-audio>\n  <div>🎵 神仙都嫌弃咱们屯.mp3</div>\n  <audio controls src="/uploads/1764485279579-dk41uy4ibe.mp3" preload="none" style={{width:'100%'}} />\n</div>\n	{音乐,绘画,写作}	2025-11-30 06:48:04.18	published	\N	24
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Comment" (id, content, "createdAt", "postId", "userId", "guestName") FROM stdin;
1	当然可以	2025-11-14 03:15:57.292	1	1	\N
2	如果你愿意的话	2025-11-14 04:49:16.636	1	1	\N
3	我觉得游戏这种东西还是算了吧	2025-11-14 08:26:23.129	1	\N	很明显我没登录
4	如果我是你的超级英雄~	2025-11-14 09:58:49.208	3	3	\N
5	这是为什么呢？	2025-11-14 10:16:49.256	3	5	\N
6	我喜欢你	2025-11-14 10:17:05.738	3	5	\N
7	我是谁~	2025-11-14 10:19:12.222	3	5	\N
8	那我问你	2025-11-14 11:01:01.664	1	6	\N
9	我是你爹	2025-11-14 11:01:10.272	1	6	\N
10	全世界我都可以放弃~	2025-11-14 12:25:55.774	3	1	\N
11	我需要医疗兵！	2025-11-14 12:26:11.881	2	1	\N
12	666还有打跑	2025-11-14 12:42:26.013	1	7	\N
13	我觉得这是因为这玩意还没上线，你在切号自娱自乐罢了	2025-11-14 12:49:07.924	4	1	\N
14	哇哇哇艾玛的脚！	2025-11-14 14:10:53.891	6	1	\N
15	woshinidie	2025-11-14 14:16:05.791	7	\N	ffds
16	我喜欢你	2025-11-14 14:28:28.847	4	8	\N
17	哇哇，直接秒狙了	2025-11-14 14:28:53.864	6	8	\N
18	这标签还挺好	2025-11-14 14:30:20.871	7	8	\N
19	那你就修吧	2025-11-14 15:10:00.584	8	8	\N
20	那你就修吧	2025-11-14 15:10:42.646	8	1	\N
21	这个好好笑哈哈	2025-11-15 10:04:40.175	9	1	\N
22	嗯嗯，那还行。	2025-11-15 10:14:19.937	10	1	\N
23	1.原来还要自己拼\n2.梅露露很可爱\n3.我只是试验一下有没有Markdown	2025-11-15 10:17:59.064	9	1	\N
24	带吧，多带	2025-11-15 10:21:16.882	10	8	\N
25	3	2025-11-16 10:36:57.177	11	8	\N
26	333	2025-11-16 10:37:09.89	11	8	\N
27	直接发没问题啊……那确实要修一阵子了	2025-11-17 11:40:26.533	14	1	\N
29	做的好差！	2025-11-19 07:03:58.731	17	1	\N
30	我了个ke-ta	2025-11-24 06:31:12.568	22	16	\N
31	111	2025-11-25 05:37:59.947	17	8	\N
32	为什么频率会高呢好难猜啊	2025-11-25 05:38:21.872	17	8	\N
33	哇这个好可爱	2025-11-26 12:24:32.785	23	8	\N
34	不错不错	2025-11-26 13:52:52.682	23	\N	匿名
35	我草我是访客	2025-11-27 07:53:56.198	23	\N	匿名
36	可爱捏	2025-11-27 08:16:06.683	23	20	\N
41	抱歉喵	2025-11-28 14:58:01.799	24	1	\N
44	看看会不会出错	2025-11-29 08:10:30.33	26	1	\N
45	jungle爱好者你赢了	2025-11-30 04:41:59.225	17	8	\N
\.


--
-- Data for Name: CommentBan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CommentBan" (id, "userId", ip, until, reason, "createdAt") FROM stdin;
\.


--
-- Data for Name: Favorite; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Favorite" (id, "createdAt", "postId", "userId") FROM stdin;
1	2025-11-16 10:33:58.398	10	1
2	2025-11-16 10:53:44.719	7	8
3	2025-11-27 08:16:08.304	23	20
5	2025-11-27 14:23:19.521	24	1
\.


--
-- Data for Name: Like; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Like" (id, "createdAt", "postId", "userId") FROM stdin;
1	2025-11-14 12:31:40.818	3	1
2	2025-11-14 12:31:42.066	2	1
3	2025-11-14 13:32:18.982	6	1
4	2025-11-14 14:31:22.734	4	8
5	2025-11-14 14:55:30.304	6	8
6	2025-11-15 10:04:12.663	9	8
7	2025-11-15 10:04:42.287	9	1
8	2025-11-16 10:37:20.697	8	8
9	2025-11-16 10:54:34.17	12	8
10	2025-11-17 08:03:46.242	10	1
11	2025-11-17 08:18:09.77	7	1
12	2025-11-17 08:18:28.355	5	1
13	2025-11-19 07:04:01.941	17	1
14	2025-11-19 08:39:39.687	4	1
15	2025-11-20 14:39:58.542	21	1
16	2025-11-24 06:45:32.173	12	1
18	2025-11-25 05:34:46.351	11	8
19	2025-11-27 08:16:07.822	23	20
22	2025-11-27 14:22:58.311	24	1
28	2025-11-27 14:26:14.997	17	8
29	2025-11-27 14:26:28.387	24	8
30	2025-11-27 14:27:07.939	22	8
37	2025-11-30 06:57:46.852	26	1
\.


--
-- Data for Name: LoginCode; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LoginCode" (id, email, code, "createdAt") FROM stdin;
20	13376478644@16	462669	2025-11-30 06:01:11.731
\.


--
-- Data for Name: PageView; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PageView" (id, route, slug, at, "userId", "postId", ip) FROM stdin;
1	/post/不知道该干什么发个音乐	不知道该干什么发个音乐	2025-11-27 08:15:29.89	\N	23	::1
2	/post/不知道该干什么发个音乐	不知道该干什么发个音乐	2025-11-27 08:15:43.885	\N	23	::1
3	/post/不知道该干什么发个音乐	不知道该干什么发个音乐	2025-11-27 08:16:02.691	20	23	::1
4	/post/修哭了才发现是next自己的问题qaq	修哭了才发现是next自己的问题qaq	2025-11-28 09:48:35.848	1	\N	::1
5	/post/修哭了才发现是next自己的问题qaq	修哭了才发现是next自己的问题qaq	2025-11-28 09:48:35.849	1	\N	::1
6	/post/代码测试	代码测试	2025-11-28 09:48:45.007	1	\N	::1
7	/post/修哭了才发现是next自己的问题qaq	修哭了才发现是next自己的问题qaq	2025-11-28 09:48:57.22	1	\N	::1
8	/post/welcome	welcome	2025-11-28 09:49:07.361	1	\N	::1
9	/post/更新一点op	更新一点op	2025-11-28 09:49:20.997	1	\N	::1
10	/post/被要求过来试用上传图片了	被要求过来试用上传图片了	2025-11-28 09:49:32.356	8	\N	::1
11	/post/被要求过来试用上传图片了	被要求过来试用上传图片了	2025-11-28 09:49:32.378	8	\N	::1
12	/post/123123	123123	2025-11-28 09:51:38.41	8	\N	::1
13	/post/更新一点op	更新一点op	2025-11-28 10:03:46.909	1	\N	::1
14	/post/更新一点op	更新一点op	2025-11-28 10:03:55.009	1	\N	::1
15	/post/更新一点op	更新一点op	2025-11-28 10:04:00.932	1	\N	::1
16	/post/123123	123123	2025-11-28 10:04:08.762	1	\N	::1
17	/post/出现新的标签啦	出现新的标签啦	2025-11-28 11:12:35.725	1	\N	::1
18	/post/出现新的标签啦	出现新的标签啦	2025-11-28 13:21:46.621	1	\N	::1
19	/post/更新一点op	更新一点op	2025-11-28 14:57:17.462	1	\N	::1
20	/post/更新一点op	更新一点op	2025-11-28 14:58:14.849	1	\N	::1
29	/post/我只能	我只能	2025-11-29 08:10:36.914	1	\N	::1
30	/post/我只能	我只能	2025-11-30 04:42:08.525	8	\N	::1
31	/post/我只能	我只能	2025-11-30 04:43:57.164	8	\N	::1
21	/post/1342	1342	2025-11-29 05:05:41.504	\N	\N	::1
22	/post/1342	1342	2025-11-29 06:22:38.797	\N	\N	::1
23	/post/1342	1342	2025-11-29 06:22:42.32	\N	\N	::1
24	/post/132412341234	132412341234	2025-11-29 06:23:09.301	\N	\N	::1
25	/post/更新一点op	更新一点op	2025-11-29 06:25:11.844	\N	\N	::1
26	/post/更新一点op	更新一点op	2025-11-29 06:25:11.895	\N	\N	::1
27	/post/1342	1342	2025-11-29 06:25:17.74	\N	\N	::1
28	/post/我只能	我只能	2025-11-29 08:04:48.097	\N	\N	::1
32	/post/我喜欢你	我喜欢你	2025-11-30 06:48:04.706	24	\N	::1
33	/post/我喜欢你	我喜欢你	2025-11-30 06:48:31.971	24	\N	::1
34	/post/我喜欢你	我喜欢你	2025-11-30 06:48:35.234	24	\N	::1
35	/post/更新一点op	更新一点op	2025-11-30 06:48:43.312	24	\N	::1
36	/post/发点美图测试	发点美图测试	2025-11-30 06:48:58.093	24	\N	::1
37	/post/发点美图测试	发点美图测试	2025-11-30 06:49:01.565	24	\N	::1
38	/post/被要求过来试用上传图片了	被要求过来试用上传图片了	2025-11-30 06:50:03.465	24	\N	::1
39	/post/123123	123123	2025-11-30 06:54:14.158	24	\N	::1
40	/post/修哭了才发现是next自己的问题qaq	修哭了才发现是next自己的问题qaq	2025-11-30 06:54:32.221	8	\N	::1
41	/post/welcome	welcome	2025-11-30 06:54:39.396	8	\N	::1
42	/post/不知道该干什么发个音乐	不知道该干什么发个音乐	2025-11-30 06:54:53.305	8	\N	::1
43	/post/second	second	2025-11-30 06:55:00.941	8	\N	::1
44	/post/我喜欢你	我喜欢你	2025-11-30 06:55:14.893	8	\N	::1
45	/post/我喜欢你	我喜欢你	2025-11-30 06:55:14.983	8	\N	::1
46	/post/测试一下上传音频	测试一下上传音频	2025-11-30 06:55:17.412	8	\N	::1
47	/post/修哭了才发现是next自己的问题qaq	修哭了才发现是next自己的问题qaq	2025-11-30 06:56:17.65	8	\N	::1
48	/post/我喜欢你	我喜欢你	2025-11-30 06:58:38.238	1	\N	::1
49	/post/修哭了才发现是next自己的问题qaq	修哭了才发现是next自己的问题qaq	2025-11-30 07:57:21.733	8	\N	::1
\.


--
-- Data for Name: RateLimit; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RateLimit" (id, ip, date, count, "lastAt") FROM stdin;
\.


--
-- Data for Name: SiteSettings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SiteSettings" (id, title, subtitle, "seoDescription", announcement, "allowGuestComment", "allowRegistration") FROM stdin;
1	MaruBlog	畅所欲言！	编程交流绘画交流音乐交流生活吹水	目前站点还在完善，望海涵喵~！	t	t
\.


--
-- Data for Name: TagDef; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TagDef" (id, name, color, bg, border, hidden) FROM stdin;
1	编程	#b3f0c7	rgba(34,197,94,.12)	rgba(34,197,94,.35)	f
2	音乐	#ffc2cc	rgba(244,63,94,.12)	rgba(244,63,94,.35)	f
3	绘画	#ffe7a3	rgba(234,179,8,.12)	rgba(234,179,8,.35)	f
4	科技	#bfe1ff	rgba(59,130,246,.12)	rgba(59,130,246,.35)	f
5	生活	#ffbfdf	rgba(236,72,153,.12)	rgba(236,72,153,.35)	f
6	闲谈	#d7c8ff	rgba(139,92,246,.12)	rgba(139,92,246,.35)	f
7	其他	#d1d5db	rgba(107,114,128,.12)	rgba(107,114,128,.35)	f
8	写作	#bb7777	#3a2c31	#bb7777	f
\.


--
-- Data for Name: Upload; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Upload" (id, "userId", kind, filename, url, status, "createdAt", "originalName", mime, size) FROM stdin;
1	4	AVATAR	1763114801107-dkmmrn5cudi.jpg	/uploads/1763114801107-dkmmrn5cudi.jpg	APPROVED	2025-11-14 10:06:41.11	2ed32104bf5722ed4aec4dc68e506817.jpg	image/jpeg	436107
2	1	AVATAR	1763121234777-mgondlqjtks.jpg	/uploads/1763121234777-mgondlqjtks.jpg	APPROVED	2025-11-14 11:53:54.779	avatar.jpg	image/jpeg	68536
3	8	AVATAR	1763124446237-bejtgt1atei.jpg	/uploads/1763124446237-bejtgt1atei.jpg	APPROVED	2025-11-14 12:47:26.238	avatar.jpg	image/jpeg	67463
4	8	OTHER	1763201005375-nrsviyeezzr.png	/uploads/1763201005375-nrsviyeezzr.png	APPROVED	2025-11-15 10:03:25.377	ab4e85cb13d9b04fa9506f13be1a4f0c.png	image/png	237050
5	1	OTHER	1763201616908-weti6mooy4s.jpg	/uploads/1763201616908-weti6mooy4s.jpg	APPROVED	2025-11-15 10:13:36.91	24ad67c7995713f56b88b0b0e3d83645507565989.jpg	image/jpeg	628920
6	1	OTHER	1763201621543-7zr5xoe91l5.jpg	/uploads/1763201621543-7zr5xoe91l5.jpg	APPROVED	2025-11-15 10:13:41.545	2ed32104bf5722ed4aec4dc68e506817.jpg	image/jpeg	436107
7	1	OTHER	1763201624399-4z42t9z6g5s.png	/uploads/1763201624399-4z42t9z6g5s.png	APPROVED	2025-11-15 10:13:44.4	ab4e85cb13d9b04fa9506f13be1a4f0c.png	image/png	237050
8	8	OTHER	1763289381287-09zgul5v5c89.jpg	/uploads/1763289381287-09zgul5v5c89.jpg	APPROVED	2025-11-16 10:36:21.289	Tonic_Triangle封面.jpg	image/jpeg	1505414
9	8	OTHER	1763535506731-2t2wchpabdd.ogg	/uploads/1763535506731-2t2wchpabdd.ogg	APPROVED	2025-11-19 06:58:26.733	majocombat.ogg	audio/ogg	3786234
10	1	OTHER	1763649323098-4y8kw29gva5.mp3	/uploads/1763649323098-4y8kw29gva5.mp3	APPROVED	2025-11-20 14:35:23.1	我了个op啊.mp3	audio/mpeg	2190594
11	1	OTHER	1763649333213-2h5meaxblpp.ogg	/uploads/1763649333213-2h5meaxblpp.ogg	APPROVED	2025-11-20 14:35:33.216	Little love.ogg	audio/ogg	2721207
12	1	OTHER	1763649377679-eksbyndd67v.png	/uploads/1763649377679-eksbyndd67v.png	APPROVED	2025-11-20 14:36:17.68	6987c14b-4e5b-4020-9139-64d0df911683.png	image/png	28663
13	1	OTHER	1763649377695-c7tibm2mroq.png	/uploads/1763649377695-c7tibm2mroq.png	APPROVED	2025-11-20 14:36:17.697	ab4e85cb13d9b04fa9506f13be1a4f0c.png	image/png	237050
14	1	OTHER	1763649377726-oc1y2pgeyp.jpg	/uploads/1763649377726-oc1y2pgeyp.jpg	APPROVED	2025-11-20 14:36:17.728	base.jpg	image/jpeg	513430
15	1	OTHER	1763649487926-b9h06p4sok8.jpg	/uploads/1763649487926-b9h06p4sok8.jpg	APPROVED	2025-11-20 14:38:07.928	2ed32104bf5722ed4aec4dc68e506817.jpg	image/jpeg	436107
16	1	OTHER	1763649523588-5mbknpcgjj8.ogg	/uploads/1763649523588-5mbknpcgjj8.ogg	APPROVED	2025-11-20 14:38:43.59	Shopping.ogg	audio/ogg	1175117
17	1	OTHER	1763649529732-gol3w81e96f.ogg	/uploads/1763649529732-gol3w81e96f.ogg	APPROVED	2025-11-20 14:38:49.734	Shuffle.ogg	audio/ogg	3342905
18	1	OTHER	1763650739606-04ccir5kqrsx.ogg	/uploads/1763650739606-04ccir5kqrsx.ogg	APPROVED	2025-11-20 14:58:59.608	Mischievians.ogg	audio/ogg	1850311
19	1	OTHER	1763650743034-wcytb9d8ybd.mp3	/uploads/1763650743034-wcytb9d8ybd.mp3	APPROVED	2025-11-20 14:59:03.036	我了个op啊.mp3	audio/mpeg	2190594
20	1	OTHER	1763650758813-3emd1dburkn.jpg	/uploads/1763650758813-3emd1dburkn.jpg	APPROVED	2025-11-20 14:59:18.815	Konachan.com - 194216 2girls blonde_hair book bow breasts hat ke-ta kirisame_marisa long_hair patchouli_knowledge purple_eyes purple_hair scan shoujo_ai sleeping touhou.jpg	image/jpeg	956515
21	1	OTHER	1763650758855-z62z2lk3z8b.jpg	/uploads/1763650758855-z62z2lk3z8b.jpg	APPROVED	2025-11-20 14:59:18.858	Konachan.com - 194217 bow brown_hair camera flowers hat ke-ta red_eyes scan shameimaru_aya short_hair touhou.jpg	image/jpeg	971918
22	8	OTHER	1764049280359-bz0990tx60a.jpg	/uploads/1764049280359-bz0990tx60a.jpg	APPROVED	2025-11-25 05:41:20.361	Konachan.com - 316375 aqua_eyes aqua_hair bloomers blush cirno dress fairy fang moon night sky stairs tamafurin touhou wings.jpg	image/jpeg	1538989
23	8	OTHER	1764049302277-pmuordrjbd.mp3	/uploads/1764049302277-pmuordrjbd.mp3	APPROVED	2025-11-25 05:41:42.279	SoftFlow02.mp3	audio/mpeg	4305258
25	8	WALLPAPER	1764050475799-lsv11njjja.jpg	/uploads/1764050475799-lsv11njjja.jpg	APPROVED	2025-11-25 06:01:15.801	Konachan.com - 161636 bloomers bow brown_eyes brown_hair dress fairy ke-ta long_hair scan socks star_sapphire touhou wings.jpg	image/jpeg	253490
29	8	OTHER	1764323606737-ppu946ae9zs.ogg	/uploads/1764323606737-ppu946ae9zs.ogg	PENDING	2025-11-28 09:53:26.739	maychr.ogg	audio/ogg	441702
30	8	OTHER	1764323655653-m1cfj3fxmim.jpg	/uploads/1764323655653-m1cfj3fxmim.jpg	PENDING	2025-11-28 09:54:15.655	24ad67c7995713f56b88b0b0e3d83645507565989.jpg	image/jpeg	628920
31	8	OTHER	1764323678380-fvpay10ihfe.ogg	/uploads/1764323678380-fvpay10ihfe.ogg	PENDING	2025-11-28 09:54:38.383	Speculation.ogg	audio/ogg	2915746
33	8	OTHER	1764324609622-6ouhsj09qbq.jpg	/uploads/1764324609622-6ouhsj09qbq.jpg	PENDING	2025-11-28 10:10:09.625	cutYoumu..jpg	image/jpeg	383076
36	1	WALLPAPER	1764327107661-pfhfd26z3ug.jpg	/uploads/1764327107661-pfhfd26z3ug.jpg	PENDING	2025-11-28 10:51:47.665	street.jpg	image/jpeg	280232
41	24	AVATAR	1764483124547-0y6bbkzsmign.jpg	/uploads/1764483124547-0y6bbkzsmign.jpg	PENDING	2025-11-30 06:12:04.551	avatar.jpg	image/jpeg	32063
42	24	AVATAR	1764483134383-qteta9lvgdk.jpg	/uploads/1764483134383-qteta9lvgdk.jpg	PENDING	2025-11-30 06:12:14.386	avatar.jpg	image/jpeg	85810
43	24	AVATAR	1764483329046-zywygy4kysc.jpg	/uploads/1764483329046-zywygy4kysc.jpg	PENDING	2025-11-30 06:15:29.049	avatar.jpg	image/jpeg	35517
44	24	AVATAR	1764483769486-28tq7fvtjj9.jpg	/uploads/1764483769486-28tq7fvtjj9.jpg	PENDING	2025-11-30 06:22:49.489	avatar.jpg	image/jpeg	36329
51	24	AVATAR	1764485216625-a79dpehere5.jpg	/uploads/1764485216625-a79dpehere5.jpg	PENDING	2025-11-30 06:46:56.628	avatar.jpg	image/jpeg	36298
52	24	OTHER	1764485270186-0vbodhcm4sqb.jpg	/uploads/1764485270186-0vbodhcm4sqb.jpg	PENDING	2025-11-30 06:47:50.189	CVV@9(LOGD2V0POY{`@[OBG_tmb.jpg	image/jpeg	258285
53	24	OTHER	1764485275643-qnz1i1zz7yj.mp3	/uploads/1764485275643-qnz1i1zz7yj.mp3	PENDING	2025-11-30 06:47:55.646	soSad.mp3	audio/mpeg	1931041
54	24	OTHER	1764485279579-dk41uy4ibe.mp3	/uploads/1764485279579-dk41uy4ibe.mp3	PENDING	2025-11-30 06:47:59.583	神仙都嫌弃咱们屯.mp3	audio/mpeg	2838848
\.


--
-- Data for Name: UserBan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserBan" (id, "userId", until, reason, "createdAt", permanent) FROM stdin;
\.


--
-- Data for Name: UserLikedAward; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserLikedAward" (id, "userId", title) FROM stdin;
1	1	再试一下这个上传的
2	1	这是测试标签的
3	1	让我看看
4	1	测试
5	1	测试一下定时后发布会怎么样
6	1	测试一下上传音频
7	1	新人报道
8	1	测试点赞后删除
9	1	测试一下给自己点赞
10	1	修哭了才发现是next自己的问题qaq
11	1	测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要
12	8	测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要测试一下极端情况下的长文字标题和长文字摘要
13	8	测试一下上传音频
14	8	水水经验
15	20	不知道该干什么发个音乐
16	1	更新一点op
17	8	更新一点op
18	8	发点美图测试
23	1	出现新的标签啦
\.


--
-- Data for Name: UserPreference; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserPreference" (id, "userId", wallpaper, opacity, theme, "fontSize") FROM stdin;
2	8	/uploads/1764050475799-lsv11njjja.jpg	0.91	\N	\N
1	1	/uploads/1764327107661-pfhfd26z3ug.jpg	0.48	\N	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
5f7bc48a-5057-445c-8f59-4f557bc0f3c5	d63ac1c8fa6ddf870ba244c4ce5ecd6ceb8c2a23fc5088d8b975d62724304c62	2025-11-27 17:43:03.847446+08	20251127094303_init_marublog	\N	\N	2025-11-27 17:43:03.795529+08	1
02244ff4-0f55-4d14-85d9-e24879048e0f	3bc1d88990d940c2a86d32aa876ef2550e7e73ae0f641ef5c44fe6e3471d4042	2025-11-27 17:46:09.42863+08	20251127094609_init_marublog	\N	\N	2025-11-27 17:46:09.424981+08	1
\.


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
-- PostgreSQL database dump complete
--

\unrestrict 8DQDkznkQs4U8XAf7jDOC2fz3LiOH7K9yOgPdmBKRLGDOuiZvnLQlrQsnsk1vTO

