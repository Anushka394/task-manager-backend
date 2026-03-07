package com.anushka.taskmanager.repository;

<<<<<<< HEAD
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.anushka.taskmanager.model.Task;
import com.anushka.taskmanager.model.Priority;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByPriority(Priority priority);

    List<Task> findByCompletedTrue();

    List<Task> findByDueDateBefore(LocalDate date);
=======
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.anushka.taskmanager.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
>>>>>>> 438f23f07e9de93a71c7682bf098a97a3f854a55
}