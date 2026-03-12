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
            );

            this.getView().setModel(new JSONModel({
                busy: false,
                requestHeader: {}
            }), "viewModel");

            this._sCsrfToken = "";
            this._fetchCsrfToken();
        },

        _onRouteMatched: function (oEvent) {
            this._sRequestId = oEvent.getParameter("arguments").requestId;
            this._loadData(this._sRequestId);
        },

        _loadData: function (sRequestId) {
            const oModel     = this.getView().getModel();
            const oViewModel = this.getView().getModel("viewModel");

            oViewModel.setProperty("/busy", true);

            // 1. TravelRequest header
            const oReqBinding = oModel.bindList("/TravelRequest", null, null, null, {
                $filter : `ID eq ${sRequestId}`,
                $expand : "employee,project",
                $select : "ID,tripNumber,purpose,travelCity,fromDate,toDate,incurredAmt,approvedAmt,eligibleAmt,status,rejectionReason,employee/name,employee/department,project/Project"
            });

            oReqBinding.requestContexts().then((aContexts) => {
                if (aContexts.length > 0) {
                    oViewModel.setProperty("/requestHeader", aContexts[0].getObject());
                }
            }).catch(() => {
                MessageBox.error("Failed to load travel request header.");
            });

            // 2. TravelExpenses
            const oExpBinding = oModel.bindList("/TravelExpenses", null, null, null, {
                $filter : `travel_ID eq ${sRequestId}`,
                $expand : "category",
                $select : "ID,billNo,description,amount,date,approved,fileName,travel_ID,category/category"
            });

            return oExpBinding.requestContexts().then((aContexts) => {
                oViewModel.setProperty("/busy", false);

                const aExpenses = aContexts.map((oCtx) =>
                    Object.assign({ _path: oCtx.getPath() }, oCtx.getObject())
                );

                let oExpModel = this.getView().getModel("expenses");
                if (!oExpModel) {
                    oExpModel = new JSONModel();
                    this.getView().setModel(oExpModel, "expenses");
                }
                oExpModel.setData({ items: aExpenses });

            }).catch((oErr) => {
                oViewModel.setProperty("/busy", false);
                console.error("Expenses load error:", oErr);
                MessageBox.error("Failed to load travel expenses.");
            });
        },

        // ── Approve / Reject entire request manually ─────────────────
        onApprove: function () {
            this._updateRequestStatus("Approved");
        },

        onReject: function () {
            this._updateRequestStatus("Rejected");
        },

        _updateRequestStatus: function (sStatus) {
            const sLabel = sStatus === "Approved" ? "Approve" : "Reject";
            MessageBox.confirm(`${sLabel} this travel request?`, {
                title   : `${sLabel} Request`,
                actions : [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose : (sAction) => {
                    if (sAction !== MessageBox.Action.OK) return;
                    this._patchRequest(this._sRequestId, { status: sStatus })
                        .then(() => {
                            MessageToast.show(`Request ${sStatus.toLowerCase()} successfully.`);
                            this._loadData(this._sRequestId);
                        })
                        .catch(() => MessageBox.error("Update failed. Please try again."));
                }
            });
        },

        // ── Approve / Reject individual bill ─────────────────────────
        onApproveBill: function (oEvent) {
            const oItem = oEvent.getSource().getBindingContext("expenses").getObject();
            this._patchExpense(oItem.ID, { approved: true })
                .then(() => {
                    MessageToast.show("Bill approved.");
                    this._checkAndUpdateRequestStatus();
                })
                .catch(() => MessageBox.error("Failed to approve bill."));
        },

        onRejectBill: function (oEvent) {
            const oItem = oEvent.getSource().getBindingContext("expenses").getObject();
            this._patchExpense(oItem.ID, { approved: false })
                .then(() => {
                    MessageToast.show("Bill rejected.");
                    this._checkAndUpdateRequestStatus();
                })
                .catch(() => MessageBox.error("Failed to reject bill."));
        },

        // ── Approve All / Reject All bills ───────────────────────────
        onApproveAll: function () { this._bulkUpdateBills(true);  },
        onRejectAll:  function () { this._bulkUpdateBills(false); },

        _bulkUpdateBills: function (bApproved) {
            const aItems = (this.getView().getModel("expenses").getProperty("/items") || []);
            if (!aItems.length) { MessageToast.show("No expenses to update."); return; }

            const sLabel = bApproved ? "Approve All Bills" : "Reject All Bills";

            MessageBox.confirm(`${sLabel}?`, {
                title   : sLabel,
                actions : [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose : (sAction) => {
                    if (sAction !== MessageBox.Action.OK) return;

                    this.getView().getModel("viewModel").setProperty("/busy", true);

                    Promise.all(aItems.map((oItem) =>
                        this._patchExpense(oItem.ID, { approved: bApproved })
                    )).then(() => {
                        this.getView().getModel("viewModel").setProperty("/busy", false);
                        this._checkAndUpdateRequestStatus();
                    }).catch(() => {
                        this.getView().getModel("viewModel").setProperty("/busy", false);
                        MessageBox.error("Bulk update failed.");
                        this._loadData(this._sRequestId);
                    });
                }
            });
        },

        // ── Auto update request status + approvedAmt based on bills ──
        _checkAndUpdateRequestStatus: function () {
            const oModel = this.getView().getModel();

            const oExpBinding = oModel.bindList("/TravelExpenses", null, null, null, {
                $filter : `travel_ID eq ${this._sRequestId}`,
                $select : "ID,approved,amount"
            });

            oExpBinding.requestContexts().then((aContexts) => {
                const aExpenses = aContexts.map((oCtx) => oCtx.getObject());

                const iTotalBills    = aExpenses.length;
                const iApprovedCount = aExpenses.filter((e) => e.approved === true).length;
                const iRejectedCount = aExpenses.filter((e) => e.approved === false).length;

                // Sum of approved bills only
                const fApprovedAmt = aExpenses
                    .filter((e) => e.approved === true)
                    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

                // Determine request status
                let sStatus;
                if (iRejectedCount > 0) {
                    sStatus = "Rejected";               // any bill rejected → Rejected
                } else if (iApprovedCount === iTotalBills && iTotalBills > 0) {
                    sStatus = "Approved";               // all bills approved → Approved
                } else {
                    sStatus = "Pending";                // mix → still Pending
                }

                // PATCH TravelRequest with new status + approvedAmt
                this._patchRequest(this._sRequestId, {
                    status      : sStatus,
                    approvedAmt : parseFloat(fApprovedAmt.toFixed(2))
                }).then(() => {
                    MessageToast.show(
                        `Status: ${sStatus} | Approved Amt: ₹${fApprovedAmt.toFixed(2)}`
                    );
                    this._loadData(this._sRequestId);   // refresh header strip
                }).catch(() => {
                    MessageBox.error("Failed to update request status.");
                });
            });
        },

        // ── PATCH helpers ─────────────────────────────────────────────
        _patchRequest: function (sId, oPayload) {
            return fetch(`/odata/v4/travel-approval/TravelRequest(${sId})`, {
                method  : "PATCH",
                headers : {
                    "Content-Type" : "application/json",
                    "X-CSRF-Token" : this._sCsrfToken
                },
                body: JSON.stringify(oPayload)
            }).then((res) => {
                if (!res.ok) return Promise.reject(res);
            });
        },

        _patchExpense: function (sId, oPayload) {
            return fetch(`/odata/v4/travel-approval/TravelExpenses(${sId})`, {
                method  : "PATCH",
                headers : {
                    "Content-Type" : "application/json",
                    "X-CSRF-Token" : this._sCsrfToken
                },
                body: JSON.stringify(oPayload)
            }).then((res) => {
                if (!res.ok) return Promise.reject(res);
            });
        },

        _fetchCsrfToken: function () {
            fetch("/odata/v4/travel-approval/", {
                method  : "HEAD",
                headers : { "X-CSRF-Token": "Fetch" }
            }).then((res) => {
                this._sCsrfToken = res.headers.get("X-CSRF-Token") || "";
            }).catch(() => {
                console.warn("CSRF token fetch failed.");
            });
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("Routetravelrequest");
        }

    });
});