package ca.uqac.groupe.examgu.controller;

import ca.uqac.groupe.examgu.entity.Exam;
import ca.uqac.groupe.examgu.request.CreateExamRequest;
import ca.uqac.groupe.examgu.service.ExamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(
        name = "Exam REST API Endpoints",
        description = "Operations related to exams"
)
@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @Operation(summary = "Create exam", description = "Create a new exam")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public Exam createExam(@Valid @RequestBody CreateExamRequest request) {
        // Le service renvoie directement un Exam
        return examService.createExam(request);
    }

    @Operation(summary = "Get exam by id", description = "Retrieve an exam by its id")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}")
    public Exam getExamById(@PathVariable Long id) {
        return examService.getExamById(id);
    }
}
