const geoip = require('geoip-lite');
const VisitorModel = require('../models/visitorModel');

const trackVisit = async (ip, userAgent) => {
  const visitDate = new Date().toISOString().slice(0, 10);
  const geo = geoip.lookup(ip) || {};

  const hasVisited = await VisitorModel.findVisit(visitDate, ip);

  if (!hasVisited) {
    await VisitorModel.insertVisit({
      visitDate,
      ip,
      country: geo.country || null,
      city: geo.city || null,
      userAgent,
    });
  }
};

module.exports = {
  trackVisit,
};
