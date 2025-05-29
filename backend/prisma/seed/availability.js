// Run this script to add sample available time slots for testing
// Create this as a separate file like: scripts/seed-availability.js

import {PrismaClient} from '../../src/generated/prisma/index.js';

const db = new PrismaClient();

async function seedAvailability() {
    try {
        console.log('Starting availability seeding...');

        // Get all doctors
        const doctors = await db.doctor.findMany();

        if (doctors.length === 0) {
            console.log('No doctors found. Please add doctors first.');
            return;
        }

        console.log(`Found ${doctors.length} doctors`);

        // Get today's date and next 14 days for better testing
        const today = new Date();
        const dates = [];

        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }

        console.log(`Creating availability for ${dates.length} days`);

        // For each doctor, create availability slots
        for (const doctor of doctors) {
            console.log(`Creating availability for Dr. ${doctor.name} (ID: ${doctor.id})`);

            for (const date of dates) {
                // Skip weekends for this example (optional)
                if (date.getDay() === 0 || date.getDay() === 6) {
                    console.log(`Skipping weekend: ${date.toDateString()}`);
                    continue;
                }

                // Create time slots from 8:00 AM to 6:00 PM (30-minute intervals)
                for (let hour = 8; hour < 18; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const startTime = new Date(date);
                        startTime.setHours(hour, minute, 0, 0);

                        const endTime = new Date(startTime);
                        endTime.setMinutes(endTime.getMinutes() + 30);

                        // Check if this time slot already exists
                        const existing = await db.availableTime.findFirst({
                            where: {
                                doctorId: doctor.id,
                                startTime: startTime,
                                endTime: endTime
                            }
                        });

                        if (!existing) {
                            await db.availableTime.create({
                                data: {
                                    doctorId: doctor.id,
                                    startTime: startTime,
                                    endTime: endTime
                                }
                            });
                            console.log(`Created slot: ${doctor.name} - ${startTime.toLocaleString()}`);
                        } else {
                            console.log(`Slot already exists: ${doctor.name} - ${startTime.toLocaleString()}`);
                        }
                    }
                }
            }
        }

        // Verify the data
        const totalSlots = await db.availableTime.count();
        console.log(`\n✅ Availability seeding completed!`);
        console.log(`📊 Total availability slots created: ${totalSlots}`);

        // Show some sample data
        const sampleSlots = await db.availableTime.findMany({
            take: 5,
            include: {
                doctor: {
                    select: {
                        name: true
                    }
                }
            }
        });

        console.log('\n📋 Sample availability slots:');
        sampleSlots.forEach(slot => {
            console.log(`  - Dr. ${slot.doctor.name}: ${slot.startTime.toLocaleString()} - ${slot.endTime.toLocaleString()}`);
        });

    } catch (error) {
        console.error('❌ Error seeding availability:', error);
    } finally {
        await db.$disconnect();
    }
}

// Run the seeding function
seedAvailability();