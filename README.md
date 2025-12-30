# Meetzeen

![Meetzeen](./apps/web/app/icon.png)

**Meetzeen** is a modern, comprehensive scheduling and booking platform designed to streamline appointment management for businesses and teams. Built with performance and scalability in mind, it offers a seamless experience for both service providers and their clients.

## Features

Meetzeen comes packed with essential tools to manage your business operations efficiently:

-   **Smart Scheduling**: Flexible calendar management with day and week views.
-   **Online Booking**: Customizable booking flow for clients to schedule appointments 24/7.
-   **Team Management**: Invite team members, manage roles, and coordinate schedules.
-   **Service Management**: Organize services into categories and define custom durations and pricing.
-   **Customer CRM**: Maintain a database of your clients with history and details.
-   **Business Customization**: Tailor your public booking page with your brand colors, logo, and social links.
-   **Analytics & Metrics**: Visual insights into revenue, new clients, and appointment trends.
-   **Global Readiness**: Support for multiple timezones and currencies.
-   **Google Calendar Integration**: Sync appointments to avoid double bookings.
-   **File Management**: Secure upload and management for logos and other assets.

## Tech Stack

This project is built using a cutting-edge, type-safe stack:

-   **Frontend**: [Next.js](https://nextjs.org/) with [Tailwind CSS](https://tailwindcss.com/) and [Shadcn UI](https://ui.shadcn.com/).
-   **Backend**: [ElysiaJS](https://elysiajs.com/) for high-performance APIs.
-   **Database**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/).
-   **Authentication**: [Better Auth](https://better-auth.com/) for secure user management.
-   **Monorepo**: Managed with [Turborepo](https://turbo.build/) and [Bun](https://bun.sh/).

## Project Structure

The codebase is organized as a monorepo containing:

-   `apps/web`: The main Next.js web application.
-   `apps/backend_worker`: Background worker services.
-   `packages/api`: Core API logic and business rules.
-   `packages/auth`: Shared authentication module.
-   `packages/database`: Database schema and client.
-   `packages/ui`: Shared UI component library.
