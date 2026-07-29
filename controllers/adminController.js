const prisma = require('../config/prisma');
const slugify = require('slugify');

// --- Dashboard ---
exports.getDashboard = async (req, res) => {
  try {
    const totalDestinations = await prisma.destination.count();
    const totalTrips = await prisma.trip.count();
    const totalBookings = await prisma.booking.count();
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      totalDestinations,
      totalTrips,
      totalBookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// --- Destinations ---
exports.getDestinations = async (req, res) => {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.render('admin/destinations-manage', {
      title: 'Manage Destinations',
      destinations
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.postDestination = async (req, res) => {
  const { title, summary, content, thumbnail, isFeatured } = req.body;
  const slug = slugify(title, { lower: true, strict: true });
  
  try {
    await prisma.destination.create({
      data: {
        title,
        slug,
        summary,
        content,
        thumbnail,
        isFeatured: isFeatured === 'on'
      }
    });
    res.redirect('/admin/destinations');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.postDeleteDestination = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.destination.delete({
      where: { id: parseInt(id) }
    });
    res.redirect('/admin/destinations');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// --- Trips ---
exports.getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: { destination: true },
      orderBy: { createdAt: 'desc' }
    });
    const destinations = await prisma.destination.findMany();
    res.render('admin/trips-manage', {
      title: 'Manage Trips',
      trips,
      destinations
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.postTrip = async (req, res) => {
  const { title, description, price, capacity, destinationId } = req.body;
  
  try {
    await prisma.trip.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        destinationId: destinationId ? parseInt(destinationId) : null
      }
    });
    res.redirect('/admin/trips');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.postDeleteTrip = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.trip.delete({
      where: { id: parseInt(id) }
    });
    res.redirect('/admin/trips');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// --- Bookings ---
exports.getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { trip: true },
      orderBy: { createdAt: 'desc' }
    });
    res.render('admin/bookings-manage', {
      title: 'Manage Bookings',
      bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.postUpdateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.redirect('/admin/bookings');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
