using TravelRequestService as service from '../../srv/travelrequest-srv';

annotate service.TravelRequest with @(
    UI.FieldGroup #GeneratedGroup              : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: tripNumber,
                Label: 'Trip Number',
            },
            {
                $Type: 'UI.DataField',
                Value: employee_ID,
            },
            {
                $Type: 'UI.DataField',
                Value: project_ID,
                Label : 'Project ID',
            },
            {
                $Type: 'UI.DataField',
                Label: 'purpose',
                Value: purpose,
            },
            {
                $Type: 'UI.DataField',
                Label: 'travelCity',
                Value: travelCity,
            },
            {
                $Type: 'UI.DataField',
                Label: 'fromDate',
                Value: fromDate,
            },
            {
                $Type: 'UI.DataField',
                Label: 'toDate',
                Value: toDate,
            },
            {
                $Type: 'UI.DataField',
                Label: 'incurredAmt',
                Value: incurredAmt,
            },
            {
                $Type: 'UI.DataField',
                Value: approvedAmt,
                Label: 'approvedAmt',
            },
            {
                $Type: 'UI.DataField',
                Label: 'eligibleAmt',
                Value: eligibleAmt,
            },
            {
                $Type: 'UI.DataField',
                Label: 'status',
                Value: status,
            },
            {
                $Type: 'UI.DataField',
                Label: 'rejectionReason',
                Value: rejectionReason,
            },
        ],
    },
    UI.Facets                                  : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'GeneratedFacet1',
            Label : 'General Information',
            Target: '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Expenses',
            ID    : 'Expenses',
            Target: 'expenses/@UI.LineItem#Expenses',
        },
    ],
    UI.LineItem                                : [
        {
            $Type: 'UI.DataField',
            Value: tripNumber,
        },
        {
            $Type         : 'UI.DataField',
            Label         : 'Purpose',
            Value         : purpose,
            @UI.Importance: #Low,
        },
        {
            $Type: 'UI.DataField',
            Label: 'Travel City',
            Value: travelCity,
        },
        {
            $Type: 'UI.DataField',
            Label: 'From Date',
            Value: fromDate,
        },
        {
            $Type: 'UI.DataField',
            Label: 'To Date',
            Value: toDate,
        },
    ],
    UI.SelectionFields                         : [
        employee_ID,
        project_ID,
        tripNumber,
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type              : 'UI.SelectionPresentationVariantType',
        PresentationVariant: {
            $Type         : 'UI.PresentationVariantType',
            Visualizations: ['@UI.LineItem',
            ],
        },
        SelectionVariant   : {
            $Type        : 'UI.SelectionVariantType',
            SelectOptions: [],
        },
        Text               : 'Table View',
    },
    UI.LineItem #tableView                     : [],
    UI.SelectionPresentationVariant #tableView1: {
        $Type              : 'UI.SelectionPresentationVariantType',
        PresentationVariant: {
            $Type         : 'UI.PresentationVariantType',
            Visualizations: ['@UI.LineItem#tableView',
            ],
        },
        SelectionVariant   : {
            $Type        : 'UI.SelectionVariantType',
            SelectOptions: [],
        },
        Text               : 'Table View 1',
    },
    UI.HeaderInfo                              : {
        TypeName      : 'Travel Expense',
        TypeNamePlural: 'Travel Expenses',
        Title         : {
            $Type: 'UI.DataField',
            Value: employee.name,
        },
        Description   : {
            $Type: 'UI.DataField',
            Value: purpose,
        },
        TypeImageUrl  : 'sap-icon://travel-request',
    },
);

annotate service.TravelRequest with {
    employee @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Employees',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: employee_ID,
                    ValueListProperty: 'ID',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'empId',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'role',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'department',
                },
            ],
            Label         : 'Employee List',
        },
        Common.Label                   : 'Employee ID',
        Common.ValueListWithFixedValues: false,
        Common.FieldControl            : #Mandatory,
        Common.Text                    : employee.name,
        Common.Text.@UI.TextArrangement: #TextOnly
    )
};


annotate service.TravelRequest with {
    tripNumber @(Common.Label: 'Trip Number',
    )
};

annotate service.TravelExpenses with @(
    UI.LineItem #Expenses  : [
        {
            $Type: 'UI.DataField',
            Value: billNo,
            Label: 'billNo',
        },
        {
            $Type: 'UI.DataField',
            Value: description,
            Label: 'description',
        },
        {
            $Type: 'UI.DataField',
            Value: category_ID,
            Label: 'category_ID',
        },
        {
            $Type: 'UI.DataField',
            Value: amount,
            Label: 'amount',
        },
    ],
    UI.Facets              : [{
        $Type : 'UI.ReferenceFacet',
        Label : 'Expenses',
        ID    : 'Expenses',
        Target: '@UI.FieldGroup#Expenses',
    }, ],
    UI.FieldGroup #Expenses: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: ID,
                Label: 'ID',
            },
            {
                $Type: 'UI.DataField',
                Value: travel_ID,
                Label: 'travel_ID',
            },
            {
                $Type: 'UI.DataField',
                Value: billNo,
                Label: 'billNo',
            },
            {
                $Type: 'UI.DataField',
                Value: category_ID,
                Label: 'category_ID',
            },
            {
                $Type: 'UI.DataField',
                Value: description,
                Label: 'description',
            },
            {
                $Type: 'UI.DataField',
                Value: date,
                Label: 'date',
            },
            {
                $Type: 'UI.DataField',
                Value: amount,
                Label: 'amount',
            },
            {
                $Type: 'UI.DataField',
                Value: billContent,
                Label: 'billContent',
            },
            {
                $Type: 'UI.DataField',
                Value: currency_code,
            },
        ],
    },
    UI.HeaderInfo          : {
        TypeName      : 'Travel Expense',
        TypeNamePlural: 'Travel Expenses',
        Title         : {
            $Type: 'UI.DataField',
            Value: billNo,
        },
        TypeImageUrl  : 'sap-icon://travel-expense',
    },
);

annotate service.TravelExpenses with {
    category @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Categories',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: category_ID,
                ValueListProperty: 'ID',
            }, ],
            Label         : 'Categories',
        },
        Common.ValueListWithFixedValues: true,
        Common.ExternalID              : category.category,
    )
};

annotate service.Categories with {
    ID @Common.Text: category
};

annotate service.TravelRequest with {
    approvedAmt @Common.FieldControl: #ReadOnly
};

annotate service.TravelRequest with {
    eligibleAmt @Common.FieldControl: #ReadOnly
};

annotate service.TravelRequest with {
    rejectionReason @UI.MultiLineText: true
};

annotate service.TravelRequest with {
    incurredAmt @Common.FieldControl: #ReadOnly
};
annotate TravelRequestService.TravelRequest with {
    project @(
        Common.Label                   : 'Project',
        Common.Text                    : project.Project, 
        Common.TextArrangement         : #TextOnly,
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'ProjectAssignment',
            Parameters    : [
                // 1. DYNAMIC FILTER: Takes employee_ID from TravelRequest 
                // and filters ProjectAssignment records by employee_ID.
                {
                    $Type            : 'Common.ValueListParameterIn',
                    LocalDataProperty: employee_ID,
                    ValueListProperty: 'employee_ID',
                },
                // 2. SELECTION: Returns the selected project_ID back to the form.
                {
                    $Type            : 'Common.ValueListParameterOut',
                    LocalDataProperty: project_ID,
                    ValueListProperty: 'project_ID',
                },
                // 3. DISPLAY: Shows the readable project name in the search help.
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'project/Project',
                },
            ],
            Label         : 'Assigned Projects Only',
        },
        Common.ValueListWithFixedValues: false
    )
};


annotate service.Projects with {
    Project @(
        Common.Text : description,
        Common.Text.@UI.TextArrangement : #TextOnly,
)};

