package com.anushka.taskmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.anushka.taskmanager.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
}