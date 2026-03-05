namespace com.al.a1f6f1b3.db;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity Employees : cuid, managed {
        empId      : String(10);
        name       : String(30);
        role       : String(30);
        department : String(10);
        location   : String(30);
        grade      : String(10);
        salary     : Decimal(9, 2);
        photo      : LargeBinary @Core.MediaType : 'image/jpeg';
        assignedProjects   : Composition of many ProjectAssignment
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
}

entity ProjectAssignment : cuid {
    employee : Association to Employees;
    project  : Association to Projects;
}

entity ProjectStatus : cuid {
    keyCode : String(10);
    name    : String(50);
}
