import type { User } from "./interfaces/User";

const UserDetail = (user: User) => {

    console.log(user)
    const userDetail = user.data;

    return (
        <>
            <p>ID: {userDetail.id}</p>
            <p>username: {userDetail.username}</p>
            <p>email: {userDetail.email}</p>
            <p>age: {userDetail.age}</p>
            <p>avatar: {userDetail.avatar}</p>
            <p>status: {userDetail.status}</p>
        </>
    );
};

export default UserDetail;
