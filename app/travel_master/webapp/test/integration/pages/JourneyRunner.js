sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/demo/travelmaster/test/integration/pages/TravelRequestList",
	"com/demo/travelmaster/test/integration/pages/TravelRequestObjectPage",
	"com/demo/travelmaster/test/integration/pages/TravelExpensesObjectPage"
], function (JourneyRunner, TravelRequestList, TravelRequestObjectPage, TravelExpensesObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/demo/travelmaster') + '/test/flp.html#app-preview',
        pages: {
			onTheTravelRequestList: TravelRequestList,
			onTheTravelRequestObjectPage: TravelRequestObjectPage,
			onTheTravelExpensesObjectPage: TravelExpensesObjectPage
        },
        async: true
    });

    return runner;
});

