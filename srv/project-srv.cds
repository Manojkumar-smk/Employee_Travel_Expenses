using {com.al.a1f6f1b3.db as a1f6f1b3} from '../db/schema';

service ProjectService {
    entity ProjectStatus as projection on a1f6f1b3.ProjectStatus;
    entity Employees as projection on a1f6f1b3.Employees;
            @odata.draft.enabled
            @requires : 'Admin'
    entity Projects      as
        projection on a1f6f1b3.Projects {
            *,
            case
                when budget = 0
                     then 'No Budget'
                when budget < 10000
                     then 'Low Budget'
                else 'Available'
            end as budgetAvail       : String,

            case
                when budget = 0
                     then 1
                when budget < 10000
                     then 2
                else 3
            end as statusCriticality : Integer,

        }

        actions {
            @Common.SideEffects: {TargetProperties: [
                'budget',
                'budgetAvail',
                'statusCriticality'
            ]}
            action AddBudget(NewBudget: Decimal(10, 2) @Common.Label: 'New Budget' ) returns String;
        }

}
annotate ProjectService.Projects with {
    status @Common.Text           : status.name
           @Common.TextArrangement: #TextOnly;
    projManager @Common.Text           : projManager.name
           @Common.TextArrangement: #TextOnly;
};
