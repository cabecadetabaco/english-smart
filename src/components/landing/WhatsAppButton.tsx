"use client";

import Link from "next/link";

export default function WhatsAppButton() {
  return (
    <>
      <Link
        href="https://wa.me/5511999999999?text=Ola!%20Gostaria%20de%20saber%20mais%20sobre%20as%20aulas%20de%20ingles."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
          zIndex: 999,
          textDecoration: "none",
          animation: "whatsapp-pulse 2s ease-in-out infinite",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <svg
          viewBox="0 0 32 32"
          width="30"
          height="30"
          fill="#fff"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.004 2.002c-7.732 0-14.002 6.268-14.002 13.998 0 2.468.654 4.876 1.896 6.996L2 30l7.194-1.874A13.94 13.94 0 0 0 16.004 30c7.732 0 14.002-6.268 14.002-13.998S23.736 2.002 16.004 2.002zm0 25.596a11.56 11.56 0 0 1-5.894-1.612l-.424-.252-4.37 1.146 1.166-4.258-.276-.44A11.54 11.54 0 0 1 4.4 16c0-6.394 5.206-11.598 11.604-11.598 6.396 0 11.602 5.204 11.602 11.598 0 6.396-5.206 11.598-11.602 11.598zm6.362-8.686c-.348-.174-2.066-1.02-2.386-1.136-.32-.118-.552-.174-.786.174-.232.348-.904 1.136-1.108 1.37-.204.232-.408.262-.756.088-.348-.174-1.47-.542-2.8-1.726-1.034-.922-1.732-2.062-1.936-2.41-.204-.348-.022-.536.154-.71.158-.156.348-.408.522-.612.174-.204.232-.348.348-.58.116-.232.058-.436-.03-.61-.088-.174-.786-1.894-1.078-2.594-.284-.68-.572-.588-.786-.598l-.668-.012c-.232 0-.61.088-.928.436-.32.348-1.218 1.19-1.218 2.904 0 1.712 1.246 3.366 1.42 3.598.174.232 2.454 3.748 5.946 5.256.832.358 1.482.572 1.988.732.836.266 1.596.228 2.198.138.67-.1 2.066-.844 2.358-1.66.29-.816.29-1.516.204-1.66-.088-.146-.32-.232-.668-.408z" />
        </svg>
      </Link>

      <style>{`
        @keyframes whatsapp-pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,0.4); }
          50% { box-shadow: 0 4px 40px rgba(37,211,102,0.7); }
        }
      `}</style>
    </>
  );
}
