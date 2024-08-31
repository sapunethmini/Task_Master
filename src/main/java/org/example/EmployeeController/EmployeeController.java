package org.example.EmployeeController;

import org.example.Employee;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/emp-controller")
@Controller
public class EmployeeController {


    List<Employee> employeeList=new ArrayList();
    @PostMapping("/add-employee")
    public void addEmployeeDetails(@RequestBody Employee employee){
        employeeList.add(employee);
    }


}
