import ReactDOM from "react-dom/client";
import NavBar from "./components/NavBar";
import Body from "./components/Body";
// import About from "./components/About";
import ErrorPage from "./components/ErrorPage";
import Contact from "./components/Contact";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import RestaurantMenu from "./components/RestaurantMenu";
import { lazy, Suspense } from "react";
import { useState, useEffect } from "react";
import UserContext from "./utils/UserContext";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Cart from "./components/Cart";
// Chunking
// Code Splitting
// Dynamic Bundling
// lazy Loading
// on demand loading
// dynamix imoprt
const About = lazy(() => import("./components/About"));

const AppLayOut = () => {
  console.log("App is Running");
  const [userName, setUserName] = useState(null);
  useEffect(() => {
    const data = {
      name: "John Doe",
    };
    setUserName(data.name);
  }, []);
  
  return (
    <Provider store={appStore}>
      <UserContext.Provider value={{ loggedInUser: userName, setUserName }}>
        <div className="appContainer">
          <NavBar />
          <Outlet />
        </div>
      </UserContext.Provider>
    </Provider>
  );
};

const appRouter = createBrowserRouter([
  {
    element: <AppLayOut />,
    path: "/",
    children: [
      {
        element: <Body />,
        path: "/",
      },
      {
        element: (
          <Suspense fallback={<h1>Loading...</h1>}>
            <About />
          </Suspense>
        ),
        path: "/about",
      },
      {
        element: <Contact />,
        path: "/contact",
      },
      {
        element: <RestaurantMenu />,
        path: "/restaurants/:resId",
      },
      {
        element: <Cart />,
        path: "/cart",
      },
    ],
    errorElement: <ErrorPage />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
