const prisma = require('../config/prisma');

exports.getDestinationBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const destination = await prisma.destination.findUnique({
      where: { slug },
      include: { trips: true } // Include associated trips
    });

    if (!destination) {
      return res.status(404).render('pages/404', { title: 'Destination Not Found' });
    }

    res.render('pages/destination-detail', {
      title: destination.title,
      destination
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
