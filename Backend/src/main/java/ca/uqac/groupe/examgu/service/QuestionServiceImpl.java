package ca.uqac.groupe.examgu.service;




import ca.uqac.groupe.examgu.entity.Choice;
import ca.uqac.groupe.examgu.entity.QCMQuestion;
import ca.uqac.groupe.examgu.entity.Question;
import ca.uqac.groupe.examgu.entity.TrueFalseQuestion;
import ca.uqac.groupe.examgu.repository.ChoiceRepository;
import ca.uqac.groupe.examgu.repository.QuestionRepository;
import ca.uqac.groupe.examgu.request.ChoiceRequest;
import ca.uqac.groupe.examgu.request.QCMQuestionRequest;
import ca.uqac.groupe.examgu.request.TrueFalseQuestionRequest;
import ca.uqac.groupe.examgu.response.ChoiceResponse;
import ca.uqac.groupe.examgu.response.QCMQuestionResponse;
import ca.uqac.groupe.examgu.response.TrueFalseQuestionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final ChoiceRepository choiceRepository;

    public QuestionServiceImpl(QuestionRepository questionRepository,
                               ChoiceRepository choiceRepository) {
        this.questionRepository = questionRepository;
        this.choiceRepository = choiceRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Object> getAllQuestions() {
        List<Question> questions = questionRepository.findAllByOrderByOrderIndexAsc();
        List<Object> questionResponses = new ArrayList<>();

        for (Question question : questions) {
            if (question instanceof QCMQuestion) {
                questionResponses.add(convertToQCMQuestionResponse((QCMQuestion) question));
            } else if (question instanceof TrueFalseQuestion) {
                questionResponses.add(convertToTrueFalseQuestionResponse((TrueFalseQuestion) question));
            }
        }

        return questionResponses;
    }

    @Override
    @Transactional
    public QCMQuestionResponse createQCMQuestion(QCMQuestionRequest questionRequest) {
        long correctChoicesCount = questionRequest.getChoices().stream()
                .filter(ChoiceRequest::getIsCorrect)
                .count();

        if (correctChoicesCount == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "At least one choice must be marked as correct");
        }

        if (!questionRequest.getMultipleAnswersAllowed() && correctChoicesCount > 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only one choice can be correct when multiple answers are not allowed");
        }

        QCMQuestion question = new QCMQuestion(
                questionRequest.getText(),
                questionRequest.getPoints(),
                questionRequest.getOrderIndex(),
                questionRequest.getMultipleAnswersAllowed()
        );

        QCMQuestion savedQuestion = (QCMQuestion) questionRepository.save(question);

        for (ChoiceRequest choiceRequest : questionRequest.getChoices()) {
            Choice choice = new Choice(
                    choiceRequest.getText(),
                    choiceRequest.getIsCorrect()
            );
            choice.setQuestion(savedQuestion);
            choiceRepository.save(choice);
        }

        return convertToQCMQuestionResponse(savedQuestion);
    }

    @Override
    @Transactional
    public QCMQuestionResponse updateQCMQuestion(long questionId, QCMQuestionRequest questionRequest) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));

        if (!(question instanceof QCMQuestion)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question is not a QCM question");
        }

        QCMQuestion qcmQuestion = (QCMQuestion) question;

        long correctChoicesCount = questionRequest.getChoices().stream()
                .filter(ChoiceRequest::getIsCorrect)
                .count();

        if (correctChoicesCount == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "At least one choice must be marked as correct");
        }

        if (!questionRequest.getMultipleAnswersAllowed() && correctChoicesCount > 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only one choice can be correct when multiple answers are not allowed");
        }

        qcmQuestion.setText(questionRequest.getText());
        qcmQuestion.setPoints(questionRequest.getPoints());
        qcmQuestion.setOrderIndex(questionRequest.getOrderIndex());
        qcmQuestion.setMultipleAnswersAllowed(questionRequest.getMultipleAnswersAllowed());

        choiceRepository.deleteByQuestion(qcmQuestion);
        qcmQuestion.getChoices().clear();

        for (ChoiceRequest choiceRequest : questionRequest.getChoices()) {
            Choice choice = new Choice(
                    choiceRequest.getText(),
                    choiceRequest.getIsCorrect()
            );
            choice.setQuestion(qcmQuestion);
            choiceRepository.save(choice);
        }

        QCMQuestion updatedQuestion = (QCMQuestion) questionRepository.save(qcmQuestion);
        return convertToQCMQuestionResponse(updatedQuestion);
    }

    @Override
    @Transactional
    public TrueFalseQuestionResponse createTrueFalseQuestion(TrueFalseQuestionRequest questionRequest) {
        TrueFalseQuestion question = new TrueFalseQuestion(
                questionRequest.getText(),
                questionRequest.getPoints(),
                questionRequest.getOrderIndex(),
                questionRequest.getCorrectAnswer()
        );

        TrueFalseQuestion savedQuestion = (TrueFalseQuestion) questionRepository.save(question);
        return convertToTrueFalseQuestionResponse(savedQuestion);
    }

    @Override
    @Transactional
    public TrueFalseQuestionResponse updateTrueFalseQuestion(long questionId,
                                                             TrueFalseQuestionRequest questionRequest) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));

        if (!(question instanceof TrueFalseQuestion)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question is not a True/False question");
        }

        TrueFalseQuestion tfQuestion = (TrueFalseQuestion) question;
        tfQuestion.setText(questionRequest.getText());
        tfQuestion.setPoints(questionRequest.getPoints());
        tfQuestion.setOrderIndex(questionRequest.getOrderIndex());
        tfQuestion.setCorrectAnswer(questionRequest.getCorrectAnswer());

        TrueFalseQuestion updatedQuestion = (TrueFalseQuestion) questionRepository.save(tfQuestion);
        return convertToTrueFalseQuestionResponse(updatedQuestion);
    }

    @Override
    @Transactional
    public void deleteQuestion(long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));

        questionRepository.delete(question);
    }

    private QCMQuestionResponse convertToQCMQuestionResponse(QCMQuestion question) {
        List<ChoiceResponse> choiceResponses = question.getChoices().stream()
                .map(choice -> new ChoiceResponse(choice.getId(), choice.getText()))
                .collect(Collectors.toList());

        return new QCMQuestionResponse(
                question.getId(),
                question.getText(),
                question.getPoints(),
                question.getOrderIndex(),
                question.isMultipleAnswersAllowed(),
                choiceResponses
        );
    }

    private TrueFalseQuestionResponse convertToTrueFalseQuestionResponse(TrueFalseQuestion question) {
        return new TrueFalseQuestionResponse(
                question.getId(),
                question.getText(),
                question.getPoints(),
                question.getOrderIndex()
        );
    }
}