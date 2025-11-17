-- =====================================================
-- exam_app (MySQL 8.x, InnoDB, utf8mb4) 
-- =====================================================



CREATE DATABASE IF NOT EXISTS exam_app
CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE exam_app;

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- 1) Users & Authorities
-- =========================
DROP TABLE IF EXISTS user_authorities;
DROP TABLE IF EXISTS authorities;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  first_name    VARCHAR(80)  NOT NULL,
  last_name     VARCHAR(80)  NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  status        ENUM('active','disabled') NOT NULL DEFAULT 'active',
  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE authorities (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  authority  VARCHAR(64) NOT NULL UNIQUE        -- ROLE_STUDENT, ROLE_TEACHER, ROLE_ADMIN
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE user_authorities (
  user_id      BIGINT NOT NULL,
  authority_id INT    NOT NULL,
  PRIMARY KEY (user_id, authority_id),
  CONSTRAINT fk_ua_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ua_auth FOREIGN KEY (authority_id) REFERENCES authorities(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_ua_auth ON user_authorities(authority_id);

-- =========================
-- 2) Exams & Grading
-- =========================

CREATE TABLE exams (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  description    TEXT NULL,
  start_datetime DATETIME(3)  NULL,           -- window open
  end_datetime   DATETIME(3)  NULL,           -- window close
  duration_min   INT NOT NULL CHECK (duration_min > 0),
  creator_id     BIGINT NOT NULL,             -- teacher (users.id)
  status         ENUM('draft','published','closed','graded') NOT NULL DEFAULT 'draft',
  created_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_exams_creator FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT chk_exam_window CHECK (start_datetime IS NULL OR end_datetime IS NULL OR start_datetime < end_datetime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_exams_creator ON exams(creator_id);
CREATE INDEX idx_exams_status  ON exams(status);
CREATE INDEX idx_exams_open    ON exams(start_datetime);
CREATE INDEX idx_exams_close   ON exams(end_datetime);

CREATE TABLE grading_scales (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  exam_id     BIGINT NOT NULL UNIQUE,         -- 1:1 with exams
  scale_pct   DECIMAL(6,2) NOT NULL DEFAULT 100.00,
  pass_mark   DECIMAL(6,2) NOT NULL DEFAULT 50.00,
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_gs_exam FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS exam_events;
DROP TABLE IF EXISTS login_events;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS choices;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS grading_scales;
DROP TABLE IF EXISTS exams;
DROP TABLE IF EXISTS exam_attempts;

-- =========================
-- 3) Questions & Choices
-- =========================
CREATE TABLE questions (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  exam_id      BIGINT NOT NULL,
  qtype        ENUM('QCM','TRUE_FALSE') NOT NULL,
  text         TEXT NOT NULL,
  points       DECIMAL(6,2) NOT NULL DEFAULT 1.00,
  -- QCM specific:
  multiple_answers_allowed BOOLEAN NULL,
  -- TRUE_FALSE specific:
  correct_tf  BOOLEAN NULL,
  position    INT NOT NULL,
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_questions_exam FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_questions_exam_pos ON questions(exam_id, position);
CREATE INDEX idx_questions_qtype    ON questions(qtype);

CREATE TABLE choices (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  question_id BIGINT NOT NULL,
  label       VARCHAR(8) NULL,
  text        TEXT NOT NULL,
  is_correct  BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_choices_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_choices_question ON choices(question_id);
CREATE INDEX idx_choices_correct  ON choices(question_id, is_correct);

-- =========================
-- 4) Enrollments & Attempts 
-- =========================
CREATE TABLE enrollments (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  exam_id     BIGINT NOT NULL,
  student_id  BIGINT NOT NULL,
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT uq_enrollment UNIQUE (exam_id, student_id),
  CONSTRAINT fk_enroll_exam FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  CONSTRAINT fk_enroll_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_enroll_student ON enrollments(student_id);

CREATE TABLE exam_attempts (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  exam_id       BIGINT NOT NULL,
  student_id    BIGINT NOT NULL,
  status        ENUM('EN_COURS','SOUMIS','CORRIGE','EXPIRE') NOT NULL DEFAULT 'EN_COURS',
  started_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  submitted_at  DATETIME(3) NULL,
  final_score   DECIMAL(7,2) NULL,
  expires_at    DATETIME(3) NOT NULL,    -- min(start+duration, end_datetime)
  note_published BOOLEAN NOT NULL DEFAULT FALSE, -- visibility flag
  CONSTRAINT fk_attempts_exam    FOREIGN KEY (exam_id)    REFERENCES exams(id)  ON DELETE CASCADE,
  CONSTRAINT fk_attempts_student FOREIGN KEY (student_id)  REFERENCES users(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_attempts_exam_student ON exam_attempts(exam_id, student_id);
CREATE INDEX idx_attempts_status       ON exam_attempts(status);
CREATE INDEX idx_attempts_expires      ON exam_attempts(expires_at);


-- =========================
-- 5) Triggers & Stored Procedures
-- =========================
DELIMITER //

DROP TRIGGER IF EXISTS trg_choices_only_for_qcm//
CREATE TRIGGER trg_choices_only_for_qcm
BEFORE INSERT ON choices
FOR EACH ROW
BEGIN
  IF (SELECT qtype FROM questions WHERE id = NEW.question_id) <> 'QCM' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Choices only allowed for QCM';
  END IF;
END//

DROP TRIGGER IF EXISTS trg_tf_must_have_correct_ins//
CREATE TRIGGER trg_tf_must_have_correct_ins
BEFORE INSERT ON questions
FOR EACH ROW
BEGIN
  IF NEW.qtype='TRUE_FALSE' AND NEW.correct_tf IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'TRUE_FALSE must define correct_tf';
  END IF;
END//

DROP TRIGGER IF EXISTS trg_tf_must_have_correct_upd//
CREATE TRIGGER trg_tf_must_have_correct_upd
BEFORE UPDATE ON questions
FOR EACH ROW
BEGIN
  IF NEW.qtype='TRUE_FALSE' AND NEW.correct_tf IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'TRUE_FALSE must define correct_tf';
  END IF;
END//

DROP TRIGGER IF EXISTS trg_check_qcm_min_choices//
CREATE TRIGGER trg_check_qcm_min_choices
BEFORE UPDATE ON exams
FOR EACH ROW
BEGIN
  IF NEW.status='published' AND OLD.status<>'published' THEN
    IF EXISTS (
      SELECT 1 FROM questions q
      WHERE q.exam_id=NEW.id AND q.qtype='QCM'
        AND (
          (SELECT COUNT(*) FROM choices c WHERE c.question_id=q.id) < 2
          OR (SELECT COUNT(*) FROM choices c WHERE c.question_id=q.id AND c.is_correct=1) < 1
        )
    ) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'QCM must have ≥2 choices and ≥1 correct before publish';
    END IF;
  END IF;
END//

DROP TRIGGER IF EXISTS trg_attempt_set_expiry//
CREATE TRIGGER trg_attempt_set_expiry
BEFORE INSERT ON exam_attempts
FOR EACH ROW
BEGIN
  DECLARE d INT; DECLARE end_dt DATETIME(3);
  SELECT duration_min, end_datetime INTO d, end_dt FROM exams WHERE id = NEW.exam_id;
  SET NEW.expires_at = LEAST(
    DATE_ADD(COALESCE(NEW.started_at, CURRENT_TIMESTAMP(3)), INTERVAL d MINUTE),
    IFNULL(end_dt, '9999-12-31 00:00:00')
  );
END//

DROP PROCEDURE IF EXISTS set_attempt_final_score//
CREATE PROCEDURE set_attempt_final_score(IN p_attempt_id BIGINT, IN p_final_score DECIMAL(7,2), IN p_publish BOOLEAN)
BEGIN
  UPDATE exam_attempts
  SET final_score = p_final_score,
      submitted_at = COALESCE(submitted_at, CURRENT_TIMESTAMP(3)),
      status = CASE WHEN status='EN_COURS' THEN 'SOUMIS' ELSE status END,
      note_published = IF(p_publish, TRUE, note_published)
  WHERE id = p_attempt_id;
END//

DELIMITER ;

-- =========================
-- 6) Admin View
-- =========================
CREATE OR REPLACE VIEW v_attempt_results AS
SELECT a.id AS attempt_id, a.exam_id, e.title AS exam_title,
       a.student_id, u.email AS student_email,
       a.status, a.started_at, a.submitted_at, a.expires_at,
       a.final_score, a.note_published
FROM exam_attempts a
JOIN exams e   ON e.id = a.exam_id
JOIN users u   ON u.id = a.student_id;

-- =========================
-- 7) SEED MINIMAL (démo)
-- =========================

-- Rôles
INSERT INTO authorities(authority) VALUES
  ('ROLE_ADMIN'),
  ('ROLE_TEACHER'),
  ('ROLE_STUDENT');

-- Utilisateurs (hashs fictifs)
INSERT INTO users(first_name,last_name,email,password_hash) VALUES
  ('Alice','Admin','alice.admin@example.com','$argon2id$dummy'),
  ('Téo','Teacher','teo.teacher@example.com','$argon2id$dummy'),
  ('Eva','Student','eva.student@example.com','$argon2id$dummy');

-- Attribution des rôles
INSERT INTO user_authorities(user_id, authority_id)
SELECT u.id, a.id
FROM users u
JOIN authorities a
  ON ( (u.email='alice.admin@example.com' AND a.authority='ROLE_ADMIN')
    OR (u.email='teo.teacher@example.com' AND a.authority='ROLE_TEACHER')
    OR (u.email='eva.student@example.com'  AND a.authority='ROLE_STUDENT') );

-- Examen de démo (ouvre demain, dure 60 min)
INSERT INTO exams(title, description, start_datetime, end_datetime, duration_min, creator_id, status)
VALUES (
  'Examen Démo',
  'Chapitres 1–2',
  DATE_ADD(NOW(), INTERVAL 1 DAY),
  DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 2 HOUR),
  60,
  (SELECT id FROM users WHERE email='teo.teacher@example.com'),
  'draft'
);

-- Échelle de notation (1:1)
INSERT INTO grading_scales(exam_id, scale_pct, pass_mark)
SELECT id, 100.00, 50.00
FROM exams WHERE title='Examen Démo';

-- Questions
-- Q1 (QCM, 2 points, réponses multiples autorisées)
INSERT INTO questions(exam_id,qtype,text,points,multiple_answers_allowed,position,correct_tf)
SELECT e.id,'QCM','Cochez les protocoles de couche application',2.0,TRUE,1,NULL
FROM exams e WHERE e.title='Examen Démo';

-- Q2 (Vrai/Faux, 1 point, réponse correcte = FALSE)
INSERT INTO questions(exam_id,qtype,text,points,position,correct_tf,multiple_answers_allowed)
SELECT e.id,'TRUE_FALSE','HTTP est stateful.',1.0,2,0,NULL
FROM exams e WHERE e.title='Examen Démo';

-- Choix pour la QCM (Q1)
INSERT INTO choices(question_id,label,text,is_correct)
SELECT q.id,'A','HTTP',1 FROM questions q
WHERE q.qtype='QCM' AND q.text='Cochez les protocoles de couche application';

INSERT INTO choices(question_id,label,text,is_correct)
SELECT q.id,'B','FTP',1 FROM questions q
WHERE q.qtype='QCM' AND q.text='Cochez les protocoles de couche application';

INSERT INTO choices(question_id,label,text,is_correct)
SELECT q.id,'C','IP',0 FROM questions q
WHERE q.qtype='QCM' AND q.text='Cochez les protocoles de couche application';

-- Inscription de l’étudiante Eva
INSERT INTO enrollments(exam_id, student_id)
SELECT e.id, u.id
FROM exams e
JOIN users u ON u.email='eva.student@example.com'
WHERE e.title='Examen Démo';

-- Création d’une tentative (metadata uniquement ; le trigger fixe expires_at)
-- On démarre demain à l’ouverture
INSERT INTO exam_attempts(exam_id, student_id, status, started_at)
SELECT e.id, u.id, 'EN_COURS',
       DATE_ADD(NOW(), INTERVAL 1 DAY)
FROM exams e
JOIN users u ON u.email='eva.student@example.com'
WHERE e.title='Examen Démo';

