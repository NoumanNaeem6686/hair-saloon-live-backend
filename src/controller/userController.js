const { PrismaClient } = require("../../prisma/generated/client");

const prisma = new PrismaClient();
require("dotenv").config();
const nodemailer = require("nodemailer");

const bookAppointment = async (req, res) => {
  try {
    const { name, email, contactNo, bookingDate, bookingTime, message } =
      req.body;

    // Convert bookingDate and bookingTime to a DateTime object
    const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);

    // Check if the requested booking falls within any unavailable slot
    const overlappingUnavailability = await prisma.adminUnavailability.findMany(
      {
        where: {
          OR: [
            {
              startDate: { lte: bookingDateTime },
              endDate: { gte: bookingDateTime },
            },
          ],
        },
      }
    );

    if (overlappingUnavailability.length > 0) {
      return res
        .status(400)
        .json({ message: "The selected slot is unavailable for booking." });
    }

    // Create appointment if the slot is available
    const parsedBookingDate = new Date(bookingDate).toISOString();
    const appointment = await prisma.appointment.create({
      data: {
        name,
        email,
        contactNo,
        bookingDate: parsedBookingDate,
        bookingTime,
        message,
      },
    });

    res
      .status(200)
      .json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({});
    res
      .status(200)
      .json({ message: "Appointments retrieved successfully", appointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addUnavailability = async (req, res) => {
  try {
    const { startDate, startTime, endDate, endTime } = req.body;

    // Combine date and time to create ISO strings
    const startDateTime = new Date(
      `${startDate}T${startTime}:00`
    ).toISOString();
    const endDateTime = new Date(`${endDate}T${endTime}:00`).toISOString();

    // Create an unavailability record in the database
    const unavailability = await prisma.adminUnavailability.create({
      data: {
        startDate: startDateTime,
        endDate: endDateTime,
        startTime: startTime, // Keeping time as string if your schema allows
        endTime: endTime, // Keeping time as string if your schema allows
      },
    });

    res
      .status(200)
      .json({ message: "Unavailability added successfully", unavailability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUnavailability = async (req, res) => {
  try {
    const unavailabilitySlots = await prisma.adminUnavailability.findMany({});
    res.status(200).json({
      message: "Unavailability slots retrieved successfully",
      unavailabilitySlots,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getAllAppointments,
  getAllUnavailability,
  addUnavailability,
};
