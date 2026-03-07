package com.anushka.taskmanager.model;

<<<<<<< HEAD
import jakarta.persistence.*;
import java.time.LocalDate;
=======
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
>>>>>>> 438f23f07e9de93a71c7682bf098a97a3f854a55

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

<<<<<<< HEAD
=======
    @Column(nullable = false)
>>>>>>> 438f23f07e9de93a71c7682bf098a97a3f854a55
    private String title;

    private String description;

    private boolean completed;

<<<<<<< HEAD
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Task() {
    }

=======
    // Constructors
    public Task() {
    }

    public Task(String title, String description, boolean completed) {
        this.title = title;
        this.description = description;
        this.completed = completed;
    }

    // Getters and Setters
>>>>>>> 438f23f07e9de93a71c7682bf098a97a3f854a55
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
<<<<<<< HEAD

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
=======
>>>>>>> 438f23f07e9de93a71c7682bf098a97a3f854a55
}