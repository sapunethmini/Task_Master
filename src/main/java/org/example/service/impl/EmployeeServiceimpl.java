package org.example.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.dto.Employee;
import org.example.entity.EmployeeEntity;
import org.example.repository.EmployeeRepository;
import org.example.service.EmployeeService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeServiceimpl implements EmployeeService {
    final EmployeeRepository repository;

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void addEmployee(Employee employee) {

            repository.save(mapper.convertValue(employee, EmployeeEntity.class));
    }

    @Override
    public List<Employee> getAll() {
        ArrayList<Employee> employeeList = new ArrayList<>();

        List<EmployeeEntity> allEntitylist = repository.findAll();
        allEntitylist.forEach(entity->{
            employeeList.add(mapper.convertValue(entity,Employee.class));
        });
        return employeeList;
    }

    @Override
    public void deleteEmployeeById(Long id) {
        if(repository.existsById(id)){
            repository.deleteById(id);
        }
    }

    @Override
    public void updateEmployee(Employee emp) {
        if(repository.findById(emp.getId()).isPresent()){
            repository.save(mapper.convertValue(emp,EmployeeEntity.class));
        }
    }

    @Override
    public Employee findById(Long id) {

        if(repository.findById(id).isPresent()){
            Optional<EmployeeEntity> byId = repository.findById(id);
           return mapper.convertValue(byId.get(),Employee.class);
        }
        return new Employee();
    }
}
