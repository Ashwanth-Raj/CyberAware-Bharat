const express = require('express');
const router = express.Router();
const { submitScam, getScams, editScam, deleteScam, getScamTrends, downloadScamPDF } = require('../controllers/scamController');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth, submitScam);
router.get('/', getScams);
router.put('/:id', auth, upload.array('files'), editScam);
router.delete('/:id', auth, deleteScam);
router.get('/trends', getScamTrends);
router.get('/:id/pdf', auth, downloadScamPDF); // New route for PDF download

module.exports = router;