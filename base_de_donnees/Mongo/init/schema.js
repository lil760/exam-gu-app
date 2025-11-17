// crée DB + collections + index + TTL
(function () {
    const admin = connect("mongodb://localhost:27017/admin");
    const db = admin.getSiblingDB("exam_nosql");
  
    if (!db.getCollectionNames().includes("attempts_raw")) db.createCollection("attempts_raw");
    if (!db.getCollectionNames().includes("attempts_grade")) db.createCollection("attempts_grade");
  
    db.attempts_raw.createIndex({ attemptId: 1 }, { unique: true, name: "uk_attemptId" });
    db.attempts_raw.createIndex({ examId: 1, studentId: 1 }, { name: "idx_exam_student" });
    db.attempts_raw.createIndex({ "answers.qid": 1 }, { name: "idx_answers_qid" });
    db.attempts_raw.createIndex({ lastSavedAt: 1 }, { expireAfterSeconds: 15552000, name: "ttl_autosave_180d" });
  
    db.attempts_grade.createIndex({ attemptId: 1 }, { unique: true, name: "uk_attemptId" });
    db.attempts_grade.createIndex({ examId: 1, studentId: 1 }, { name: "idx_exam_student" });
    db.attempts_grade.createIndex({ "perQuestion.qid": 1 }, { name: "idx_perQuestion_qid" });
  })();
  