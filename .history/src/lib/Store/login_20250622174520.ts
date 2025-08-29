interface LoginData {
    username?: string;
    id?: string;
    photo?: string;
    user_type: "CUSTOMER" | "STAFF" | "ADMIN";
    login_time: string;
}
