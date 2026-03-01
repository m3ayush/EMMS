require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Organisation = require('./src/models/Organisation');
const Mou = require('./src/models/Mou');

async function seedInactiveFaculty() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Create or find user
        let user = await User.findOne({ email: 'sk4567@srmist.edu.in' });
        if (!user) {
            user = new User({
                firebaseUid: 'dummy_uid_sushant_kumar_123',
                email: 'sk4567@srmist.edu.in',
                name: 'Sushant Kumar',
                department: 'Computer Science',
                designation: 'assistant professor',
                role: 'faculty',
                phone: '7307794557',
            });
            await user.save();
            console.log('Created user:', user.name);
        } else {
            console.log('User already exists:', user.name);
        }

        // Create organisation
        let org = await Organisation.findOne({ name: 'Inactive Protocol Corp' });
        if (!org) {
            org = new Organisation({
                name: 'Inactive Protocol Corp',
                type: 'industry',
                createdBy: user._id,
            });
            await org.save();
            console.log('Created organisation:', org.name);
        }

        // Create Mou that is "stale"
        // Needs to have status='active', lastInteractionDate < 90 days ago, expiryDate in future
        const now = new Date();
        const oneHundredTwentyDaysAgo = new Date();
        oneHundredTwentyDaysAgo.setDate(now.getDate() - 120);

        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(now.getFullYear() + 1);

        const oneHundredFiftyDaysAgo = new Date();
        oneHundredFiftyDaysAgo.setDate(now.getDate() - 150);

        let mou = await Mou.findOne({ title: 'Legacy Protocol Research' });
        if (!mou) {
            mou = new Mou({
                title: 'Legacy Protocol Research',
                description: 'This is a sample MoU to demonstrate an inactive faculty member who has not interacted for over 90 days.',
                faculty: user._id,
                organisation: org._id,
                signedCopyUrl: 'https://example.com/dummy.pdf',
                signedCopyPath: 'dummy/path.pdf',
                status: 'active',
                signedDate: oneHundredFiftyDaysAgo,
                expiryDate: oneYearFromNow,
                lastInteractionDate: oneHundredTwentyDaysAgo,
            });
            await mou.save();
            console.log('Created stale MoU:', mou.title);
        } else {
            console.log('MoU already exists:', mou.title);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
}

seedInactiveFaculty();
