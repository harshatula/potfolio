import { LOCALIZATION } from "../localization";
import { Mail, Linkedin, Github, FileDown } from "lucide-react";

interface ContactSectionProps {
  currentLang: "en" | "te";
}

export default function ContactSection({ currentLang }: ContactSectionProps) {
  const t = LOCALIZATION[currentLang];

  const socials = [
    {
      name: "Email",
      val: "harshapranaytula@gmail.com",
      url: "mailto:harshapranaytula@gmail.com",
      icon: Mail,
      desc: currentLang === "en" ? "Direct communication channel" : "ప్రత్యక్ష ఈమెయిల్ మార్గం"
    },
    {
      name: "LinkedIn",
      val: "harsha-pranay",
      url: "https://linkedin.com/in/harsha-pranay", // simulated standard format matches email
      icon: Linkedin,
      desc: currentLang === "en" ? "Professional corporate uplink" : "వృత్తిపరమైన లింక్డ్ఇన్ నెట్‌వర్క్"
    },
    {
      name: "GitHub",
      val: "@harshapranaytula",
      url: "https://github.com/harshapranaytula",
      icon: Github,
      desc: currentLang === "en" ? "Compiled repositories directory" : "నా కోడ్ రిపోజిటరీలు"
    },
    {
      name: "Resume",
      val: "resume.pdf",
      url: "https://harshapranaytula.github.io/portfolio/resume.pdf",
      icon: FileDown,
      desc: currentLang === "en" ? "Technical qualifications document" : "సాంకేతిక అర్హతల పత్రం"
    }
  ];

  return (
    <section id="contact" className="relative py-28 px-6 max-w-7xl mx-auto select-none overflow-hidden">
      
      {/* Decorative center background light */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[700px] h-[350px] rounded-t-full bg-blue-500/5 blur-3xl pointer-events-none -z-10 animate-glow-pulse"></div>

      {/* Network Endpoints centered container */}
      <div className="max-w-4xl mx-auto w-full mt-8 space-y-12">
        
        <div className="space-y-3 text-center">
          <span className="text-[8px] font-mono tracking-widest text-blue-400 uppercase block">06 . NETWORK ENDPOINTS</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-[#E0E0E0] tracking-[0.1em] uppercase">{t.contactTitle}</h2>
          <p className="text-[11px] font-mono tracking-wider text-neutral-400 max-w-xl mx-auto uppercase">
            {t.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-4.5 border border-white/10 bg-white/5 hover:border-blue-500/30 cursor-pointer transition-all duration-300 text-left"
            >
              <div className="p-3.5 bg-white/5 border border-white/10 text-neutral-400 group-hover:text-blue-400 transition-all duration-300 shrink-0">
                <social.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8px] font-mono uppercase text-neutral-500 tracking-widest block">
                  {social.name}
                </span>
                <span className="text-xs font-mono tracking-wider text-white block truncate mt-0.5 uppercase">
                  {social.val}
                </span>
                <span className="text-[10px] text-neutral-450 truncate block mt-0.5 font-light">
                  {social.desc}
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
