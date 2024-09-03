package com.psych.Brief2;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {
	
	@RequestMapping("/")
	public String index() {
		return "Test Selection";
	}

	@RequestMapping("/Brief2")
	public String Brief2() {
		return "Brief2";
	}

	
}