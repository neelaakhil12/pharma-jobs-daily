'use client';

export default function WhatsAppWidget() {
  const phoneNumber = '918919278961';
  const message = 'Hello! I am visiting the Pharma Jobs Daily website and would like to get updates about latest job vacancies.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-6 z-40 flex items-center justify-center p-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
      title="Chat on WhatsApp"
    >
      {/* Ripple/Pulse Effect */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40 animate-ping -z-10 group-hover:animate-none" />
      
      {/* WhatsApp Icon */}
      <svg
        className="w-6 h-6 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.69 1.97 14.221.945 11.6.943c-5.445 0-9.87 4.372-9.874 9.802-.001 1.758.465 3.479 1.346 5.025l-.995 3.637 3.737-.978zm11.567-5.56c-.32-.16-1.89-.93-2.185-1.04-.294-.11-.51-.16-.723.16-.214.32-.83.104-1.016.32-.186.216-.373.24-.693.08-.32-.16-1.353-.5-2.577-1.6-.952-.85-1.593-1.9-1.78-2.22-.187-.32-.02-.49.14-.65.144-.14.32-.37.48-.56.16-.19.214-.32.32-.53.11-.21.055-.4-.027-.56-.083-.16-.723-1.74-.992-2.39-.262-.64-.528-.55-.723-.55-.19 0-.408-.01-.625-.01-.217 0-.57.08-.87.408-.3.32-1.148 1.12-1.148 2.73s1.175 3.17 1.34 3.39c.163.22 2.31 3.53 5.596 4.95 2.778 1.2 3.344 1.01 4.545.89 1.2-.12 2.57-.74 2.93-1.46.36-.72.36-1.34.25-1.46-.11-.12-.43-.28-.75-.44z" />
      </svg>
      
      {/* Floating tooltip */}
      <span className="absolute right-16 scale-0 group-hover:scale-100 bg-neutral-900 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg border border-neutral-800 transition-all duration-200 origin-right whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
}
