import Hero from '../../Components/Hero/Hero'
import './homepage.css'
import AboutSection from '../../Components/AboutSection/AboutSection'
import Inquire from '../../Components/Inquire/Inquire'
import EventSliderhome from '../../Components/EventSliderhome/EventSliderhome'
import Footer from '../../Components/Footer/Footer'


export default function HomePage() {
    return (
        <>
            <Hero />
            <EventSliderhome />
            <AboutSection />
            <Inquire />
        </>
    )
}