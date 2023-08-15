import {GrabEventsTask} from "./tasks/grab-events.task";
import {environment} from "../environment";
import * as path from "path";
import * as chrome from 'selenium-webdriver/chrome';
import {Builder} from "selenium-webdriver";

const servicePath = path.resolve(environment.driver_path);
let service = new chrome.ServiceBuilder(servicePath);

let driver = new Builder()
    .forBrowser('chrome')
    .setChromeService(service)
    .build();

async function executeTask() {
    const task = new GrabEventsTask();
    for (let month = 1; month <= 12; month++) {
        await task.run(driver, month, environment.year ?? new Date().getFullYear());
    }
}

executeTask();

//schedule(environment.schedule, executeTask);
