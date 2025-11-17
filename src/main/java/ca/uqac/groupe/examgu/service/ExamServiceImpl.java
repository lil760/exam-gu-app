package ca.uqac.groupe.examgu.service;


import ca.uqac.groupe.examgu.entity.Exam;
import ca.uqac.groupe.examgu.entity.User;
import ca.uqac.groupe.examgu.repository.ExamRepository;
import ca.uqac.groupe.examgu.repository.UserRepository;
import ca.uqac.groupe.examgu.request.CreateExamRequest;
import ca.uqac.groupe.examgu.service.ExamService;
import org.springframework.stereotype.Service;

@Service
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;

    public ExamServiceImpl(ExamRepository examRepository, UserRepository userRepository) {
        this.examRepository = examRepository;
        this.userRepository = userRepository;
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
}
