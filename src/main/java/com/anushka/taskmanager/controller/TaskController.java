package com.anushka.taskmanager.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anushka.taskmanager.model.Priority;
import com.anushka.taskmanager.model.Task;
import com.anushka.taskmanager.service.TaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        Task createdTask = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody Task updatedTask) {
        Task task = taskService.updateTask(id, updatedTask);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok("Task deleted successfully");
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Task> markCompleted(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        task.setCompleted(true);
        Task updated = taskService.updateTask(id, task);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/priority/{priority}")
    public List<Task> getTasksByPriority(@PathVariable Priority priority) {
        return taskService.getTasksByPriority(priority);
    }

    @GetMapping("/completed")
    public List<Task> getCompletedTasks() {
        return taskService.getCompletedTasks();
    }

    @GetMapping("/overdue")
    public List<Task> getOverdueTasks() {
        return taskService.getOverdueTasks();
    }
}
