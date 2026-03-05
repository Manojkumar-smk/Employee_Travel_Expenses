const cds = require('@sap/cds');
const { UPDATE, SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = class ProjectService extends cds.ApplicationService {
    init() {
        const { Projects } = cds.entities('ProjectService');

        this.before('CREATE', Projects, async (req) => {
            req.data.startDate = new Date().toISOString().split('T')[0];
        });

        this.on("AddBudget", async req => {
            const projId = req.params[0].ID;
            const newBudget = Number(req.data.NewBudget);
            const project = await SELECT.one.from(Projects).where({ ID: projId });
            const calcBudget = Number(project.budget) + newBudget;
            await UPDATE(Projects)
                .set({ budget: calcBudget })
                .where({ ID: projId });
            req.info(" Budget Updated Successfully")
        })

        return super.init();
    }
}