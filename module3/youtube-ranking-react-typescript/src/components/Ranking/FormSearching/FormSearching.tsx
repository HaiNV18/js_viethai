import { useState } from "react";
import { FaSearch, FaFileExcel } from "react-icons/fa";
import type { SubscribeSortOption, CategoryFilterOption } from "../../../types/youtube";

interface FormSearchingProps {
    onSearch: (keywords: string, subscribeFilter: SubscribeSortOption, categoryFilter: CategoryFilterOption) => void;
    onExportExcel?: () => void;
}

function FormSearching({ onSearch, onExportExcel }: FormSearchingProps) {
    const [keywords, setKeywords] = useState("");
    const [subscribeFilter, setSubscribeFilter] = useState<SubscribeSortOption>("");
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilterOption>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(keywords, subscribeFilter, categoryFilter);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div 
                className="p-3 p-md-4 rounded-4 shadow-sm"
                style={{ backgroundColor: "#4C6FFF" }}
            >
                <div className="row g-2 align-items-center">
                    {/* Keyword Input */}
                    <div className="col-12 col-md-4">
                        <input
                            type="text"
                            className="form-control form-control-lg border-0 fs-6 py-2 px-3 shadow-none"
                            placeholder="Enter your keywords"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                        />
                    </div>

                    {/* Subscribe Filter Dropdown */}
                    <div className="col-12 col-md-3">
                        <select
                            className="form-select form-select-lg border-0 fs-6 py-2 px-3 shadow-none text-secondary"
                            value={subscribeFilter}
                            onChange={(e) => setSubscribeFilter(e.target.value as SubscribeSortOption)}
                        >
                            <option value="">Subcribe filter</option>
                            <option value="highest">Highest Subscribers</option>
                            <option value="lowest">Lowest Subscribers</option>
                        </select>
                    </div>

                    {/* YouTube Content Dropdown */}
                    <div className="col-12 col-md-3">
                        <select
                            className="form-select form-select-lg border-0 fs-6 py-2 px-3 shadow-none text-secondary"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilterOption)}
                        >
                            <option value="">Select YouTube Content</option>
                            <option value="VTuber">VTuber</option>
                            <option value="Game">Game</option>
                            <option value="News">News</option>
                            <option value="Development">Development</option>
                            <option value="Music">Music</option>
                            <option value="Tech">Tech</option>
                            <option value="Entertainment">Entertainment</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-12 col-md-2 d-flex gap-2 justify-content-start justify-content-md-end">
                        <button
                            type="submit"
                            className="btn btn-light btn-lg d-flex align-items-center justify-content-center p-2 rounded-3 shadow-none border-0 flex-fill flex-md-grow-0"
                            style={{ width: "46px", height: "46px" }}
                            title="Search"
                        >
                            <FaSearch className="text-dark fs-5" />
                        </button>
                        
                        <button
                            type="button"
                            onClick={onExportExcel}
                            className="btn btn-light btn-lg d-flex align-items-center justify-content-center p-2 rounded-3 shadow-none border-0 flex-fill flex-md-grow-0"
                            style={{ width: "46px", height: "46px" }}
                            title="Export to Excel"
                        >
                            <FaFileExcel className="text-dark fs-5" />
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default FormSearching;
