import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import './App.css'
import HomePage from './Pages/HomePage/homepage';
import Footer from './Components/Footer/Footer';
import CreateEventPage from './Pages/CreateEventPage/CreateEventPage';
import Events from './Pages/Events/Events';
import EventDetails from './Pages/EventDetails/EventDetails';
import Profile from './Pages/Profile/Profile';
import ProfileCalendar from './Components/Calendar/Calendar';
import MyCalendar from './Components/Calendar/Calendar';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/eventdetails/:id" element={<EventDetails />} />
        <Route path="/calendar" element={<MyCalendar />} />
      </Routes>
      <Footer />

    </>
  )
}

export default App
