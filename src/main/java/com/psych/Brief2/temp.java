package com.psych.Brief2;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;


public class temp {
  public static void main(String[] args) throws FileNotFoundException {
    File file = new File("./Brief2\\src\\main\\resources\\questions.txt");
        try (Scanner input = new Scanner(file)) {
            while (input.hasNextLine()) {
                String line = input.nextLine();
                System.out.println(line);
            }   }
  }
}
