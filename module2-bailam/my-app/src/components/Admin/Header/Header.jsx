import './Header.css'

function Header({ onLogin }) {
    const isLogin = false;

    if (isLogin) {
        onLogin("Nguyễn Văn A");
    }

    return (
        <header className="header">
            {isLogin ? <h1>Xin chào</h1> : <button>Đăng nhập</button>}
        </header>
    );
}

export default Header;
