// seed minimal: 1 tentative (raw) + 1 résultat (grade)
(function () {
    const admin = connect("mongodb://localhost:27017/admin");
    const db = admin.getSiblingDB("exam_nosql");
    const now = new Date(), start = new Date(now.getTime()+24*3600*1000), expire = new Date(start.getTime()+60*60000);
  
    db.attempts_raw.updateOne(
      { attemptId: 1001 },
      { $setOnInsert: {
          attemptId: 1001, examId: 55, studentId: 301,
          status: "in_progress", startedAt: start, expiresAt: expire,
          answers: [
            { qid: 901, type: "TRUE_FALSE", valueBool: false, updatedAt: now, timeSpentSec: 40 },
            { qid: 902, type: "QCM", selectedChoiceIds: [7001,7002], updatedAt: now, timeSpentSec: 95 }
          ],
          events: [{ t: "focus", ts: now }], client: { ua: "docker-init", tz: "UTC" }
        }, $set: { lastSavedAt: now } },
      { upsert: true }
    );
  
    db.attempts_grade.updateOne(
      { attemptId: 1001 },
      { $set: {
          attemptId: 1001, examId: 55, studentId: 301, submittedAt: now,
          policy: { qcmMode:"exact_match", scalePct:100, passMark:50 },
          rawScore: 3.0, finalScore: 3.0,
          perQuestion: [
            { qid: 901, type: "TRUE_FALSE", points: 1.0, earned: 1.0, correct: true, timeSpentSec: 40 },
            { qid: 902, type: "QCM", points: 2.0, earned: 2.0, correct: true,
              selectedChoiceIds: [7001,7002], correctChoiceIds: [7001,7002], timeSpentSec: 95 }
          ],
          byTheme: [], anomalies: [], version: 1
        } },
      { upsert: true }
    );
  })();
  