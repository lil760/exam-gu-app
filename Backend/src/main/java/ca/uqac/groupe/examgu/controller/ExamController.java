package ca.uqac.groupe.examgu.controller;

import ca.uqac.groupe.examgu.entity.Exam;
import ca.uqac.groupe.examgu.request.CreateExamRequest;
import ca.uqac.groupe.examgu.request.UpdateExamAvailabilityRequest;
import ca.uqac.groupe.examgu.request.UpdateExamDurationRequest;
import ca.uqac.groupe.examgu.request.UpdateExamGradingRequest;
import ca.uqac.groupe.examgu.response.ExamTimeInfoResponse;
import ca.uqac.groupe.examgu.service.ExamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        return examService.createExam(request);
    }

    @Operation(summary = "Get exam by id", description = "Retrieve an exam by its id")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}")
    public Exam getExamById(@PathVariable Long id) {
        return examService.getExamById(id);
    }

    @Operation(summary = "Update exam grading scheme",
            description = "Update the points/weighting of questions for a given exam")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{id}/grading")
    public Exam updateExamGrading(@PathVariable Long id,
                                  @Valid @RequestBody UpdateExamGradingRequest request) {
        return examService.updateExamGrading(id, request);
    }

    @Operation(summary = "Update exam availability",
            description = "Update start and end date/time of an exam")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{id}/availability")
    public Exam updateExamAvailability(@PathVariable Long id,
                                       @Valid @RequestBody UpdateExamAvailabilityRequest request) {
        return examService.updateExamAvailability(id, request);
    }

    @Operation(summary = "Update exam duration",
            description = "Update the duration (in minutes) of an exam")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{id}/duration")
    public Exam updateExamDuration(@PathVariable Long id,
                                   @Valid @RequestBody UpdateExamDurationRequest request) {
        return examService.updateExamDuration(id, request);
    }

    @Operation(
            summary = "Exam time information",
            description = "Return timing information for an exam (server time, start/end, remaining seconds)"
    )
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}/time-info")
    public ExamTimeInfoResponse getExamTimeInfo(@PathVariable Long id) {
        return examService.getExamTimeInfo(id);
    }
    @Operation(summary = "Get available exams for student",
            description = "Retrieve list of available exams for a student")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/student/{studentId}/available")
    public List<Exam> getAvailableExamsForStudent(@PathVariable Long studentId) {
        return examService.getAvailableExamsForStudent(studentId);
    }

    @Operation(summary = "Get exam result for student",
            description = "Retrieve exam result for a specific student")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{examId}/student/{studentId}/result")
    public Exam getExamResultForStudent(@PathVariable Long examId, @PathVariable Long studentId) {
        return examService.getExamResultForStudent(examId, studentId);
    }
}
