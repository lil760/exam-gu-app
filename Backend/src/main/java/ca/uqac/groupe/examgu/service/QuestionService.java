package ca.uqac.groupe.examgu.service;

import ca.uqac.groupe.examgu.entity.QCMQuestion;
import ca.uqac.groupe.examgu.entity.Question;
import ca.uqac.groupe.examgu.entity.TrueFalseQuestion;
import ca.uqac.groupe.examgu.request.QCMQuestionRequest;
import ca.uqac.groupe.examgu.request.TrueFalseQuestionRequest;
import ca.uqac.groupe.examgu.response.QCMQuestionResponse;
import ca.uqac.groupe.examgu.response.TrueFalseQuestionResponse;


import java.util.List;

public interface QuestionService {

    List<Object> getAllQuestions();
    QCMQuestionResponse createQCMQuestion(QCMQuestionRequest questionRequest);
    QCMQuestionResponse updateQCMQuestion(long questionId, QCMQuestionRequest questionRequest);
    TrueFalseQuestionResponse createTrueFalseQuestion(TrueFalseQuestionRequest questionRequest);
    TrueFalseQuestionResponse updateTrueFalseQuestion(long questionId, TrueFalseQuestionRequest questionRequest);
    void deleteQuestion(long questionId);
}

