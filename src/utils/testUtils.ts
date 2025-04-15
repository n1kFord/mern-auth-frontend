export const checkElements = (elements: Array<HTMLElement> | HTMLElement) => {
    if (Array.isArray(elements)) {
        elements.forEach((element) => {
            expect(element).toBeInTheDocument();
        });
    } else {
        expect(elements).toBeInTheDocument();
    }
};

export const resizeWindow = (width: number, height: number = 800) => {
    global.innerWidth = width;
    global.innerHeight = height;
    global.dispatchEvent(new Event("resize"));
};
