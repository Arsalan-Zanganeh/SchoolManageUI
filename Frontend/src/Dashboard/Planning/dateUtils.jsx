export const getStartOfWeek = (year, week) => {
    const firstDayOfYear = new Date(year, 0, 1);
    const days = (week - 1) * 7;
    const startOfWeek = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + days));
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday is the start of the week
    return new Date(startOfWeek.setDate(diff));
};

export const getEndOfWeek = (year, week) => {
    const startOfWeek = getStartOfWeek(year, week);
    return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
};
