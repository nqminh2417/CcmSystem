// src/routes/routes.ts

// Object này để xài trong code: Routes.Login, Routes.Home
export const Routes = {
    Login: 'Login',
    Home: 'Home',
    // thêm các màn khác ở đây...
} as const;

// Type cho Stack Navigator (React Navigation)
export type RootStackParamList = {
    [Routes.Login]: undefined;
    [Routes.Home]: undefined;
    // [Routes.BoxHistory]: { boxId: string }; // ví dụ nếu sau này có param
};
