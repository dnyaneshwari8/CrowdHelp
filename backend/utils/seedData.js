const User = require('../models/User');
const Campaign = require('../models/Campaign');
const NGOApplication = require('../models/NGOApplication');
const Donation = require('../models/Donation');

const seedDatabase = async (forceReseed = false) => {
    try {
        console.log('--- Checking & Seeding Demo Accounts & Data ---');

        // Fixed deterministic ObjectIds to preserve demo sessions across MongoMemoryServer restarts
        const DEMO_ADMIN_ID = '65f000000000000000000001';
        const DEMO_NGO_ID = '65f000000000000000000002';
        const DEMO_USER_ID = '65f000000000000000000003';

        // 1. Seed Admin User
        let admin = await User.findOne({ email: 'admin@crowdhelp.com' });
        if (!admin) {
            admin = await User.create({
                _id: DEMO_ADMIN_ID,
                name: 'Platform Admin',
                email: 'admin@crowdhelp.com',
                phone: '9999999999',
                password: 'adminpassword',
                role: 'ADMIN',
                isVerified: true
            });
            console.log('✓ Admin Account Seeded: admin@crowdhelp.com / adminpassword');
        }

        // 2. Seed NGO User
        let ngo = await User.findOne({ email: 'ngo@careindia.org' });
        if (!ngo) {
            ngo = await User.create({
                _id: DEMO_NGO_ID,
                name: 'Care India NGO',
                email: 'ngo@careindia.org',
                phone: '8888888888',
                password: 'ngopassword',
                role: 'NGO',
                ngoStatus: 'APPROVED',
                organizationName: 'Care India Foundation',
                organizationDescription: 'Empowering underprivileged communities through education, healthcare, and sustainable development.',
                organizationEmail: 'ngo@careindia.org',
                organizationPhone: '8888888888',
                registrationNumber: 'NGO-IND-2024-8849',
                website: 'https://careindia.org',
                isVerified: true
            });
            console.log('✓ NGO Account Seeded: ngo@careindia.org / ngopassword');
        }

        // 3. Seed Registered Donor Users
        const sampleUsersData = [
            { name: 'Vikram Malhotra', email: 'vikram.malhotra@gmail.com', phone: '9820112233', role: 'USER' },
            { name: 'Priya Patel', email: 'priya.patel@outlook.com', phone: '9820223344', role: 'USER' },
            { name: 'Rajesh Iyer', email: 'rajesh.iyer@gmail.com', phone: '9820334455', role: 'USER' },
            { name: 'Aarav Sharma', email: 'aarav.sharma@yahoo.com', phone: '9820445566', role: 'USER' },
            { name: 'Sneha Deshmukh', email: 'sneha.deshmukh@gmail.com', phone: '9820556677', role: 'USER' },
            { name: 'Amit Verma', email: 'amit.verma@techcorp.com', phone: '9820667788', role: 'USER' },
            { name: 'Ritu Sen', email: 'ritu.sen@gmail.com', phone: '9820778899', role: 'USER' },
            { _id: DEMO_USER_ID, name: 'Demo Donor', email: 'user@crowdhelp.com', phone: '7777777777', role: 'USER' },
            { name: 'Arjun Rao', email: 'arjun.rao@gmail.com', phone: '9820889900', role: 'USER' },
            { name: 'Ananya Mukherjee', email: 'ananya.m@gmail.com', phone: '9820990011', role: 'USER' },
            { name: 'Kavita Reddy', email: 'kavita.reddy@gmail.com', phone: '9820101010', role: 'USER' }
        ];

        const userMap = {};
        for (const u of sampleUsersData) {
            let existing = await User.findOne({ email: u.email });
            if (!existing) {
                const userData = {
                    name: u.name,
                    email: u.email,
                    phone: u.phone,
                    password: 'userpassword',
                    role: 'USER',
                    isVerified: true
                };
                if (u._id) userData._id = u._id;
                existing = await User.create(userData);
            }
            userMap[u.email] = existing;
        }
        console.log(`✓ ${Object.keys(userMap).length} Active Donor Accounts Ready`);

        // 4. Seed Campaigns (Ensure around 10-12 diverse campaigns exist)
        const campaignCount = await Campaign.countDocuments();
        if (campaignCount < 10 || forceReseed) {
            if (forceReseed) {
                await Campaign.deleteMany({});
                await Donation.deleteMany({});
            }

            const sampleCampaigns = [
                {
                    title: 'Educate Underprivileged Children in Rural Schools',
                    description: 'Support 200+ underprivileged children with books, digital learning tools, school kits, and daily nutrition in rural communities.',
                    category: 'Education',
                    goalAmount: 150000,
                    currentAmount: 95000,
                    status: 'APPROVED',
                    startDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
                    createdBy: ngo._id,
                    createdByRole: 'NGO',
                    ngoId: ngo._id
                },
                {
                    title: 'Emergency Pediatric Surgeries & ICU Healthcare Fund',
                    description: 'Provide critical emergency surgeries, life-saving medicines, and diagnostic tests for low-income infant patients and children in urgent medical distress.',
                    category: 'Health',
                    goalAmount: 350000,
                    currentAmount: 245000,
                    status: 'APPROVED',
                    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
                    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
                    createdBy: ngo._id,
                    createdByRole: 'NGO',
                    ngoId: ngo._id
                },
                {
                    title: 'Clean Water & Solar RO Kiosks for Drought-Hit Villages',
                    description: 'Installing solar-powered clean drinking water filtration kiosks and sanitary pipeline infrastructure in 10 drought-prone villages.',
                    category: 'Environment',
                    goalAmount: 200000,
                    currentAmount: 140000,
                    status: 'APPROVED',
                    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
                    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80',
                    createdBy: admin._id,
                    createdByRole: 'ADMIN'
                },
                {
                    title: 'Rescue, Treatment & Shelter for Injured Stray Animals',
                    description: '24/7 animal ambulance, emergency fracture surgery, anti-rabies vaccination, and permanent foster shelter for abandoned animals.',
                    category: 'Animal Welfare',
                    goalAmount: 120000,
                    currentAmount: 82000,
                    status: 'APPROVED',
                    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80',
                    createdBy: ngo._id,
                    createdByRole: 'NGO',
                    ngoId: ngo._id
                },
                {
                    title: 'Digital STEM Labs & Coding Kits for Rural High Schools',
                    description: 'Equipping rural public schools with modern computer labs, solar battery backups, coding curriculum, and certified robotics trainers.',
                    category: 'Education',
                    goalAmount: 280000,
                    currentAmount: 195000,
                    status: 'APPROVED',
                    startDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
                    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
                    createdBy: ngo._id,
                    createdByRole: 'NGO',
                    ngoId: ngo._id
                },
                {
                    title: 'Mobile Medical Vans & Cancer Screening for Urban Slums',
                    description: 'Deploying custom mobile clinical vans staffed with oncologists and nurses to provide early cancer detection, diabetes screening, and free medications.',
                    category: 'Health',
                    goalAmount: 450000,
                    currentAmount: 310000,
                    status: 'APPROVED',
                    startDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
                    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
                    createdBy: ngo._id,
                    createdByRole: 'NGO',
                    ngoId: ngo._id
                },
                {
                    title: 'Urban Reforestation & 50,000 Native Tree Micro-Forests',
                    description: 'Combating urban heatwaves and air pollution by planting and nurturing 50,000 dense native species using the Miyawaki afforestation method.',
                    category: 'Environment',
                    goalAmount: 180000,
                    currentAmount: 115000,
                    status: 'APPROVED',
                    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000),
                    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
                    createdBy: ngo._id,
                    createdByRole: 'NGO',
                    ngoId: ngo._id
                },
                {
                    title: 'Community Dog Sterilization & Anti-Rabies Mega Drive',
                    description: 'Humanely reducing street dog suffering through scientific birth control surgeries, rabies immunizations, and community volunteer care.',
                    category: 'Animal Welfare',
                    goalAmount: 150000,
                    currentAmount: 98000,
                    status: 'APPROVED',
                    startDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
                    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=80',
                    createdBy: ngo._id,
                    createdByRole: 'NGO',
                    ngoId: ngo._id
                },
                {
                    title: 'Emergency Flood Relief, Clean Rations & Temporary Shelters',
                    description: 'Delivering urgent rescue boats, hygienic drinking water packets, baby food, dry rations, and mosquito-proof emergency tents to submerged districts.',
                    category: 'Disaster Relief',
                    goalAmount: 500000,
                    currentAmount: 375000,
                    status: 'APPROVED',
                    startDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1000&q=80',
                    createdBy: admin._id,
                    createdByRole: 'ADMIN'
                },
                {
                    title: 'Earthquake Reconstruction & Safe Permanent Housing',
                    description: 'Rebuilding seismic-resistant homes, community hygiene blocks, and schools for families who lost everything in recent seismic tremors.',
                    category: 'Disaster Relief',
                    goalAmount: 650000,
                    currentAmount: 480000,
                    status: 'APPROVED',
                    startDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80',
                    createdBy: admin._id,
                    createdByRole: 'ADMIN'
                },
                {
                    title: 'Micro-Grants & Handloom Training for Widows & Rural Women',
                    description: 'Equipping 150+ women with sewing machines, organic handloom training, and seed capital to launch independent self-sustaining micro-enterprises.',
                    category: 'Other',
                    goalAmount: 220000,
                    currentAmount: 160000,
                    status: 'APPROVED',
                    startDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
                    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1000&q=80',
                    createdBy: ngo._id,
                    createdByRole: 'NGO',
                    ngoId: ngo._id
                },
                {
                    title: 'Nutritious Morning Breakfast & Daily Meals for Slum Children',
                    description: 'Providing freshly cooked, nutrient-rich morning breakfast and milk to 500+ underprivileged school children every single morning to eradicate classroom hunger.',
                    category: 'Education',
                    goalAmount: 160000,
                    currentAmount: 110000,
                    status: 'APPROVED',
                    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
                    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
                    createdBy: ngo._id,
                    createdByRole: 'NGO',
                    ngoId: ngo._id
                }
            ];

            const createdCampaigns = await Campaign.insertMany(sampleCampaigns);
            console.log(`✓ ${createdCampaigns.length} Demo Campaigns Seeded Successfully`);

            // 5. Seed Multi-Tier Completed Donations for Leaderboard Ranking
            const sampleDonations = [
                // Rank 1: Vikram Malhotra (Total: ₹65,000 -> Diamond Champion)
                {
                    userId: userMap['vikram.malhotra@gmail.com']._id,
                    campaignId: createdCampaigns[1]._id,
                    ngoId: ngo._id,
                    donorName: 'Vikram Malhotra',
                    donorEmail: 'vikram.malhotra@gmail.com',
                    amount: 30000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_101',
                    razorpay_payment_id: 'pay_ldb_101',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                },
                {
                    userId: userMap['vikram.malhotra@gmail.com']._id,
                    campaignId: createdCampaigns[8]._id,
                    ngoId: ngo._id,
                    donorName: 'Vikram Malhotra',
                    donorEmail: 'vikram.malhotra@gmail.com',
                    amount: 25000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_102',
                    razorpay_payment_id: 'pay_ldb_102',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
                },
                {
                    userId: userMap['vikram.malhotra@gmail.com']._id,
                    campaignId: createdCampaigns[0]._id,
                    ngoId: ngo._id,
                    donorName: 'Vikram Malhotra',
                    donorEmail: 'vikram.malhotra@gmail.com',
                    amount: 10000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_103',
                    razorpay_payment_id: 'pay_ldb_103',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                },

                // Rank 2: Priya Patel (Total: ₹48,000 -> Platinum Guardian)
                {
                    userId: userMap['priya.patel@outlook.com']._id,
                    campaignId: createdCampaigns[0]._id,
                    ngoId: ngo._id,
                    donorName: 'Priya Patel',
                    donorEmail: 'priya.patel@outlook.com',
                    amount: 25000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_201',
                    razorpay_payment_id: 'pay_ldb_201',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                },
                {
                    userId: userMap['priya.patel@outlook.com']._id,
                    campaignId: createdCampaigns[5]._id,
                    ngoId: ngo._id,
                    donorName: 'Priya Patel',
                    donorEmail: 'priya.patel@outlook.com',
                    amount: 15000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_202',
                    razorpay_payment_id: 'pay_ldb_202',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
                },
                {
                    userId: userMap['priya.patel@outlook.com']._id,
                    campaignId: createdCampaigns[3]._id,
                    ngoId: ngo._id,
                    donorName: 'Priya Patel',
                    donorEmail: 'priya.patel@outlook.com',
                    amount: 8000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_203',
                    razorpay_payment_id: 'pay_ldb_203',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
                },

                // Rank 3: Rajesh Iyer (Total: ₹36,000 -> Platinum Guardian)
                {
                    userId: userMap['rajesh.iyer@gmail.com']._id,
                    campaignId: createdCampaigns[2]._id,
                    ngoId: ngo._id,
                    donorName: 'Rajesh Iyer',
                    donorEmail: 'rajesh.iyer@gmail.com',
                    amount: 20000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_301',
                    razorpay_payment_id: 'pay_ldb_301',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                },
                {
                    userId: userMap['rajesh.iyer@gmail.com']._id,
                    campaignId: createdCampaigns[6]._id,
                    ngoId: ngo._id,
                    donorName: 'Rajesh Iyer',
                    donorEmail: 'rajesh.iyer@gmail.com',
                    amount: 10000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_302',
                    razorpay_payment_id: 'pay_ldb_302',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                },
                {
                    userId: userMap['rajesh.iyer@gmail.com']._id,
                    campaignId: createdCampaigns[7]._id,
                    ngoId: ngo._id,
                    donorName: 'Rajesh Iyer',
                    donorEmail: 'rajesh.iyer@gmail.com',
                    amount: 6000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_303',
                    razorpay_payment_id: 'pay_ldb_303',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
                },

                // Rank 4: Aarav Sharma (Total: ₹25,000 -> Platinum Guardian)
                {
                    userId: userMap['aarav.sharma@yahoo.com']._id,
                    campaignId: createdCampaigns[1]._id,
                    ngoId: ngo._id,
                    donorName: 'Aarav Sharma',
                    donorEmail: 'aarav.sharma@yahoo.com',
                    amount: 15000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_401',
                    razorpay_payment_id: 'pay_ldb_401',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
                },
                {
                    userId: userMap['aarav.sharma@yahoo.com']._id,
                    campaignId: createdCampaigns[4]._id,
                    ngoId: ngo._id,
                    donorName: 'Aarav Sharma',
                    donorEmail: 'aarav.sharma@yahoo.com',
                    amount: 10000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_402',
                    razorpay_payment_id: 'pay_ldb_402',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
                },

                // Rank 5: Sneha Deshmukh (Total: ₹18,500 -> Gold Benefactor)
                {
                    userId: userMap['sneha.deshmukh@gmail.com']._id,
                    campaignId: createdCampaigns[10]._id,
                    ngoId: ngo._id,
                    donorName: 'Sneha Deshmukh',
                    donorEmail: 'sneha.deshmukh@gmail.com',
                    amount: 12000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_501',
                    razorpay_payment_id: 'pay_ldb_501',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
                },
                {
                    userId: userMap['sneha.deshmukh@gmail.com']._id,
                    campaignId: createdCampaigns[11]._id,
                    ngoId: ngo._id,
                    donorName: 'Sneha Deshmukh',
                    donorEmail: 'sneha.deshmukh@gmail.com',
                    amount: 6500,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_502',
                    razorpay_payment_id: 'pay_ldb_502',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
                },

                // Rank 6: Amit Verma (Total: ₹14,000 -> Gold Benefactor)
                {
                    userId: userMap['amit.verma@techcorp.com']._id,
                    campaignId: createdCampaigns[4]._id,
                    ngoId: ngo._id,
                    donorName: 'Amit Verma',
                    donorEmail: 'amit.verma@techcorp.com',
                    amount: 10000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_601',
                    razorpay_payment_id: 'pay_ldb_601',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                },
                {
                    userId: userMap['amit.verma@techcorp.com']._id,
                    campaignId: createdCampaigns[6]._id,
                    ngoId: ngo._id,
                    donorName: 'Amit Verma',
                    donorEmail: 'amit.verma@techcorp.com',
                    amount: 4000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_602',
                    razorpay_payment_id: 'pay_ldb_602',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000)
                },

                // Rank 7: Ritu Sen (Total: ₹9,500 -> Silver Supporter)
                {
                    userId: userMap['ritu.sen@gmail.com']._id,
                    campaignId: createdCampaigns[0]._id,
                    ngoId: ngo._id,
                    donorName: 'Ritu Sen',
                    donorEmail: 'ritu.sen@gmail.com',
                    amount: 5500,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_701',
                    razorpay_payment_id: 'pay_ldb_701',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
                },
                {
                    userId: userMap['ritu.sen@gmail.com']._id,
                    campaignId: createdCampaigns[3]._id,
                    ngoId: ngo._id,
                    donorName: 'Ritu Sen',
                    donorEmail: 'ritu.sen@gmail.com',
                    amount: 4000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_702',
                    razorpay_payment_id: 'pay_ldb_702',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
                },

                // Rank 8: Demo Donor (Total: ₹8,000 -> Silver Supporter)
                {
                    userId: userMap['user@crowdhelp.com']._id,
                    campaignId: createdCampaigns[0]._id,
                    ngoId: ngo._id,
                    donorName: 'Demo Donor',
                    donorEmail: 'user@crowdhelp.com',
                    amount: 5000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_801',
                    razorpay_payment_id: 'pay_ldb_801',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                },
                {
                    userId: userMap['user@crowdhelp.com']._id,
                    campaignId: createdCampaigns[2]._id,
                    ngoId: ngo._id,
                    donorName: 'Demo Donor',
                    donorEmail: 'user@crowdhelp.com',
                    amount: 3000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_802',
                    razorpay_payment_id: 'pay_ldb_802',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
                },

                // Rank 9: Arjun Rao (Total: ₹5,500 -> Silver Supporter)
                {
                    userId: userMap['arjun.rao@gmail.com']._id,
                    campaignId: createdCampaigns[7]._id,
                    ngoId: ngo._id,
                    donorName: 'Arjun Rao',
                    donorEmail: 'arjun.rao@gmail.com',
                    amount: 5500,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_901',
                    razorpay_payment_id: 'pay_ldb_901',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                },

                // Rank 10: Ananya Mukherjee (Total: ₹3,500 -> Bronze Friend)
                {
                    userId: userMap['ananya.m@gmail.com']._id,
                    campaignId: createdCampaigns[10]._id,
                    ngoId: ngo._id,
                    donorName: 'Ananya Mukherjee',
                    donorEmail: 'ananya.m@gmail.com',
                    amount: 3500,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_1001',
                    razorpay_payment_id: 'pay_ldb_1001',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                },

                // Rank 11: Kavita Reddy (Total: ₹2,000 -> Bronze Friend)
                {
                    userId: userMap['kavita.reddy@gmail.com']._id,
                    campaignId: createdCampaigns[11]._id,
                    ngoId: ngo._id,
                    donorName: 'Kavita Reddy',
                    donorEmail: 'kavita.reddy@gmail.com',
                    amount: 2000,
                    isAnonymous: false,
                    razorpay_order_id: 'order_ldb_1101',
                    razorpay_payment_id: 'pay_ldb_1101',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
                }
            ];

            await Donation.insertMany(sampleDonations);
            console.log(`✓ ${sampleDonations.length} Sample Completed Donations Seeded for Leaderboard & Donor Wall`);
        }

        // 6. Seed Sample NGO Application for Admin Review testing
        const appCount = await NGOApplication.countDocuments();
        if (appCount === 0) {
            await NGOApplication.create({
                userId: userMap['user@crowdhelp.com']._id,
                organizationName: 'Green Earth Initiative',
                description: 'Promoting urban green cover, organic farming, and community solar power systems.',
                registrationNumber: 'NGO-IND-2024-9912',
                email: 'contact@greenearth.org',
                phone: '9123456780',
                website: 'https://greenearth.org',
                address: '12 Eco Park, Green City',
                status: 'PENDING'
            });
            console.log('✓ Sample Pending NGO Application Seeded for Admin Approval');
        }

        console.log('--- Database Seeding Complete ---');
    } catch (error) {
        console.error('Database seeding error:', error.message);
    }
};

module.exports = { seedDatabase };
