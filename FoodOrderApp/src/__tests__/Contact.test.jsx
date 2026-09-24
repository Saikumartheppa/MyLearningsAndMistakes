import {render, screen} from "@testing-library/react";
import Contact from "../components/Contact";
import "@testing-library/jest-dom"

// render
// query
// assert

// describe -> this used for group the test cases
// We can write the name as it
describe("first group", ()=> {
    test("Should load the contact us component", ()=> {
        render(<Contact />)
        expect(screen.getByTestId("contact")).toBeInTheDocument();
    })
    
    test("Should load button inside contact component", ()=> {
         render(<Contact />)
        expect(screen.getByRole("button", {name: /submit/i})).toBeInTheDocument();
        // not -> !
    })
})

describe("second group", ()=> {
    it("should render the input", ()=> {
        render(
            <Contact />
        )
        const isContactPageRendered = screen.getByPlaceholderText("message");
        expect(isContactPageRendered).toBeInTheDocument();
    })
})