/**
 * seed.js — Database seeder
 * Run once with: node seed.js
 * Seeds the MongoDB Atlas database with sample posts and the admin user.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Post, Contact, User } = require("./models/index");

const SAMPLE_POSTS = [
  {
    title: "Global Offshore Wind Capacity Hits Record 100GW",
    summary:
      "A landmark milestone as cumulative offshore wind installations surpass 100 gigawatts, driven by aggressive expansion in the North Sea and Asia-Pacific.",
    content: `<p>The global offshore wind sector achieved a historic milestone this year as cumulative installed capacity crossed the <strong>100 gigawatt threshold</strong>. This growth has been propelled by major projects in the United Kingdom, Germany, and increasingly in China and South Korea.</p>
<p>Analysts project a further doubling of capacity by 2030, underpinned by falling levelised costs of energy (LCOE) and supportive policy frameworks across the G7. The average offshore wind LCOE has dropped 60% over the past decade to approximately $80/MWh.</p>
<h3>Key Drivers</h3>
<ul>
  <li>Floating turbine technology enabling deeper water deployments</li>
  <li>Supply chain maturation reducing per-MW capital costs</li>
  <li>Long-term Power Purchase Agreements providing investor certainty</li>
</ul>`,
    author: "Dr. Priya Nair",
    category: "Wind",
    thumbnail:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&q=80",
    readTime: "4 min",
  },
  {
    title: "Solid-State Battery Breakthrough Promises 2× EV Range",
    summary:
      "Researchers unveil a sulfide-based solid electrolyte achieving 500 Wh/kg energy density — a potential inflection point for electric vehicle adoption.",
    content: `<p>A consortium of universities and automotive manufacturers has demonstrated a solid-state battery cell achieving an energy density of <strong>500 Wh/kg</strong> — more than double the best commercially available lithium-ion cells.</p>
<p>The sulfide-based solid electrolyte eliminates thermal runaway risk and enables ultra-fast 10-minute charging cycles. Commercial production timelines are projected for 2027.</p>
<h3>Performance Benchmarks</h3>
<ul>
  <li>Energy density: 500 Wh/kg vs 250 Wh/kg (standard Li-ion)</li>
  <li>Charge cycle life: 2,000+ full cycles with &lt;5% degradation</li>
  <li>Operating temperature range: -30°C to +85°C</li>
</ul>`,
    author: "Marcus Okafor",
    category: "Storage",
    thumbnail:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80",
    readTime: "6 min",
  },
  {
    title: "EU Green Hydrogen Strategy: €8 Billion Unlocked",
    summary:
      "The European Commission approves a landmark fund targeting 10 million tonnes of domestic green hydrogen production by 2030.",
    content: `<p>The European Commission has formally approved the European Hydrogen Bank's second auction, releasing <strong>€8 billion</strong> in subsidies to kickstart a domestic green hydrogen industry.</p>
<p>The initiative targets the replacement of fossil-based hydrogen in industrial processes including steel manufacturing and chemical production. Critics note that electrolyser supply chains remain a bottleneck, with lead times of 18–24 months for large-scale equipment.</p>
<h3>Funding Allocation</h3>
<ul>
  <li>€3.2B — Industrial electrolyser capacity</li>
  <li>€2.5B — Hydrogen transport infrastructure</li>
  <li>€2.3B — R&D and pilot projects</li>
</ul>`,
    author: "Lena Brandt",
    category: "Hydrogen",
    thumbnail:
      "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=1200&q=80",
    readTime: "5 min",
  },
  {
    title: "Solar PV Module Prices Drop Below $0.10 per Watt",
    summary:
      "Chinese manufacturing overcapacity drives crystalline silicon module spot prices to an all-time low, reshaping global project economics.",
    content: `<p>Spot market prices for crystalline silicon solar PV modules have fallen below <strong>$0.10/W</strong> for the first time, a consequence of significant manufacturing overcapacity in China.</p>
<p>While this accelerates project deployment globally, it has created severe margin pressure for non-Chinese manufacturers. The EU is investigating anti-dumping measures, while US tariff regimes continue to shield domestic producers at higher cost bases.</p>
<h3>Market Impact</h3>
<ul>
  <li>LCOE for utility-scale solar now below $30/MWh in high-irradiance regions</li>
  <li>European module manufacturers reporting 20–35% revenue declines</li>
  <li>Global annual installations projected at 700 GW for 2025</li>
</ul>`,
    author: "Aiko Tanaka",
    category: "Solar",
    thumbnail:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
    readTime: "3 min",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB Compass");

    // Clear existing data
    await Promise.all([Post.deleteMany({}), Contact.deleteMany({}), User.deleteMany({})]);
    console.log("🗑  Cleared existing collections");

    // Seed posts
    await Post.insertMany(SAMPLE_POSTS);
    console.log(`📄 Seeded ${SAMPLE_POSTS.length} posts`);

    // Seed admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123", 12);
    await User.create({
      email: process.env.ADMIN_EMAIL || "admin@ecomonitor.io",
      password: hashedPassword,
      role: "admin",
      name: "EcoMonitor Admin",
    });
    console.log(`👤 Admin user created: ${process.env.ADMIN_EMAIL}`);

    console.log("\n✨ Database seeded successfully. Run 'node server.js' to start the API.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
