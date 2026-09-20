import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaYoutube, FaTwitter, FaGlobe, FaTiktok, FaFacebook, FaArrowLeft } from "react-icons/fa";
import { getChannelDetailService, type ChannelDetailResponse } from "../../../services/channelService";
import { MOCK_CHANNELS } from "../../../data/channels";
import "./DetailChannel.css";

// Formatter số hiển thị dạng 496K, 1.3M, v.v.
const formatCount = (count: string | number): string => {
    const num = typeof count === "string" ? parseInt(count, 10) : count;
    if (isNaN(num) || num === 0) return "0";
    if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toLocaleString();
};

function DetailChannel() {
    const { idChannel } = useParams<{ idChannel: string }>();
    const [channel, setChannel] = useState<ChannelDetailResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Social links bổ sung cho mock channels nếu API không trả về
    const [socials, setSocials] = useState<{
        website?: string;
        facebook?: string;
        tiktok?: string;
        twitter?: string;
        youtube?: string;
    }>({});

    useEffect(() => {
        if (!idChannel) return;

        let isMounted = true;
        setLoading(true);
        setError(null);

        // Gọi API GET /api/v1/channel?id_channel=idChannel
        getChannelDetailService(idChannel)
            .then((data) => {
                if (isMounted) {
                    setChannel(data);
                    // Kiểm tra xem có mock data khớp ID để bổ sung các link mạng xã hội không
                    const mock = MOCK_CHANNELS.find((m) => m.id === idChannel);
                    if (mock) {
                        setSocials({
                            website: mock.website,
                            facebook: mock.facebook,
                            tiktok: mock.tiktok,
                            twitter: mock.twitter,
                            youtube: mock.url,
                        });
                    } else if (data.customUrl) {
                        setSocials({
                            youtube: `https://youtube.com/${data.customUrl}`,
                        });
                    }
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.warn("Lỗi khi kết nối API chi tiết kênh, chuyển sang dữ liệu mẫu:", err);
                if (isMounted) {
                    // Fallback sang mock data nếu API gặp lỗi hoặc hết quota YouTube
                    const mock = MOCK_CHANNELS.find((m) => m.id === idChannel);
                    if (mock) {
                        setChannel({
                            idChannel: mock.id,
                            nameChannel: mock.name,
                            description: `Official YouTube channel of ${mock.name}. Category: ${mock.category}.`,
                            customUrl: mock.handle,
                            publishedAt: "2020-01-01T00:00:00Z",
                            thumbnail: mock.avatar.includes('/') ? mock.avatar : `/img/channel/500x500/${mock.avatar}`,
                            banner: mock.banner ? (mock.banner.includes('/') ? mock.banner : `/img/channel/banner/${mock.banner}`) : "/img/channel/banner/default-channel-banner.jpg",
                            viewCount: "0",
                            subscriberCount: mock.subscribers.toString(),
                            hiddenSubscriberCount: false,
                            videoCount: mock.videosCount.toString(),
                        });
                        setSocials({
                            website: mock.website,
                            facebook: mock.facebook,
                            tiktok: mock.tiktok,
                            twitter: mock.twitter,
                            youtube: mock.url,
                        });
                    } else {
                        setError("Channel not found");
                    }
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [idChannel]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="mt-2 text-muted fs-5">Loading channel details...</div>
            </div>
        );
    }

    if (error || !channel) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-warning rounded-4 shadow-sm p-4 d-inline-block">
                    <h4 className="fw-bold">Channel Not Found</h4>
                    <p className="mb-3 text-secondary">
                        Could not load information for channel ID: <code>{idChannel}</code>
                    </p>
                    <Link to="/" className="btn btn-primary rounded-pill px-4">
                        <FaArrowLeft className="me-2" /> Back to Ranking
                    </Link>
                </div>
            </div>
        );
    }

    const handleDisplay = channel.customUrl
        ? channel.customUrl.startsWith("@")
            ? channel.customUrl
            : `@${channel.customUrl}`
        : `@${channel.nameChannel.replace(/\s+/g, "")}`;

    const rawBanner = channel.banner || "/img/channel/banner/default-channel-banner.jpg";
    const bannerUrl = rawBanner.startsWith("/") || rawBanner.startsWith("http")
        ? rawBanner
        : `/img/channel/banner/${rawBanner}`;

    return (
        <div className="container py-4">
            {/* Navigation back button */}
            <div className="mb-3">
                <Link to="/" className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-2">
                    <FaArrowLeft className="me-2" /> Back to Ranking
                </Link>
            </div>

            {/* Banner hiển thị width 100% */}
            <div className="w-100 mb-4 overflow-hidden rounded-4 shadow-sm">
                <img
                    src={bannerUrl}
                    alt={channel.nameChannel}
                    width="100%"
                    className="w-100 channel-detail-banner-img"
                    style={{ width: "100%", height: "240px", objectFit: "cover", display: "block" }}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/img/channel/banner/default-channel-banner.jpg";
                    }}
                />
            </div>

                {/* Header Card với Avatar tròn đè lớp đúng như hình thiết kế */}
                <div className="channel-header-container">
                    {/* Avatar tròn lớn bên trái */}
                    <div className="channel-detail-avatar-wrapper">
                        <img
                            src={channel.thumbnail || "/img/channel/500x500/default-channel-thumbnail.jpg"}
                            alt={channel.nameChannel}
                            className="channel-detail-avatar-img"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/img/channel/500x500/default-channel-thumbnail.jpg";
                            }}
                        />
                    </div>

                    {/* Khung thông tin chính */}
                    <div className="channel-detail-header-card">
                        {/* <h1>Channel Name</h1> */}
                        <h1 className="fw-bold mb-2 text-dark fs-2">{channel.nameChannel}</h1>

                        {/* Metadata line: @Handle  Subscribers  Videos */}
                        <div className="d-flex flex-wrap align-items-center gap-4 text-secondary mb-3 fs-6 channel-stats-row">
                            <span className="fw-medium text-dark">{handleDisplay}</span>
                            <span>
                                <strong className="text-dark">{formatCount(channel.subscriberCount)}</strong> subscribers
                            </span>
                            <span>
                                <strong className="text-dark">{formatCount(channel.videoCount)}</strong> videos
                            </span>
                        </div>

                        {/* Social links row */}
                        <div className="d-flex flex-wrap align-items-center gap-3 mt-3 channel-social-links">
                            {socials.website && (
                                <a
                                    href={socials.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1"
                                >
                                    <FaGlobe /> Official Website
                                </a>
                            )}
                            {socials.facebook && (
                                <a
                                    href={socials.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1"
                                >
                                    <FaFacebook /> Facebook
                                </a>
                            )}
                            {socials.tiktok && (
                                <a
                                    href={socials.tiktok}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-dark btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1"
                                >
                                    <FaTiktok /> TikTok
                                </a>
                            )}
                            {socials.twitter && (
                                <a
                                    href={socials.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-info btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1"
                                >
                                    <FaTwitter /> Twitter (X)
                                </a>
                            )}
                            {socials.youtube && (
                                <a
                                    href={socials.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1"
                                >
                                    <FaYoutube /> YouTube
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Channel's Information Section */}
                <div className="channel-info-section">
                    <h3 className="channel-info-title">Channel's information</h3>
                    <div className="channel-info-box shadow-sm">
                        {channel.description ? (
                            <p className="mb-3">{channel.description}</p>
                        ) : (
                            <p className="text-muted mb-3">No description available for this channel.</p>
                        )}

                        <hr className="my-3 text-muted" />

                        <div className="row g-3 fs-6">
                            <div className="col-12 col-md-4">
                                <span className="text-secondary">Channel ID:</span>{" "}
                                <code className="text-dark fw-semibold">{channel.idChannel}</code>
                            </div>
                            {channel.viewCount !== "0" && (
                                <div className="col-12 col-md-4">
                                    <span className="text-secondary">Total Views:</span>{" "}
                                    <strong className="text-dark">{parseInt(channel.viewCount, 10).toLocaleString()}</strong>
                                </div>
                            )}
                            {channel.publishedAt && (
                                <div className="col-12 col-md-4">
                                    <span className="text-secondary">Joined Date:</span>{" "}
                                    <strong className="text-dark">
                                        {new Date(channel.publishedAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </strong>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailChannel;
