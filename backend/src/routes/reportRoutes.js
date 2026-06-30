'use strict';

const express = require('express');
const router = express.Router();
const { getReport, getDashboard } = require('../controllers/reportController');
const { resolveSchool } = require('../middleware/schoolContext');
const { requireSchoolAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { reportQuerySchema } = require('../middleware/schemas/reportSchemas');

// All report endpoints expose full financial data and CSV/accounting exports.
// Gate every route behind the finance permission (fix #887).
const requireFinanceRole = requireSchoolAuth(['owner', 'finance']);

router.use(resolveSchool);

router.get('/dashboard', requireFinanceRole, getDashboard);
router.get('/', requireFinanceRole, validate(reportQuerySchema, 'query'), getReport);

module.exports = router;
