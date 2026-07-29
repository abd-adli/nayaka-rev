const prisma = require('../config/prisma');

exports.getHome = async (req, res) => {
  try {
    const featuredDestinations = await prisma.destination.findMany({
      where: { isFeatured: true },
      take: 6,
      orderBy: { createdAt: 'desc' }
    });
    res.render('pages/index', { 
      title: 'Nayaka Tour - Best Travel Experience',
      destinations: featuredDestinations
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
