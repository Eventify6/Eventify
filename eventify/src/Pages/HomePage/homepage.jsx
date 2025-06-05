import Hero from '../../Components/Hero/Hero'
import './homepage.css'
import AboutSection from '../../Components/AboutSection/AboutSection'
import Inquire from '../../Components/Inquire/Inquire'
import Footer from '../../Components/Footer/Footer'

export default function HomePage() {
    return (
        <>
            <Hero />
            <AboutSection />
            <Inquire />
        </>
    )
}