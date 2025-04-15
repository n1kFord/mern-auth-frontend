import "intersection-observer";
import { render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import About, { technologies } from "./About";
import { BackgroundProvider } from "../contexts/BackgroundContext";

describe("About component", () => {
    const renderAboutPage = () =>
        render(
            <BackgroundProvider>
                <About />
            </BackgroundProvider>,
        );

    it("should have no accessibility violations", async () => {
        const { container } = renderAboutPage();
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    describe("Hero section", () => {
        it("should render the title with correct text", () => {
            renderAboutPage();
            const title = screen.getByRole("heading", {
                level: 1,
                name: "MERN AUTH",
            });
            expect(title).toBeInTheDocument();
            expect(title).toHaveAttribute("id", "about-title");
        });

        it("should render the subtitle with correct text", () => {
            renderAboutPage();
            const subtitle = screen.getByText(
                "An Authentication System Using the MERN Stack",
            );
            expect(subtitle).toBeInTheDocument();
            expect(subtitle).toHaveAttribute("aria-describedby", "about-title");
        });
    });

    describe("Technologies section", () => {
        it("should render the list of technologies", () => {
            renderAboutPage();
            const list = screen.getByRole("list", { name: "Technologies" });
            expect(list).toBeInTheDocument();
        });

        it("should render each technology item correctly", () => {
            renderAboutPage();
            const list = screen.getByRole("list", { name: "Technologies" });
            const items = within(list).getAllByRole("listitem");

            expect(items.length).toBe(technologies.length);

            items.forEach((item, index) => {
                const tech = technologies[index];
                const link = within(item).getByRole("link", {
                    name: new RegExp(tech.label, "i"),
                });

                expect(link).toHaveAttribute("href", tech.url);
                expect(link).toHaveAttribute(
                    "id",
                    `technology-item-${tech.label}`,
                );

                const img = within(item).getByRole("img", {
                    name: `${tech.label} icon`,
                });

                expect(img).toHaveAttribute("src", tech.icon);
                expect(img).toHaveAttribute("width", "128");
                expect(img).toHaveAttribute("height", "128");

                expect(item).toHaveAttribute(
                    "aria-labelledby",
                    `technology-item-${tech.label}`,
                );
            });
        });
    });

    describe("Description section", () => {
        it("should render the section with the correct title", () => {
            renderAboutPage();
            const title = screen.getByRole("heading", {
                level: 2,
                name: "What is the MERN Stack?",
            });
            expect(title).toBeInTheDocument();
            expect(title).toHaveAttribute("id", "description-title");

            const section = screen.getByRole("region", {
                name: "What is the MERN Stack?",
            });
            expect(section).toBeInTheDocument();
            expect(section).toHaveAttribute(
                "aria-labelledby",
                "description-title",
            );
        });

        it("should render each technology description correctly", () => {
            renderAboutPage();
            const list = screen.getByRole("list", {
                name: "Technologies Description",
            });

            const items = within(list).getAllByRole("listitem");
            expect(items.length).toBe(technologies.length);

            items.forEach((item, index) => {
                const tech = technologies[index];

                expect(item).toHaveTextContent(
                    new RegExp(`^${tech.label}.*${tech.description}$`, "i"),
                );

                expect(item).toHaveAttribute(
                    "aria-labelledby",
                    `description-item-${tech.label}`,
                );
            });
        });
    });

    describe("Project Features section", () => {
        it("should render the section with the correct title", () => {
            renderAboutPage();
            const title = screen.getByRole("heading", {
                level: 2,
                name: "Project features:",
            });
            expect(title).toBeInTheDocument();
            expect(title).toHaveAttribute("id", "features-title");
        });

        it("should render each feature correctly", () => {
            renderAboutPage();
            const list = screen.getByRole("list", { name: "Project Features" });
            expect(list).toBeInTheDocument();

            const items = within(list).getAllByRole("listitem");
            expect(items.length).toBe(4);

            items.forEach((item) => {
                const title = within(item).getByRole("heading", {
                    level: 3,
                });
                expect(title).toBeInTheDocument();
                expect(item).toHaveAttribute(
                    "aria-labelledby",
                    `feature-item-${title.textContent}`,
                );

                const img = within(item).getByRole("img", {
                    hidden: true,
                });
                expect(img).toBeInTheDocument();
                expect(img).toHaveAttribute("width", "100");
                expect(img).toHaveAttribute("height", "100");
            });
        });
    });

    describe("Explore section", () => {
        it("should render the call-to-action text", () => {
            renderAboutPage();
            const exploreText = screen.getByRole("heading", {
                level: 3,
                name: /Explore the code and see how you can integrate these functionalities into your own projects!/i,
            });
            expect(exploreText).toBeInTheDocument();
            expect(exploreText).toHaveAttribute("id", "explore-title");
        });

        it("should render the GitHub link correctly", () => {
            renderAboutPage();
            const link = screen.getByRole("link", {
                name: /made by n1kford/i,
            });

            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute("href", "https://github.com/n1kFord");
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noreferrer");

            const img = within(link).getByRole("img", {
                hidden: true,
            });
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute("alt", "GitHub project page");
            expect(img).toHaveAttribute("width", "93");
            expect(img).toHaveAttribute("height", "93");
        });
    });
});
