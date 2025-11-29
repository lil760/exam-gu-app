package ca.uqac.groupe.examgu.request;



import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class QCMQuestionRequest {

    @NotEmpty(message = "Question text is mandatory")
    @Size(min = 5, max = 1000, message = "Question text must be between 5 and 1000 characters")
    private String text;

    @Min(value = 0, message = "Points must be positive or zero")
    private double points;

    @Min(value = 0, message = "Order index must be positive or zero")
    private int orderIndex;

    @NotNull(message = "Multiple answers flag is mandatory")
    private Boolean multipleAnswersAllowed;

    @NotNull(message = "Choices are mandatory")
    @Size(min = 2, message = "At least 2 choices are required")
    @Valid
    private List<ChoiceRequest> choices;

    public QCMQuestionRequest() {}

    public QCMQuestionRequest(String text, double points, int orderIndex,
                              Boolean multipleAnswersAllowed, List<ChoiceRequest> choices) {
        this.text = text;
        this.points = points;
        this.orderIndex = orderIndex;
        this.multipleAnswersAllowed = multipleAnswersAllowed;
        this.choices = choices;
    }

    // Getters and Setters
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public double getPoints() {
        return points;
    }

    public void setPoints(double points) {
        this.points = points;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Boolean getMultipleAnswersAllowed() {
        return multipleAnswersAllowed;
    }

    public void setMultipleAnswersAllowed(Boolean multipleAnswersAllowed) {
        this.multipleAnswersAllowed = multipleAnswersAllowed;
    }

    public List<ChoiceRequest> getChoices() {
        return choices;
    }

    public void setChoices(List<ChoiceRequest> choices) {
        this.choices = choices;
    }
}
