const express = require("express");
const routes = express.Router();
const {
  bookAppointment,
  getAllAppointments,
  addUnavailability,
  getAllUnavailability,
} = require("../controller/userController");

routes.post("/book-appointment", bookAppointment);
routes.get("/appointments", getAllAppointments);
routes.post("/add-unavailability", addUnavailability);
routes.get("/get-all-unavailability", getAllUnavailability);

module.exports = routes;
