import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://650e5434a8b42265ec2d0421.mockapi.io/fligtsinfo";

export default function FlightApp() {
  const [flights, setFlights] = useState([]);
  const [formData, setFormData] = useState({
    flightNumber: "",
    airline: "",
    origin: "",
    destination: "",
    arrival: "",
    departure: "",
    status: ""
  });
  const [editingFlight, setEditingFlight] = useState(null);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    const response = await axios.get(API_URL);
    setFlights(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addFlight = async () => {
    if (Object.values(formData).every(field => field.trim() !== "")) {
      await axios.post(API_URL, formData);
      setFormData({ flightNumber: "", airline: "", origin: "", destination: "", arrival: "", departure: "", status: "" });
      fetchFlights();
    }
  };

  const updateFlight = async (id) => {
    if (Object.values(formData).every(field => field.trim() !== "")) {
      await axios.put(`${API_URL}/${id}`, formData);
      setEditingFlight(null);
      setFormData({ flightNumber: "", airline: "", origin: "", destination: "", arrival: "", departure: "", status: "" });
      fetchFlights();
    }
  };

  const deleteFlight = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchFlights();
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Flights Info</h1>
      <div className="row mb-3">
        {["flightNumber", "airline", "origin", "destination", "arrival", "departure", "status"].map((field, index) => (
          <div className="col" key={index}>
            <input type="text" className="form-control" name={field} value={formData[field]} onChange={handleInputChange} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} />
          </div>
        ))}
        <div className="col">
          <button onClick={addFlight} className="btn btn-primary">Add</button>
        </div>
      </div>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Flight No.</th>
            <th>Airline</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Arrival</th>
            <th>Departure</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.id}>
              {editingFlight === flight.id ? (
                ["flightNumber",  "airline", "origin", "destination", "arrival", "departure", "status"].map((field, index) => (
                  <td key={index}><input type="text" className="form-control" name={field} value={formData[field]} onChange={handleInputChange} /></td>
                ))
              ) : (
                <>
                  <td>{flight.flightNumber}</td>
                  <td>{flight.airline}</td>
                  <td>{flight.origin}</td>
                  <td>{flight.destination}</td>
                  <td>{flight.arrival}</td>
                  <td>{flight.departure}</td>
                  <td>{flight.status}</td>
                </>
              )}
              <td>
                {editingFlight === flight.id ? (
                  <button onClick={() => updateFlight(flight.id)} className="btn btn-success me-2">Save</button>
                ) : (
                  <button onClick={() => { setEditingFlight(flight.id); setFormData(flight); }} className="btn btn-warning me-2">Edit</button>
                )}
                <button onClick={() => deleteFlight(flight.id)} className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
