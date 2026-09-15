import { screen, render, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"
import Body from "../components/Body";
import MOCK_DATA from "../mocks/mockRestuarentData.json"
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "../utils/appStore";


global.fetch = jest.fn(()=> {
    return Promise.resolve({json: ()=>  Promise.resolve(MOCK_DATA)})
})

describe("Seach integration testing", ()=> {
    // beforeAll(()=> {
    //     console.log("Before All") // this will run before all the test cases
    // })

    // beforeEach(()=> {
    //     console.log("Before each") // this will run before eah test case
    // })

    // afterAll(()=> {
    //     console.log("after all") // this will run after all the test cases
    // })

    // afterEach(()=> {
    //     console.log("after each") // this will run after each test case
    // })


    it("Should render the body component with searh button", async()=> {
    render(
        <Provider store={appStore}>
        <BrowserRouter>
        <Body />
        </BrowserRouter>
        </Provider>
    )
    const buttonRendered= await screen.findByRole("button", {name: /Search/i});

        expect(buttonRendered).toBeInTheDocument();

})

it("Should Search filter is working", async()=> {
     render(
        <BrowserRouter>
        <Body />
        </BrowserRouter>
    )
    const getSeachInput = await screen.findByTestId("searchInput")

        const cards = await screen.findAllByTestId("resCard")

     expect(cards.length).toBe(20)
    fireEvent.change(getSeachInput, {target: {value: "burger"}})
    expect(getSeachInput).toHaveValue("burger")
     const buttonRendered= await screen.findByRole("button", {name: /Search/i});
     fireEvent.click(buttonRendered)

   const filteredCards = await screen.findAllByTestId("resCard")

     expect(filteredCards.length).toBe(1)
})

it("Should Search filter is toprated restarent", async()=> {
     render(
        <BrowserRouter>
        <Body />
        </BrowserRouter>
    )
        const cards = await screen.findAllByTestId("resCard")
     expect(cards.length).toBe(20)
     const buttonRendered= await screen.findByRole("button", {name: /Top Rated Restaurants/i});
     fireEvent.click(buttonRendered)

   const filteredCards = await screen.findAllByTestId("resCard")

     expect(filteredCards.length).toBe(18)
})
})

/*
 The real difference (very important)
❗ Version 1 waits
await screen.findByRole(...)


Retries until the button appears

Times out if it never appears

Safe for async rendering

Internally uses waitFor + act

❗ Version 2 assumes it already exists
screen.getByRole(...)


Looks immediately

Throws error if element is not there at that moment

No retry
*/


// it("Should render the body component with searh button", async()=> {
//     await act(async()=> render(
//         <BrowserRouter>
//         <Body />
//         </BrowserRouter>
//     ))
//     const buttonRendered=  screen.getByRole("button", {name: /Search/i});
//     expect(buttonRendered).toBeInTheDocument();

// })