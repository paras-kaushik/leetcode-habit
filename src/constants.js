// src/constants.js

export const hours = [
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
    '10:00 PM',
    '11:00 PM',
    '12:00 AM (midnight)',
];

export const initialTasksByHour = {
    '6:00 AM': [],
    '7:00 AM': [],
    '8:00 AM': [],
    '9:00 AM': [],
    '10:00 AM': [],
    '11:00 AM': [],
    '12:00 PM': [],
    '1:00 PM': [],
    '2:00 PM': [],
    '3:00 PM': [],
    '4:00 PM': [],
    '5:00 PM': [],
    '6:00 PM': [],
    '7:00 PM': [],
    '8:00 PM': [],
    '9:00 PM': [],
    '10:00 PM': [],
    '11:00 PM': [],
    '12:00 AM (midnight)': [],
};

const eyePleasingColors = [
    "#FF5733", // Red
    "#FFC300", // Yellow
    "#FFA500", // Orange
    "#FF70A6", // Pink
    "#C70039", // Crimson
    "#900C3F", // Dark Red
    "#FF851B", // Deep Orange
    "#4CAF50", // Green
    "#2979FF", // Blue
    "#673AB7", // Purple
];

let currentIndex = 0;

export const getNextEyePleasingColor = () => {
    const color = eyePleasingColors[currentIndex];
    currentIndex = (currentIndex + 1) % eyePleasingColors.length;
    return color;
};



export const contrastColor = (hexColor) => {
    // Convert the hex color to RGB components
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate the relative luminance using the sRGB formula
    const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

    // Determine the contrast color (black or white) based on luminance
    return luminance > 0.5 ? "#000000" : "#ffffff";
};

export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en', {
        day: 'numeric',
        month: 'short',
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        millisecond: 'numeric',
        hour12: true,
    }).format(date);
};
