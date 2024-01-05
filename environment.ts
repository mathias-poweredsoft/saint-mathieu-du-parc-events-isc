interface IEnvironment {
    year?: number,
    driver_path: string;
    // schedule: string;
}

export const environment: IEnvironment = {
    driver_path: './chromedriver/chromedriver-win64/chromedriver.exe',
    // https://www.npmjs.com/package/node-cron
    // schedule: '* * * * *'
};
