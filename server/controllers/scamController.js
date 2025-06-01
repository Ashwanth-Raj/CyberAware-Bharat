const Scam = require('../models/Scam');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary.config');
const PDFDocument = require('pdfkit');
const stream = require('stream');
const axios = require('axios'); // Added for fetching images

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

exports.submitScam = async (req, res) => {
  try {
    console.log('Submit scam request body:', req.body);
    const { scamType, description, region, files, isAnonymous } = req.body;

    if (!scamType) {
      return res.status(400).json({ message: 'Scam type is required' });
    }
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }
    if (!region) {
      return res.status(400).json({ message: 'Region is required' });
    }

    const userId = req.user._id; // Updated to use _id from full user object
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const scam = new Scam({
      scamType,
      description,
      region,
      files: Array.isArray(files) ? files : [],
      userId: isAnonymous ? null : userId,
      creatorEmail: isAnonymous ? null : user.email,
      isAnonymous,
    });
    await scam.save();
    res.status(201).json({ message: 'Scam reported successfully' });
  } catch (error) {
    console.error('Submit scam error:', error.message);
    res.status(500).json({ message: 'Error submitting scam', error: error.message });
  }
};

exports.getScams = async (req, res) => {
  try {
    const { scamType, region, startDate, endDate } = req.query;
    const query = {};

    if (scamType) query.scamType = scamType;
    if (region) {
      try {
        const sanitizedRegion = escapeRegExp(region);
        query.region = new RegExp(sanitizedRegion, 'i');
      } catch (error) {
        console.error('Invalid region regex:', region, error.message);
        return res.status(400).json({ message: 'Invalid region filter' });
      }
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start)) {
          return res.status(400).json({ message: 'Invalid start date' });
        }
        query.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end)) {
          return res.status(400).json({ message: 'Invalid end date' });
        }
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const scams = await Scam.find(query).select('scamType description region files creatorEmail isAnonymous createdAt userId');
    res.json(scams);
  } catch (error) {
    console.error('Get scams error:', error.message);
    res.status(500).json({ message: 'Error fetching scams', error: error.message });
  }
};

exports.editScam = async (req, res) => {
  try {
    const { id } = req.params;
    const scam = await Scam.findById(id);
    if (!scam) return res.status(404).json({ message: 'Scam not found' });

    console.log('Scam document before update:', scam);

    // Authorization: Only the creator can edit, law_enforcement cannot edit others' scams
    const isCreator =
      (scam.userId && scam.userId.toString() === req.user._id.toString()) ||
      (scam.creatorEmail && req.user.email && scam.creatorEmail === req.user.email);
    if (!isCreator) {
      return res.status(403).json({ message: 'Unauthorized to edit this scam' });
    }

    const { scamType, description, region, removedFiles } = req.body;
    const files = req.files || [];

    let filesToRemove = [];
    if (removedFiles) {
      filesToRemove = typeof removedFiles === 'string' ? JSON.parse(removedFiles) : removedFiles;
    }

    if (filesToRemove.length > 0) {
      for (const fileUrl of filesToRemove) {
        try {
          const publicId = fileUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`cybersafe/${publicId}`);
          scam.files = scam.files.filter((file) => file !== fileUrl);
        } catch (error) {
          console.error(`Failed to delete image from Cloudinary: ${fileUrl}`, error.message);
        }
      }
    }

    let newFileUrls = [];
    if (files.length > 0) {
      newFileUrls = await Promise.all(
        files.map(async (file) => {
          try {
            const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(base64, {
              folder: 'cybersafe',
              resource_type: 'image',
            });
            return result.secure_url;
          } catch (error) {
            console.error('Failed to upload image to Cloudinary:', error.message);
            throw new Error('Image upload failed');
          }
        })
      );
      scam.files = [...scam.files, ...newFileUrls];
    }

    scam.scamType = scamType || scam.scamType;
    scam.description = description || scam.description;
    scam.region = region || scam.region;

    await scam.save({ validateBeforeSave: true, versionKey: false });
    res.json({ message: 'Scam updated successfully', scam });
  } catch (error) {
    console.error('Edit scam error:', error.message);
    res.status(500).json({ message: 'Error editing scam', error: error.message });
  }
};

exports.deleteScam = async (req, res) => {
  try {
    const { id } = req.params;
    const scam = await Scam.findById(id);
    if (!scam) return res.status(404).json({ message: 'Scam not found' });

    // Authorization: Creator or law_enforcement can delete
    const isCreator =
      (scam.userId && scam.userId.toString() === req.user._id.toString()) ||
      (scam.creatorEmail && req.user.email && scam.creatorEmail === req.user.email);
    const isLawEnforcement = req.user.role === 'law_enforcement';
    if (!isCreator && !isLawEnforcement) {
      return res.status(403).json({ message: 'Unauthorized to delete this scam' });
    }

    if (scam.files && scam.files.length > 0) {
      for (const fileUrl of scam.files) {
        try {
          const publicId = fileUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`cybersafe/${publicId}`);
        } catch (error) {
          console.error(`Failed to delete image from Cloudinary: ${fileUrl}`, error.message);
        }
      }
    }

    await scam.deleteOne();
    res.json({ message: 'Scam deleted successfully' });
  } catch (error) {
    console.error('Delete scam error:', error.message);
    res.status(500).json({ message: 'Error deleting scam', error: error.message });
  }
};

exports.downloadScamPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const scam = await Scam.findById(id);
    if (!scam) return res.status(404).json({ message: 'Scam not found' });

    // Authorization: Only law_enforcement can download PDF
    if (req.user.role !== 'law_enforcement') {
      return res.status(403).json({ message: 'Unauthorized to download PDF' });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const filename = `scam-report-${id}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    // Pipe PDF to response
    const buffer = new stream.PassThrough();
    doc.pipe(buffer);
    buffer.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text('Scam Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Scam Type: ${scam.scamType}`);
    doc.text(`Region: ${scam.region}`);
    doc.text(`Description: ${scam.description}`);
    doc.text(`Creator: ${scam.isAnonymous ? 'Anonymous' : scam.creatorEmail || 'Unknown'}`);
    doc.text(`Created At: ${new Date(scam.createdAt).toLocaleString()}`);
    doc.moveDown();

    if (scam.files && scam.files.length > 0) {
      doc.fontSize(14).text('Evidence Images:', { underline: true });
      doc.moveDown(0.5);

      for (const [index, fileUrl] of scam.files.entries()) {
        doc.fontSize(12).text(`Image ${index + 1}:`);
        try {
          // Fetch the image from the Cloudinary URL
          const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
          const imageBuffer = Buffer.from(response.data, 'binary');

          // Embed the image in the PDF
          doc.image(imageBuffer, {
            fit: [150, 150], // Resize image to fit within 150x150
            align: 'left',
            valign: 'top',
          });
        } catch (err) {
          console.error(`Error embedding image ${fileUrl}:`, err.message);
          doc.fontSize(10).text('[Failed to load image]');
        }
        doc.moveDown(1);
      }
    }

    doc.end();
  } catch (error) {
    console.error('Download PDF error:', error.message);
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
};

exports.getScamTrends = async (req, res) => {
  try {
    const trends = await Scam.aggregate([
      { $group: { _id: '$scamType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(trends);
  } catch (error) {
    console.error('Get trends error:', error.message);
    res.status(500).json({ message: 'Error fetching trends', error: error.message });
  }
};