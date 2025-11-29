package ca.uqac.groupe.examgu.response;



public class TrueFalseQuestionResponse {

    private long id;
    private String text;
    private double points;
    private int orderIndex;
    private String type;

    public TrueFalseQuestionResponse() {}

    public TrueFalseQuestionResponse(long id, String text, double points, int orderIndex) {
        this.id = id;
        this.text = text;
        this.points = points;
        this.orderIndex = orderIndex;
        this.type = "TRUE_FALSE";
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
}
