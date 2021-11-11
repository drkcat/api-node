export const capitalize = (text, setLowercase) => {
    if (text) {
        if (setLowercase) {
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        } else {
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
    }
    return null;
};

export const capitalizeEachWord = (text, setLowercase) => {
    if (text) {
        if (text.indexOf(' ') > -1) {
            const words = text.split(' ');
            const capitalized = [];
            words.map((word) => {
                capitalized.push(capitalize(word, setLowercase));
            });
            return capitalized.join(' ');
        } else {
            return capitalize(text, setLowercase);
        }
    }
    return null;
};