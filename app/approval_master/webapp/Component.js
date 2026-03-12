sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JsonModel",
    "com/demo/approvalmaster/model/models"
], function(UIComponent, JsonModel, models) {
    "use strict";

    return UIComponent.extend("com.demo.approvalmaster.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            //appState Model
            this.setModel(new JsonModel({
                employeeId : null,
                employeeName : null,
                empId : null
            }), "appState");

            // enable routing
            this.getRouter().initialize();
        }
    });
});