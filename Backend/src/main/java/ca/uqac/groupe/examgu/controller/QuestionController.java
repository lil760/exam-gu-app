package ca.uqac.groupe.examgu.controller;

import ca.uqac.groupe.examgu.entity.QCMQuestion;
import ca.uqac.groupe.examgu.entity.Question;
import ca.uqac.groupe.examgu.entity.TrueFalseQuestion;
import ca.uqac.groupe.examgu.request.CreateQcmQuestionRequest;
import ca.uqac.groupe.examgu.request.CreateTrueFalseQuestionRequest;
import ca.uqac.groupe.examgu.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(
        name = "Question REST API Endpoints",
        description = "Operations related to questions (QCM and True/False)"
)
@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // -------- READ : récupérer une question (QCM ou True/False) par id --------

    @Operation(summary = "Get question by id",
            description = "Retrieve a question (QCM or True/False) by its id")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}")
    public Question getQuestionById(@PathVariable Long id) {
        return questionService.getQuestionById(id) ;
    }

    // -------- UPDATE : modifier une question QCM --------

    @Operation(summary = "Update QCM question",
            description = "Update an existing QCM question")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/qcm/{id}")
    public QCMQuestion updateQcmQuestion(@PathVariable Long id,
                                         @Valid @RequestBody CreateQcmQuestionRequest request) {
        return questionService.updateQcmQuestion(id, request);
    }

    // -------- UPDATE : modifier une question Vrai/Faux --------

    @Operation(summary = "Update True/False question",
            description = "Update an existing True/False question")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/true-false/{id}")
    public TrueFalseQuestion updateTrueFalseQuestion(@PathVariable Long id,
                                                     @Valid @RequestBody CreateTrueFalseQuestionRequest request) {
        return questionService.updateTrueFalseQuestion(id, request);
    }

    // -------- DELETE : supprimer une question (quel que soit le type) --------

    @Operation(summary = "Delete question",
            description = "Delete a question by id")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
    }
}
