package psych;

public class Question {
  private String text; 
  private String response; 
  private int score; 

  public Question() {
    this.text = "";
    this.response = "";
    this.score = 0;
  }
  public static void main(String[] args) {
    Question q = new Question(); 
    q.toString();
    System.out.println(q.getText());
  }

  public String getText(){
    return this.text;
  }

  public void setText(String string){
    this.text = string;
  }

  public String getResponse(){ 
    return this.response;
  }

  public void setResponse(String string){
    this.response = string;
  }

  public int getScore(){
    return this.score;
  }

  public void setScore(int score){
    this.score = score;
  }
   
}
