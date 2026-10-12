import { defineConfig, devices } from '@playwright/test';
const port = Number(process.env.MOCOMO_TEST_PORT || 3000);
const url = `http://127.0.0.1:${port}`;
export default defineConfig({testDir:'./tests/browser', use:{baseURL:url,...devices['iPhone 13'],browserName:'chromium',launchOptions:process.env.MOCOMO_CHROMIUM_PATH?{executablePath:process.env.MOCOMO_CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']}:{}},webServer:{command:`npm run ${process.env.MOCOMO_TEST_PRODUCTION?'start':'dev'} -- --hostname 127.0.0.1 --port ${port}`,url,reuseExistingServer:!process.env.MOCOMO_TEST_PORT}, reporter:'list'});
