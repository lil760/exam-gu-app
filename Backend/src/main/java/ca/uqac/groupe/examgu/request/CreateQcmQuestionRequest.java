package ca.uqac.groupe.examgu.request;

import java.util.List;

public class CreateQcmQuestionRequest {
    private String text;
    private double points;
    private boolean multipleAnswersAllowed;
    private List<ChoiceDto> choices;

    public static class ChoiceDto {
        private String text;
        private boolean correct;

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }

        public boolean isCorrect() { return correct; }
        public void setCorrect(boolean correct) { this.correct = correct; }
    }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public double getPoints() { return points; }
    public void setPoints(double points) { this.points = points; }

    public boolean isMultipleAnswersAllowed() { return multipleAnswersAllowed; }
    public void setMultipleAnswersAllowed(boolean multipleAnswersAllowed) { this.multipleAnswersAllowed = multipleAnswersAllowed; }

    public List<ChoiceDto> getChoices() { return choices; }
    public void setChoices(List<ChoiceDto> choices) { this.choices = choices; }
}
