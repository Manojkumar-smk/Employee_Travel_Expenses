const cds = require('@sap/cds');

module.exports = class TravelRequestService extends cds.ApplicationService {
    async init() {
        const { TravelRequest, TravelExpenses, Employees, Products } = this.entities;

    }
}