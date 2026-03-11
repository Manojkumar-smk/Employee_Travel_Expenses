using {com.al.a1f6f1b3.db as a1f6f1b3} from '../db/schema';

service TravelRequestService {
    entity Employees      as projection on a1f6f1b3.Employees;
    entity Projects       as projection on a1f6f1b3.Projects;
    entity Categories     as projection on a1f6f1b3.Categories;

    @odata.draft.enabled
    @Common.SideEffects: {
        SourceProperties: ['project_ID'],
        TargetProperties: ['eligibleAmt']
    }
    entity TravelRequest  as projection on a1f6f1b3.TravelRequest;

    entity TravelExpenses as projection on a1f6f1b3.TravelExpenses;
}
