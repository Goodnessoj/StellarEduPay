'use strict';

const express = require('express');
const router = express.Router();
const { createRule, listRules, updateRule, deleteRule } = require('../controllers/feeAdjustmentController');
const { resolveSchool } = require('../middleware/schoolContext');
const { requireAdminAuth } = require('../middleware/auth');
const { auditContext } = require('../middleware/auditContext');

router.use(resolveSchool);

router.post('/',      requireAdminAuth, auditContext, createRule);
router.get('/',       listRules);
router.put('/:id',    requireAdminAuth, auditContext, updateRule);
router.delete('/:id', requireAdminAuth, auditContext, deleteRule);

module.exports = router;
