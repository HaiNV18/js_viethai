import { useState, useMemo } from 'react';
import { FaYoutube, FaTwitter, FaGlobe, FaTiktok, FaFacebook, FaTrophy } from 'react-icons/fa';
import FormSearching from '../FormSearching/FormSearching';
import { MOCK_CHANNELS } from '../../../data/channels';
import type { SubscribeSortOption, CategoryFilterOption } from '../../../types/youtube';

function TableRanking() {
    const [keywords, setKeywords] = useState("");
    const [subscribeFilter, setSubscribeFilter] = useState<SubscribeSortOption>("");
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilterOption>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleSearch = (
        kw: string,
        subFilter: SubscribeSortOption,
        catFilter: CategoryFilterOption
    ) => {
        setKeywords(kw);
        setSubscribeFilter(subFilter);
        setCategoryFilter(catFilter);
        setCurrentPage(1);
    };

    const handleExportExcel = () => {
        const headers = ["Rank", "Channel Name", "Handle", "Category", "Subscribers", "Videos"];
        const rows = filteredChannels.map(c => [
            c.displayRank,
            `"${c.name}"`,
            c.handle,
            c.category,
            c.subscribers,
            c.videosCount
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "youtube_ranking_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filter & Sort Channels
    const filteredChannels = useMemo(() => {
        let result = [...MOCK_CHANNELS];

        if (keywords.trim()) {
            const query = keywords.toLowerCase();
            result = result.filter(
                c => c.name.toLowerCase().includes(query) || c.handle.toLowerCase().includes(query)
            );
        }

        if (categoryFilter) {
            result = result.filter(c => c.category === categoryFilter);
        }

        if (subscribeFilter === "highest") {
            result.sort((a, b) => b.subscribers - a.subscribers);
        } else if (subscribeFilter === "lowest") {
            result.sort((a, b) => a.subscribers - b.subscribers);
        }

        // Re-assign ranks dynamically based on sorted order
        return result.map((item, index) => ({
            ...item,
            displayRank: index + 1
        }));
    }, [keywords, subscribeFilter, categoryFilter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredChannels.length / itemsPerPage) || 1;
    const paginatedChannels = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredChannels.slice(start, start + itemsPerPage);
    }, [filteredChannels, currentPage]);

    const getRankBadge = (rank: number) => {
        if (rank === 1) {
            return <span className="badge bg-warning text-dark px-2 py-1 rounded-pill"><FaTrophy className="me-1" /> #1</span>;
        }
        if (rank === 2) {
            return <span className="badge bg-secondary text-white px-2 py-1 rounded-pill">#2</span>;
        }
        if (rank === 3) {
            return <span className="badge bg-danger text-white px-2 py-1 rounded-pill">#3</span>;
        }
        return <span className="text-secondary fw-semibold">#{rank}</span>;
    };

    const getCategoryBadgeClass = (category: string) => {
        switch (category) {
            case "VTuber": return "bg-info text-dark";
            case "Game": return "bg-purple text-white bg-dark";
            case "Development": return "bg-primary text-white";
            case "Music": return "bg-success text-white";
            case "Tech": return "bg-warning text-dark";
            default: return "bg-secondary text-white";
        }
    };

    return (
        <main className="w-100">
            {/* Search Form Component */}
            <FormSearching onSearch={handleSearch} onExportExcel={handleExportExcel} />

            {/* Total Count */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="text-secondary fw-medium fs-6 ms-1">
                    Total: <span className="fw-bold text-dark">{filteredChannels.length}</span>
                </div>
            </div>

            {/* Channels Ranking Table */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light border-bottom">
                            <tr>
                                <th scope="col" className="py-3 px-4 text-secondary text-uppercase fs-7 fw-bold" style={{ width: "80px" }}>Rank</th>
                                <th scope="col" className="py-3 px-4 text-secondary text-uppercase fs-7 fw-bold">Channel</th>
                                <th scope="col" className="py-3 px-4 text-secondary text-uppercase fs-7 fw-bold">Category</th>
                                <th scope="col" className="py-3 px-4 text-secondary text-uppercase fs-7 fw-bold text-end">Subscribers</th>
                                <th scope="col" className="py-3 px-4 text-secondary text-uppercase fs-7 fw-bold text-center" style={{ width: "160px" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedChannels.length > 0 ? (
                                paginatedChannels.map((channel) => (
                                    <tr key={channel.id}>
                                        <td className="px-4 py-3 text-center">
                                            {getRankBadge(channel.displayRank)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={channel.avatar}
                                                    alt={channel.name}
                                                    className="rounded-circle me-3 shadow-sm border"
                                                    style={{ width: "44px", height: "44px", objectFit: "cover" }}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/img/channel/500x500/default-channel-thumbnail.jpg";
                                                    }}
                                                />
                                                <div>
                                                    <h6 className="mb-0 fw-bold text-dark">{channel.name}</h6>
                                                    <small className="text-muted">{channel.handle}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge rounded-pill px-3 py-2 ${getCategoryBadgeClass(channel.category)}`}>
                                                {channel.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-end fw-bold text-dark">
                                            {channel.subscribersFormatted}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="d-flex align-items-center justify-content-center gap-1">
                                                {channel.website && (
                                                    <a
                                                        href={channel.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-outline-secondary btn-sm p-1 rounded-circle d-inline-flex align-items-center justify-content-center"
                                                        style={{ width: "32px", height: "32px" }}
                                                        title="Official Website"
                                                    >
                                                        <FaGlobe className="fs-6" />
                                                    </a>
                                                )}
                                                {channel.url && (
                                                    <a
                                                        href={channel.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-outline-danger btn-sm p-1 rounded-circle d-inline-flex align-items-center justify-content-center"
                                                        style={{ width: "32px", height: "32px" }}
                                                        title="YouTube Channel"
                                                    >
                                                        <FaYoutube className="fs-6" />
                                                    </a>
                                                )}
                                                {channel.twitter && (
                                                    <a
                                                        href={channel.twitter}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-outline-info btn-sm p-1 rounded-circle d-inline-flex align-items-center justify-content-center"
                                                        style={{ width: "32px", height: "32px" }}
                                                        title="Twitter (X)"
                                                    >
                                                        <FaTwitter className="fs-6" />
                                                    </a>
                                                )}
                                                {channel.tiktok && (
                                                    <a
                                                        href={channel.tiktok}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-outline-dark btn-sm p-1 rounded-circle d-inline-flex align-items-center justify-content-center"
                                                        style={{ width: "32px", height: "32px" }}
                                                        title="TikTok"
                                                    >
                                                        <FaTiktok className="fs-6" />
                                                    </a>
                                                )}
                                                {channel.facebook && (
                                                    <a
                                                        href={channel.facebook}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-outline-primary btn-sm p-1 rounded-circle d-inline-flex align-items-center justify-content-center"
                                                        style={{ width: "32px", height: "32px" }}
                                                        title="Facebook"
                                                    >
                                                        <FaFacebook className="fs-6" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-5 text-muted">
                                        No YouTube channels found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center">
                    <nav aria-label="Page navigation">
                        <ul className="pagination mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
                                    Previous
                                </button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(page)}>
                                        {page}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </main>
    );
}

export default TableRanking;
