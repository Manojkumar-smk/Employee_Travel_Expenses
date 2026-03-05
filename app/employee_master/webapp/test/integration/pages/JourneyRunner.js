sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/demo/employeemaster/test/integration/pages/EmployeesList",
	"com/demo/employeemaster/test/integration/pages/EmployeesObjectPage",
	"com/demo/employeemaster/test/integration/pages/ProjectAssignmentObjectPage"
], function (JourneyRunner, EmployeesList, EmployeesObjectPage, ProjectAssignmentObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/demo/employeemaster') + '/test/flp.html#app-preview',
        pages: {
			onTheEmployeesList: EmployeesList,
			onTheEmployeesObjectPage: EmployeesObjectPage,
			onTheProjectAssignmentObjectPage: ProjectAssignmentObjectPage
        },
        async: true
    });

    return runner;
});

