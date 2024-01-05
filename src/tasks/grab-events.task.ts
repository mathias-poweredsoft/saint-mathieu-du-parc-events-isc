import {By, ThenableWebDriver} from "selenium-webdriver";
import * as ics from "ics";
import * as fs from "fs";
import * as path from "path";

interface IDomEventCategory {
    title: string;
    icon: string;
}

interface Event {
    title: string;
    date: Date;
}

export class GrabEventsTask {
    public async run(driver: ThenableWebDriver, month: number, year: number) {
        await driver.get(`https://www.saint-mathieu-du-parc.ca/fr/evenements/${year}/${month}`);

        let events : Event[] = [];
        console.log(`Getting events for ${month}/${year}`);

        let categories: IDomEventCategory[] = [];

        const categoriesContainer = await driver.findElement(By.className('calendar__categories categories-nav'))
        const categoriesButtons = await categoriesContainer.findElements(By.css('a'));
        for (let categoryButtons of categoriesButtons) {
            const titleElement = await categoryButtons.findElement(By.css('span'));
            const title = await titleElement.getAttribute('textContent');
            const icon = await (await categoryButtons.findElement(By.css('i'))).getAttribute('class');
            categories.push({
                title: title,
                icon: icon
            });
        }

        const cellContainer = await driver.findElements(By.className('calendar__cell has-events'));
        for (let container of cellContainer) {
            const eventContainers = await container.findElements(By.className('calendar__event'));
            if (eventContainers.length === 0)
                continue;

            const dayOfTheWeek = Number.parseInt(await container.findElement(By.className('calendar__monthday')).getText());
            const eventsDate = new Date(year, month - 1, dayOfTheWeek);

            for (let eventContainer of eventContainers) {
                for (let category of categories) {
                    try {
                        await eventContainer.findElement(By.className(category.icon));
                        events.push({
                            title: category.title,
                            date: eventsDate
                        });
                    }
                    catch (e) {
                    }
                }
            }
        }

        ics.createEvents(events.map(e => {
            return {
                title: e.title,
                start: [e.date.getFullYear(), e.date.getMonth() + 1, e.date.getDate()],
                duration: {hours: 24},
                alarms: [
                    {action: 'display', trigger: {hours: 6, minutes: 0, before: true}}
                ]
            }
        }), (error, value) => {
            if (error) {
                console.log(error);
                return;
            }

            const dir = path.join(__dirname, '../../events');
            fs.writeFileSync(`${dir}/${year}/${month.toString().padStart(2, '0')}_${year}-events.ics`, value);
        });
    }
}
