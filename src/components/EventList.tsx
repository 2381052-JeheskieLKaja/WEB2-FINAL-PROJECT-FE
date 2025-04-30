import { useNavigate } from "react-router-dom"; // Import useNavigate
import { eventList } from "../types/EventData";
import "../styles/EventList.css";

const EventList = () => {
  const navigate = useNavigate(); // Inisialisasi navigator

  const handleOrderClick = (eventId: number) => {
    navigate(`/tiket/${eventId}`); // Redirect ke page pembayaran berdasarkan ID
  };

  return (
    <div className="event-list-container">
      {" "}
      {/* Menggunakan kelas CSS yang sesuai */}
      {eventList.map((event) => (
        <div key={event.id} className="event-card">
          <img  src={event.image} alt={event.name} className="event-card-img" />
          <h4 className="event-name">{event.name}</h4>
          <p className="event-description">{event.description}</p>
          <div className="event-details">
            <span className="event-date">{event.date}</span>
            <span className="event-price">{`$${event.price}`}</span>
          </div>
          <button
            onClick={() => handleOrderClick(event.id)}
            className="event-order-button"
          >
            Pesan Sekarang
          </button>
        </div>
      ))}
    </div>
  );
};

export default EventList;
