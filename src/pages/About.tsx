import { FC } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import usePageBackground from "../hooks/usePageBackground";
import {
    expressJsIcon,
    githubIcon,
    loginIcon,
    mongodbIcon,
    nodeJsIcon,
    oauthIcon,
    reactIcon,
    securityIcon,
    settingsIcon,
} from "../assets";

export const technologies: {
    label: string;
    description: string;
    icon: string;
    url: string;
}[] = [
    {
        label: "MongoDB",
        description:
            "A NoSQL database that stores data in flexible, JSON-like documents.",
        icon: mongodbIcon,
        url: "https://www.mongodb.com/docs/",
    },
    {
        label: "Express.js",
        description:
            "A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
        icon: expressJsIcon,

        url: "https://expressjs.com/",
    },
    {
        label: "React",
        description:
            "A JavaScript library for building user interfaces, maintained by Facebook. It allows developers to create large web applications that can update and render efficiently in response to data changes.",
        icon: reactIcon,
        url: "https://reactjs.org/docs/getting-started.html",
    },
    {
        label: "Node.js",
        description:
            "A JavaScript runtime built on Chrome's V8 JavaScript engine that allows developers to use JavaScript for server-side scripting, running scripts server-side to produce dynamic web page content before the page is sent to the user's web browser.",
        icon: nodeJsIcon,
        url: "https://nodejs.org/en/docs/",
    },
];

const features: { label: string; description: string; icon: string }[] = [
    {
        label: "User Registration and Login",
        description: "Secure user authentication using passwords.",
        icon: loginIcon,
    },
    {
        label: "OAuth Integration",
        description:
            "Support for third-party authentication providers like Google and GitHub.",
        icon: oauthIcon,
    },
    {
        label: "Dashboard Management",
        description:
            "Users can manage their profiles, change usernames, and passwords.",
        icon: settingsIcon,
    },
    {
        label: "Security Best Practices",
        description:
            "Implementation of best practices in authentication and data protection.",
        icon: securityIcon,
    },
];

const About: FC = () => {
    const currentBackground =
        "linear-gradient(220deg, #26434e 0%, rgba(24, 42, 51, 0.82) 100%)";

    const background = usePageBackground(currentBackground);

    return (
        <motion.main
            className="about"
            initial={{
                background: background,
            }}
            animate={{
                background: currentBackground,
            }}
            transition={{
                duration: 2,
                ease: "linear",
            }}
            aria-label="About Page"
        >
            <motion.h1
                className="about__title"
                initial={{
                    opacity: 0.3,
                }}
                whileInView={{
                    opacity: 1,
                }}
                viewport={{ once: true }}
                transition={{
                    duration: 1,
                    ease: "easeIn",
                }}
                id="about-title"
            >
                MERN AUTH
            </motion.h1>
            <motion.p
                className="about__subtitle"
                initial={{
                    opacity: 0.1,
                }}
                whileInView={{
                    opacity: 1,
                }}
                viewport={{ once: true }}
                transition={{
                    duration: 1.3,
                    ease: "easeIn",
                }}
                aria-describedby="about-title"
            >
                An Authentication System Using the MERN Stack
            </motion.p>
            <ul className="about__technologies" aria-label="Technologies">
                {technologies.map((item, i) => {
                    return (
                        <motion.li
                            key={uuidv4()}
                            className="about__technologies__item"
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                                filter: "hue-rotate(-60deg)",
                                cursor: "default",
                            }}
                            whileInView={{
                                opacity: 1,
                                scale: 1,
                                filter: "hue-rotate(0deg)",
                            }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5 * i + 1.3,
                                ease: "easeIn",
                                delay: 0.3,
                            }}
                            role="listitem"
                            aria-labelledby={`technology-item-${item.label}`}
                        >
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="about__technologies__item__link"
                                id={`technology-item-${item.label}`}
                            >
                                <img
                                    src={item.icon}
                                    alt={`${item.label} icon`}
                                    className="about__technologies__item__icon"
                                    width={128}
                                    height={128}
                                />
                                <span className="about__technologies__item__label">
                                    <b>{item.label[0]}</b>
                                    {item.label.slice(1, item.label.length)}
                                </span>
                            </a>
                        </motion.li>
                    );
                })}
            </ul>
            <section
                className="about__description"
                aria-labelledby="description-title"
            >
                <motion.h2
                    className="about__description__title"
                    initial={{
                        opacity: 0,
                    }}
                    whileInView={{
                        opacity: 1,
                    }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 1.5,
                        ease: "easeIn",
                    }}
                    id="description-title"
                >
                    What is the <b>MERN</b> Stack?
                </motion.h2>
                <ul
                    className="about__description__list"
                    aria-label="Technologies Description"
                >
                    {technologies.map((item, i) => {
                        return (
                            <motion.li
                                key={uuidv4()}
                                className="about__description__list__item"
                                initial={{
                                    opacity: 0,
                                    scale: 0.99,
                                    filter: "hue-rotate(-200deg)",
                                }}
                                whileInView={{
                                    opacity: 1,
                                    scale: 1,
                                    filter: "hue-rotate(0deg)",
                                }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5 * i + 1,
                                    ease: "easeIn",
                                    delay: 0.3,
                                }}
                                role="listitem"
                                aria-labelledby={`description-item-${item.label}`}
                            >
                                <b>{item.label}</b>: {item.description}
                            </motion.li>
                        );
                    })}
                </ul>
            </section>
            <section
                className="about__features"
                aria-labelledby="features-title"
            >
                <motion.h2
                    className="about__features__title"
                    initial={{
                        opacity: 0,
                    }}
                    whileInView={{
                        opacity: 1,
                    }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 1,
                        ease: "easeIn",
                    }}
                    id="features-title"
                >
                    Project features:
                </motion.h2>
                <ul
                    className="about__features__list"
                    aria-label="Project Features"
                >
                    {features.map((item, i) => (
                        <motion.li
                            key={item.label}
                            className="about__features__item"
                            initial={{
                                opacity: 0,
                            }}
                            whileInView={{
                                opacity: 1,
                            }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5 * i + 1.3,
                                ease: "easeInOut",
                                delay: 0.3,
                            }}
                            role="listitem"
                            aria-labelledby={`feature-item-${item.label}`}
                        >
                            <img
                                src={item.icon}
                                className="about__features__item__icon"
                                alt={`${item.label} feature icon`}
                                width={100}
                                height={100}
                                aria-hidden="true"
                            />
                            <h3
                                className="about__features__item__title"
                                id={`feature-item-${item.label}`}
                            >
                                {item.label}
                            </h3>
                            <p className="about__features__item__description">
                                {item.description}
                            </p>
                        </motion.li>
                    ))}
                </ul>
            </section>
            <section className="about__explore" aria-labelledby="explore-title">
                <motion.h3
                    className="about__explore__title"
                    initial={{
                        opacity: 0.1,
                    }}
                    whileInView={{
                        opacity: 1,
                    }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 1.3,
                        ease: "easeIn",
                    }}
                    id="explore-title"
                >
                    Explore the code and see how you can integrate these
                    functionalities into your own projects!
                </motion.h3>
                <motion.a
                    href="https://github.com/n1kFord"
                    className="about__explore__link"
                    target="_blank"
                    rel="noreferrer"
                    initial={{
                        opacity: 0,
                        scale: 0.99,
                        filter: "hue-rotate(-120deg)",
                    }}
                    whileInView={{
                        opacity: 1,
                        scale: 1,
                        filter: "hue-rotate(0deg)",
                    }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 2,
                        ease: "linear",
                    }}
                >
                    <img
                        src={githubIcon}
                        alt="GitHub project page"
                        className="about__explore__link__icon"
                        width={93}
                        height={93}
                        aria-hidden="true"
                    />
                    <span className="about__explore__link__author">
                        made by n1kford
                    </span>
                </motion.a>
            </section>
        </motion.main>
    );
};

export default About;
