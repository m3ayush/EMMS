const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const mouRoutes = require('./routes/mouRoutes');
const orgRoutes = require('./routes/orgRoutes');
const activityRoutes = require('./routes/activityRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/mous', mouRoutes);
app.use('/api/organisations', orgRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'EMMS API is running' });
});

app.use(errorHandler);

module.exports = app;
