package com.anushka.taskmanager.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.anushka.taskmanager.model.Task;
import com.anushka.taskmanager.model.Priority;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByPriority(Priority priority);

    List<Task> findByCompletedTrue();

    List<Task> findByDueDateBefore(LocalDate date);
}