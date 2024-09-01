package org.example.EmployeeController;

import lombok.RequiredArgsConstructor;
import org.example.dto.Employee;
import org.example.entity.EmployeeEntity;
import org.example.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public void addEmployeeDetails(@RequestBody Employee employee){
        service.addEmployee(employee);
    }

    @GetMapping("/get-all")
    public List<Employee> getAll(){
        return service.getAll();
    }


}
