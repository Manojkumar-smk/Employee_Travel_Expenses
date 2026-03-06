const cds = require('@sap/cds');
const { UPDATE, SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = class ProjectService extends cds.ApplicationService {
    async init() {
        const { Projects } = this.entities;

        this.before('CREATE', Projects, async (req) => {
            const tx = cds.tx(req);
            const result = await tx.run(
                SELECT.one.from(Projects).columns('projId')
                        .orderBy({ projId : 'desc' })
            );
            console.log(result?.projId);
            const lastId = Number(result?.projId);
            const nextId = isNaN(lastId) || !result
            ? 1001
            : lastId + 1;
            req.data.projId = String(nextId);
            req.data.startDate = new Date().toISOString().split('T')[0];
        });

        this.on("AddBudget", Projects.drafts, async req => {
            const tx = cds.tx(req)
            const projId = req.params[0].ID;
            const newBudget = Number(req.data.NewBudget);
            let project = await tx.run(SELECT.one.from(Projects.drafts).where({ ID: projId }))
            if (!project) return req.error(404, 'Project not found');
            
            const calcBudget = Number(project?.budget || 0) + newBudget;
            await tx.run(UPDATE(Projects.drafts)
                .set({ budget: calcBudget })
                .where({ ID: projId }));

            req.info(" Budget Updated Successfully")
        })

        return super.init();
    }
}