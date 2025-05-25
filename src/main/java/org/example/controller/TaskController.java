package org.example.controller;
import org.example.dto.Priority;
import org.example.dto.TaskRequestDto;
import org.example.dto.TaskResponseDto;
import org.example.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/createTask")
    public ResponseEntity<TaskResponseDto> createTask(@RequestBody TaskRequestDto taskDto) {
        if (taskDto.getUserId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // For debugging
        System.out.println("Received userId: " + taskDto.getUserId());

        TaskResponseDto createdTask = taskService.createTask(taskDto);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<TaskResponseDto> getTaskById(@PathVariable Long id) {
        TaskResponseDto task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getAllTasks() {
        List<TaskResponseDto> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDto> updateTask(@PathVariable Long id, @RequestBody TaskRequestDto taskDto) {
        TaskResponseDto updatedTask = taskService.updateTask(id, taskDto);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByUserId(@PathVariable Long userId) {
        List<TaskResponseDto> tasks = taskService.getTasksByUserId(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByCategory(@PathVariable String category) {
        List<TaskResponseDto> tasks = taskService.getTasksByCategory(category);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByStatus(@PathVariable String status) {
        List<TaskResponseDto> tasks = taskService.getTasksByStatus(status);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByUserIdAndCategory(
            @PathVariable Long userId,
            @PathVariable String category) {
        List<TaskResponseDto> tasks = taskService.getTasksByUserIdAndCategory(userId, category);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByUserIdAndStatus(
            @PathVariable Long userId,
            @PathVariable String status) {
        List<TaskResponseDto> tasks = taskService.getTasksByUserIdAndStatus(userId, status);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/sort/created-date/desc")
    public ResponseEntity<List<TaskResponseDto>> getAllTasksSortedByCreatedDateDesc() {
        List<TaskResponseDto> tasks = taskService.getAllTasksSortedByCreatedDateDesc();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/sort/created-date/asc")
    public ResponseEntity<List<TaskResponseDto>> getAllTasksSortedByCreatedDateAsc() {
        List<TaskResponseDto> tasks = taskService.getAllTasksSortedByCreatedDateAsc();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/sort/priority/desc")
    public ResponseEntity<List<TaskResponseDto>> getAllTasksSortedByPriorityDesc() {
        List<TaskResponseDto> tasks = taskService.getAllTasksSortedByPriorityDesc();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/sort/priority/asc")
    public ResponseEntity<List<TaskResponseDto>> getAllTasksSortedByPriorityAsc() {
        List<TaskResponseDto> tasks = taskService.getAllTasksSortedByPriorityAsc();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/sort/title")
    public ResponseEntity<List<TaskResponseDto>> getAllTasksSortedByTitleAsc() {
        List<TaskResponseDto> tasks = taskService.getAllTasksSortedByTitleAsc();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/sort/status")
    public ResponseEntity<List<TaskResponseDto>> getAllTasksSortedByStatusAsc() {
        List<TaskResponseDto> tasks = taskService.getAllTasksSortedByStatusAsc();
        return ResponseEntity.ok(tasks);
    }

    // Combined filtering and sorting
    @GetMapping("/user/{userId}/sort/priority")
    public ResponseEntity<List<TaskResponseDto>> getTasksByUserIdSortedByPriority(@PathVariable Long userId) {
        List<TaskResponseDto> tasks = taskService.getTasksByUserIdSortedByPriority(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/{userId}/sort/created-date")
    public ResponseEntity<List<TaskResponseDto>> getTasksByUserIdSortedByCreatedDate(@PathVariable Long userId) {
        List<TaskResponseDto> tasks = taskService.getTasksByUserIdSortedByCreatedDate(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/category/{category}/sort/priority")
    public ResponseEntity<List<TaskResponseDto>> getTasksByCategorySortedByPriority(@PathVariable String category) {
        List<TaskResponseDto> tasks = taskService.getTasksByCategorySortedByPriority(category);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}/sort/created-date")
    public ResponseEntity<List<TaskResponseDto>> getTasksByStatusSortedByCreatedDate(@PathVariable String status) {
        List<TaskResponseDto> tasks = taskService.getTasksByStatusSortedByCreatedDate(status);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/sort")
    public ResponseEntity<List<TaskResponseDto>> getAllTasksSorted(
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        // Call a service method instead of using repository directly
        List<TaskResponseDto> tasks = taskService.getAllTasksSorted(sortBy, direction);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}/count")
    public ResponseEntity<Long> getTaskCountByStatus(@PathVariable String status) {
        Long count = taskService.getTaskCountByStatus(status);
        return ResponseEntity.ok(count);
    }


    @GetMapping("/team/{departmentId}/count")
    public ResponseEntity<Long> getTaskCountByTeam(@PathVariable String departmentId) {
        Long count = taskService.getTaskCountByTeam(departmentId);
        return ResponseEntity.ok(count);
    }



    @GetMapping("/count")
    public ResponseEntity<Long> getTotalTaskCount() {
        Long count = taskService.getTotalTaskCount();
        return ResponseEntity.ok(count);
    }



    @GetMapping("/team/{team}/priority/{priority}/count")
    public ResponseEntity<Long> getTaskCountByTeamAndPriority(
            @PathVariable String team,
            @PathVariable String priority) {
        try {
            Priority priorityEnum = Priority.valueOf(priority.toUpperCase());
            Long count = taskService.getTaskCountByTeamAndPriority(team, priorityEnum);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getAllTasks/team/{team}/priority/{priority}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByTeamAndPriority(
            @PathVariable String team,
            @PathVariable String priority) {
        try {
            Priority priorityEnum = Priority.valueOf(priority.toUpperCase());
            List<TaskResponseDto> tasks = taskService.getTasksByTeamAndPriority(team, priorityEnum);
            return ResponseEntity.ok(tasks);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getAllTasks/team/{team}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByTeam(
            @PathVariable String team) {
        try {
            List<TaskResponseDto> tasks = taskService.getTasksByTeam(team);
            return ResponseEntity.ok(tasks);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }




    @GetMapping("/getAllTasks/team/{team}/status/{status}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByTeamAndStatus(
            @PathVariable String team,
            @PathVariable String status) {
        List<TaskResponseDto> tasks = taskService.getTasksByTeamAndStatus(team, status);
        return ResponseEntity.ok(tasks);
    }


    // Add these specific endpoints to your TaskController class
// Make sure to place them BEFORE any generic endpoints to avoid conflicts

    @GetMapping("/team/{team}/status/{status}/count")     // Most specific first
    public ResponseEntity<Long> getTaskCountByTeamAndStatus(
            @PathVariable String team,
            @PathVariable String status) {
        try {
            System.out.println("Received request for team: " + team + ", status: " + status);
            Long count = taskService.getTaskCountByTeamAndStatus(team, status);
            System.out.println("Count result: " + count);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            System.err.println("Error in getTaskCountByTeamAndStatus: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/User/{userId}/status/{status}/count")
    public ResponseEntity<Long> getTaskCountByUserAndStatus(
            @PathVariable Long userId,  // Match type!
            @PathVariable String status) {
        Long count = taskService.getTaskCountByUserAndStatus(userId, status);
        return ResponseEntity.ok(count);
    }


}