const reportService = require('../services/report.service');
const exportService = require('../services/export.service');
const ReportError = require('../utils/ReportError');

const resolveUserId = (req) => req.user?.sub || req.user?.id || req.user?.userId;

const assertUserAccess = (req, userId) => {
  const requesterId = resolveUserId(req);
  const role = req.user.role;
  const isAdmin = role === 'ADMIN_ROLE' || role === 'ADMIN';
  if (!isAdmin && String(requesterId) !== String(userId)) {
    throw new ReportError('No autorizado para este recurso', 403, 'FORBIDDEN');
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    assertUserAccess(req, userId);
    const data = await reportService.getHistory(userId, req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getAccountStatement = async (req, res, next) => {
  try {
    const { accountNumber } = req.params;
    const userId = req.query.userId || resolveUserId(req);
    assertUserAccess(req, userId);
    const data = await reportService.getAccountStatement(userId, accountNumber, req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.exportAccountStatement = async (req, res, next) => {
  try {
    const { accountNumber } = req.params;
    const userId = req.query.userId || resolveUserId(req);
    const format = (req.query.format || 'pdf').toLowerCase();
    if (!['pdf', 'xlsx'].includes(format)) {
      throw new ReportError('format debe ser pdf o xlsx');
    }
    assertUserAccess(req, userId);
    const statement = await reportService.getAccountStatement(userId, accountNumber, req.query);
    const file = await exportService.exportAccountStatement(statement, format);
    res.setHeader('Content-Type', file.mime);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(file.buffer);
  } catch (error) {
    next(error);
  }
};

exports.getFinancialReport = async (req, res, next) => {
  try {
    const { userId } = req.params;
    assertUserAccess(req, userId);
    const data = await reportService.getFinancialReport(userId, req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getStatistics = async (req, res, next) => {
  try {
    const { userId } = req.params;
    assertUserAccess(req, userId);
    const data = await reportService.getStatistics(userId, req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.exportHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const format = (req.query.format || 'pdf').toLowerCase();
    if (!['pdf', 'xlsx'].includes(format)) {
      throw new ReportError('format debe ser pdf o xlsx');
    }
    assertUserAccess(req, userId);
    const history = await reportService.getHistory(userId, { ...req.query, limit: 200 });
    const file = await exportService.exportHistory(history, format, userId);
    res.setHeader('Content-Type', file.mime);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(file.buffer);
  } catch (error) {
    next(error);
  }
};

exports.getGlobalReport = async (req, res, next) => {
  try {
    const data = await reportService.getGlobalReport();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Compatibilidad ruta antigua
exports.getUserReport = exports.getHistory;
