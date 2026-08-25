import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// @mui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import MainCard from '@/components/MainCard';

const products = [
    {
        id: 1,
        name: 'Iphone 13',
        description: 'Mô tả',
        brand: 'apple',
        price: 9000,
        thumbnail: 'iphone13.jpg'
    },
    {
        id: 2,
        name: 'Iphone 15',
        description: 'Mô tả',
        brand: 'apple',
        price: 9000,
        thumbnail: 'iphone15.jpg'
    },
    {
        id: 3,
        name: 'Samsung S24',
        description:
            '<strong>Samsung S24</strong> là mẫu smartphone tầm trung nổi bật với sức mạnh từ chipset Exynos 1330 cùng công nghệ chống rung OIS trên camera chính 50MP, giúp tối ưu hiệu năng và chất lượng ảnh chụp. Thiết bị sở hữu viên pin 5.000mAh bền bỉ kèm sạc nhanh 25W, đáp ứng trọn vẹn nhu cầu sử dụng cả ngày dài. Với thiết kế tinh tế gồm 3 gam màu thời thượng, A17 5G hứa hẹn là lựa chọn hàng đầu trong phân khúc năm 2026.',
        brand: 'samsung',
        price: 6000,
        thumbnail: 'samsung-s24.jpg'
    },
    {
        id: 4,
        name: 'Xiaomi 14',
        description: 'Mô tả',
        brand: 'xiaomi',
        price: 5000,
        thumbnail: 'xiaomi14.jpg'
    },
    {
        id: 5,
        name: 'Oppo Find X9 Pro',
        description: 'Mô tả',
        brand: 'oppo',
        price: 9000,
        thumbnail: 'oppo-find-x9-pro.jpg'
    },
    {
        id: 6,
        name: 'Xiaomi 15',
        description: 'Mô tả',
        brand: 'xiaomi',
        price: 11000,
        thumbnail: 'xiaomi15.jpg'
    },
    {
        id: 7,
        name: 'Samsung Galaxy A57',
        description: 'Mô tả',
        brand: 'samsung',
        price: 8000,
        thumbnail: 'samsung-galaxy-a57.jpg'
    },
    {
        id: 8,
        name: 'Samsung Galaxy S26',
        description: 'Mô tả',
        brand: 'samsung',
        price: 12000,
        thumbnail: 'samsung-galaxy-s26.jpg'
    },
    {
        id: 9,
        name: 'Samsung Galaxy A07',
        description: 'Mô tả',
        brand: 'samsung',
        price: 2000,
        thumbnail: 'samsung-galaxy-a07.jpg'
    },
    {
        id: 10,
        name: 'Samsung Galaxy S25',
        description: 'Mô tả',
        brand: 'samsung',
        price: 17000,
        thumbnail: 'samsung-galaxy-s5.jpg'
    }
];

const ITEMS_PER_PAGE = 5;

const getBrandColor = (brand) => {
    switch (brand?.toLowerCase()) {
        case 'apple':
            return 'primary';
        case 'samsung':
            return 'info';
        case 'xiaomi':
            return 'warning';
        case 'oppo':
            return 'success';
        default:
            return 'default';
    }
};

export default function ProductList() {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const paginatedProducts = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <ComponentsWrapper title="List Product">
            <MainCard sx={{ p: 0 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Brand</TableCell>
                                <TableCell align="right">Price ($)</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedProducts.map((product) => (
                                <TableRow key={product.id} hover>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>{product.name}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={product.brand.toUpperCase()}
                                            size="small"
                                            color={getBrandColor(product.brand)}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                                        ${product.price.toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 350 }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            component="div"
                                            dangerouslySetInnerHTML={{ __html: product.description }}
                                            sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            component={RouterLink}
                                            to={`/products/detail/${product.id}`}
                                            variant="outlined"
                                            color="secondary"
                                            size="large"
                                            sx={{ marginRight: 2 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            size="large"
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {totalPages > 1 && (
                    <Stack sx={{ p: 2, alignItems: 'center' }}>
                        <Pagination count={totalPages} page={page} onChange={handleChangePage} color="primary" />
                    </Stack>
                )}
            </MainCard>
        </ComponentsWrapper>
    );
}
