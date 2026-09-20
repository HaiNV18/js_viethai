import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Ranking from "./components/Ranking/Ranking";
import TableRanking from "./components/Ranking/TableRanking/TableRanking";
import DetailChannel from "./components/Ranking/DetailChannel/DetailChannel";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =====================
                    RANKING LAYOUT
                ====================== */}

                <Route element={<Ranking />}>

                    {/* Main List */}
                    <Route
                        path="/"
                        element={<TableRanking />}
                    />

                    {/* Channel Detail */}
                    <Route
                        path="/channel/:idChannel"
                        element={<DetailChannel />}
                    />

                </Route>

                {/* =====================
                    DEFAULT
                ====================== */}

                <Route
                    path="/"
                    element={<Navigate to="/" replace />}
                />

                {/* URL không tồn tại */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
