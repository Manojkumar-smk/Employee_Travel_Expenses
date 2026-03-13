const { func } = require("@sap/cds/lib/ql/cds-ql");

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History"
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

        _getApproverId: function () {
            return this.getOwnerComponent().getModel("appState").getProperty("/employeeId");
        },

        onApproveBill: function (oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getParent().getParent().getBindingContext("expenses");
            var oExpense = oContext.getObject();

            MessageBox.confirm(
                "Approve bill " + oExpense.billNo + " of " + oExpense.amount + "?",
                {
                    title: "Confirm Approval",
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.YES) {
                            this._callExpenseAction(
                                "approveExpenses",
                                oExpense,
                                oContext
                            );
                        }
                    }.bind(this)
                }
            );

        },

        onRejectBill: function (oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getParent().getParent().getBindingContext("expenses");
            var oExpense = oContext.getObject();

            MessageBox.confirm(
                "Reject bill" + oExpense.billNo + "?",
                {
                    title: "Confirm Rejection",
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.YES) {
                            this._callExpenseAction(
                                "rejectExpenses",
                                oExpense,
                                oContext
                            );
                        }
                    }.bind(this)
                }
            );
        },

        _callExpenseAction: function () {
            var oView = this.getView();
            var oModel = oView.getModel();
            var oViewModel = oView.getModel("viewModel");
            var sApproverId = this._getApproverId();

            if (!sApproverId) {
                MessageBox.error("Approver not identified. Please re-login");
                return;
            }

            var oActionBinding = oModel.bindContext(
                "/TravelExpenses(" + oExpense.ID + ")" +
                "/TravelApprovalService." + sActionName + "(...)"
            );

            oActionBinding.setParameter("approver_ID", sApproverId);
            oActionBinding.setParameter("remarks",
                sActionName === "approveExpenses"
                    ? "Bill " + oExpense.billNo + "approved."
                    : "Bill " + oExpense.billNo + "rejected."
            );
            oActionBinding.execute()
                .then(function () {
                    oViewModel.setProperty("/busy", false);
                    MessageToast.show(
                        sActionName === "approveExpense"
                            ? "Bill " + oExpense.billNo + " approved."
                            : "Bill " + oExpense.billNo + " rejected."
                    );

                    // update local expenses model — no full reload needed
                    var aItems = oView.getModel("expenses").getProperty("/items");
                    var nIdx = aItems.findIndex(function (e) {
                        return e.ID === oExpense.ID;
                    });
                    if (nIdx >= 0) {
                        aItems[nIdx].approved = sActionName === "approveExpenses"
                            ? true : false;
                        oView.getModel("expenses").setProperty("/items", aItems);
                    }
                  
                    this._refreshHeaderAmounts();
                }.bind(this))
                .catch(function (oError) {
                    oViewModel.setProperty("/busy", false);
                    var sMsg = this._extractErrorMessage(oError);
                    MessageBox.error("Action failed:\n" + sMsg);
                }.bind(this));
        },

        _refreshHeaderAmounts: function () {
            var oModel = this.getView().getModel();
            var oViewModel = this.getView().getModel("viewModel");

            var oContext = oModel.bindContext(
                "/TravelRequest(" + this._sRequestId + ")",
                null,
                {
                    $select: "incurredAmt,eligibleAmt,approvedAmt,status,rejectionReason"
                }
            );

            oContext.requestObject().then(function (oData) {
                oViewModel.setProperty("/requestHeader/incurredAmt", oData.incurredAmt || 0);
                oViewModel.setProperty("/requestHeader/eligibleAmt", oData.eligibleAmt || 0);
                oViewModel.setProperty("/requestHeader/approvedAmt", oData.approvedAmt || 0);
                oViewModel.setProperty("/requestHeader/status", oData.status || "");
                oViewModel.setProperty("/requestHeader/rejectionReason", oData.rejectionReason || "");
            });
        },

        onNavBack: function () {
            var sPrev = History.getInstance().getPreviousHash();
            if (sPrev !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent()
                    .getRouter()
                    .navTo("Routetravelrequest", {}, true);
            }
        },

        onApprove: function () { },
        onReject: function () { },
        _extractErrorMessage: function (oError) {
            try {
                var oBody = JSON.parse(oError.responseText || oError.message);
                return (oBody.error && oBody.error.message) || oError.message;
            } catch (e) {
                return oError.message || "Unknown error.";
            }
        }

    });
});
