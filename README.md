# Chemical Consumption Management System

Ứng dụng mobile (React Native, Android) quản lý tiêu thụ hoá chất: ghi nhận, tra cứu, theo dõi…  
Mục tiêu chạy trên các thiết bị Android (bao gồm cả thiết bị scan chuyên dụng) với Android 11 và 13.

---

## 1. Tech stack

- **React Native** (CLI, không dùng Expo)
- **TypeScript**
- **Yarn 1.22.22** – package manager
- **Node.js 24.11.1** – quản lý qua **nvm for Windows**
- **Java 17 (17.0.17)** – dùng cho Gradle/Android build
- **Android Studio + Android SDK** (API 30, 33, 35)
- **React Native Metro bundler** (dev server)

---

## 2. Chuẩn bị môi trường (Windows 11)

### 2.1. Cài nvm for Windows

1. Tải **nvm for Windows 1.2.2** (Node.js version manager for Windows).
2. Cài đặt theo hướng dẫn, sau đó mở **PowerShell / CMD mới** và kiểm tra:

   ```bash
   nvm version
   ```

### 2.2. Cài Node.js LTS (24.11.1)

Sau khi có nvm:

```bash
nvm install 24.11.1
nvm use 24.11.1

node -v   # kỳ vọng: v24.11.1
npm -v
```

> Nếu sau này gặp vấn đề lạ, có thể cài thêm Node 20 LTS rồi `nvm use 20.x` để thử.

---

### 2.3. Cài Java 17 (v17.0.17) & JAVA_HOME

1. Cài JDK 17 (bản 17.0.17) từ nhà cung cấp bạn chọn (Adoptium/Oracle…).

2. Giả sử đường dẫn JDK là:

   ```text
   C:\Program Files\Java\jdk-17.0.17
   ```

3. Thiết lập biến môi trường:

   - Mở **Edit the system environment variables** → **Environment Variables…**
   - Ở **System variables**:

     - **New…**

       - Name: `JAVA_HOME`
       - Value: `C:\Program Files\Java\jdk-17.0.17`

     - Chọn biến `Path` → **Edit** → **New**:

       - Thêm: `%JAVA_HOME%\bin`

4. Kiểm tra:

   ```bash
   java -version
   echo %JAVA_HOME%   # trong PowerShell có thể dùng: $env:JAVA_HOME
   ```

---

### 2.4. Cài Android Studio & Android SDK

1. Cài **Android Studio** mới nhất.
2. Mở Android Studio → **More Actions → SDK Manager**.

#### 2.4.1. Tab **SDK Platforms**

Bật **Show Package Details** và đảm bảo đã cài:

- **Android 11 (API 30)**
- **Android 13 (API 33)**
- **Android 15 / VanillaIceCream (API 35)** – tương ứng với `compileSdkVersion = 36` của project (Android Studio/SDK sẽ map phù hợp).

(Chỉ cần có các platform này để build + tạo emulator.)

#### 2.4.2. Tab **SDK Tools**

Bật **Show Package Details** và đảm bảo:

- **Android SDK Build-Tools**

  - **35.0.0**
  - **36.0.0** (bản được React Native doctor recommend)

- **Android SDK Platform-Tools**
- **Android SDK Command-line Tools (latest)**
- **NDK (Side by side)**:

  - Cài **`27.1.12297006`** (trùng với `ndkVersion` trong project)

- **CMake**:

  - Khuyến nghị **>= 3.22.1** (nếu có nhiều bản, 3.22.x trở lên là đủ)

---

### 2.5. Thiết lập ANDROID_HOME / ANDROID_SDK_ROOT

Trong **SDK Manager → SDK Location**, ghi lại đường dẫn, ví dụ:

```text
C:\Users\<YOUR_USER>\AppData\Local\Android\Sdk
```

Thiết lập:

- Ở **User variables** (hoặc System variables):

  - **New…**

    - Name: `ANDROID_HOME`
    - Value: `C:\Users\<YOUR_USER>\AppData\Local\Android\Sdk`

- Trong biến `Path` (User hoặc System), thêm:

  - `%ANDROID_HOME%\platform-tools`
  - `%ANDROID_HOME%\emulator`
  - `%ANDROID_HOME%\tools`
  - `%ANDROID_HOME%\tools\bin`

Kiểm tra:

```bash
echo %ANDROID_HOME%
adb version
```

---

### 2.6. Cài Yarn 1.22.22

Sau khi Node đã ok:

```bash
npm install -g yarn
yarn -v   # kỳ vọng: 1.22.22
```

> Lưu ý: sau khi dùng Yarn, **không dùng lẫn `npm install` trong project** để tránh loạn `lock` và `node_modules`.

---

## 3. Các lệnh Yarn trong project

Trong `package.json` hiện có:

```jsonc
"scripts": {
  "android": "react-native run-android",
  "ios": "react-native run-ios",
  "lint": "eslint .",
  "start": "react-native start",
  "start:reset": "react-native start --reset-cache",
  "test": "jest",

  "android:clean": "cd android && gradlew.bat clean",
  "android:clean-debug": "cd android && gradlew.bat clean && cd .. && react-native run-android",
  "android:clean-aab": "cd android && gradlew.bat clean bundleRelease",
  "android:clean-apk": "cd android && gradlew.bat clean assembleRelease"
}
```

### 3.1. Lệnh dev cơ bản

- **Start Metro (dev server)**

  ```bash
  yarn start
  ```

- **Start Metro kèm reset cache**

  Dùng khi đổi branch lớn, đổi Babel/Metro config, gặp lỗi cache:

  ```bash
  yarn start:reset
  ```

- **Chạy app Android (debug)**

  (Sau khi đã bật emulator hoặc cắm điện thoại):

  ```bash
  yarn android
  ```

- **Lint**

  ```bash
  yarn lint
  ```

- **Test (Jest)**

  ```bash
  yarn test
  ```

---

### 3.2. Lệnh clean & build Android

- **Clean project Android**

  ```bash
  yarn android:clean
  ```

- **Clean + build debug + cài lại app**

  (dùng khi build bị dơ):

  ```bash
  yarn android:clean-debug
  ```

- **Clean + build file AAB (release)**

  (dùng để upload lên Play Store / MDM):

  ```bash
  yarn android:clean-aab
  ```

  File AAB sẽ nằm ở:

  ```text
  android/app/build/outputs/bundle/release/app-release.aab
  ```

- **Clean + build file APK (release)**

  (dùng để cài tay lên thiết bị scan / device):

  ```bash
  yarn android:clean-apk
  ```

  File APK sẽ nằm ở:

  ```text
  android/app/build/outputs/apk/release/app-release.apk
  ```

---

## 4. Quy trình chạy project lần đầu (cho người mới clone)

### 4.1. Clone source

```bash
git clone <URL_REPO>
cd ChemicalConsumptionManagementSystem   # hoặc tên thư mục repo
```

### 4.2. Chọn đúng version Node

```bash
nvm install 24.11.1    # nếu chưa có
nvm use 24.11.1
node -v
```

### 4.3. Cài dependencies

```bash
yarn install
```

### 4.4. Kiểm tra môi trường React Native

```bash
npx react-native doctor
```

- Nếu có mục nào báo lỗi (Android SDK, Java, Node…) thì sửa theo hướng dẫn và chạy lại.

### 4.5. Chạy app Android (debug)

1. **Mở Android emulator**:

   - Android Studio → **Device Manager** → Start AVD (khuyến nghị:

     - 1 emulator **Android 11 – API 30**
     - 1 emulator **Android 13 – API 33**
     - 1 emulator **Android 15 – API 35**)

2. **Terminal 1 – Start Metro**:

   ```bash
   yarn start
   # hoặc nếu cần reset cache:
   # yarn start:reset
   ```

3. **Terminal 2 – Build & cài app**:

   ```bash
   yarn android
   ```

---

## 5. Build release cho thiết bị thực (APK/AAB)

- **Build AAB (release)** – đưa lên Play Store / MDM:

  ```bash
  yarn android:clean-aab
  ```

- **Build APK (release)** – cài trực tiếp lên thiết bị (scan, máy nội bộ, v.v.):

  ```bash
  yarn android:clean-apk
  ```

Sau đó:

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

(hoặc copy tay file APK vào thiết bị rồi cài).

---

## 6. Troubleshooting nhanh

- App báo lỗi module lạ, UI không cập nhật, đổi branch xong lỗi vô lý:

  - Dừng Metro.

  - Chạy:

    ```bash
    yarn start:reset
    ```

  - Mở terminal khác:

    ```bash
    yarn android
    ```

- Build Android bị lỗi dơ Gradle:

  - Dùng:

    ```bash
    yarn android:clean-debug
    ```

- Nếu Android Studio báo thiếu NDK/CMake:

  - Vào **SDK Manager → SDK Tools**, bật **Show Package Details**:

    - Cài đúng **NDK 27.1.12297006**
    - Cài **CMake >= 3.22.1**

---

## 7. Ghi chú khác

- Không dùng `npm install` trong project này, chỉ dùng **Yarn**.
- Branch mặc định: `master` / `main` tùy theo setup Git hiện tại của repo (cập nhật thêm trong mục này nếu cần).
- Docker **không dùng** cho project này (build & run trực tiếp trên Windows + Android Studio).
