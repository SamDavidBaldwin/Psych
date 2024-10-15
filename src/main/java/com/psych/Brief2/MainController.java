package com.psych.Brief2;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {
	
	@RequestMapping("/")
	public String index() {
		return "Test Selection";
	}

	@RequestMapping("/Brief2/Parent")
	public String Brief2P() {
		return "Brief2_Parent";
	}

	@RequestMapping("/Brief2/Teacher")
	public String Brief2T() {
		return "Brief2_Teacher";
	}

	@RequestMapping("/Masc2/Parent")
	public String Masc2P() {
		return "Masc2_Parent";
	}

	@RequestMapping("/Masc2/Self")
	public String Masc2S() {
		return "Masc2_Self";
	}

	@RequestMapping("/CDI")
	public String CDI(){
		return "CDI";
	}
	
	@RequestMapping("/test")
	public String test(){
		return "testing";
	}
}