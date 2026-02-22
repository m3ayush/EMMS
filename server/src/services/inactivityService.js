const Mou = require('../models/Mou');

async function getInactiveFacultyMous() {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const staleMous = await Mou.find({
    status: 'active',
    lastInteractionDate: { $lt: ninetyDaysAgo },
  })
    .populate('faculty', 'name email department designation')
    .populate('organisation', 'name type')
    .sort({ lastInteractionDate: 1 });

  const grouped = {};
  for (const mou of staleMous) {
    const facultyId = mou.faculty._id.toString();
    if (!grouped[facultyId]) {
      grouped[facultyId] = {
        faculty: mou.faculty,
        staleMous: [],
        maxInactiveDays: 0,
      };
    }
    const inactiveDays = Math.floor((Date.now() - mou.lastInteractionDate) / (1000 * 60 * 60 * 24));
    grouped[facultyId].staleMous.push({
      ...mou.toObject(),
      inactiveDays,
    });
    grouped[facultyId].maxInactiveDays = Math.max(grouped[facultyId].maxInactiveDays, inactiveDays);
  }

  return Object.values(grouped).sort((a, b) => b.maxInactiveDays - a.maxInactiveDays);
}

module.exports = { getInactiveFacultyMous };
