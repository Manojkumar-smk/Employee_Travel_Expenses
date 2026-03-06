using ProjectService as service from '../../srv/project-srv';
annotate service.Projects with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Project ID',
                Value : projId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Project',
                Value : Project,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Description',
                Value : description,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Budget',
                Value : budget,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Start Date',
                Value : startDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'End Date',
                Value : endDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Active',
                Value : active,
            },
            {
                $Type : 'UI.DataField',
                Value : status_ID,
                Label : 'status_ID',
            },
            {
                $Type : 'UI.DataField',
                Value : budgetAvail,
                Label : 'Budget Avail',
                Criticality : statusCriticality,
                CriticalityRepresentation : statusCriticality
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'Project Details',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Project ID',
            Value : projId,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Project',
            Value : Project,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Description',
            Value : description,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Budget',
            Value : budget,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Start Date',
            Value : startDate,
        },
        {
            $Type : 'UI.DataField',
            Value : endDate,
            Label : 'End Date',
        },
        {
            $Type : 'UI.DataField',
            Value : active,
        },
        {
            $Type : 'UI.DataField',
            Value : status_ID,
            Label : 'Status',
        },
        {
            $Type : 'UI.DataField',
            Value : budgetAvail,
            Label : 'Budget Avail',
            Criticality : statusCriticality
        },
    ],
    UI.SelectionFields : [
        projId,
        Project,
        active,
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
        TypeName : 'Project',
        TypeNamePlural : 'Projects',
        Title : {
            $Type : 'UI.DataField',
            Value : Project,
            Criticality : statusCriticality,
            CriticalityRepresentation : statusCriticality
        },
        Description : {
            $Type : 'UI.DataField',
            Value : description,
        },
        TypeImageUrl : 'sap-icon://capital-projects',
    },
    UI.Identification : [
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'ProjectService.AddBudget',
            Label : 'Add Budget',
            ![@UI.Hidden] : IsActiveEntity,
        },
    ],
);

annotate service.Projects with {
    projId @(
        Common.Label : 'Project ID',
        Common.FieldControl : #ReadOnly,
        Core.Immutable : true
    )
};

annotate service.Projects with {
    Project @Common.Label : 'Project'
};

annotate service.Projects with {
    active @Common.Label : 'Active'
};

annotate service.Projects with {
    startDate @Common.FieldControl : #ReadOnly
};

annotate service.Projects with {
    budgetAvail @Common.FieldControl : #ReadOnly
};


annotate service.Projects with {
    status @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'ProjectStatus',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : status_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Status List',
        },
        Common.ValueListWithFixedValues : true,
)};

annotate service.ProjectStatus with {
    ID @(
        Common.Text : name,
        Common.Text.@UI.TextArrangement : #TextOnly,
)};

