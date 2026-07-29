const prisma = require('../config/prisma');

exports.postBooking = async (req, res) => {
  try {
    const { tripId, customerName, customerEmail, phone, bookingDate, quantity } = req.body;
    
    // Parse values
    const tripIdInt = parseInt(tripId);
    const quantityInt = parseInt(quantity);
    const parsedDate = new Date(bookingDate);

    // Fetch the trip to get the correct price (security measure)
    const trip = await prisma.trip.findUnique({
      where: { id: tripIdInt }
    });

    if (!trip) {
      return res.status(404).send('Trip not found');
    }

    const totalPrice = trip.price * quantityInt;
    const userId = req.session.user ? req.session.user.id : null;

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        tripId: tripIdInt,
        userId: userId,
        customerName,
        customerEmail,
        phone,
        bookingDate: parsedDate,
        totalTickets: quantityInt,
        totalPrice: totalPrice,
        status: 'PENDING'
      },
      include: {
        trip: true
      }
    });

    res.render('pages/booking-success', {
      title: 'Booking Berhasil',
      booking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).send('Terjadi kesalahan saat memproses booking Anda.');
  }
};
