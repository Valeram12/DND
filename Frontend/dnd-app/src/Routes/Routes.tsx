import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Homepage from "../pages/Home/Homepage";
import Authpage from "../pages/Auth/Authpage";
import Registration from '../pages/Registration/Registration';
import Merche from "../pages/Merche/Merche";
import ProtectedRoute from "../Services/ProtectedRoute";
import Charlist from "../pages/Charlist/Charlist";
import CreateChar from "../pages/CreateChar/CreateChar";
import Character from "../pages/Character/Character";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <Homepage/>},
            {path: "/auth", element: <Authpage/>},
            {path: "/registration", element:<Registration/>},
            {path: "/merche", element:<Merche/>},
            {path: "/charlist", element:<ProtectedRoute><Charlist/></ProtectedRoute>},
            {path: "/create-new", element:<ProtectedRoute><CreateChar/></ProtectedRoute>},
            {path: "/character/:id", element:<ProtectedRoute><Character/></ProtectedRoute>},
            { path: "*", element: <Homepage /> }
        ],

    },
    { path: "*", element: <Homepage /> }
])