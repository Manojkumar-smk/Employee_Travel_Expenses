const cds = require('@sap/cds');
const { data } = require('@sap/cds/lib/dbs/cds-deploy');

module.exports = class TravelRequestService extends cds.ApplicationService {
    async init() {
        const { Projects, TravelRequest, TravelExpenses } = this.entities;

        this.after("PATCH", TravelRequest.drafts, async (data, req) => {
            const { ID } = data;
            const draftItem = await SELECT.one.from(TravelRequest.drafts).where({ ID: ID });
            
            if (draftItem && draftItem.project_ID) {
                const project = await SELECT.one.from(Projects).columns('budget').where({ ID: draftItem.project_ID });
                if (project && project.budget) {
                    const eligibleAmt = Number(project.budget) * 0.5;
                    if(eligibleAmt <= 0){
                        return req.error("Insuffient Budget for this Project: "+project.project);
                    }else{
                    await UPDATE(TravelRequest.drafts).set({ eligibleAmt: eligibleAmt }).where({ ID: ID });
                    };
                }
            }
            if (draftItem && draftItem.employee_ID){
                const employee = await SELECT.one.from(Employees).columns('grade').where({ ID : draftItem.employee_ID });
                if(employee && employee.grade){
                    if (employee.grade !== data.user.attr.grade[0]){
                        return req.error("Grade not Satisfied");
                    }
                }
            }
        });


        this.after("PATCH", TravelExpenses.drafts, async (data, req) => {
            const {ID} = data

            const expense = await SELECT.from(TravelExpenses.drafts).where({ travel_ID : data.travel_ID });
            
            if (expense) {
                let totalAmt = 0;
                expense.forEach(item => {
                    totalAmt += Number(item.amount || 0);
                });

                await UPDATE(TravelRequest.drafts).set({ incurredAmt: totalAmt }).where({ ID: data.travel_ID });
            }
        });

        return super.init();
    }
}
