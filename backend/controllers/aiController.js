const { generateProductDescription, estimatePrice, analyzeFraud } = require('../services/geminiService');

// @desc    Generate product description using AI
// @route   POST /api/ai/generate-description
// @access  Private
const generateDescription = async (req, res, next) => {
  try {
    const { title, condition } = req.body;
    if (!title || !condition) {
      res.status(400);
      return next(new Error('Please provide title and condition'));
    }

    const description = await generateProductDescription(title, condition);
    res.json({ description });
  } catch (error) {
    next(error);
  }
};

// @desc    Estimate item price using AI
// @route   POST /api/ai/estimate-price
// @access  Private
const estimatePricing = async (req, res, next) => {
  try {
    const { title, category, condition, description } = req.body;
    if (!title || !category || !condition) {
      res.status(400);
      return next(new Error('Please provide title, category, and condition'));
    }

    const estimation = await estimatePrice(title, category, condition, description || '');
    res.json(estimation);
  } catch (error) {
    next(error);
  }
};

// @desc    Check listing for potential fraud using AI
// @route   POST /api/ai/check-fraud
// @access  Private
const checkFraudRisk = async (req, res, next) => {
  try {
    const { title, category, condition, description, startingBid } = req.body;
    if (!title || !category || !condition || startingBid === undefined) {
      res.status(400);
      return next(new Error('Please provide title, category, condition, and starting bid'));
    }

    const fraudResult = await analyzeFraud(title, category, condition, description || '', startingBid);
    res.json(fraudResult);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateDescription,
  estimatePricing,
  checkFraudRisk
};
