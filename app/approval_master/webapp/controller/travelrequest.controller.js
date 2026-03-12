sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (Controller, Filter, FilterOperator, MessageBox, MessageToast) => {
    "use strict";

    return Controller.extend("com.demo.approvalmaster.controller.travelrequest", {
        onInit() {
            this.byId("empDialog").open();
        },
        onEmpIdLiveChange: function (oEvent) {
            const sValue = oEvent.getParameter("value").trim();
            this.byId("proceedBtn").setEnabled(sValue.length > 0);
            if (!sValue) {
                this.byId("empNameText").setVisible(false);
                this.byId("empErrText").setVisible(false);
            }
        },
        onProceed: function () {
            const sEmpId = this.byId("empIdInput").getValue().trim();
            if (!sEmpId) {
                MessageToast.show("Please enter Employee ID");
                return;
            };

            this.byId("proceedBtn").setBusy(true);
            this.byId("empErrText").setText("");
            this.byId("empNameText").setText("");
            this.byId("empNameText").setVisible(false);
            this.byId("empErrText").setVisible(false);

            const oModel = this.getView().getModel();

            const oListBinding = oModel.bindList("/Employees", null, null, null, {
                $filter: `empId eq '${sEmpId}'`,
                $select: "ID,empId,name,role,department"
            });
            oListBinding.requestContexts(0, 1)
                .then((aContexts) => {
                    this.byId("proceedBtn").setBusy(false);

                    if (!aContexts.length) {
                        this.byId("empErrText").setText('Employee ID "${sEmpId}" not found').setVisible(true);
                        this.byId("empNameText").setVisible(false);
                        return;
                    }

                    const oEmp = aContexts[0].getObject();
                    this.byId("empNameText")
                        .setText(`${oEmp.name} | (${oEmp.role})`)
                        .setVisible(true);
                    this.byId("empErrText").setVisible(false);

                    const oAppState = this.getOwnerComponent().getModel("appState");
                    oAppState.setProperty("/employeeId", oEmp.ID);
                    oAppState.setProperty("/employeeName", oEmp.name);
                    oAppState.setProperty("/empId", oEmp.empId);

                    setTimeout(() => {
                        this.byId("empDialog").close();
                        this._loadTravelRequest(oEmp.ID);
                    }, 800);
                })
                .catch((oError) => {
                    this.byId("proceedBtn").setBusy(false);
                    console.error("Binding error:", oError);
                    MessageBox.error("Service error. Please Check Connection", { title: "Error" });
                });
        },

        _loadTravelRequest: function (sManagerId) {
            const oTable = this.byId("travelRequestTable");
            if (!oTable) {
                console.warm("Table not Found");
                return;
            }
            const oBinding = oTable.getBinding("items");
            if (!oBinding) {
                console.warm("Table binding not ready");
                return;
            }
            const oFilter = new Filter(
                "project/projManager_ID",
                FilterOperator.EQ,
                sManagerId
            );
            oBinding.filter([
                oFilter
            ]);
        },
        onChangeUser: function () {
            this.byId("empIdInput").setValue("");
            this.byId("empNameText").setVisible(false).setText("");
            this.byId("empNameText").setVisible(false).setText("");
            this.byId("proceedBtn").setEnabled(false);
            this.byId("empDialog").open();
        }
    });
});