package com.anushka.taskmanager.dto.response;

import com.anushka.taskmanager.model.Priority;
import com.anushka.taskmanager.model.Task;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private LocalDate dueDate;
    private Priority priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TaskResponse from(Task t) {
        TaskResponse r = new TaskResponse();
        r.id = t.getId(); r.title = t.getTitle(); r.description = t.getDescription();
        r.completed = t.isCompleted(); r.dueDate = t.getDueDate();
        r.priority = t.getPriority(); r.createdAt = t.getCreatedAt(); r.updatedAt = t.getUpdatedAt();
        return r;
    }
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public boolean isCompleted() { return completed; }
    public LocalDate getDueDate() { return dueDate; }
    public Priority getPriority() { return priority; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
