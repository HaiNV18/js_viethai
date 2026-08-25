import { useParams, Link } from 'react-router-dom';

// @mui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import MainCard from '@/components/MainCard';

const products = [
  {
    id: 1,
    name: 'Iphone 13',
    description: 'Mô tả chi tiết cho iPhone 13.',
    brand: 'apple',
    price: 9000,
    thumbnail: 'iphone13.jpg'
  },
  {
    id: 2,
    name: 'Iphone 15',
    description: 'Mô tả chi tiết cho iPhone 15.',
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
    description: 'Mô tả chi tiết cho Xiaomi 14.',
    brand: 'xiaomi',
    price: 5000,
    thumbnail: 'xiaomi14.jpg'
  },
  {
    id: 5,
    name: 'Oppo Find X9 Pro',
    description: 'Mô tả chi tiết cho Oppo Find X9 Pro.',
    brand: 'oppo',
    price: 9000,
    thumbnail: 'oppo-find-x9-pro.jpg'
  },
  {
    id: 6,
    name: 'Xiaomi 15',
    description: 'Mô tả chi tiết cho Xiaomi 15.',
    brand: 'xiaomi',
    price: 11000,
    thumbnail: 'xiaomi15.jpg'
  },
  {
    id: 7,
    name: 'Samsung Galaxy A57',
    description: 'Mô tả chi tiết cho Samsung Galaxy A57.',
    brand: 'samsung',
    price: 8000,
    thumbnail: 'samsung-galaxy-a57.jpg'
  },
  {
    id: 8,
    name: 'Samsung Galaxy S26',
    description: 'Mô tả chi tiết cho Samsung Galaxy S26.',
    brand: 'samsung',
    price: 12000,
    thumbnail: 'samsung-galaxy-s26.jpg'
  },
  {
    id: 9,
    name: 'Samsung Galaxy A07',
    description: 'Mô tả chi tiết cho Samsung Galaxy A07.',
    brand: 'samsung',
    price: 2000,
    thumbnail: 'samsung-galaxy-a07.jpg'
  },
  {
    id: 10,
    name: 'Samsung Galaxy S25',
    description: 'Mô tả chi tiết cho Samsung Galaxy S25.',
    brand: 'samsung',
    price: 17000,
    thumbnail: 'samsung-galaxy-s5.jpg'
  }
];

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((item) => String(item.id) === String(id));

  if (!product) {
    return (
      <ComponentsWrapper title="Product Detail">
        <MainCard>
          <Stack sx={{ gap: 2, alignItems: 'center', py: 4 }}>
            <Typography variant="h5" color="error">
              Product Not Found (ID: {id})
            </Typography>
            <Button component={Link} to="/products/list-product" variant="contained">
              Back to Product List
            </Button>
          </Stack>
        </MainCard>
      </ComponentsWrapper>
    );
  }

  return (
    <ComponentsWrapper title={`Product Detail - ${product.name}`}>
      <MainCard>
        <Stack sx={{ gap: 3 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h3">{product.name}</Typography>
            <Button component={Link} to="/products/list-product" variant="outlined">
              Back to List
            </Button>
          </Stack>
          <Divider />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Product ID
              </Typography>
              <Typography variant="h6">#{product.id}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Brand
              </Typography>
              <Chip label={product.brand.toUpperCase()} color="primary" variant="outlined" sx={{ mt: 0.5 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Price
              </Typography>
              <Typography variant="h4" color="primary.main">
                ${product.price.toLocaleString()}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Thumbnail
              </Typography>
              <Typography variant="body1">{product.thumbnail}</Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                Description
              </Typography>
              <Typography
                variant="body1"
                component="div"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </Grid>
          </Grid>
        </Stack>
      </MainCard>
    </ComponentsWrapper>
  );
}
