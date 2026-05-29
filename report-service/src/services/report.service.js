const repo = require('../repositories/transaction.repository');
const ReportError = require('../utils/ReportError');
const { mapTransaction } = require('../utils/mappers');
const { signedAmount } = require('../utils/transactionSign');

const buildSummary = (aggregates) => {
  const summary = {
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalTransfersIn: 0,
    totalTransfersOut: 0,
    transactionCount: 0,
    netFlow: 0,
  };

  aggregates.forEach((row) => {
    const total = Number(row.total);
    const count = Number(row.count);
    summary.transactionCount += count;

    switch (row.type) {
      case 'DEPOSIT':
        summary.totalDeposits = total;
        break;
      case 'WITHDRAW':
        summary.totalWithdrawals = total;
        break;
      case 'TRANSFER_IN':
        summary.totalTransfersIn = total;
        break;
      case 'TRANSFER_OUT':
        summary.totalTransfersOut = total;
        break;
      default:
        break;
    }
    summary.netFlow += signedAmount(row.type, total);
  });

  return summary;
};

const parseDateRange = (query) => {
  const from = query.from ? new Date(query.from) : null;
  const to = query.to ? new Date(query.to) : null;
  if (from && Number.isNaN(from.getTime())) throw new ReportError('from inválido');
  if (to && Number.isNaN(to.getTime())) throw new ReportError('to inválido');
  return { from, to };
};

const getHistory = async (userId, query) => {
  const range = parseDateRange(query);
  const { rows, total } = await repo.findByUser(userId, {
    ...range,
    accountNumber: query.accountNumber,
    type: query.type,
    limit: Math.min(Number(query.limit) || 50, 200),
    offset: Number(query.offset) || 0,
  });

  return {
    userId,
    transactions: rows.map(mapTransaction),
    pagination: { total, limit: Number(query.limit) || 50, offset: Number(query.offset) || 0 },
  };
};

const getAccountStatement = async (userId, accountNumber, query) => {
  const range = parseDateRange(query);
  const { rows } = await repo.findByAccount(accountNumber, userId, {
    ...range,
    limit: 500,
    offset: 0,
  });

  if (!rows.length && query.strict === 'true') {
    throw new ReportError('No hay movimientos para esta cuenta en el periodo', 404);
  }

  const chronological = [...rows].reverse();
  let runningBalance = 0;
  const movements = chronological.map((row) => {
    const signed = signedAmount(row.type, row.amount);
    runningBalance += signed;
    return {
      ...mapTransaction(row),
      signedAmount: signed,
      runningBalance: Number(runningBalance.toFixed(2)),
    };
  });

  const summary = buildSummary(
    chronological.reduce((acc, row) => {
      const found = acc.find((a) => a.type === row.type);
      if (found) {
        found.count += 1;
        found.total += Number(row.amount);
      } else {
        acc.push({ type: row.type, count: 1, total: Number(row.amount) });
      }
      return acc;
    }, [])
  );

  return {
    accountNumber,
    userId,
    period: { from: query.from || null, to: query.to || null },
    openingBalance: movements.length ? movements[0].runningBalance - movements[0].signedAmount : 0,
    closingBalance: movements.length ? movements[movements.length - 1].runningBalance : 0,
    movements: movements.reverse(),
    summary,
  };
};

const getFinancialReport = async (userId, query) => {
  const range = parseDateRange(query);
  const aggregates = await repo.aggregateByUser(userId, range);
  const summary = buildSummary(aggregates);

  return {
    userId,
    period: { from: query.from || null, to: query.to || null },
    summary,
    byType: aggregates.map((row) => ({
      type: row.type,
      count: row.count,
      total: Number(row.total),
    })),
  };
};

const getStatistics = async (userId, query) => {
  const months = Math.min(Number(query.months) || 6, 24);
  const aggregates = await repo.aggregateByUser(userId, parseDateRange(query));
  const monthly = await repo.monthlyStats(userId, months);
  const summary = buildSummary(aggregates);

  const average =
    summary.transactionCount > 0
      ? Number(
          (
            (summary.totalDeposits +
              summary.totalWithdrawals +
              summary.totalTransfersIn +
              summary.totalTransfersOut) /
            summary.transactionCount
          ).toFixed(2)
        )
      : 0;

  return {
    userId,
    summary: { ...summary, averageTransactionAmount: average },
    byType: aggregates,
    monthlyBreakdown: monthly,
  };
};

const getGlobalReport = async () => {
  const aggregates = await repo.aggregateGlobal();
  const summary = buildSummary(aggregates);
  return { summary, byType: aggregates };
};

module.exports = {
  getHistory,
  getAccountStatement,
  getFinancialReport,
  getStatistics,
  getGlobalReport,
};
