const cds = require('@sap/cds');
const { UPDATE, SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = class ProjectService extends cds.ApplicationService {
    init() {
        const { Projects } = cds.entities('ProjectService');

        this.before('CREATE', Projects, async (req) => {
            const tx = cds.tx(req);
            const result = await tx.run(
                SELECT.one`max(projId) as maxId`.from(Projects)
            );
            const nextId = (Number(result?.maxId || 1000) + 1);
            req.data.projId = String(nextId);
            req.data.startDate = new Date().toISOString().split('T')[0];
        });

        this.on("AddBudget", async req => {
            const tx = cds.tx(req)
            const projId = req.params[0].ID;
            const newBudget = Number(req.data.NewBudget);
            const project = await tx.run(SELECT.one.from(Projects).where({ ID: projId }))
            const calcBudget = Number(project?.budget || 0) + newBudget;
            await tx.run(UPDATE(Projects)
                .set({ budget: calcBudget })
                .where({ ID: projId }));

            req.info(" Budget Updated Successfully")
        })

        return super.init();
    }
}