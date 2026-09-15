import { screen, render, fireEvent } from "@testing-library/react";
import RestaurantMenu from "../components/RestaurantMenu";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import appStore from "../utils/appStore";
import { BrowserRouter } from "react-router-dom";
import NavBar from "../components/NavBar";

global.fetch = jest.fn()
describe("RestaurantMenu", ()=> {
    it("Should load the restaurant card", async()=> {
        render(
            <Provider store={appStore}>
                <BrowserRouter>
                <NavBar />
            <RestaurantMenu />
            </BrowserRouter>
            </Provider>
        )
        const getButton = screen.getByRole("button", {name: /ADD/i})
        expect(getButton).toBeInTheDocument()
        // fireEvent.click(getButton)
        expect(await screen.findByText(/Cart - (0items)/i)).toBeInTheDocument()
    })
})