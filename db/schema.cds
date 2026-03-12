namespace com.al.a1f6f1b3.db;

using {
    cuid,
    managed,
    Currency
} from '@sap/cds/common';

entity Employees : cuid, managed {
    empId            : String(10);
    name             : String(30);
    role             : String(30);
    department       : String(10);
    location         : String(30);
    grade            : String(10);
    salary           : Decimal(9, 2);
    @Core.MediaType: photoType
    photo            : LargeBinary;
    @Core.IsMediaType: true
    photoType        : String default 'image/jpeg';
    assignedProjects : Composition of many ProjectAssignment
                           on assignedProjects.employee = $self;
}

entity Projects : cuid, managed {
    projId      : String(10);
    Project     : String(30);
    description : String(50);
    budget      : Decimal(11, 2);
    startDate   : Date;
    endDate     : Date;
    status      : Association to ProjectStatus;
    active      : Boolean default true;
    projManager : Association to Employees;
}

entity ProjectAssignment : cuid {
    employee : Association to Employees;
    project  : Association to Projects;
}

entity ProjectStatus : cuid {
    keyCode : String(10);
    name    : String(50);
}

entity TravelRequest : cuid, managed {
    tripNumber      : String(10);
    purpose         : String(100);
    travelCity      : String(20);
    fromDate        : Date;
    toDate          : Date;
    incurredAmt     : Decimal(10, 2);
    approvedAmt     : Decimal(10, 2);
    eligibleAmt     : Decimal(10, 2);
    status          : String(20) enum {
        Pending;
        Approved;
        Rejected
    } default 'Pending';
    rejectionReason : String(200);
    employee        : Association to Employees;
    project         : Association to Projects;
    expenses        : Composition of many TravelExpenses
                          on expenses.travel = $self;
}

entity TravelExpenses : cuid {
    travel         : Association to TravelRequest;
    billNo         : String(10);
    category       : Association to Categories;
    description    : String(200);
    amount         : Decimal(10, 2);
    currency       : Currency;
    date           : Date;
    status         : Boolean;

    @Core.MediaType  : attachmentType
    billContent    : LargeBinary;

    @Core.IsMediaType: true
    attachmentType : String default 'application/pdf';
    fileName       : String;

}

entity Categories : cuid {
    category : String(20);
}

entity TravelApproval : cuid, managed{
    
}
