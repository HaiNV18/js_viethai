-- Tạo bảng channels trong PostgreSQL
CREATE TABLE IF NOT EXISTS channels (
    id VARCHAR(100) PRIMARY KEY,                         -- ID kênh (VD: 'UCX6OQ3DkcsbYNE6H8uQQuVA')
    name VARCHAR(255) NOT NULL,                          -- Tên kênh
    handle VARCHAR(100),                                 -- Handle/Custom URL (VD: '@MrBeast')
    avatar VARCHAR(255) DEFAULT 'default-channel-thumbnail.jpg', -- Ảnh đại diện
    banner VARCHAR(255) DEFAULT 'default-channel-banner.jpg',    -- Ảnh banner
    subscribers BIGINT DEFAULT 0,                        -- Số lượng người đăng ký
    subscribers_formatted VARCHAR(50),                   -- Chuỗi định dạng hiển thị (VD: '375M', '500K')
    category VARCHAR(100) NOT NULL,                      -- Danh mục (Entertainment, Game, VTuber, News, Tech...)
    videos_count INT DEFAULT 0,                          -- Số lượng video
    view_count BIGINT DEFAULT 0,                         -- Tổng số lượt xem kênh
    description TEXT,                                    -- Mô tả kênh
    url VARCHAR(255),                                    -- Đường dẫn YouTube Channel
    website VARCHAR(255),                                -- Trang web chính thức
    facebook VARCHAR(255),                               -- Link Facebook
    twitter VARCHAR(255),                                -- Link Twitter (X)
    tiktok VARCHAR(255),                                 -- Link TikTok
    published_at TIMESTAMP WITH TIME ZONE,               -- Ngày tạo kênh trên YouTube
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Ngày thêm vào DB
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  -- Ngày cập nhật DB
);

-- Tạo Index hỗ trợ tìm kiếm và sắp xếp nhanh
CREATE INDEX IF NOT EXISTS idx_channels_category ON channels(category);
CREATE INDEX IF NOT EXISTS idx_channels_subscribers ON channels(subscribers DESC);
CREATE INDEX IF NOT EXISTS idx_channels_name_handle ON channels(name, handle);

INSERT INTO channels (
    id, name, handle, avatar, banner, subscribers, subscribers_formatted, category, videos_count, url, website, facebook, twitter, tiktok
) VALUES
('UCX6OQ3DkcsbYNE6H8uQQuVA', 'MrBeast', '@MrBeast', 'default-channel-thumbnail.jpg', 'default-channel-banner.jpg', 375000000, '375M', 'Entertainment', 840, 'https://youtube.com/@MrBeast', 'https://mrbeast.com', 'https://facebook.com/MrBeast6000', 'https://twitter.com/MrBeast', 'https://tiktok.com/@mrbeast'),

('UCq-Fj5jknLsUf-MWSy4_brA', 'T-Series', '@tseries', 'tseries-channel-thumbnail.jpg', 'default-channel-banner.jpg', 285000000, '285M', 'Music', 21500, 'https://youtube.com/@tseries', 'https://tseries.com', 'https://facebook.com/tseriesmusic', 'https://twitter.com/TSeries', NULL),

('UC-lHJZR3Gqxm24_Vd_AJ5Yw', 'PewDiePie', '@PewDiePie', 'pewdiepie-channel-thumbnail.jpg', 'default-channel-banner.jpg', 111000000, '111M', 'Game', 4790, 'https://youtube.com/@PewDiePie', 'https://pewdiepie.com', 'https://facebook.com/pewdiepie', 'https://twitter.com/pewdiepie', NULL),

('UCGCZAYq5Xxojl_tSXcVJhiQ', 'ANN News Channel', '@ANNnewsCH', 'ann-news-channel-thumbnail.jpg', 'default-channel-banner.jpg', 3800000, '3.8M', 'News', 154000, 'https://youtube.com/@ANNnewsCH', 'https://news.tv-asahi.co.jp', NULL, 'https://twitter.com/tv_asahi_news', NULL),

('UC8butISFwT-Wl7EV0hUK0BQ', 'FreeCodeCamp.org', '@freecodecamp', 'freecodecamp-channel-thumbnail.jpg', 'default-channel-banner.jpg', 10200000, '10.2M', 'Development', 1850, 'https://youtube.com/@freecodecamp', 'https://www.freecodecamp.org', NULL, 'https://twitter.com/freecodecamp', NULL),

('UCJFZiqLm7iJ0vEM18y4_bWw', 'Hololive Ch. hololive-VTuber', '@hololive', 'hololive-channel-thumbnail.jpg', 'hololive-channel-banner.jpg', 2500000, '2.5M', 'VTuber', 2100, 'https://youtube.com/@hololive', 'https://hololive.hololivepro.com', NULL, 'https://twitter.com/hololivetv', 'https://tiktok.com/@hololive_eng'),

('UC4YaOt1yT-ZeyB0OmxHgolA', 'Kizuna AI Channel', '@KizunaAI', 'kizuna-ai-channel-thumbnail.jpg', 'default-channel-banner.jpg', 3000000, '3.0M', 'VTuber', 1100, 'https://youtube.com/@KizunaAI', 'https://kizunaai.com', NULL, 'https://twitter.com/aichan_nel', 'https://tiktok.com/@kizunaai0630'),

('UCott96qGP5ADmsB_yNQMvDA', 'Muse Vietnam', '@MuseVN', 'musevn-channel-thumbnail.jpg', 'default-channel-banner.jpg', 1800000, '1.8M', 'Entertainment', 3200, 'https://youtube.com/@MuseVN', NULL, 'https://facebook.com/museacg.vn', NULL, NULL),

('UClOf1XXinvZsy4wKPAkro2A', 'PlayOverwatch', '@PlayOverwatch', 'play-overwatch-channel-thumbnail.jpg', 'default-channel-banner.jpg', 3600000, '3.6M', 'Game', 890, 'https://youtube.com/@PlayOverwatch', 'https://overwatch.blizzard.com', 'https://facebook.com/PlayOverwatch', 'https://twitter.com/PlayOverwatch', NULL),

('UC9nK195uN_z_4L0Qj7x1l0w', 'SBS Drama', '@sbsdrama', 'sbs-channel-thumbnail.jpg', 'default-channel-banner.jpg', 7200000, '7.2M', 'Entertainment', 45000, 'https://youtube.com/@sbsdrama', 'https://www.sbs.co.kr', 'https://facebook.com/sbsNOW', NULL, NULL),

('UCuP2vJ6_0nB9H_P1o5_P3wA', 'Vexsper', '@vexsper', 'vexsper-channel-thumbnail.jpg', 'default-channel-banner.jpg', 500000, '500K', 'Development', 150, 'https://youtube.com/@vexsper', NULL, NULL, 'https://twitter.com/vexsper', NULL),

('UCVia_crjzJylRmGq7SHTiaw', 'Hearthstone', '@Hearthstone', 'hearthstone-channel-thumbnail.jpg', 'hearthstone-channel-banner.jpg', 496000, '496K', 'Game', 1680, 'https://youtube.com/@Hearthstone', 'https://us.shop.battle.net/en-us/family/hearthstone', NULL, NULL, NULL),

('UC68VHcQS5x-WNFmf5cAFtgg', 'VTC NEWS', '@VTCNewstintuc', 'vtc-news-channel-thumbnail.jpg', 'vtc-news-channel-banner.jpg', 449000, '449K', 'Tech', 1680, 'https://youtube.com/@VTCNewstintuc', 'https://vtcnews.vn/', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;