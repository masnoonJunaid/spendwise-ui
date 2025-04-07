import { addToast } from "@heroui/react";

export const displayToast = (title: string, description: string, radius: "sm" | "md" | "lg" | "none" | "full" | undefined, color: "default" | "foreground" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined) => {
    addToast({
        hideIcon: true,
        title: title,
        description: description,
        radius: radius,
        color:color,
        // classNames: {
        //     closeButton: "flex gap-2 opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
        // },
        // closeIcon: (
        //     <svg
        //         fill="none"
        //         height="32"
        //         stroke="currentColor"
        //         strokeLinecap="round"
        //         strokeLinejoin="round"
        //         strokeWidth="2"
        //         viewBox="0 0 24 24"
        //         width="32"
        //     >
        //         <path d="M18 6 6 18" />
        //         <path d="m6 6 12 12" />
        //     </svg>
        // ),
    })
}

export function formatDateToReadable(dateString:string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }