const cds = require('@sap/cds');
const { SELECT, UPDATE } = require('@sap/cds/lib/ql/cds-ql');

module.exports = class TravelApprovalService extends cds.ApplicationService {
    async init() {
        const { TravelApproval, TravelRequest, TravelExpenses } = this.entities;

        this.on('approveExpense', TravelExpenses, async (req) => {
            const { ID } = req.params[0];
            const { approver_ID, remarks } = req.data;

            if (!approver_ID)
                return req.error(400, `Approver ID is required.`);

            const oExpense = await SELECT.one.from(TravelExpenses).where({ ID });
            if (!oExpense)
                return req.error(404, `Expense ${ID} not found.`);

            if (oExpense.approved === true)
                return req.error(404, `Bill ${oExpense.billNo} is already approved.`);

            const oRequest = await SELECT.one.from(TravelRequest).where({ ID: oExpense.travel_ID })
                .columns('ID', 'status');

            if (!oRequest)
                return req.error(404, `Parent Travel Request not Found.`);

            if (oRequest.status !== 'Pending')
                return req.error(400, `Cannot modify a bill on a ${oRequest.status} request.`);

            await UPDATE(TravelExpenses).set({ approved: true }).where({ ID })

            const nApprovedAmt = await _recalcApprovedAmt(oExpense.travel_ID);

            const sToday = new Date();

            await INSERT.into(TravelApproval).entries({
                ID: cds.utils.uuid(),
                approver_ID: approver_ID,
                travel_ID: oExpense.travel_ID,
                approvedAmt: oExpense.approvedAmt,
                remarks: oExpense.billNo,
                actionDate: sToday,
                status: 'Approved'
            })

            return SELECT.one.from(TravelExpenses).where({ ID });
        });

        this.on('rejectExpense', TravelExpenses, async (req) => {
            const { ID } = req.params[0];
            const { approver_ID, remarks } = req.data;

            if (!approver_ID) return req.error(400, `Approver ID is required.`);

            const oExpense = await SELECT.one.from(TravelExpenses).where({ ID });

            if (!oExpense) return req.error(404, `Expense ${ID} not found.`);

            if (oExpense.approved === false)
                return req.error(404, `Bill ${oExpense.billNo} is already rejected.`);

            const oRequest = await SELECT.one.from(TravelRequest).where({ ID: oExpense.travel_ID })
                .columns('ID', 'status');

            if (!oRequest) return req.error(404, `Parent travel request not found.`);

            if (oRequest.status !== 'Pending')
                return req.error(400, `Cannot modify a bill on a ${oRequest.status} request.`);

            await UPDATE(TravelExpenses).set({ approved: false }).where({ ID })

            const nApprovedAmt = await _recalcApprovedAmt(oExpense.travel_ID);

            const sToday = new Date();

            await INSERT.into(TravelApproval).entries({
                ID: cds.utils.uuid(),
                approver_ID: approver_ID,
                travel_ID: oExpense.travel_ID,
                approvedAmt: oExpense.approvedAmt,
                remarks: oExpense.billNo,
                actionDate: sToday,
                status: 'Rejected',
            })

            return SELECT.one.from(TravelExpenses).where({ ID });

        });

        const _recalcApprovedAmt = async (sTravelID) => {
            const aExpenses = await SELECT.from(TravelExpenses).where({ travel_ID: sTravelID })
                .columns('amount', 'approved');

            const nApprovedAmt = parseFloat(
                aExpenses
                    .filter(e => e.approved === true)
                    .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
                    .toFixed(2)
            );

            const nTotal = aExpenses.length;
            const nApproved = aExpenses.filter(e => e.approved === true).length;
            const nRejected = aExpenses.filter(e => e.approved === false).length;
            const nPending = aExpenses.filter(e => e.approved === null || e.approved === undefined).length;
            let sRequestStatus = 'Pending';
            if (nPending === 0) {
                if (nRejected === nTotal) {
                    sRequestStatus = 'Rejected';
                } else {
                    sRequestStatus = 'Approved';
                };
            }

            await UPDATE(TravelRequest)
                .set({
                    approvedAmt: nApprovedAmt,
                    status: sRequestStatus
                })
                .where({ ID: sTravelID });
            return { nApprovedAmt };
        };

        return super.init();
    }
}