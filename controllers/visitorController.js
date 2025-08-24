const { getAllVisitors } = require('../models/visitorModel');
const visitorService = require('../services/visitorService');
const {logger} = require('../services/logger');

const handleTrackVisit = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || null;

    //console.log(ip)

    await visitorService.trackVisit(ip, userAgent);
    res.status(201).json({ message: "Visit tracked" });
  } catch (error) {
    console.error("Error tracking visit:", error);
      logger.error(error, 'Error tracking visit:');
    res.status(500).json({ error: "Server error" });
  }
};

const getVisitorStats = async (req, res) => {
  try {
    const visitors = await getAllVisitors()

    const today = new Date().toISOString().slice(0, 10);
    const todayDate = new Date(today);
    const last7 = new Date(todayDate);
    const last30 = new Date(todayDate);
    last7.setDate(todayDate.getDate() - 6);
    last30.setDate(todayDate.getDate() - 29);

    let total = 0;
    let todayCount = 0;
    let last7Count = 0;
    let last30Count = 0;

    visitors.forEach(visitor => {
  const visitDate = new Date(visitor.created_at);

  if (visitor.created_at.toISOString().slice(0, 10) === today) todayCount++;

  if (visitDate >= last7) last7Count++;
  if (visitDate >= last30) last30Count++;
});


    res.status(200).json({
      totalVisitors: visitors.length,
      visitorsToday: todayCount,
      last7Days: last7Count,
      last30Days: last30Count,
      visitors
    });
  } catch (error) {
    console.error("Error getting visitor stats:", error);
      logger.error(error, 'Error getting visitor stats:');
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { handleTrackVisit,getVisitorStats };
