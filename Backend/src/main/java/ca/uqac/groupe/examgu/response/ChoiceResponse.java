package ca.uqac.groupe.examgu.response;



public class ChoiceResponse {

    private long id;
    private String text;

    public ChoiceResponse() {}

    public ChoiceResponse(long id, String text) {
        this.id = id;
        this.text = text;
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
}
