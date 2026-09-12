"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "../lib/supabase/dto";
import { useTelegram } from "../components/TelegramBridge";

type Country = {
  name: string;
  flag: string;
  code: string;
};

const countries: Country[] = [
  { name: "السعودية", flag: "🇸🇦", code: "+966" },
  { name: "اليمن", flag: "🇾🇪", code: "+967" },
  { name: "الإمارات العربية المتحدة", flag: "🇦🇪", code: "+971" },
  { name: "الكويت", flag: "🇰🇼", code: "+965" },
  { name: "قطر", flag: "🇶🇦", code: "+974" },
  { name: "البحرين", flag: "🇧🇭", code: "+973" },
  { name: "عُمان", flag: "🇴🇲", code: "+968" },
  { name: "الأردن", flag: "🇯🇴", code: "+962" },
  { name: "مصر", flag: "🇪🇬", code: "+20" },
  { name: "فلسطين", flag: "🇵🇸", code: "+970" },
  { name: "لبنان", flag: "🇱🇧", code: "+961" },
  { name: "سوريا", flag: "🇸🇾", code: "+963" },
  { name: "العراق", flag: "🇮🇶", code: "+964" },
  { name: "المغرب", flag: "🇲🇦", code: "+212" },
  { name: "الجزائر", flag: "🇩🇿", code: "+213" },
  { name: "تونس", flag: "🇹🇳", code: "+216" },
  { name: "ليبيا", flag: "🇱🇾", code: "+218" },
  { name: "السودان", flag: "🇸🇩", code: "+249" },
  { name: "الصومال", flag: "🇸🇴", code: "+252" },
  { name: "جيبوتي", flag: "🇩🇯", code: "+253" },
  { name: "موريتانيا", flag: "🇲🇷", code: "+222" },
  { name: "جزر القمر", flag: "🇰🇲", code: "+269" },
  { name: "الهند", flag: "🇮🇳", code: "+91" },
  { name: "باكستان", flag: "🇵🇰", code: "+92" },
  { name: "بنغلاديش", flag: "🇧🇩", code: "+880" },
  { name: "تركيا", flag: "🇹🇷", code: "+90" },
  { name: "جورجيا", flag: "🇬🇪", code: "+995" },
  { name: "أذربيجان", flag: "🇦🇿", code: "+994" },
  { name: "كازاخستان", flag: "🇰🇿", code: "+7" },
  { name: "قيرغيزستان", flag: "🇰🇬", code: "+996" },
  { name: "أوزبكستان", flag: "🇺🇿", code: "+998" },
  { name: "روسيا", flag: "🇷🇺", code: "+7" },
  { name: "أوكرانيا", flag: "🇺🇦", code: "+380" },
  { name: "الصين", flag: "🇨🇳", code: "+86" },
  { name: "اليابان", flag: "🇯🇵", code: "+81" },
  { name: "كوريا الجنوبية", flag: "🇰🇷", code: "+82" },
  { name: "إندونيسيا", flag: "🇮🇩", code: "+62" },
  { name: "ماليزيا", flag: "🇲🇾", code: "+60" },
  { name: "سنغافورة", flag: "🇸🇬", code: "+65" },
  { name: "تايلاند", flag: "🇹🇭", code: "+66" },
  { name: "الفلبين", flag: "🇵🇭", code: "+63" },
  { name: "فيتنام", flag: "🇻🇳", code: "+84" },
  { name: "أستراليا", flag: "🇦🇺", code: "+61" },
  { name: "نيوزيلندا", flag: "🇳🇿", code: "+64" },
  { name: "الولايات المتحدة", flag: "🇺🇸", code: "+1" },
  { name: "كندا", flag: "🇨🇦", code: "+1" },
  { name: "المملكة المتحدة", flag: "🇬🇧", code: "+44" },
  { name: "فرنسا", flag: "🇫🇷", code: "+33" },
  { name: "ألمانيا", flag: "🇩🇪", code: "+49" },
  { name: "إيطاليا", flag: "🇮🇹", code: "+39" },
  { name: "إسبانيا", flag: "🇪🇸", code: "+34" },
  { name: "البرتغال", flag: "🇵🇹", code: "+351" },
  { name: "هولندا", flag: "🇳🇱", code: "+31" },
  { name: "بلجيكا", flag: "🇧🇪", code: "+32" },
  { name: "سويسرا", flag: "🇨🇭", code: "+41" },
  { name: "النمسا", flag: "🇦🇹", code: "+43" },
  { name: "السويد", flag: "🇸🇪", code: "+46" },
  { name: "النرويج", flag: "🇳🇴", code: "+47" },
  { name: "الدنمارك", flag: "🇩🇰", code: "+45" },
  { name: "فنلندا", flag: "🇫🇮", code: "+358" },
  { name: "بولندا", flag: "🇵🇱", code: "+48" },
  { name: "رومانيا", flag: "🇷🇴", code: "+40" },
  { name: "اليونان", flag: "🇬🇷", code: "+30" },
  { name: "التشيك", flag: "🇨🇿", code: "+420" },
  { name: "سلوفاكيا", flag: "🇸🇰", code: "+421" },
  { name: "المجر", flag: "🇭🇺", code: "+36" },
  { name: "بلغاريا", flag: "🇧🇬", code: "+359" },
  { name: "صربيا", flag: "🇷🇸", code: "+381" },
  { name: "كرواتيا", flag: "🇭🇷", code: "+385" },
  { name: "سلوفينيا", flag: "🇸🇮", code: "+386" },
  { name: "ألبانيا", flag: "🇦🇱", code: "+355" },
  { name: "البوسنة والهرسك", flag: "🇧🇦", code: "+387" },
  { name: "الجبل الأسود", flag: "🇲🇪", code: "+382" },
  { name: "مقدونيا الشمالية", flag: "🇲🇰", code: "+389" },
  { name: "إيرلندا", flag: "🇮🇪", code: "+353" },
  { name: "أيسلندا", flag: "🇮🇸", code: "+354" },
  { name: "مالطا", flag: "🇲🇹", code: "+356" },
  { name: "قبرص", flag: "🇨🇾", code: "+357" },
  { name: "إيران", flag: "🇮🇷", code: "+98" },
  { name: "أفغانستان", flag: "🇦🇫", code: "+93" },
  { name: "نيبال", flag: "🇳🇵", code: "+977" },
  { name: "سريلانكا", flag: "🇱🇰", code: "+94" },
  { name: "جزر المالديف", flag: "🇲🇻", code: "+960" },
  { name: "إثيوبيا", flag: "🇪🇹", code: "+251" },
  { name: "كينيا", flag: "🇰🇪", code: "+254" },
  { name: "تنزانيا", flag: "🇹🇿", code: "+255" },
  { name: "أوغندا", flag: "🇺🇬", code: "+256" },
  { name: "غانا", flag: "🇬🇭", code: "+233" },
  { name: "نيجيريا", flag: "🇳🇬", code: "+234" },
  { name: "جنوب أفريقيا", flag: "🇿🇦", code: "+27" },
  { name: "رواندا", flag: "🇷🇼", code: "+250" },
  { name: "زامبيا", flag: "🇿🇲", code: "+260" },
  { name: "زيمبابوي", flag: "🇿🇼", code: "+263" },
  { name: "البرازيل", flag: "🇧🇷", code: "+55" },
  { name: "المكسيك", flag: "🇲🇽", code: "+52" },
  { name: "الأرجنتين", flag: "🇦🇷", code: "+54" },
  { name: "تشيلي", flag: "🇨🇱", code: "+56" },
  { name: "كولومبيا", flag: "🇨🇴", code: "+57" },
  { name: "بيرو", flag: "🇵🇪", code: "+51" },
  { name: "فنزويلا", flag: "🇻🇪", code: "+58" },
];

const skills = [
  "القيادة",
  "إدارة الفريق",
  "التنظيم",
  "التواصل",
  "العمل الجماعي",
  "إدارة الوقت",
  "التخطيط",
  "حل المشكلات",
  "البحث",
  "كتابة المحتوى",
  "التصميم",
  "التصوير",
  "المونتاج",
  "صناعة المحتوى",
  "التسويق",
  "العلاقات العامة",
  "إدارة الحسابات",
  "إدارة المشاريع",
  "التعليم والتدريب",
  "الترجمة",
  "إدخال البيانات",
  "تحليل البيانات",
  "البرمجة",
  "التقنية",
  "الذكاء الاصطناعي",
  "التفاوض",
  "التقديم والإلقاء",
];

const tools = [
  "Canva",
  "Photoshop",
  "Illustrator",
  "Premiere Pro",
  "After Effects",
  "DaVinci Resolve",
  "CapCut",
  "Audacity",
  "Figma",
  "Microsoft Word",
  "Microsoft Excel",
  "Microsoft PowerPoint",
  "Google Docs",
  "Google Sheets",
  "Google Forms",
  "Notion",
  "Trello",
  "Discord",
  "Telegram",
  "GitHub",
  "Visual Studio Code",
  "ChatGPT",
  "Google Gemini",
  "Microsoft Copilot",
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [submitting, setSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const [inviteCode] = useState(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    const code = params.get("invite")?.trim().toUpperCase();
    if (code) return code;
    const tgParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param
      ?.trim()
      .toUpperCase();
    return tgParam ?? "";
  });

  const telegramState = useTelegram();

  const [countryPicker, setCountryPicker] = useState<
    "nationality" | "residence" | "phone" | null
  >(null);

  const [countrySearch, setCountrySearch] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    fatherName: "",
    familyName: "",
    email: "",
    phone: "",
    phoneCountry: null as Country | null,
    birthDate: "",
    nationality: null as Country | null,
    residence: null as Country | null,
    hasCv: "",
    cvName: "",
    skills: [] as string[],
    tools: [] as string[],
  });

  const filteredCountries = countries.filter((country) =>
    country.name
      .toLocaleLowerCase("ar")
      .includes(countrySearch.toLocaleLowerCase("ar").trim())
  );

  const updateField = (
    field:
      | "firstName"
      | "fatherName"
      | "familyName"
      | "email"
      | "phone"
      | "birthDate"
      | "hasCv"
      | "cvName",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleItem = (
    field: "skills" | "tools",
    value: string
  ) => {
    setForm((prev) => {
      const current = prev[field];

      if (current.includes(value)) {
        return {
          ...prev,
          [field]: current.filter((item) => item !== value),
        };
      }

      return {
        ...prev,
        [field]: [...current, value],
      };
    });
  };

  const chooseCountry = (country: Country) => {
    if (countryPicker === "nationality") {
      setForm((prev) => ({
        ...prev,
        nationality: country,
      }));
    }

    if (countryPicker === "residence") {
      setForm((prev) => ({
        ...prev,
        residence: country,
      }));
    }

    if (countryPicker === "phone") {
      setForm((prev) => ({
        ...prev,
        phoneCountry: country,
      }));
    }

    setCountryPicker(null);
    setCountrySearch("");
  };

  const nextStep = () => {
    setStep((current) => Math.min(current + 1, 3));
  };

  const previousStep = () => {
    setStep((current) => Math.max(current - 1, 1));
  };

  async function handleSubmit() {
    if (submitting) return;

    setRegisterError("");
    setSubmitting(true);

    const phone = form.phoneCountry
      ? `${form.phoneCountry.code} ${form.phone}`.trim()
      : form.phone.trim();

    const result = await registerUser({
      code: inviteCode,
      firstName: form.firstName,
      fatherName: form.fatherName,
      familyName: form.familyName,
      email: form.email,
      phone,
      birthDate: form.birthDate,
      nationality: form.nationality?.name ?? "",
      residence: form.residence?.name ?? "",
      countryCode: form.phoneCountry?.code,
      skills: form.skills,
      tools: form.tools,
      telegramId:
        telegramState.status === "ready" && telegramState.telegram
          ? telegramState.telegram.user.id
          : undefined,
      telegramUsername:
        telegramState.status === "ready" && telegramState.telegram
          ? telegramState.telegram.user.username
          : undefined,
    });

    if (result.demoMode) {
      setSubmitting(false);
      alert("الخطوة التالية ستكون اتفاقية التطوع");
      return;
    }

    setSubmitting(false);

    if (result.id) {
      router.push(`/welcome?id=${encodeURIComponent(result.id)}`);
      return;
    }

    setRegisterError(result.error || "تعذر إتمام التسجيل. حاول مرة أخرى.");
  }

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-molim-soft text-molim-foreground"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 top-20 h-48 w-48 rotate-12 border-2 border-[#ed542f]/10" />

        <div className="absolute left-[-30px] top-72 h-32 w-32 -rotate-12 border border-[#202124]/10" />

        <div
          className="absolute left-8 top-36 h-24 w-24 border border-[#ed542f]/10"
          style={{
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />

        <div className="absolute right-0 bottom-24 h-px w-52 rotate-[20deg] bg-[#ed542f]/10" />
      </div>

      <div className="relative mx-auto max-w-md px-5 pb-12 pt-7">
        <header className="flex items-center justify-between border-b border-[#202124]/10 pb-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center bg-[#ed542f] text-xl font-black text-white">
              م
            </div>

            <div>
              <p className="text-[11px] text-molim-muted">منصة الفريق</p>
              <h1 className="text-lg font-black text-molim-foreground">مُلم</h1>
            </div>
          </Link>

          <span className="text-xs text-molim-muted">
            الخطوة {step} من 3
          </span>
        </header>

        <div className="mt-5 flex gap-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-1 flex-1 ${
                item <= step ? "bg-[#ed542f]" : "bg-molim-soft"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <section className="mt-9">
            <p className="text-sm font-bold text-[#ed542f]">
              البيانات الأساسية
            </p>

            <h2 className="mt-2 text-3xl font-black leading-tight text-molim-foreground">
              عرفنا بنفسك 👋
            </h2>

            <p className="mt-3 text-sm leading-6 text-molim-muted">
              أدخل بياناتك الأساسية بدقة، وستُستخدم لإدارة حسابك داخل
              فريق مُلم وإصدار الشهادات والمستندات عند استحقاقها.
            </p>

            <div className="mt-8 space-y-4">
              <Input
                label="الاسم الأول"
                value={form.firstName}
                onChange={(value) => updateField("firstName", value)}
                placeholder="الاسم الأول"
              />

              <Input
                label="اسم الأب"
                value={form.fatherName}
                onChange={(value) => updateField("fatherName", value)}
                placeholder="اسم الأب"
              />

              <Input
                label="اسم العائلة"
                value={form.familyName}
                onChange={(value) => updateField("familyName", value)}
                placeholder="اسم العائلة"
              />

              <Input
                label="البريد الإلكتروني"
                type="email"
                value={form.email}
                onChange={(value) => updateField("email", value)}
                placeholder="example@email.com"
              />

              <PhoneField
                country={form.phoneCountry}
                phone={form.phone}
                onCountryClick={() => {
                  setCountryPicker("phone");
                  setCountrySearch("");
                }}
                onPhoneChange={(value) =>
                  updateField("phone", value)
                }
              />

              <Input
                label="تاريخ الميلاد"
                type="date"
                value={form.birthDate}
                onChange={(value) => updateField("birthDate", value)}
              />

              <CountryField
                label="الجنسية"
                value={form.nationality}
                onClick={() => {
                  setCountryPicker("nationality");
                  setCountrySearch("");
                }}
              />

              <CountryField
                label="بلد الإقامة"
                value={form.residence}
                onClick={() => {
                  setCountryPicker("residence");
                  setCountrySearch("");
                }}
              />
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="mt-7 flex h-14 w-full items-center justify-center bg-[#ed542f] text-sm font-black text-white"
            >
              متابعة
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="mt-9">
            <p className="text-sm font-bold text-[#ed542f]">
              مهاراتك وأدواتك
            </p>

            <h2 className="mt-2 text-3xl font-black leading-tight text-molim-foreground">
              وش تقدر تقدم لمُلم؟ 🛠️
            </h2>

            <p className="mt-3 text-sm leading-6 text-molim-muted">
              اختر الأشياء التي تجيدها فعلًا. لا تحتاج إلى اختيار كل
              شيء، اختر ما يناسبك فقط.
            </p>

            <div className="mt-8">
              <p className="mb-3 text-sm font-black text-molim-foreground">
                المهارات
              </p>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => {
                  const selected = form.skills.includes(skill);

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleItem("skills", skill)}
                      className={`border px-3 py-2 text-xs font-semibold transition ${
                        selected
                          ? "border-[#ed542f] bg-[#ed542f] text-white"
                          : "border-molim bg-molim-soft text-molim-foreground"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-black text-molim-foreground">
                الأدوات والبرامج
              </p>

              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => {
                  const selected = form.tools.includes(tool);

                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleItem("tools", tool)}
                      className={`border px-3 py-2 text-xs font-semibold transition ${
                        selected
                          ? "border-[#ed542f] bg-[#ed542f] text-white"
                          : "border-molim bg-molim-soft text-molim-foreground"
                      }`}
                    >
                      {tool}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-black text-molim-foreground">
                السيرة الذاتية
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateField("hasCv", "yes")}
                  className={`border p-4 text-sm font-bold ${
                    form.hasCv === "yes"
                      ? "border-[#ed542f] bg-[#ed542f]/5 text-[#ed542f]"
                      : "border-molim bg-molim-soft"
                  }`}
                >
                  نعم، لدي CV
                </button>

                <button
                  type="button"
                  onClick={() => updateField("hasCv", "no")}
                  className={`border p-4 text-sm font-bold ${
                    form.hasCv === "no"
                      ? "border-[#ed542f] bg-[#ed542f]/5 text-[#ed542f]"
                      : "border-molim bg-molim-soft"
                  }`}
                >
                  لا أملك CV
                </button>
              </div>

              {form.hasCv === "yes" && (
                <label className="mt-3 block cursor-pointer border border-dashed border-molim bg-molim-soft p-5 text-center">
                  <span className="block text-sm font-black text-molim-foreground">
                    📎 رفع السيرة الذاتية
                  </span>

                  <span className="mt-1 block text-xs text-molim-muted">
                    PDF أو ملف مستند
                  </span>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(event) =>
                      updateField(
                        "cvName",
                        event.target.files?.[0]?.name ?? ""
                      )
                    }
                  />

                  {form.cvName && (
                    <span className="mt-3 block text-xs font-bold text-[#ed542f]">
                      {form.cvName}
                    </span>
                  )}
                </label>
              )}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={previousStep}
                className="h-14 border border-molim bg-molim-soft text-sm font-black text-molim-foreground"
              >
                رجوع
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="h-14 bg-[#ed542f] text-sm font-black text-white"
              >
                متابعة
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="mt-9">
            <p className="text-sm font-bold text-[#ed542f]">
              مراجعة البيانات
            </p>

            <h2 className="mt-2 text-3xl font-black leading-tight text-molim-foreground">
              تأكد من بياناتك
            </h2>

            <p className="mt-3 text-sm leading-6 text-molim-muted">
              راجع المعلومات قبل الانتقال إلى اتفاقية التطوع.
            </p>

            <div className="mt-8 space-y-2">
              <InfoRow
                label="الاسم"
                value={`${form.firstName} ${form.fatherName} ${form.familyName}`.trim()}
              />

              <InfoRow
                label="البريد الإلكتروني"
                value={form.email || "—"}
              />

              <InfoRow
                label="رقم الهاتف"
                value={
                  form.phoneCountry
                    ? `${form.phoneCountry.flag} ${form.phoneCountry.code} ${form.phone}`.trim()
                    : form.phone || "—"
                }
              />

              <InfoRow
                label="تاريخ الميلاد"
                value={form.birthDate || "—"}
              />

              <InfoRow
                label="الجنسية"
                value={
                  form.nationality
                    ? `${form.nationality.flag} ${form.nationality.name}`
                    : "—"
                }
              />

              <InfoRow
                label="بلد الإقامة"
                value={
                  form.residence
                    ? `${form.residence.flag} ${form.residence.name}`
                    : "—"
                }
              />

              <InfoRow
                label="المهارات"
                value={
                  form.skills.length > 0
                    ? `${form.skills.length} مهارة مختارة`
                    : "لم يتم اختيار مهارات"
                }
              />

              <InfoRow
                label="الأدوات والبرامج"
                value={
                  form.tools.length > 0
                    ? `${form.tools.length} أداة مختارة`
                    : "لم يتم اختيار أدوات"
                }
              />

              <InfoRow
                label="السيرة الذاتية"
                value={
                  form.hasCv === "yes"
                    ? form.cvName || "سيتم رفعها"
                    : "لا يوجد"
                }
              />
            </div>

            <div className="mt-6 border border-[#ed542f]/20 bg-[#ed542f]/5 p-4">
              <p className="text-xs font-black text-molim-foreground">
                🔐 خصوصية بياناتك
              </p>

              <p className="mt-1 text-xs leading-6 text-molim-muted">
                بياناتك مخصصة لإدارة عضويتك في مُلم ولن يتم عرض
                المعلومات الخاصة مثل رقم الهاتف أو البريد الإلكتروني
                لأعضاء الفريق الآخرين.
              </p>
            </div>

            {registerError && (
              <p className="mt-4 bg-red-50 p-3 text-xs font-semibold text-red-600">
                {registerError}
              </p>
            )}

            <div className="mt-7 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={previousStep}
                className="h-14 border border-molim bg-molim-soft text-sm font-black text-molim-foreground"
              >
                تعديل
              </button>

              <button
                type="button"
                disabled={submitting}
                className="h-14 bg-[#ed542f] text-sm font-black text-white disabled:cursor-wait disabled:opacity-70"
                onClick={handleSubmit}
              >
                {submitting ? "جاري التسجيل..." : "الانتقال للاتفاقية"}
              </button>
            </div>
          </section>
        )}

        <footer className="mt-10 border-t border-molim pt-6 text-center">
          <p className="text-[11px] text-molim-muted">
            مُلم — إدارة فريقك بشكل أبسط وآمن وسلس
          </p>
        </footer>
      </div>

      {countryPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-5">
          <div className="max-h-[85vh] w-full max-w-md overflow-hidden border border-molim bg-molim-soft shadow-2xl sm:max-h-[80vh]">
            <div className="border-b border-molim bg-molim-soft p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-molim-muted">
                    اختيار الدولة
                  </p>

                  <h3 className="mt-1 text-lg font-black text-molim-foreground">
                    {countryPicker === "nationality"
                      ? "اختر جنسيتك"
                      : countryPicker === "residence"
                        ? "اختر بلد إقامتك"
                        : "اختر رمز الدولة"}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCountryPicker(null);
                    setCountrySearch("");
                  }}
                  className="flex h-9 w-9 items-center justify-center border border-molim text-lg text-molim-muted"
                  aria-label="إغلاق"
                >
                  ×
                </button>
              </div>

              <div className="relative mt-4">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-molim-muted">
                  🔍
                </span>

                <input
                  autoFocus
                  type="text"
                  value={countrySearch}
                  onChange={(event) =>
                    setCountrySearch(event.target.value)
                  }
                  placeholder="ابحث عن دولة..."
                  className="h-12 w-full border border-molim bg-molim-surface px-11 pl-4 text-sm outline-none focus:border-[#ed542f]"
                />
              </div>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-3">
              {filteredCountries.length > 0 ? (
                <div className="space-y-1">
                  {filteredCountries.map((country) => (
                    <button
                      key={`${country.flag}-${country.code}-${country.name}`}
                      type="button"
                      onClick={() => chooseCountry(country)}
                      className="flex w-full items-center gap-3 border border-transparent bg-molim-soft px-4 py-3 text-right transition hover:border-[#ed542f]/30 hover:bg-molim-surface"
                    >
                      <span className="text-2xl">
                        {country.flag}
                      </span>

                      <span className="flex-1 text-sm font-semibold text-molim-foreground">
                        {country.name}
                      </span>

                      <span className="text-sm font-bold text-molim-muted">
                        {country.code}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-bold text-molim-foreground">
                    لا توجد دولة مطابقة
                  </p>

                  <p className="mt-1 text-xs text-molim-muted">
                    جرّب البحث باسم آخر.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-molim-foreground">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-14 w-full border border-molim bg-molim-soft px-4 text-sm text-molim-foreground outline-none transition placeholder:text-molim-muted focus:border-[#ed542f]"
      />
    </label>
  );
}

function PhoneField({
  country,
  phone,
  onCountryClick,
  onPhoneChange,
}: {
  country: Country | null;
  phone: string;
  onCountryClick: () => void;
  onPhoneChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-molim-foreground">
        رقم الهاتف
      </p>

      <div className="flex gap-2" dir="ltr">
        <button
          type="button"
          onClick={onCountryClick}
          className="flex h-14 w-[145px] shrink-0 items-center justify-center gap-2 border border-molim bg-molim-soft px-3 text-sm transition hover:border-[#ed542f]"
        >
          {country ? (
            <>
              <span className="text-xl">{country.flag}</span>
              <span className="font-bold text-molim-foreground">
                {country.code}
              </span>
            </>
          ) : (
            <span className="text-molim-muted">رمز الدولة</span>
          )}

          <span className="text-molim-muted">⌄</span>
        </button>

        <input
          type="tel"
          value={phone}
          onChange={(event) =>
            onPhoneChange(
              event.target.value.replace(/[^\d\s-]/g, "")
            )
          }
          placeholder="05xxxxxxxx"
          className="h-14 min-w-0 flex-1 border border-molim bg-molim-soft px-4 text-sm text-molim-foreground outline-none transition placeholder:text-molim-muted focus:border-[#ed542f]"
        />
      </div>
    </div>
  );
}

function CountryField({
  label,
  value,
  onClick,
}: {
  label: string;
  value: Country | null;
  onClick: () => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-molim-foreground">
        {label}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="flex h-14 w-full items-center border border-molim bg-molim-soft px-4 text-right transition hover:border-[#ed542f]"
      >
        {value ? (
          <>
            <span className="ml-3 text-2xl">{value.flag}</span>

            <span className="text-sm font-semibold text-molim-foreground">
              {value.name}
            </span>
          </>
        ) : (
          <span className="text-sm text-molim-muted">
            اختر {label}
          </span>
        )}

        <span className="mr-auto text-lg text-molim-muted">
          ←
        </span>
      </button>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-molim bg-molim-soft p-4">
      <p className="text-[11px] text-molim-muted">{label}</p>

      <p className="mt-1 break-words text-sm font-bold text-molim-foreground">
        {value}
      </p>
    </div>
  );
}