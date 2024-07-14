package com.Spring_social_media.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.Spring_social_media.models.User;
import com.Spring_social_media.repositories.UserRepository;

@Controller 
@RequestMapping(path="/user") 
public class UserController {
  @Autowired 
        
  private UserRepository userRepository;

  @PostMapping(path="/add") // Map ONLY POST Requests
  public @ResponseBody String addNewUser (@RequestParam String name
      , @RequestParam String email, @RequestParam String username, @RequestParam String password) {
    

    User n = new User();

    n.setName(name);
    n.setEmail(email);
    n.setUsername(username);
    n.setPassword(password);
    userRepository.save(n);

    return "User Created Successfully";
  }

  @GetMapping(path="/all")
  public @ResponseBody Iterable<User> getAllUsers() {
    return userRepository.findAll();
  }
}