sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (Controller, JSONModel, MessageBox, MessageToast) => {
    "use strict";

    return Controller.extend("com.demo.approvalmaster.controller.travelexpenses", {
        onInit() {
           const oRouter = this.getOwnerComponent().getRouter();
           oRouter.getRoute("RouteTravelExpenses").attachPatternMatched(
            this._onRouteMatched, this
           )
        },
        _onRouteMatched: function(oEvent) {
            this._sRequestId = oEvent.getParameter("arguments").requestId;
            this._loadData(this._sRequestId);
        },

        _loadData: function(_sRequestId) {
        const oReqBinding = oModel.bindList("/TravelRequest", null, null, null, {
            $filter : `ID eq ${_sRequestId}`,
            $expand : "employee, project",
            $select : "ID,tripNumber,purpose,travelCity,fromDate,toDate,incurredAmt,approvedAmt,eligibleAmt,status, employye/name,employee/department. project/Project"
        });   
        },
        
        onNavBack: function() {
            this.getOwnerComponent().getRouter().navTo("Routetravelrequest")
        }

        });
});