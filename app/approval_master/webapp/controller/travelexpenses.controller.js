sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/routing/history"
], (Controller, JSONModel, MessageBox, History) => {
    "use strict";

    return Controller.extend("com.demo.approvalmaster.controller.travelexpenses", {

        onInit() {

            var oViewModel = new JSONModel({
                busy: false,
                requestHeader: {
                    tripNumber: "",
                    purpose: "",
                    travelCity: "",
                    fromDate: "",
                    toDate: "",
                    incurredAmt: 0,
                    eligibleAmt: 0,
                    approvedAmt: 0,
                    rejectionReason: "",
                    status: "",
                    employee: { name: "", department: "" },
                    project: { Project: "" }
                }
            });

            this.getView().setModel(oViewModel, "viewModel");

            var oExpensesModel = new JSONModel({ items: [] });
            this.getView().setModel(oExpensesModel, "expenses");

            this.getOwnerComponent().getRouter().getRoute("RouteTravelExpenses")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sRequestId = oEvent.getParameter("arguments").requestId;
            this._sRequestId = sRequestId;
            this._loadData(sRequestId);
        },

        _loadData: function (sRequestId) {
            var oView = this.getView();
            var oViewModel = oView.getModel("viewModel");
            var oModel = oView.getModel();

            oViewModel.setProperty("/busy", true);

            var oContext = oModel.bindContext("/TravelRequest(" + sRequestId + ")", null, {
                $expand: "employee," +
                    "project($select=Project)," +
                    "expenses($expand=category($select=category))"
            }
            );

            oContext.requestObject().then(function (oData) {
                console.log(JSON.stringify(oData.employee));
                oViewModel.setProperty("/requestHeader", {
                    tripNumber: oData.tripNumber || "",
                    purpose: oData.purpose || "",
                    travelCity: oData.travelCity || "",
                    fromDate: oData.fromDate || "",
                    toDate: oData.toDate || "",
                    incurredAmt: oData.incurredAmt || "",
                    eligibleAmt: oData.eligibleAmt || "",
                    approvedAmt: oData.approvedAmt || "",
                    rejectionReason: oData.rejectionReason || "",
                    status: oData.status || "",
                    employee: oData.employee || { name: "", department: "" },
                    project: oData.project || { Project: "" }

                });

                oView.getModel("expenses")
                    .setProperty("/items", oData.expenses || []);

                oViewModel.setProperty("/busy", false);

            }.bind(this)).catch(function (oError) {
                oViewModel.setProperty("/busy", false);
                MessageBox.error("Failed to load Travel Data. \n" + oError.message);
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPrev = oHistory.getPreviousHash();
            if (sPrev !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("Routetravelrequest", {}, true);
            }
        },

        onApproveBill: function () { },
        onRejectBill: function () { },
        onApprove: function () { },
        onReject: function () { }
    });
});