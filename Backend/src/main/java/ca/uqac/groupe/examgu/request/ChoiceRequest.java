package ca.uqac.groupe.examgu.request;



import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ChoiceRequest {

    @NotEmpty(message = "Choice text is mandatory")
    @Size(min = 1, max = 500, message = "Choice text must be between 1 and 500 characters")
    private String text;

    @NotNull(message = "isCorrect flag is mandatory")
    private Boolean isCorrect;

    public ChoiceRequest() {}

    public ChoiceRequest(String text, Boolean isCorrect) {
        this.text = text;
        this.isCorrect = isCorrect;
    }

    // Getters and Setters
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
}
