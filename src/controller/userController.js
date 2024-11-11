const { PrismaClient } = require("../../prisma/generated/client");

const prisma = new PrismaClient();
require("dotenv").config();
const nodemailer = require("nodemailer");

const bookAppointment = async (req, res) => {
  try {
    const { name, email, contactNo, bookingDate, bookingTime, message } =
      req.body;

    // Convert bookingDate to ISO-8601 DateTime string
    const parsedBookingDate = new Date(bookingDate).toISOString();

    // Create appointment in the database
    const appointment = await prisma.appointment.create({
      data: {
        name,
        email,
        contactNo,
        bookingDate: parsedBookingDate, // Use the converted date
        bookingTime,
        message,
      },
    });

    // Set up Nodemailer transport (using Gmail as an example)
    // let transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USER, // Your Gmail address (stored in .env)
    //     pass: process.env.EMAIL_PASS, // Your Gmail password or app password (stored in .env)
    //   },
    // });

    // // Email content
    // let mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: email, // Sending email to the user who booked the appointment
    //   subject: "Appointment Confirmation",
    //   text: `Dear ${name},\n\nYour appointment has been booked successfully!\n\nDetails:\n- Date: ${bookingDate}\n- Time: ${bookingTime}\n\nThank you for choosing us!\n\nBest regards,\nYour Company Name`,
    // };

    // // Send the email
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error("Error sending email:", error);
    //   } else {
    //     console.log("Email sent:", info.response);
    //   }
    // });

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

module.exports = {
  bookAppointment,
  getAllAppointments,
};
