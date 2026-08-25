import React from 'react';
import { useForm, Controller } from "react-hook-form";
import { Button, Checkbox, Typography, Container, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Link as RouterLink } from 'react-router-dom';
import { MenuList, MenuItem, Link } from '@mui/material';

import { TextField } from "@mui/material";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';


import './App.css'

const myTheme = createTheme({
  palette: {
    primary: { main: '#ff4757' }, // Đổi màu chủ đạo sang Đỏ
    secondary: { main: '#FFFF' }
  },
});

const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };


// 1. Tạo một "Cầu nối" giữa thuộc tính href và to
const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Chuyển đổi href của MUI thành to của React Router
  return <RouterLink ref={ref} to={href} {...other} />;
});

// 2. Cấu hình Theme để tất cả Button và Link đều dùng "Cầu nối" này
export const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
});


function App() {

  const { control, handleSubmit, } = useForm({
    defaultValues: {
      fullName: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };


  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, textAlign: 'center', p: 3, border: '1px solid #eee', borderRadius: 2 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Welcome to MUI
        </Typography>
        <Typography variant="body1" mb={3}>
          Bắt đầu xây dựng giao diện chuyên nghiệp trong tích tắc.
        </Typography>
        <Button variant="contained" color="secondary" size="large">
          Khám phá ngay
        </Button>
      </Box>

      <Box sx={{
        p: {xs:2, md:5},
        width: {xs: '100%', md: '50%'},

        bgcolor: 'primary.main',
        color: 'secondary.contrastText',

        '&:hover': {opacity: 0.8},
        '& .child-class': {mt: 1}
      }}>Nội dung tự co giãn theo màn hình
      </Box>

      <ThemeProvider theme={myTheme}>
        <Button variant="contained" color="primary">Nút bấm màu đỏ</Button>
      </ThemeProvider>

      <Typography
        variant="h4"
        component="div"
        gutterBottom
        sx={{color: 'text.primary'}}>

        TIêu đề phân đoạn

      </Typography>

      <Checkbox {...label} defaultChecked />
      <Checkbox {...label} />
      <Checkbox {...label} disabled />
      <Checkbox {...label} disabled checked />

      <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      <Fab color="secondary" aria-label="edit">
        <EditIcon />
      </Fab>
      <Fab variant="extended">
        <NavigationIcon sx={{ mr: 1 }} />
        Navigate
      </Fab>
      <Fab disabled aria-label="like">
        <FavoriteIcon />
      </Fab>
    </Box>


    <Box>
        <Badge badgeContent={4} color="error">
            <MailIcon color="action" />
        </Badge>

        <Chip
            avatar={<Avatar src="...." />}
            label="Admin User"
            variant="outlined"
            color="primary"
            onDelete={() => alert("Delete clicked")}
        />

        <Tooltip title="Xóa vĩnh viễn" arrow placement="top">
            <IconButton color="error">
            <DeleteIcon />
            </IconButton>
        </Tooltip>


        <Card sx={{ maxWidth: 345, borderRadius: 3, boxShadow: 5 }}>
            <CardHeader
                avatar={<Avatar sx={{ bgcolor: "#f50057" }}>R</Avatar>}
                title="React & MUI Masterclass" subheader="April 2026" />
            <CardMedia
                component="img"
                height="160"
                image="..."
                alt="React Background"
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                Khám phá sức mạnh của Material UI v6...
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" variant="text">
                Share
                </Button>
                <Button size="small" variant="contained" startIcon={<SendIcon />}>
                Get Started
                </Button>
            </CardActions>
        </Card>
    </Box>

    <Box sx={{ bgcolor: 'grey.100', p: 3, textAlign: 'center' }}>
        Nội dung nằm gọn trong khung
    </Box>

    {/* <Stack
      direction={{ xs: 'column', sm: 'row' }} // Mobile dọc, Tablet ngang
      spacing={2}                             // Khoảng cách 16px giữa các con, cách đều nhau
      justifyContent="center"
      alignItems="center"
    >
      <Button variant="contained">Nút 1</Button>
      <Button variant="contained">Nút 2</Button>
      <Button variant="contained">Nút 3</Button>
    </Stack> */}


    <Grid container spacing={3} >
      {/* Cột trái: 12/12 trên mobile, 8/12 trên desktop */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper>Nội dung chính (Main Content)</Paper>
      </Grid>

      {/* Cột phải: 12/12 trên mobile, 4/12 trên desktop */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper>Thanh bên (Sidebar)</Paper>
      </Grid>
    </Grid>
    <Grid container spacing={3}>
        {/* Cột phải: 12/12 trên mobile, 4/12 trên desktop */}
        <Grid size={{ xs: 12, md: 4 }}>
            <Paper>Thanh bên (Sidebar)</Paper>
        </Grid>
        {/* Cột trái: 12/12 trên mobile, 8/12 trên desktop */}
        <Grid size={{ xs: 12, md: 8 }}>
            <Paper>Nội dung chính (Main Content)</Paper>
        </Grid>
    </Grid>



    <MenuList>
      <MenuItem component={RouterLink} to="/profile">
        Trang cá nhân
      </MenuItem>

      <MenuItem component={RouterLink} to="/home">
        Trang chủ
      </MenuItem>

      <MenuItem component={RouterLink} to="/add-staff">
        Thêm nhân viên
      </MenuItem>
    </MenuList>

    <Button href="/home">Home</Button>
    <Link href="/about">About</Link>

    <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="fullName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}                          // Kết nối value, onChange, onBlur
              label="Họ và tên"
              fullWidth
              error={!!error}                     // Bật màu đỏ nếu có lỗi
              helperText={error?.message}         // Hiển thị nội dung lỗi
            />
          )}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Chức vụ" fullWidth>
              <MenuItem value="admin">Quản trị viên</MenuItem>
              <MenuItem value="editor">Biên tập viên</MenuItem>
              <MenuItem value="user">Người dùng</MenuItem>
            </TextField>
          )}
        />


    <button type="submit">Lưu</button>
    </form>


    </Container>
  )
}

export default App
