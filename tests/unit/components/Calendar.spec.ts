import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';

import Calendar from '@/components/Calendar.vue';
import DatepickerMenu from '@/components/DatepickerMenu.vue';
import { resetDateTime } from '@/utils/date-utils';

const mountCalendar = async () => {
    const menu = mount(DatepickerMenu, {});
    await menu.vm.$nextTick();
    const calendar = menu.findComponent(Calendar);
    const date = new Date();

    return { calendar, date };
};

describe('Calendar component', () => {
    it('Should render custom day names', () => {
        const calendar = mount(Calendar, { props: { dayNames: ['1', '2', '3', '4', '5', '6', '7'] } });

        const header = calendar.find('[data-test="calendar-header"]');

        expect(header.text()).toContain('1');
    });

    it('Should display marker', async () => {
        const marker = {
            date: new Date(),
        };
        const menu = mount(DatepickerMenu, { props: { markers: [marker] } });
        await menu.vm.$nextTick();
        const calendar = menu.findComponent(Calendar);

        expect(calendar.html()).toContain('dp__marker_dot');
    });

    it('Should display marker tooltip', async () => {
        const marker = {
            date: new Date(),
            tooltip: [{ text: 'test' }],
        };
        const menu = mount(DatepickerMenu, { props: { markers: [marker] } });
        await menu.vm.$nextTick();
        const calendar = menu.findComponent(Calendar);

        await calendar.find(`[data-test="${resetDateTime(new Date())}"]`).trigger('mouseover');
        await calendar.vm.$nextTick();

        expect(calendar.html()).toContain('dp__marker_tooltip');
    });

    it('Should emit hover date on mouse over', async () => {
        const { calendar, date } = await mountCalendar();

        await calendar.find(`[data-test="${resetDateTime(date)}"]`).trigger('mouseover');
        await calendar.vm.$nextTick();

        expect(calendar.emitted()).toHaveProperty('set-hover-date');
        expect((calendar.emitted()['set-hover-date'][0] as any)[0].value).toEqual(resetDateTime(date));
    });

    it('Should emit date when calendar day is clicked', async () => {
        const { calendar, date } = await mountCalendar();

        await calendar.find(`[data-test="${resetDateTime(date)}"]`).trigger('click');
        await calendar.vm.$nextTick();

        expect(calendar.emitted()).toHaveProperty('select-date');
        expect((calendar.emitted()['select-date'][0] as any)[0].value).toEqual(resetDateTime(date));
    });

    it('Should display six weeks', async () => {
        const menu = mount(DatepickerMenu, { props: { sixWeeks: true } });
        await menu.vm.$nextTick();

        expect(menu.vm.dates(0)).toHaveLength(6);
    });
});
