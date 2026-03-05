using employeeService as service from '../../srv/employee-srv';
annotate service.Employees with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Employee ID',
                Value : empId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Name',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Role',
                Value : role,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Department',
                Value : department,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Location',
                Value : location,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Grade',
                Value : grade,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Salary',
                Value : salary,
            },
            {
                $Type : 'UI.DataField',
                Value : photo,
                Label : 'Photo',
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
            Label : 'Projects',
            ID : 'Projects',
            Target : 'assignedProjects/@UI.LineItem#Projects',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Employee ID',
            Value : empId,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Name',
            Value : name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Role',
            Value : role,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Department',
            Value : department,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Location',
            Value : location,
        },
        {
            $Type : 'UI.DataField',
            Value : grade,
        },
        {
            $Type : 'UI.DataField',
            Value : salary,
            Label : 'Salary',
        },
    ],
    UI.SelectionFields : [
        empId,
        department,
        grade,
        role,
        location,
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
    UI.HeaderInfo : {
        TypeName : 'Employee',
        TypeNamePlural : 'Employees',
        Title : {
            $Type : 'UI.DataField',
            Value : name,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : role,
        },
        ImageUrl : photo,
    },
);

annotate service.Employees with {
    empId @Common.Label : 'Employee ID'
};

annotate service.Employees with {
    department @Common.Label : 'Department'
};

annotate service.Employees with {
    grade @Common.Label : 'Grade'
};

annotate service.Employees with {
    role @Common.Label : 'Role'
};

annotate service.Employees with {
    location @Common.Label : 'Location'
};

annotate service.ProjectAssignment with @(
    UI.LineItem #ProjectAssignment : [
        {
            $Type : 'UI.DataField',
            Value : employee_ID,
            Label : 'employee_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : project_ID,
            Label : 'project_ID',
        },
    ],
    UI.LineItem #Projects : [
        {
            $Type : 'UI.DataField',
            Value : employee_ID,
            Label : 'Employee Id',
        },
        {
            $Type : 'UI.DataField',
            Value : employeeName,
            Label : 'Employee Name',
        },
        {
            $Type : 'UI.DataField',
            Value : project_ID,
            Label : 'Project ID',
        },
        {
            $Type : 'UI.DataField',
            Value : projectName,
            Label : 'Project Name',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Projects',
            ID : 'Projects',
            Target : '@UI.FieldGroup#Projects',
        },
    ],
    UI.FieldGroup #Projects : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : employee_ID,
                Label : 'Employee ID',
            },
            {
                $Type : 'UI.DataField',
                Value : project_ID,
                Label : 'Project ID',
            },
        ],
    },
);

annotate service.ProjectAssignment with {
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
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'Project',
                    LocalDataProperty : projectName,
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'description',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'projId',
                },
            ],
            Label : 'Project Selection',
        },
        Common.ValueListWithFixedValues : false,
)};

annotate service.Projects with @(
    UI.PresentationVariant #vh_ProjectAssignment_project : {
        $Type : 'UI.PresentationVariantType',
        SortOrder : [
            {
                $Type : 'Common.SortOrderType',
                Property : ID,
                Descending : false,
            },
        ],
    }
);

annotate service.ProjectAssignment with {
    employeeName @Common.ExternalID : employee.name
};

