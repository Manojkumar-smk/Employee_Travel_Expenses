using {com.al.a1f6f1b3.db as db} from '../db/schema';

service employeeService {
    entity Projects          as projection on db.Projects;

    @odata.draft.enabled
    entity Employees         as projection on db.Employees;
    entity ProjectAssignment as projection on db.ProjectAssignment{
        *,
        employee.name as employeeName,
        project.Project as projectName
    };

}

