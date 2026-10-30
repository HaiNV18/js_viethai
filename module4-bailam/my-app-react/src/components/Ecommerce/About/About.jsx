import { Link } from "react-router-dom";
import {
    FaRocket,
    FaShieldAlt,
    FaHeadset,
    FaAward,
    FaUsers,
    FaArrowRight
} from "react-icons/fa";
import "./About.css";

const stats = [
    { id: 1, number: "50,000+", label: "Khách hàng tin tưởng" },
    { id: 2, number: "1,200+", label: "Sản phẩm chính hãng" },
    { id: 3, number: "99.8%", label: "Tỉ lệ đánh giá 5 sao" },
    { id: 4, number: "24/7", label: "Hỗ trợ kỹ thuật tận tâm" },
];

const coreValues = [
    {
        id: 1,
        icon: <FaShieldAlt className="value-icon" />,
        title: "100% Chính Hãng",
        description: "Cam kết tất cả thiết bị từ Apple, Samsung, Xiaomi,... đều có nguồn gốc rõ ràng và hóa đơn đầy đủ.",
    },
    {
        id: 2,
        icon: <FaRocket className="value-icon" />,
        title: "Giao Hàng Siêu Tốc",
        description: "Đóng gói cẩn thận, vận chuyển nội thành chỉ trong 2 giờ và toàn quốc trong 24-48 giờ.",
    },
    {
        id: 3,
        icon: <FaAward className="value-icon" />,
        title: "Bảo Hành Tận Tâm",
        description: "Chính sách 1 đổi 1 trong vòng 30 ngày đầu tiên nếu phát sinh lỗi từ nhà sản xuất.",
    },
    {
        id: 4,
        icon: <FaHeadset className="value-icon" />,
        title: "Hỗ Trợ 24/7",
        description: "Đội ngũ chuyên viên tư vấn luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ kỹ thuật kịp thời.",
    },
];

const teamMembers = [
    {
        id: 1,
        name: "Nguyễn Văn Hải",
        role: "Founder & CEO",
        avatar: "/asset/img/avatar/avatar-circle.png",
        bio: "Hơn 10 năm kinh nghiệm trong lĩnh vực bán lẻ thiết bị di động và chuỗi cung ứng.",
    },
    {
        id: 2,
        name: "Trần Thị Lan",
        role: "Trưởng phòng Sản phẩm",
        avatar: "/asset/img/avatar/avatar-circle.png",
        bio: "Chuyên gia đánh giá công nghệ, quản lý kiểm định chất lượng sản phẩm đầu vào.",
    },
    {
        id: 3,
        name: "Lê Minh Tuấn",
        role: "Giám đốc Kỹ thuật & CSKH",
        avatar: "/asset/img/avatar/avatar-circle.png",
        bio: "Phụ trách hệ thống bảo hành, đào tạo kỹ thuật viên và chăm sóc khách hàng sau bán.",
    },
];

function About() {
    return (
        <div className="about-page">
            {/* HERO SECTION */}
            <section className="about-hero">
                <div className="about-container">
                    <span className="badge-pill">VỀ CHÚNG TÔI</span>
                    <h1 className="hero-title">
                        Kết Nối Bạn Với Thế Giới <span className="highlight-text">Công Nghệ Đỉnh Cao</span>
                    </h1>
                    <p className="hero-subtitle">
                        Chúng tôi được thành lập với sứ mệnh mang lại những thiết bị điện tử, điện thoại thông minh
                        chất lượng cao nhất cùng trải nghiệm mua sắm an tâm tuyệt đối cho mọi khách hàng.
                    </p>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="about-stats">
                <div className="about-container stats-grid">
                    {stats.map((item) => (
                        <div key={item.id} className="stat-card">
                            <h3 className="stat-number">{item.number}</h3>
                            <p className="stat-label">{item.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CORE VALUES SECTION */}
            <section className="about-values">
                <div className="about-container">
                    <div className="section-header">
                        <h2 className="section-title">Tại Sao Nên Chọn Chúng Tôi?</h2>
                        <p className="section-desc">
                            Uy tín và sự hài lòng của bạn là tiêu chí hàng đầu định hướng cho mọi hoạt động của cửa hàng.
                        </p>
                    </div>

                    <div className="values-grid">
                        {coreValues.map((val) => (
                            <div key={val.id} className="value-card">
                                <div className="icon-wrapper">{val.icon}</div>
                                <h4>{val.title}</h4>
                                <p>{val.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className="about-team">
                <div className="about-container">
                    <div className="section-header">
                        <h2 className="section-title">Đội Ngũ Đồng Hành</h2>
                        <p className="section-desc">
                            Những con người luôn cống hiến hết mình để đem lại dịch vụ tốt nhất.
                        </p>
                    </div>

                    <div className="team-grid">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="team-card">
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="team-avatar"
                                />
                                <h4 className="member-name">{member.name}</h4>
                                <span className="member-role">{member.role}</span>
                                <p className="member-bio">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="about-cta">
                <div className="about-container cta-card">
                    <h2>Sẵn Sàng Trải Nghiệm Mua Sắm Ngay Hôm Nay?</h2>
                    <p>Khám phá bộ sưu tập smartphone, laptop và thiết bị công nghệ mới nhất cùng nhiều ưu đãi hấp dẫn.</p>
                    <Link to="/" className="cta-button">
                        Khám phá sản phẩm <FaArrowRight />
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default About;
