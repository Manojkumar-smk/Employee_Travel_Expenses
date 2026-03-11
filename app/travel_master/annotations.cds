using TravelRequestService as service from '../../srv/travelrequest-srv';
annotate service.TravelRequest with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : tripNumber,
                Label : 'Trip Number',
            },
            {
                $Type : 'UI.DataField',
                Value : project_ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'purpose',
                Value : purpose,
            },
            {
                $Type : 'UI.DataField',
                Label : 'travelCity',
                Value : travelCity,
            },
            {
                $Type : 'UI.DataField',
                Label : 'fromDate',
                Value : fromDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'toDate',
                Value : toDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'incurredAmt',
                Value : incurredAmt,
            },
            {
                $Type : 'UI.DataField',
                Value : approvedAmt,
                Label : 'approvedAmt',
            },
            {
                $Type : 'UI.DataField',
                Label : 'eligibleAmt',
                Value : eligibleAmt,
            },
            {
                $Type : 'UI.DataField',
                Label : 'status',
                Value : status,
            },
            {
                $Type : 'UI.DataField',
                Label : 'rejectionReason',
                Value : rejectionReason,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Expenses',
            ID : 'Expenses',
            Target : 'expenses/@UI.LineItem#Expenses',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : tripNumber,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Purpose',
            Value : purpose,
            @UI.Importance : #Low,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Travel City',
            Value : travelCity,
        },
        {
            $Type : 'UI.DataField',
            Label : 'From Date',
            Value : fromDate,
        },
        {
            $Type : 'UI.DataField',
            Label : 'To Date',
            Value : toDate,
        },
    ],
    UI.SelectionFields : [
        employee_ID,
        project_ID,
        tripNumber,
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Table View',
    },
    UI.LineItem #tableView : [
    ],
    UI.SelectionPresentationVariant #tableView1 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Table View 1',
    },
);

annotate service.TravelRequest with {
    employee @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Employees',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : employee_ID,
                    ValueListProperty : 'ID',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'empId',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'name',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'role',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'department',
                },
            ],
        },
        Common.Label : 'Employee ID',
    )
};

annotate service.TravelRequest with {
    project @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Projects',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : project_ID,
                    ValueListProperty : 'ID',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'projId',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'Project',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'description',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'budget',
                },
            ],
        },
        Common.Label : 'Project ID',
    )
};

annotate service.TravelRequest with {
    tripNumber @(
    Common.Label : 'Trip Number',
    Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'TravelRequest',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : tripNumber,
                ValueListProperty : 'tripNumber',
            },
        ],
        Label : 'Trip Number',
    },
    Common.ValueListWithFixedValues : true,
)
};

annotate service.TravelExpenses with @(
    UI.LineItem #Expenses : [
        {
            $Type : 'UI.DataField',
            Value : travel_ID,
            Label : 'travel_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : billNo,
            Label : 'billNo',
        },
        {
            $Type : 'UI.DataField',
            Value : description,
            Label : 'description',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Expenses',
            ID : 'Expenses',
            Target : '@UI.FieldGroup#Expenses',
        },
    ],
    UI.FieldGroup #Expenses : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ID,
                Label : 'ID',
            },
            {
                $Type : 'UI.DataField',
                Value : travel_ID,
                Label : 'travel_ID',
            },
            {
                $Type : 'UI.DataField',
                Value : billNo,
                Label : 'billNo',
            },
            {
                $Type : 'UI.DataField',
                Value : category_ID,
                Label : 'category_ID',
            },
            {
                $Type : 'UI.DataField',
                Value : description,
                Label : 'description',
            },
            {
                $Type : 'UI.DataField',
                Value : date,
                Label : 'date',
            },
            {
                $Type : 'UI.DataField',
                Value : amount,
                Label : 'amount',
            },
            {
                $Type : 'UI.DataField',
                Value : billContent,
                Label : 'billContent',
            },
            {
                $Type : 'UI.DataField',
                Value : currency_code,
            },
        ],
    },
);

annotate service.TravelExpenses with {
    category @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Categories',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : category_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Categories',
        },
        Common.ValueListWithFixedValues : true,
)};

annotate service.Categories with {
    ID @Common.Text : category
};

