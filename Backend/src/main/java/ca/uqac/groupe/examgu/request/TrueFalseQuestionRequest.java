package ca.uqac.groupe.examgu.request;



import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TrueFalseQuestionRequest {

    @NotEmpty(message = "Question text is mandatory")
    @Size(min = 5, max = 1000, message = "Question text must be between 5 and 1000 characters")
    private String text;

    @Min(value = 0, message = "Points must be positive or zero")
    private double points;

    @Min(value = 0, message = "Order index must be positive or zero")
    private int orderIndex;

    @NotNull(message = "Correct answer is mandatory")
    private Boolean correctAnswer;

    public TrueFalseQuestionRequest() {}

    public TrueFalseQuestionRequest(String text, double points, int orderIndex, Boolean correctAnswer) {
        this.text = text;
        this.points = points;
        this.orderIndex = orderIndex;
        this.correctAnswer = correctAnswer;
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

    public Boolean getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(Boolean correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
}