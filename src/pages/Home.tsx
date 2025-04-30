import EventList from "../components/EventList";
import "../styles/Home.css"

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h2 className="text-3xl font-bold text-center">Daftar Event Lari</h2>
        <p className="text-center text-lg text-gray-600">
          Temukan event lari terbaik dan bergabunglah dengan kami untuk pengalaman yang seru dan menantang!
        </p>
      </header>
      
      <section className="event-section">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Pilih Event yang Anda Minati</h3>
        <EventList />
      </section>
    </div>
  );
};

export default Home;
