package com.anushka.taskmanager.service;

import com.anushka.taskmanager.dto.request.TaskRequest;
import com.anushka.taskmanager.dto.response.TaskResponse;
import com.anushka.taskmanager.exception.ResourceNotFoundException;
import com.anushka.taskmanager.model.Priority;
import com.anushka.taskmanager.model.Task;
import com.anushka.taskmanager.model.User;
import com.anushka.taskmanager.repository.TaskRepository;
import com.anushka.taskmanager.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {
    private static final Logger log = LoggerFactory.getLogger(TaskService.class);

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository; this.userRepository = userRepository;
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private Task ownedTask(Long id) {
        return taskRepository.findByIdAndUser(id, currentUser())
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findByUser(currentUser()).stream().map(TaskResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(Long id) { return TaskResponse.from(ownedTask(id)); }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        User user = currentUser();
        Task task = new Task();
        task.setTitle(request.getTitle()); task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        task.setUser(user);
        Task saved = taskRepository.save(task);
        log.info("Created task id={} for user id={}", saved.getId(), user.getId());
        return TaskResponse.from(saved);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = ownedTask(id);
        task.setTitle(request.getTitle()); task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse completeTask(Long id) {
        Task task = ownedTask(id);
        task.setCompleted(true);
        log.info("Task id={} marked complete", id);
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long id) {
        taskRepository.delete(ownedTask(id));
        log.info("Deleted task id={}", id);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getCompletedTasks() {
        return taskRepository.findByUserAndCompletedTrue(currentUser()).stream().map(TaskResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getPendingTasks() {
        return taskRepository.findByUserAndCompletedFalse(currentUser()).stream().map(TaskResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByPriority(Priority priority) {
        return taskRepository.findByUserAndPriority(currentUser(), priority).stream().map(TaskResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getOverdueTasks() {
        return taskRepository.findByUserAndDueDateBefore(currentUser(), LocalDate.now())
                .stream().map(TaskResponse::from).toList();
    }
}
