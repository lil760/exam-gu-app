package ca.uqac.groupe.examgu.service;

import ca.uqac.groupe.examgu.entity.Exam;
import ca.uqac.groupe.examgu.request.CreateExamRequest;
import ca.uqac.groupe.examgu.request.UpdateExamAvailabilityRequest;
import ca.uqac.groupe.examgu.request.UpdateExamDurationRequest;
import ca.uqac.groupe.examgu.request.UpdateExamGradingRequest;
import ca.uqac.groupe.examgu.response.ExamTimeInfoResponse;

public interface ExamService {
    Exam createExam(CreateExamRequest request);
    Exam getExamById(Long id);
    Exam updateExamGrading(Long examId, UpdateExamGradingRequest request);
    Exam updateExamAvailability(Long examId, UpdateExamAvailabilityRequest request);
    Exam updateExamDuration(Long examId, UpdateExamDurationRequest request);
    ExamTimeInfoResponse getExamTimeInfo(Long examId);
}
