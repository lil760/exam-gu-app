package ca.uqac.groupe.examgu.response;

import java.util.List;

public class QuestionResponse {
    private Long id;
    private String text;
    private double points;
    private String type; // "QCM" ou "TRUE_FALSE"

    // pour QCM
    private Boolean multipleAnswersAllowed;
    private List<ChoiceResponse> choices;

    // pour True/False
    private Boolean correctAnswer;

    public static class ChoiceResponse {
        private Long id;
        private String text;
        private Boolean correct;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }

        public Boolean getCorrect() { return correct; }
        public void setCorrect(Boolean correct) { this.correct = correct; }
    }

    // getters / setters
    // ...
}
