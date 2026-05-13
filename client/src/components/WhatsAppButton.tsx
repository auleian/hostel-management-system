import { useLocation } from "react-router-dom";

export default function WhatsAppButton() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;

  const number = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.replace(/[^\d]/g, "");
  if (!number) return null;

  const message = (import.meta.env.VITE_WHATSAPP_MESSAGE as string | undefined) || "";
  const href = `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#1ebe57] focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
    >
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.602 3.41 4.555 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.535-1.39.157-.336.215-.71.215-1.06 0-.71-1.018-1.118-1.59-1.418-.143-.058-.342-.157-.486-.157zm-3.182 6.05a8.95 8.95 0 0 1-4.557-1.245l-.327-.195-3.382.888.9-3.297-.213-.34a8.929 8.929 0 0 1-1.367-4.762c0-4.93 4.02-8.95 8.95-8.95a8.892 8.892 0 0 1 6.328 2.624 8.892 8.892 0 0 1 2.62 6.33c-.001 4.93-4.02 8.948-8.95 8.948zm7.617-16.568A10.706 10.706 0 0 0 15.928 3.5C9.973 3.5 5.13 8.342 5.13 14.297c0 1.902.498 3.762 1.442 5.4l-1.533 5.6 5.733-1.504a10.78 10.78 0 0 0 5.156 1.31h.005c5.953 0 10.797-4.842 10.8-10.795a10.74 10.74 0 0 0-3.17-7.62z" />
      </svg>
    </a>
  );
}
