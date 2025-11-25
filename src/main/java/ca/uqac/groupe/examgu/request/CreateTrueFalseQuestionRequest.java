package ca.uqac.groupe.examgu.request;

public class CreateTrueFalseQuestionRequest {
    private String text;
    private double points;
    private boolean correctAnswer;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public double getPoints() { return points; }
    public void setPoints(double points) { this.points = points; }

    public boolean isCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(boolean correctAnswer) { this.correctAnswer = correctAnswer; }
}
