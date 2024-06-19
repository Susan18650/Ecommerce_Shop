import { Content } from "./content"
import NavbarSection  from "../navbar/navbar"

const Header = () => {
    return (
        <div className="pb-5 header-section container-fluid px-0">
            <div className="clearfix">
                <NavbarSection />
                <Content />
            </div>
        </div>
    )
}
export { Header };