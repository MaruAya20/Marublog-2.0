-- ============================================================
-- MaruBlog MySQL Schema
-- 字符集: utf8mb4  引擎: InnoDB
-- 从 PostgreSQL (Prisma) 迁移而来
-- 与 Spring Boot Entity 层严格同步
-- ============================================================

CREATE DATABASE IF NOT EXISTS marublog
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE marublog;


-- ---------- 用户表 ----------
CREATE TABLE IF NOT EXISTS user (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  email           VARCHAR(255) UNIQUE,
  name            VARCHAR(100),
  role            ENUM('ADMIN', 'AUTHOR', 'MEMBER', 'GUEST') NOT NULL DEFAULT 'GUEST',
  created_at      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  avatar          VARCHAR(500),
  signature       VARCHAR(500),
  xp              INT NOT NULL DEFAULT 0,
  stats_date      VARCHAR(20),
  posts_today     INT DEFAULT 0,
  xp_today        INT DEFAULT 0,
  last_comment_at DATETIME(3),
  INDEX idx_role (role),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- 用户偏好 ----------
CREATE TABLE IF NOT EXISTS user_preference (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL UNIQUE,
  wallpaper  VARCHAR(500),
  opacity    FLOAT,
  theme      VARCHAR(50),
  font_size  VARCHAR(20),
  CONSTRAINT fk_pref_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- 用户收藏文章徽章 ----------
CREATE TABLE IF NOT EXISTS user_liked_award (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  user_id  INT NOT NULL,
  title    VARCHAR(500) NOT NULL,
  CONSTRAINT fk_ula_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  INDEX idx_title (title(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- 文章 ----------
CREATE TABLE IF NOT EXISTS post (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(300) NOT NULL UNIQUE,
  title         VARCHAR(300) NOT NULL,
  excerpt       TEXT,
  content       MEDIUMTEXT NOT NULL,
  tags          JSON,
  published_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  status        VARCHAR(20) NOT NULL DEFAULT 'published',
  scheduled_at  DATETIME(3),
  author_id     INT NOT NULL,
  CONSTRAINT fk_post_author FOREIGN KEY (author_id) REFERENCES user(id),
  INDEX idx_status (status),
  INDEX idx_published (published_at),
  INDEX idx_author_status (author_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- 评论 ----------
CREATE TABLE IF NOT EXISTS comment (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  content     TEXT NOT NULL,
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  post_id     INT NOT NULL,
  user_id     INT,
  guest_name  VARCHAR(100),
  CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL,
  INDEX idx_post (post_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- 点赞 ----------
CREATE TABLE IF NOT EXISTS `like` (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  post_id     INT NOT NULL,
  user_id     INT NOT NULL,
  UNIQUE KEY uk_post_user (post_id, user_id),
  CONSTRAINT fk_like_post FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- 收藏 ----------
CREATE TABLE IF NOT EXISTS favorite (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  post_id     INT NOT NULL,
  user_id     INT NOT NULL,
  UNIQUE KEY uk_post_user (post_id, user_id),
  CONSTRAINT fk_fav_post FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- 上传记录 ----------
CREATE TABLE IF NOT EXISTS upload (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT,
  kind          ENUM('POST_IMAGE', 'ATTACHMENT', 'AVATAR', 'WALLPAPER', 'OTHER') NOT NULL,
  filename      VARCHAR(300) NOT NULL,
  url           VARCHAR(500) NOT NULL UNIQUE,
  status        ENUM('PUBLISHED', 'PENDING', 'APPROVED', 'REJECTED') NOT NULL,
  created_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  original_name VARCHAR(300),
  mime          VARCHAR(100) NOT NULL,
  size          INT NOT NULL,
  CONSTRAINT fk_upload_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_kind (kind)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- 登录验证码 ----------
CREATE TABLE IF NOT EXISTS login_code (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  code       VARCHAR(10) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  expires_at DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- IP 频率限制 ----------
CREATE TABLE IF NOT EXISTS rate_limit (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  ip        VARCHAR(50) NOT NULL,
  date      VARCHAR(20) NOT NULL,
  count     INT NOT NULL DEFAULT 0,
  last_at   DATETIME(3),
  UNIQUE KEY uk_ip_date (ip, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- 管理员提权会话 ----------
CREATE TABLE IF NOT EXISTS admin_session (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  promoted_by  INT,
  until        DATETIME(3) NOT NULL,
  CONSTRAINT fk_admin_sess_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  INDEX idx_until (until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- 管理员操作日志 ----------
CREATE TABLE IF NOT EXISTS admin_log (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  admin_id    INT NOT NULL,
  action      VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id   VARCHAR(100),
  detail      TEXT,
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  ip          VARCHAR(50),
  ua          VARCHAR(500),
  CONSTRAINT fk_admin_log_admin FOREIGN KEY (admin_id) REFERENCES user(id),
  INDEX idx_admin (admin_id),
  INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- 评论封禁 ----------
CREATE TABLE IF NOT EXISTS comment_ban (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT,
  ip         VARCHAR(50),
  until      DATETIME(3) NOT NULL,
  reason     VARCHAR(500),
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_cb_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL,
  INDEX idx_until (until),
  INDEX idx_ip (ip)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- 用户封禁 ----------
CREATE TABLE IF NOT EXISTS user_ban (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  email      VARCHAR(255),
  until      DATETIME(3) NOT NULL,
  reason     VARCHAR(500),
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  permanent  BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_ub_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  INDEX idx_until (until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- 标签定义 ----------
CREATE TABLE IF NOT EXISTS tag_def (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  name   VARCHAR(100) NOT NULL UNIQUE,
  color  VARCHAR(50),
  bg     VARCHAR(50),
  border VARCHAR(50),
  hidden BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------- 站点设置 (单行固定) ----------
CREATE TABLE IF NOT EXISTS site_settings (
  id                   INT PRIMARY KEY,
  title                VARCHAR(100) NOT NULL DEFAULT 'MaruBlog',
  subtitle             VARCHAR(200),
  seo_description      VARCHAR(500),
  announcement         TEXT,
  allow_guest_comment  BOOLEAN NOT NULL DEFAULT TRUE,
  allow_registration   BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO site_settings (id) VALUES (1) ON DUPLICATE KEY UPDATE id = id;


-- ---------- 页面访问记录 ----------
CREATE TABLE IF NOT EXISTS page_view (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  route      VARCHAR(500) NOT NULL,
  slug       VARCHAR(300),
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  user_id    INT,
  post_id    INT,
  ip         VARCHAR(50),
  CONSTRAINT fk_pv_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL,
  CONSTRAINT fk_pv_post FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE SET NULL,
  INDEX idx_route (route(100)),
  INDEX idx_slug (slug),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;