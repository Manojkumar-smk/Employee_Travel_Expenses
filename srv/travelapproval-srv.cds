using {com.al.a1f6f1b3.db as a1f6f1b3} from '../db/schema';

service TravelApprovalService  @( restrict : [
    {
        grant : ['*'],
        to : 'Approver'
    }
 ]){
    entity Employees      as projection on a1f6f1b3.Employees;
    entity Projects       as projection on a1f6f1b3.Projects;
    entity Categories     as projection on a1f6f1b3.Categories;

    @odata.draft.enabled
    entity TravelApproval as
        projection on a1f6f1b3.TravelApproval {
            *,
            travel   : redirected to TravelRequest,
            approver : redirected to Employees,
        };

    entity TravelRequest  as
        projection on a1f6f1b3.TravelRequest {
            *,
            employee : redirected to Employees,
            project  : redirected to Projects,
            expenses : redirected to TravelExpenses,
        }
        actions {
            action approveRequest(approver_ID : UUID)                            returns TravelApproval;
            action rejectRequest(approver_ID : UUID, rejectionReason: String(200)) returns TravelApproval;
        };

    entity TravelExpenses as
        projection on a1f6f1b3.TravelExpenses {
            *,
            category : redirected to Categories,
        }
        actions {
            action approveExpense(approver_ID : UUID, remarks : String(200) ) returns TravelExpenses;
            action rejectExpense(approver_ID : UUID, remarks : String(200) )  returns TravelExpenses;
        };

}
