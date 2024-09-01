package org.example.EmployeeController;

import lombok.RequiredArgsConstructor;
import org.example.dto.Employee;
import org.example.entity.EmployeeEntity;
import org.example.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/emp-controller")
@Controller

public class EmployeeController {
   @Autowired
   EmployeeService service;


    @PostMapping("/add-employee")
    @ResponseStatus(HttpStatus.CREATED)
    public void addEmployeeDetails(@RequestBody Employee employee){
        service.addEmployee(employee);
    }

    @GetMapping("/get-all")
    public List<Employee> getAll(){
        return service.getAll();
    }

    @DeleteMapping("delete-emp/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public String deleteEmployee(@PathVariable Long id){
        service.deleteEmployeeById(id);
        return "successfully deleted";
    }

    @PutMapping("/update-emp")
    @ResponseStatus(HttpStatus.RESET_CONTENT)
    public void updateEmployee(@RequestBody Employee emp){
        service.updateEmployee(emp);
    }


    @GetMapping("/find-by-id/{id}")
    public Employee findById(@PathVariable Long id){
        return service.findById(id);

    }

}
