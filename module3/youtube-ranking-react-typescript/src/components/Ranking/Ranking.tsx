import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import "./Ranking.css";

function Ranking() {
    return (
        <div className="bg-light min-vh-100 pb-5">
            <Header />

            <div className="container py-4 py-md-5">
                <div className="row justify-content-center mb-4">
                    <div className="col-lg-10 text-center">
                        <h1 className="fw-bold fs-2 text-dark mb-3">
                            SUBSCRIBED YOUTUBE CHANNELS RANKING
                        </h1>
                        <p className="text-secondary fs-6 mb-0">
                            The lists of the most-subscribed YouTube channels in every categories: VTuber, Game, News, Development, etc...
                        </p>
                    </div>
                </div>

                <Outlet />
            </div>
        </div>
    );
}

export default Ranking;
