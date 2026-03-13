const cds = require('@sap/cds');

module.exports = class TravelApprovalService extends cds.ApplicationService {
    async init() {
        const { TravelApproval, TravelRequest, TravelExpenses } = this.entities;


         return super.init();
    }

}