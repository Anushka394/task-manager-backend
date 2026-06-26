package com.anushka.taskmanager.repository;

import com.anushka.taskmanager.model.Priority;
import com.anushka.taskmanager.model.Task;
import com.anushka.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    Optional<Task> findByIdAndUser(Long id, User user);
    List<Task> findByUserAndCompletedTrue(User user);
    List<Task> findByUserAndCompletedFalse(User user);
    List<Task> findByUserAndPriority(User user, Priority priority);
    List<Task> findByUserAndDueDateBefore(User user, LocalDate date);
}
