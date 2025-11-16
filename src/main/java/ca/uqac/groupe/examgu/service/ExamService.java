package ca.uqac.groupe.examgu.service;

import ca.uqac.groupe.examgu.entity.Exam;
import ca.uqac.groupe.examgu.request.CreateExamRequest;

public interface ExamService {
    Exam createExam(CreateExamRequest request);
    Exam getExamById(Long id);
}
