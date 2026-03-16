using {com.al.a1f6f1b3.db as a1f6f1b3} from '../db/schema';

service TravelRequestService @( restrict : [
    {
        grant : ['*'],
        to : 'Employee', where : (employee_ID = $user.empId)
    }
 ]){
    entity Employees         as projection on a1f6f1b3.Employees;
    entity Projects          as projection on a1f6f1b3.Projects;
    entity Categories        as projection on a1f6f1b3.Categories;
    entity ProjectAssignment as
        projection on a1f6f1b3.ProjectAssignment {
            *,
            project  : redirected to Projects,
            employee : redirected to Employees
        };

    @odata.draft.enabled
    @Common.SideEffects: {
        SourceProperties: ['project_ID'],
        TargetProperties: ['eligibleAmt']
    }
    entity TravelRequest     as projection on a1f6f1b3.TravelRequest;

    entity TravelExpenses    as projection on a1f6f1b3.TravelExpenses;
}
