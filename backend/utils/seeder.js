const User = require('../models/User');
const Auction = require('../models/Auction');

const seedAuctions = async () => {
  try {
    // Find or create a default seller user
    let seller = await User.findOne({ email: 'trader@campus.edu' });
    if (!seller) {
      seller = await User.create({
        username: 'campus_trader',
        email: 'trader@campus.edu',
        password: 'password123',
        collegeName: 'State University',
        location: 'Hostel Block A, Room 102',
        role: 'seller'
      });
      console.log('Sample seller user created:', seller.username);
    } else {
      // Ensure password isn't double-hashed and matches "password123"
      seller.password = 'password123';
      await seller.save();
    }

    // Create a buyer/bidder user
    let bidder = await User.findOne({ email: 'bidder@campus.edu' });
    if (!bidder) {
      bidder = await User.create({
        username: 'eager_bidder',
        email: 'bidder@campus.edu',
        password: 'password123',
        collegeName: 'State University',
        location: 'Hostel Block C, Room 304',
        role: 'buyer'
      });
      console.log('Sample bidder user created:', bidder.username);
    } else {
      // Ensure password isn't double-hashed and matches "password123"
      bidder.password = 'password123';
      await bidder.save();
    }

    // Clear existing auctions first to support clean re-seeding
    await Auction.deleteMany({});
    console.log('Cleared existing auctions from database.');

    console.log('Seeding sample auctions...');

    // Seed some high quality auctions
    const mockAuctions = [
      {
        seller: seller._id,
        title: 'JEE Advanced 2025 Complete Study Prep Pack',
        description: 'Complete set of books including Physics, Chemistry, and Mathematics modules. Barely used, no markings, includes practice test papers. Perfect for preparation.',
        category: 'Study Materials',
        condition: 'Like New',
        startingBid: 1200,
        currentBid: 1200,
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
        duration: 72,
        endDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
        collegeName: 'State University',
        location: 'Hostel Block C, Room 302',
        aiPriceEstimation: {
          marketValue: 2500,
          recommendedStartingBid: 1200,
          suggestedDurationHours: 72,
          reasoning: 'Valued based on complete pack modules and pristine condition.'
        },
        aiFraudRisk: {
          riskLevel: 'Low',
          reasons: ['Listing details align well with academic study materials.']
        }
      },
      {
        seller: seller._id,
        title: 'Firefox Target 21-Speed Hybrid Cycle',
        description: 'Excellent hybrid cycle for campus commuting. 21 Shimano gears, dual disc brakes, front suspension. Tires are in good condition. Comes with a combination lock.',
        category: 'Cycles',
        condition: 'Good',
        startingBid: 4500,
        currentBid: 4500,
        images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600'],
        duration: 48,
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
        collegeName: 'State University',
        location: 'Cycle Stand, Gate 2',
        aiPriceEstimation: {
          marketValue: 9000,
          recommendedStartingBid: 4500,
          suggestedDurationHours: 48,
          reasoning: 'Valued based on the brand, functional gear setup, and utility value.'
        },
        aiFraudRisk: {
          riskLevel: 'Low',
          reasons: ['Legitimate campus commute item listed with realistic pricing and details.']
        }
      },
      {
        seller: seller._id,
        title: 'Apple MacBook Pro M1 (8GB / 256GB)',
        description: 'MacBook Pro M1 in Space Gray. Great battery life (88% health). Minor scratch on the bottom, screen is pristine. Perfect for coding, projects, and general study.',
        category: 'Laptops',
        condition: 'Good',
        startingBid: 35000,
        currentBid: 35000,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'],
        duration: 24,
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        collegeName: 'State University',
        location: 'Library Lounge',
        aiPriceEstimation: {
          marketValue: 48000,
          recommendedStartingBid: 35000,
          suggestedDurationHours: 24,
          reasoning: 'Standard resale valuation for base M1 MacBook Pro in good condition.'
        },
        aiFraudRisk: {
          riskLevel: 'Low',
          reasons: ['Item features check out, realistic description.']
        }
      },
      {
        seller: seller._id,
        title: 'Casio fx-991EX Scientific Calculator',
        description: 'Brand new Casio scientific calculator. Essential for engineering and science courses. Unopened box with warranty card.',
        category: 'Calculators',
        condition: 'New',
        startingBid: 600,
        currentBid: 600,
        images: ['https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=600'],
        duration: 96,
        endDate: new Date(Date.now() + 96 * 60 * 60 * 1000),
        collegeName: 'State University',
        location: 'Hostel Block A, Lobby',
        aiPriceEstimation: {
          marketValue: 1200,
          recommendedStartingBid: 600,
          suggestedDurationHours: 96,
          reasoning: 'Valued slightly lower than retail price for campus auction quick sale.'
        },
        aiFraudRisk: {
          riskLevel: 'Low',
          reasons: ['Authentic calculator model. low risk profile.']
        }
      },
      {
        seller: seller._id,
        title: 'Sony WH-1000XM4 Wireless Headphones',
        description: 'Industry-leading noise canceling headphones in Silver. Active Noise Canceling is amazing. Battery lasts up to 30 hours. Minor signs of wear on the headband.',
        category: 'Gadgets',
        condition: 'Good',
        startingBid: 12000,
        currentBid: 12000,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
        duration: 36,
        endDate: new Date(Date.now() + 36 * 60 * 60 * 1000),
        collegeName: 'State University',
        location: 'Hostel Block B, Room 205',
        aiPriceEstimation: {
          marketValue: 18000,
          recommendedStartingBid: 12000,
          suggestedDurationHours: 36,
          reasoning: 'Standard second-hand rate for XM4 model in good working condition.'
        },
        aiFraudRisk: {
          riskLevel: 'Low',
          reasons: ['Item details are precise. Pricing matches local market trends.']
        }
      },
      {
        seller: seller._id,
        title: 'Introduction to Algorithms (CLRS) 3rd Edition',
        description: 'The ultimate textbook for algorithms and data structures. Necessary for computer science majors. Clean pages, no highlights or pen marks.',
        category: 'Books',
        condition: 'Like New',
        startingBid: 800,
        currentBid: 800,
        images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'],
        duration: 120,
        endDate: new Date(Date.now() + 120 * 60 * 60 * 1000),
        collegeName: 'State University',
        location: 'Reading Room, Library',
        aiPriceEstimation: {
          marketValue: 1800,
          recommendedStartingBid: 800,
          suggestedDurationHours: 120,
          reasoning: 'Good valuation for student CS textbook in clean condition.'
        },
        aiFraudRisk: {
          riskLevel: 'Low',
          reasons: ['Standard college textbook. Authentic listing.']
        }
      },
      {
        seller: seller._id,
        title: 'Ergonomic Mesh Study Chair',
        description: 'High-back mesh chair with adjustable lumbar support and armrests. Very comfortable for long study or coding sessions. Sturdy wheels, height mechanism works perfectly.',
        category: 'Hostel Items',
        condition: 'Good',
        startingBid: 2000,
        currentBid: 2000,
        images: ['https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600'],
        duration: 48,
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
        collegeName: 'State University',
        location: 'Hostel Block C, Room 410',
        aiPriceEstimation: {
          marketValue: 4500,
          recommendedStartingBid: 2000,
          suggestedDurationHours: 48,
          reasoning: 'Resale value for functional office mesh chair.'
        },
        aiFraudRisk: {
          riskLevel: 'Low',
          reasons: ['Hostel items are commonly traded on campus. Model checks out.']
        }
      },
      {
        seller: seller._id,
        title: 'Apple iPad Air 4th Gen (64GB, Wi-Fi)',
        description: 'iPad Air 4 in Sky Blue. Comes with original charger and a screen guard pre-applied. Clean, scratchless back. Battery health is excellent (92%). Works great for note-taking with Apple Pencil (Pencil not included).',
        category: 'Gadgets',
        condition: 'Like New',
        startingBid: 22000,
        currentBid: 22000,
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'],
        duration: 24,
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        collegeName: 'State University',
        location: 'Hostel Block A, Room 102',
        aiPriceEstimation: {
          marketValue: 32000,
          recommendedStartingBid: 22000,
          suggestedDurationHours: 24,
          reasoning: 'Valued reasonably for standard 64GB storage model in pristine condition.'
        },
        aiFraudRisk: {
          riskLevel: 'Low',
          reasons: ['iPad checks out with realistic photos and description.']
        }
      },
      {
        seller: seller._id,
        title: 'LED Desk Lamp with Qi Wireless Charger',
        description: 'Foldable study lamp with 3 color modes and brightness settings. Features a built-in wireless charger for smartphones. Plug and play.',
        category: 'Hostel Items',
        condition: 'New',
        startingBid: 500,
        currentBid: 500,
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'],
        duration: 72,
        endDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
        collegeName: 'State University',
        location: 'Hostel Block B, Room 112',
        aiPriceEstimation: {
          marketValue: 1200,
          recommendedStartingBid: 500,
          suggestedDurationHours: 72,
          reasoning: 'Fair value for study lamp with Qi charger.'
        },
        aiFraudRisk: {
          riskLevel: 'Low',
          reasons: ['Basic electronic device, low risk.']
        }
      }
    ];

    await Auction.insertMany(mockAuctions);
    console.log('Sample auctions seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

module.exports = seedAuctions;
