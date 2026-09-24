import "@testing-library/jest-dom";
import {screen, render} from "@testing-library/react"
import RestaurantCard from "../components/RestaurantCard";
import { restaurnatCard } from "../mocks/mocks";
import { withPromotedLabel } from "../components/RestaurantCard";

describe("test for restaurent card", ()=> {
    it("should render the restaurent card component", ()=> {
        render(
            <RestaurantCard resData={restaurnatCard}/>
        )
        expect(screen.getByAltText("food image")).toBeInTheDocument();
        expect(screen.getByText(/A2B - Adyar Ananda Bhavan/i)).toBeInTheDocument();
    })

    it("Should render restaurent card with promoted label", ()=> {
        const RestaurantCardWithPromotedLabel = withPromotedLabel(RestaurantCard)
        render(
            <RestaurantCardWithPromotedLabel resData={restaurnatCard}/>
        )
        expect(screen.getByText(/Promoted/i)).toBeInTheDocument();
        expect(screen.getByText(/A2B - Adyar Ananda Bhavan/i)).toBeInTheDocument();
    })
})