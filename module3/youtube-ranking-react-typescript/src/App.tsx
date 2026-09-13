import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Ranking from "./components/Ranking/Ranking";

import TableRanking from "./components/Ranking/TableRanking/TableRanking";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =====================
                    RANKING LAYOUT
                ====================== */}

                <Route element={<Ranking />}>

                    {/* Main */}
                    <Route
                        path="/"
                        element={<TableRanking />}
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
