package com.anushka.taskmanager;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Task Manager Backend is Running";
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> 438f23f07e9de93a71c7682bf098a97a3f854a55
