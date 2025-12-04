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
import ca.uqac.groupe.examgu.response.ExamTimeInfoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

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
    @Transactional
    public Exam createExam(CreateExamRequest request) {
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));

        if (request.getEndDateTime().isBefore(request.getStartDateTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "End date time must be after start date time");
        }

        if (request.getDurationMinutes() == null || request.getDurationMinutes() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duration must be positive");
        }

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
    @Transactional(readOnly = true)
    public Exam getExamById(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exam not found"));
    }

    @Override
    @Transactional
    public Exam updateExamGrading(Long examId, UpdateExamGradingRequest request) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exam not found"));

        // Récupérer les questions de cet examen
        List<Question> examQuestions = exam.getQuestions();

        for (UpdateExamGradingRequest.QuestionPointsUpdate qp : request.getQuestions()) {
            Question question = questionRepository.findById(qp.getQuestionId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Question not found: " + qp.getQuestionId()));

            // Sécurité : vérifier que la question appartient bien à cet exam
            // Puisque Question n'a pas d'attribut exam, on vérifie via la liste de l'exam
            if (!examQuestions.contains(question)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Question " + qp.getQuestionId() + " does not belong to exam " + examId);
            }

            if (qp.getPoints() < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Points must be positive or zero");
            }

            question.setPoints(qp.getPoints());
            questionRepository.save(question);
        }

        return examRepository.findById(examId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exam not found"));
    }

    @Override
    @Transactional
    public Exam updateExamAvailability(Long examId, UpdateExamAvailabilityRequest request) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exam not found"));

        if (request.getEndDateTime().isBefore(request.getStartDateTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "End date time must be after start date time");
        }

        exam.setStartDateTime(request.getStartDateTime());
        exam.setEndDateTime(request.getEndDateTime());

        return examRepository.save(exam);
    }

    @Override
    @Transactional
    public Exam updateExamDuration(Long examId, UpdateExamDurationRequest request) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exam not found"));

        Integer newDuration = request.getDurationMinutes();
        if (newDuration == null || newDuration <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duration must be positive");
        }

        long maxDuration = Duration.between(
                exam.getStartDateTime(),
                exam.getEndDateTime()
        ).toMinutes();

        if (newDuration > maxDuration) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Duration cannot be greater than availability window (" + maxDuration + " minutes)");
        }

        exam.setDurationMinutes(newDuration);

        return examRepository.save(exam);
    }

    @Override
    public ExamTimeInfoResponse getExamTimeInfo(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        LocalDateTime now = LocalDateTime.now(); // tu peux utiliser un Clock injectable si tu veux tester

        LocalDateTime start = exam.getStartDateTime();
        LocalDateTime end = exam.getEndDateTime(); // ou start.plusMinutes(exam.getDurationMinutes())

        boolean notStarted = now.isBefore(start);
        boolean finished = now.isAfter(end);
        boolean inProgress = !notStarted && !finished;

        long remainingSeconds;
        if (finished) {
            remainingSeconds = 0;
        } else {
            remainingSeconds = Duration.between(now, end).getSeconds();
            if (remainingSeconds < 0) {
                remainingSeconds = 0;
            }
        }

        ExamTimeInfoResponse response = new ExamTimeInfoResponse();
        response.setExamId(exam.getId());
        response.setServerNow(now);
        response.setStartDateTime(start);
        response.setEndDateTime(end);
        response.setDurationMinutes(exam.getDurationMinutes());
        response.setRemainingSeconds(remainingSeconds);
        response.setNotStarted(notStarted);
        response.setInProgress(inProgress);
        response.setFinished(finished);

        return response;
    }
    @Override
    @Transactional(readOnly = true)
    public List<Exam> getAvailableExamsForStudent(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        LocalDateTime now = LocalDateTime.now();

        return examRepository.findAll().stream()
                .filter(exam -> !now.isBefore(exam.getStartDateTime()) && !now.isAfter(exam.getEndDateTime()))
                .toList();
    }
    @Override
    @Transactional(readOnly = true)
    public Exam getExamResultForStudent(Long examId, Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exam not found"));

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(exam.getEndDateTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Exam results are not yet available");
        }

        return exam;
    }
}