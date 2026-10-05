import NavBar from "../components/NavBar";
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"; 
import { Provider } from "react-redux";
import appStore from "../utils/appStore";
import { BrowserRouter } from "react-router-dom";


describe("Nav bar", ()=> {
it("should nav bar load", ()=> {
    render(
        <Provider store={appStore}>
            <BrowserRouter>
        <NavBar />
        </BrowserRouter>
        </Provider>
    )

    expect(screen.getByTestId("nav")).toBeInTheDocument();
})

it("should user name rendered", ()=> {
    render(
        <Provider store={appStore}>
            <BrowserRouter>
        <NavBar />
        </BrowserRouter>
        </Provider>
    )
    const isUserNameDisplayed = screen.getByText("Default User")
    // const isUserNameDisplayed = screen.getByText(/Default User/i) // regex (this will find even less match)
    expect(isUserNameDisplayed).toBeInTheDocument()
})

it("should render header component with cart item zero", ()=> {
    render(
        <Provider store={appStore}>
            <BrowserRouter>
        <NavBar />
        </BrowserRouter>
        </Provider>
    )
   const isUserNameDisplayed = screen.getByText("Cart - (0 items)")
    // const isUserNameDisplayed = screen.getByText(/Default User/i) // regex
    expect(isUserNameDisplayed).toBeInTheDocument()
})

// it("should show the cart page on click on the cart in homepage", async()=> {
//     render(
//         <Provider store={appStore}>
//             <BrowserRouter>
//         <NavBar />
//         </BrowserRouter>
//         </Provider>
//     )
//     const getCartBtn = screen.getByText("Cart - (0 items)")
//     fireEvent.click(getCartBtn)
//     const isClearCart = await screen.findByRole("button", {name: /clear cart/i});
//     expect(isClearCart).toBeInTheDocument()
// })

})