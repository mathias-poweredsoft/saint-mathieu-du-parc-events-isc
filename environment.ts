interface IEnvironment {
    year?: number,
    driver_path: string;
    // schedule: string;
}

export const environment: IEnvironment = {
    driver_path: './chromedriver/win64-115.0.5790.170/chromedriver-win64/chromedriver.exe',
    // https://www.npmjs.com/package/node-cron
    // schedule: '* * * * *'
};
