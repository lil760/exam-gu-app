package ca.uqac.groupe.examgu.service;

import ca.uqac.groupe.examgu.entity.Exam;
import ca.uqac.groupe.examgu.entity.Question;
import ca.uqac.groupe.examgu.entity.User;
import ca.uqac.groupe.examgu.repository.ExamRepository;
import ca.uqac.groupe.examgu.repository.QuestionRepository;
import ca.uqac.groupe.examgu.repository.UserRepository;
import ca.uqac.groupe.examgu.request.CreateExamRequest;
import ca.uqac.groupe.examgu.request.UpdateExamAvailabilityRequest;
import ca.uqac.groupe.examgu.request.UpdateExamDurationRequest;
import ca.uqac.groupe.examgu.request.UpdateExamGradingRequest;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;

    public ExamServiceImpl(ExamRepository examRepository,
                           UserRepository userRepository,
                           QuestionRepository questionRepository) {

        this.examRepository = examRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    public Exam createExam(CreateExamRequest request) {
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Exam exam = new Exam();
        exam.setTitle(request.getTitle());
        exam.setDescription(request.getDescription());
        exam.setStartDateTime(request.getStartDateTime());
        exam.setEndDateTime(request.getEndDateTime());
        exam.setDurationMinutes(request.getDurationMinutes());
        exam.setCreator(teacher);

        return examRepository.save(exam);
    }

    @Override
    public Exam getExamById(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
    }


    @Override
    public Exam updateExamGrading(Long examId, UpdateExamGradingRequest request) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        // On met à jour les points question par question
        for (UpdateExamGradingRequest.QuestionPointsUpdate qp : request.getQuestions()) {
            Question q = questionRepository.findById(qp.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found: " + qp.getQuestionId()));

            // Sécurité : vérifier que la question appartient bien à cet exam
            if (!q.getExam().getId().equals(examId)) {
                throw new RuntimeException("Question " + qp.getQuestionId() + " does not belong to exam " + examId);
            }

            q.setPoints(qp.getPoints());
            questionRepository.save(q);
        }


        return examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
    }


    @Override
    public Exam updateExamAvailability(Long examId, UpdateExamAvailabilityRequest request) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        if (request.getEndDateTime().isBefore(request.getStartDateTime())) {
            throw new RuntimeException("End date/time must be after start date/time");
        }

        exam.setStartDateTime(request.getStartDateTime());
        exam.setEndDateTime(request.getEndDateTime());

        return examRepository.save(exam);
    }


    @Override
    public Exam updateExamDuration(Long examId, UpdateExamDurationRequest request) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        Integer newDuration = request.getDurationMinutes();
        if (newDuration <= 0) {
            throw new RuntimeException("Duration must be positive");
        }

        // Optionnel : vérifier que la durée ne dépasse pas la fenêtre de disponibilité
        long maxDuration = Duration.between(
                exam.getStartDateTime(),
                exam.getEndDateTime()
        ).toMinutes();
        if (newDuration > maxDuration) {
            throw new RuntimeException("Duration cannot be greater than availability window (" + maxDuration + " minutes)");
        }

        exam.setDurationMinutes(newDuration);

        return examRepository.save(exam);
    }
}
