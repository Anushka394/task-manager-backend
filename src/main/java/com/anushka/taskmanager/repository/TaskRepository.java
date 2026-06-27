package com.anushka.taskmanager.repository;

import com.anushka.taskmanager.model.Priority;
import com.anushka.taskmanager.model.Task;
import com.anushka.taskmanager.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Paginated — used by GET /api/tasks
    Page<Task> findByUser(User user, Pageable pageable);
    Page<Task> findByUserAndCompletedTrue(User user, Pageable pageable);
    Page<Task> findByUserAndCompletedFalse(User user, Pageable pageable);
    Page<Task> findByUserAndPriority(User user, Priority priority, Pageable pageable);

    // Non-paginated (overdue list, single-task lookup)
    Optional<Task> findByIdAndUser(Long id, User user);
    List<Task> findByUserAndDueDateBeforeAndCompletedFalse(User user, LocalDate date);
}
