const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nayaka.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@nayaka.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user seeded:', admin.email);

  // 2. Create Dummy Destinations
  const dest1 = await prisma.destination.upsert({
    where: { slug: 'bali-paradise' },
    update: {},
    create: {
      title: 'Bali: The Island of Gods',
      slug: 'bali-paradise',
      thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      summary: 'Experience the magic of Bali with its beautiful beaches and vibrant culture.',
      content: '<p>Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.</p>',
      isFeatured: true,
    },
  });

  const dest2 = await prisma.destination.upsert({
    where: { slug: 'lombok-escape' },
    update: {},
    create: {
      title: 'Lombok Tropical Escape',
      slug: 'lombok-escape',
      thumbnail: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
      summary: 'Discover the untouched beauty of Lombok and the Gili Islands.',
      content: '<p>Lombok is an Indonesian island east of Bali and west of Sumbawa, part of the Lesser Sunda Island chain.</p>',
      isFeatured: true,
    },
  });
  console.log('Destinations seeded');

  // 3. Create Dummy Trips
  await prisma.trip.create({
    data: {
      title: '3 Days 2 Nights Bali Best Beaches',
      description: 'Explore the best beaches in South Bali including Uluwatu and Nusa Dua.',
      price: 2500000, // IDR
      capacity: 10,
      destinationId: dest1.id,
    }
  });

  await prisma.trip.create({
    data: {
      title: 'Lombok Trekking & Snorkeling',
      description: 'Trek Mount Rinjani and snorkel in Gili Trawangan.',
      price: 3500000, // IDR
      capacity: 8,
      destinationId: dest2.id,
    }
  });
  console.log('Trips seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
