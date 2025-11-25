package ca.uqac.groupe.examgu.service;

import ca.uqac.groupe.examgu.entity.QCMQuestion;
import ca.uqac.groupe.examgu.entity.Question;
import ca.uqac.groupe.examgu.entity.TrueFalseQuestion;
import ca.uqac.groupe.examgu.request.CreateQcmQuestionRequest;
import ca.uqac.groupe.examgu.request.CreateTrueFalseQuestionRequest;


public interface QuestionService {
    QCMQuestion addQcmQuestion(Long examId, CreateQcmQuestionRequest request);
    TrueFalseQuestion addTrueFalseQuestion(Long examId, CreateTrueFalseQuestionRequest request);

    // CRUD supplémentaire
    java.util.List<Question> getQuestionsByExam(Long examId);
    Question getQuestionById(Long id);
    QCMQuestion updateQcmQuestion(Long id, CreateQcmQuestionRequest request);
    TrueFalseQuestion updateTrueFalseQuestion(Long id, CreateTrueFalseQuestionRequest request);
    void deleteQuestion(Long id);
}

