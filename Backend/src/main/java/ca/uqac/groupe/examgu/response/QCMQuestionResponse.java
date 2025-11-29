package ca.uqac.groupe.examgu.response;



import java.util.List;

public class QCMQuestionResponse {

    private long id;
    private String text;
    private double points;
    private int orderIndex;
    private String type;
    private boolean multipleAnswersAllowed;
    private List<ChoiceResponse> choices;

    public QCMQuestionResponse() {}

    public QCMQuestionResponse(long id, String text, double points, int orderIndex,
                               boolean multipleAnswersAllowed, List<ChoiceResponse> choices) {
        this.id = id;
        this.text = text;
        this.points = points;
        this.orderIndex = orderIndex;
        this.type = "QCM";
        this.multipleAnswersAllowed = multipleAnswersAllowed;
        this.choices = choices;
    }

    // Getters and Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isMultipleAnswersAllowed() {
        return multipleAnswersAllowed;
    }

    public void setMultipleAnswersAllowed(boolean multipleAnswersAllowed) {
        this.multipleAnswersAllowed = multipleAnswersAllowed;
    }

    public List<ChoiceResponse> getChoices() {
        return choices;
    }

    public void setChoices(List<ChoiceResponse> choices) {
        this.choices = choices;
    }
}