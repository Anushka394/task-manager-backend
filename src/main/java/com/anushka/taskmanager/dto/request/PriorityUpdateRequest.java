package com.anushka.taskmanager.dto.request;

import com.anushka.taskmanager.model.Priority;
import jakarta.validation.constraints.NotNull;

public class PriorityUpdateRequest {
    @NotNull(message = "Priority is required")
    private Priority priority;

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
}
