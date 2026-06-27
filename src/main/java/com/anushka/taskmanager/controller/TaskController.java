package com.anushka.taskmanager.controller;

import com.anushka.taskmanager.dto.request.PriorityUpdateRequest;
import com.anushka.taskmanager.dto.request.TaskRequest;
import com.anushka.taskmanager.dto.response.PagedResponse;
import com.anushka.taskmanager.dto.response.TaskResponse;
import com.anushka.taskmanager.model.Priority;
import com.anushka.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private static final Logger log = LoggerFactory.getLogger(TaskController.class);
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * GET /api/tasks
     * Optional filters: completed=true|false, priority=LOW|MEDIUM|HIGH
     * Pagination: page (0-based), size, sortBy, direction (asc|desc)
     */
    @GetMapping
    public ResponseEntity<PagedResponse<TaskResponse>> getAllTasks(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) Priority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        PagedResponse<TaskResponse> result;
        if (Boolean.TRUE.equals(completed))       result = taskService.getCompletedTasks(page, size, sortBy, direction);
        else if (Boolean.FALSE.equals(completed)) result = taskService.getPendingTasks(page, size, sortBy, direction);
        else if (priority != null)                result = taskService.getTasksByPriority(priority, page, size, sortBy, direction);
        else                                      result = taskService.getAllTasks(page, size, sortBy, direction);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTask(id));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request) {
        log.info("POST /api/tasks title='{}'", request.getTitle());
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id,
                                                   @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskResponse> markCompleted(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.completeTask(id));
    }

    @PatchMapping("/{id}/priority")
    public ResponseEntity<TaskResponse> updatePriority(@PathVariable Long id,
                                                       @Valid @RequestBody PriorityUpdateRequest request) {
        return ResponseEntity.ok(taskService.updatePriority(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        log.info("DELETE /api/tasks/{}", id);
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<TaskResponse>> getOverdueTasks() {
        return ResponseEntity.ok(taskService.getOverdueTasks());
    }
}
