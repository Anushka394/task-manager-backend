package com.anushka.taskmanager.service;

import com.anushka.taskmanager.dto.request.PriorityUpdateRequest;
import com.anushka.taskmanager.dto.request.TaskRequest;
import com.anushka.taskmanager.dto.response.PagedResponse;
import com.anushka.taskmanager.dto.response.TaskResponse;
import com.anushka.taskmanager.exception.ResourceNotFoundException;
import com.anushka.taskmanager.model.Priority;
import com.anushka.taskmanager.model.Task;
import com.anushka.taskmanager.model.User;
import com.anushka.taskmanager.repository.TaskRepository;
import com.anushka.taskmanager.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private Task ownedTask(Long id) {
        return taskRepository.findByIdAndUser(id, currentUser())
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
    }

    private Pageable buildPageable(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        return PageRequest.of(page, Math.min(size, 100), sort);
    }

    private <T> PagedResponse<T> toPagedResponse(Page<T> p) {
        return new PagedResponse<>(p.getContent(), p.getNumber(), p.getSize(),
                p.getTotalElements(), p.getTotalPages(), p.isLast());
    }

    // ── Queries ──────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public PagedResponse<TaskResponse> getAllTasks(int page, int size, String sortBy, String direction) {
        Pageable pageable = buildPageable(page, size, sortBy, direction);
        return toPagedResponse(taskRepository.findByUser(currentUser(), pageable).map(TaskResponse::from));
    }

    @Transactional(readOnly = true)
    public PagedResponse<TaskResponse> getCompletedTasks(int page, int size, String sortBy, String direction) {
        Pageable pageable = buildPageable(page, size, sortBy, direction);
        return toPagedResponse(taskRepository.findByUserAndCompletedTrue(currentUser(), pageable).map(TaskResponse::from));
    }

    @Transactional(readOnly = true)
    public PagedResponse<TaskResponse> getPendingTasks(int page, int size, String sortBy, String direction) {
        Pageable pageable = buildPageable(page, size, sortBy, direction);
        return toPagedResponse(taskRepository.findByUserAndCompletedFalse(currentUser(), pageable).map(TaskResponse::from));
    }

    @Transactional(readOnly = true)
    public PagedResponse<TaskResponse> getTasksByPriority(Priority priority, int page, int size, String sortBy, String direction) {
        Pageable pageable = buildPageable(page, size, sortBy, direction);
        return toPagedResponse(taskRepository.findByUserAndPriority(currentUser(), priority, pageable).map(TaskResponse::from));
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(Long id) {
        return TaskResponse.from(ownedTask(id));
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getOverdueTasks() {
        return taskRepository.findByUserAndDueDateBeforeAndCompletedFalse(currentUser(), LocalDate.now())
                .stream().map(TaskResponse::from).toList();
    }

    // ── Mutations ─────────────────────────────────────────────────────────────

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        User user = currentUser();
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
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
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
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
    public TaskResponse updatePriority(Long id, PriorityUpdateRequest request) {
        Task task = ownedTask(id);
        task.setPriority(request.getPriority());
        log.info("Task id={} priority set to {}", id, request.getPriority());
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long id) {
        taskRepository.delete(ownedTask(id));
        log.info("Deleted task id={}", id);
    }
}
