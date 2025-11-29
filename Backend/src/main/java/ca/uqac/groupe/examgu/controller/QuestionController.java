package ca.uqac.groupe.examgu.controller;


import ca.uqac.groupe.examgu.request.QCMQuestionRequest;
import ca.uqac.groupe.examgu.request.TrueFalseQuestionRequest;
import ca.uqac.groupe.examgu.response.QCMQuestionResponse;
import ca.uqac.groupe.examgu.response.TrueFalseQuestionResponse;
import ca.uqac.groupe.examgu.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;




import jakarta.validation.constraints.Min;


        import java.util.List;

@Tag(name = "Question REST API Endpoints", description = "Operations for managing questions")
@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @Operation(summary = "Get all questions", description = "Fetch all questions ordered by index")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    public List<Object> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @Operation(summary = "Add QCM question", description = "Add a multiple choice question")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/qcm")
    public QCMQuestionResponse createQCMQuestion(@Valid @RequestBody QCMQuestionRequest questionRequest) {
        return questionService.createQCMQuestion(questionRequest);
    }

    @Operation(summary = "Update QCM question", description = "Update an existing QCM question")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/qcm/{questionId}")
    public QCMQuestionResponse updateQCMQuestion(
            @PathVariable @Min(1) long questionId,
            @Valid @RequestBody QCMQuestionRequest questionRequest) {
        return questionService.updateQCMQuestion(questionId, questionRequest);
    }

    @Operation(summary = "Add True/False question", description = "Add a true or false question")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/truefalse")
    public TrueFalseQuestionResponse createTrueFalseQuestion(
            @Valid @RequestBody TrueFalseQuestionRequest questionRequest) {
        return questionService.createTrueFalseQuestion(questionRequest);
    }

    @Operation(summary = "Update True/False question", description = "Update an existing True/False question")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/truefalse/{questionId}")
    public TrueFalseQuestionResponse updateTrueFalseQuestion(
            @PathVariable @Min(1) long questionId,
            @Valid @RequestBody TrueFalseQuestionRequest questionRequest) {
        return questionService.updateTrueFalseQuestion(questionId, questionRequest);
    }

    @Operation(summary = "Delete question", description = "Delete a question")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{questionId}")
    public void deleteQuestion(@PathVariable @Min(1) long questionId) {
        questionService.deleteQuestion(questionId);
    }
}
