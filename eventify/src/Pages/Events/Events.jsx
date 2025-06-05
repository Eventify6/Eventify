import EventsSlider from "../../Components/EventsSlider/EventsSlider";
import './Events.css';
import BrowseEvents from "../../Components/BrowseEvents/BrowseEvents";
export default function Events() {
    return (
        <div className="events-page-container">
            <EventsSlider />
            <BrowseEvents />
        </div>
    );
}