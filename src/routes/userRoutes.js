const express = require("express");
const routes = express.Router();
const {
  bookAppointment,
  getAllAppointments,
} = require("../controller/userController");

routes.post("/book-appointment", bookAppointment);
routes.get("/appointments", getAllAppointments);

module.exports = routes;
