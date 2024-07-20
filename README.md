# MERN BLOG

MERN 스택은 MongoDB, Express.js, React, Node.js의 약자로, 풀스택 자바스크립트 애플리케이션 개발을 위한 기술 스택입니다. 각 구성 요소는 특정한 역할을 하며, 함께 사용하면 서버사이드와 클라이언트사이드를 모두 자바스크립트로 작업하였습니다.

mongodb(https://www.mongodb.com/)
insomnia(https://insomnia.rest/)

## react 설치

vite(https://ko.vitejs.dev/guide/)

```bash
npm create vite@latest
cd client
npm install
npm run dev
```

## tailwind 설치

tailwindcss(https://tailwindcss.com/docs/guides/vite)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## GIT 연동

```bash
git init
git add .
git commit -m "first"
git remote add origin https://github.com/webstoryboy/mern-blog3.git
git branch -M main
git push -u origin main
```

## Client 설치

```bash
npm i react-router-dom
npm i react-icons
npm i react-circular-progressbar

npm install @reduxjs/toolkit react-redux
npm i redux-persist

npm install firebase

```

## Server 설치

```bash
npm init -y
npm i express
npm i nodemon
npm i mongoose
npm i dotenv
npm i bcryptjs
npm i jsonwebtoken
npm i cookie-parser

```
