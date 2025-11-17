package ca.uqac.groupe.examgu.service;

import ca.uqac.groupe.examgu.entity.Choice;
import ca.uqac.groupe.examgu.entity.Exam;
import ca.uqac.groupe.examgu.entity.QCMQuestion;
import ca.uqac.groupe.examgu.entity.Question;
import ca.uqac.groupe.examgu.entity.QuestionType;
import ca.uqac.groupe.examgu.entity.TrueFalseQuestion;
import ca.uqac.groupe.examgu.repository.ExamRepository;
import ca.uqac.groupe.examgu.repository.QuestionRepository;
import ca.uqac.groupe.examgu.request.CreateQcmQuestionRequest;
import ca.uqac.groupe.examgu.request.CreateTrueFalseQuestionRequest;
import ca.uqac.groupe.examgu.service.QuestionService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {

    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;

    public QuestionServiceImpl(ExamRepository examRepository,
                               QuestionRepository questionRepository) {
        this.examRepository = examRepository;
        this.questionRepository = questionRepository;
    }

    // -------------------- CREATE QCM --------------------

    @Override
    public QCMQuestion addQcmQuestion(Long examId, CreateQcmQuestionRequest request) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        QCMQuestion question = new QCMQuestion();
        question.setText(request.getText());
        question.setPoints(request.getPoints());
        question.setType(QuestionType.QCM);
        question.setMultipleAnswersAllowed(request.isMultipleAnswersAllowed());
        question.setExam(exam);

        // Créer les choix à partir du DTO
        List<Choice> choices = request.getChoices().stream()
                .map(dto -> {
                    Choice c = new Choice();
                    c.setText(dto.getText());
                    c.setCorrect(dto.isCorrect());
                    c.setQuestion(question);
                    return c;
                })
                .collect(Collectors.toList());

        question.setChoices(choices);

        // Lier la question à l’exam
        exam.getQuestions().add(question);

        return questionRepository.save(question);
    }

    // -------------------- CREATE TRUE/FALSE --------------------

    @Override
    public TrueFalseQuestion addTrueFalseQuestion(Long examId, CreateTrueFalseQuestionRequest request) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        TrueFalseQuestion question = new TrueFalseQuestion();
        question.setText(request.getText());
        question.setPoints(request.getPoints());
        question.setType(QuestionType.TRUE_FALSE);
        question.setCorrectAnswer(request.isCorrectAnswer());
        question.setExam(exam);

        exam.getQuestions().add(question);

        return questionRepository.save(question);
    }

    // -------------------- READ : liste des questions d’un exam --------------------

    @Override
    public List<Question> getQuestionsByExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        return exam.getQuestions();
    }

    // -------------------- READ : une question par id --------------------

    @Override
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    // -------------------- UPDATE QCM --------------------

    @Override
    public QCMQuestion updateQcmQuestion(Long id, CreateQcmQuestionRequest request) {
        Question base = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!(base instanceof QCMQuestion)) {
            throw new RuntimeException("Question is not of type QCM");
        }

        QCMQuestion question = (QCMQuestion) base;
        question.setText(request.getText());
        question.setPoints(request.getPoints());
        question.setMultipleAnswersAllowed(request.isMultipleAnswersAllowed());

        // On supprime les anciens choix et on recrée à partir du DTO
        if (question.getChoices() != null) {
            question.getChoices().clear();
        }

        List<Choice> newChoices = request.getChoices().stream()
                .map(dto -> {
                    Choice c = new Choice();
                    c.setText(dto.getText());
                    c.setCorrect(dto.isCorrect());
                    c.setQuestion(question);
                    return c;
                })
                .collect(Collectors.toList());

        question.setChoices(newChoices);

        return questionRepository.save(question);
    }

    // -------------------- UPDATE TRUE/FALSE --------------------

    @Override
    public TrueFalseQuestion updateTrueFalseQuestion(Long id, CreateTrueFalseQuestionRequest request) {
        Question base = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!(base instanceof TrueFalseQuestion)) {
            throw new RuntimeException("Question is not of type TRUE_FALSE");
        }

        TrueFalseQuestion question = (TrueFalseQuestion) base;
        question.setText(request.getText());
        question.setPoints(request.getPoints());
        question.setCorrectAnswer(request.isCorrectAnswer());

        return questionRepository.save(question);
    }

    // -------------------- DELETE --------------------

    @Override
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new RuntimeException("Question not found");
        }
        questionRepository.deleteById(id);
    }
}
