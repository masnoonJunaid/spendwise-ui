# Next.js & HeroUI Template


## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/heroui-inc/next-app-template
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).


# SpendWise UI: Your Smart Spending Companion

SpendWise UI is a modern, user-friendly web application designed to help you track, manage, and optimize your spending habits. Built with cutting-edge technologies, SpendWise UI offers a seamless experience across devices, empowering you to take control of your finances.

## Key Features

*   **Expense Tracking:** Effortlessly log your daily expenses with detailed categories and descriptions.
*   **Budgeting:** Set monthly budgets and monitor your progress to stay on track.
*   **Spending Analysis:** Gain insights into your spending patterns with interactive charts and reports.
*   **Customizable Categories:** Tailor expense categories to match your unique spending style.
*   **Secure and Private:** Your financial data is handled with the utmost security and privacy.
*   **Responsive Design:** Access SpendWise UI from any device, be it desktop, tablet, or mobile.

## Technologies Used

SpendWise UI leverages a powerful stack of modern web development technologies:

*   **Next.js 14:**
    *   **Description:** A React framework for building fast, user-friendly web applications. It provides features like server-side rendering, static site generation, and API routes.
    *   **Why We Use It:** Enhances performance, SEO, and developer experience.
    *   **Link:** [https://nextjs.org/](https://nextjs.org/)
*   **HeroUI v2:**
    *   **Description:** A component library that provides pre-built, customizable UI components.
    *   **Why We Use It:** Speeds up development and ensures a consistent, high-quality user interface.
    *   **Link:** [https://heroui.com/](https://heroui.com/)
*   **Tailwind CSS:**
    *   **Description:** A utility-first CSS framework for rapidly building custom designs.
    *   **Why We Use It:** Enables quick styling and ensures a responsive design system.
    *   **Link:** [https://tailwindcss.com/](https://tailwindcss.com/)
*   **Tailwind Variants:**
    *   **Description:** A library for creating reusable component variants with Tailwind CSS.
    *   **Why We Use It:** Simplifies the management of component styles and themes.
    *   **Link:** [https://tailwind-variants.org/](https://tailwind-variants.org/)
*   **TypeScript:**
    *   **Description:** A statically typed superset of JavaScript that adds optional types.
    *   **Why We Use It:** Improves code quality, maintainability, and developer productivity.
    *   **Link:** [https://www.typescriptlang.org/](https://www.typescriptlang.org/)
*   **Framer Motion:**
    *   **Description:** A production-ready animation library for React.
    *   **Why We Use It:** Adds smooth, engaging animations to enhance the user experience.
    *   **Link:** [https://www.framer.com/motion/](https://www.framer.com/motion/)
*   **next-themes:**
    *   **Description:** A library for adding dark mode and theme switching to Next.js applications.
    *   **Why We Use It:** Allows users to customize the app's appearance to their preference.
    *   **Link:** [https://github.com/pacocoursey/next-themes](https://github.com/pacocoursey/next-themes)
*   **redux-toolkit:**
    *   **Description:** The official, opinionated, and recommended approach for writing Redux logic in JavaScript.
    *   **Why We Use It:**  simplifies store setup, reduces boilerplate, and encourages best practices.
    *   **Link:** [https://redux-toolkit.js.org/](https://redux-toolkit.js.org/)


## Project Structure

The SpendWise UI project follows a well-organized structure to ensure scalability and maintainability. Here's a breakdown of the key directories:


**Explanation of Key Directories:**

*   **`app/`:** The heart of the Next.js application, containing all the pages and routing logic.
    *   `(auth)`: Contains all the pages related to authentication.
    *   `(dashboard)`: Contains all the pages related to the dashboard.
*   **`components/`:** Houses all the reusable UI components.
    *   `ui/`: Contains components from the HeroUI library.
    *   `common/`: Contains components that are commonly used across the application.
*   **`lib/`:** Contains utility functions and helper modules.
*   **`public/`:** Stores static assets like images, fonts, etc.
*   **`styles/`:** Contains global CSS and Tailwind configurations.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    ```
2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    * Create a `.env.local` file in the root directory.
    * Add any necessary environment variables.

4.  **Run the development server:**

    ```bash
    pnpm run dev
    ```

5.  Open http://localhost:3000 with your browser to see the result.

## Contributing

We welcome contributions to SpendWise UI! If you're interested in helping improve the project, please read our contribution guidelines.

## License

This project is licensed under the MIT License.

