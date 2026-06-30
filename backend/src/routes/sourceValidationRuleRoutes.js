'use strict';

const express = require('express');
const router = express.Router();

const { createRule, getRules, deleteRule } = require('../controllers/sourceValidationRuleController');
const { requireAdminAuth } = require('../middleware/auth');
const { auditContext } = require('../middleware/auditContext');

// All source-rule endpoints are admin-only — no school context needed
// (rules are global payment source controls, not per-school)
router.post('/',      requireAdminAuth, auditContext, createRule);
router.get('/',       requireAdminAuth, getRules);
router.delete('/:id', requireAdminAuth, auditContext, deleteRule);

module.exports = router;
