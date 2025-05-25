package org.example.repository;

import org.example.entity.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<EmployeeEntity,Long> {

    EmployeeEntity  findByfirstname(String firstname );

    List<EmployeeEntity> findByDepartment_Id(String departmentId);

    EmployeeEntity findByEmail(String email);

    long countByDepartment_Id(String departmentId);
}
