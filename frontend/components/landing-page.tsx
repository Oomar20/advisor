import { BookingWidget } from "@/components/booking-widget";

const topIcons = [
  {
    alt: "lamp",
    src: "https://www.figma.com/api/mcp/asset/851261ad-7162-43fe-9a08-bcc465d8e68f",
  },
  {
    alt: "message",
    src: "https://www.figma.com/api/mcp/asset/7ad03e86-359b-48a1-bce4-c0df376f87a7",
  },
  {
    alt: "bell",
    src: "https://www.figma.com/api/mcp/asset/fb1726a4-35bb-482d-93d5-892a9e18d89d",
  },
];

const socialIcons = [
  {
    alt: "linkedin",
    src: "/icons/linkedin.svg",
  },
  {
    alt: "instagram",
    src: "/icons/instagram.svg",
  },
  {
    alt: "twitter",
    src: "/icons/x.svg",
  },
];

const avatarSrc = "https://www.figma.com/api/mcp/asset/a1c981f0-8c41-409d-9ff1-484ad5145a40";

const advisoryTopics = [
  "اشتراك e-com",
  "اعتماد الوسائط الرقمية / المنصة",
  "بناء + تحجيم SaaS",
  "الاستثمار المبكر",
  "استراتيجيات نمو تويتر",
  "بناء المجتمع",
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1c1c1c]">
      <div className="mx-auto w-full max-w-[1159px] px-5 pb-10 pt-16 sm:px-8 lg:px-0 lg:pb-0 lg:pt-[100px]">
        <div className="mx-auto w-full max-w-[1000px]">
          <header className="mb-[30px] flex items-center justify-between">
            <div className="flex items-center gap-5">
              {topIcons.map((icon) => (
                <img key={icon.alt} alt={icon.alt} className="h-6 w-6" src={icon.src} />
              ))}
            </div>
            <h1 className="text-right text-[22px] font-extrabold leading-normal" dir="rtl">
              المستشار
            </h1>
          </header>

          <section className="grid gap-5 lg:grid-cols-[380px_600px]">
            <BookingWidget
              calendarTitle="الأيام المتاحة"
              calendarDescription="مدة الجلسة 60 دقيقة محددة سابقاً من قبل المستشار"
              slotsTitle="الأوقات المتاحة"
              slotsDescription="سيتم الحجز بتوقيت بلدك الحالي"
              buttonLabel="حجز جلسة"
            />

            <article className="overflow-hidden rounded-[12px] bg-[#f7f7f7]">
              <div className="flex flex-col gap-4 px-5 py-6 sm:flex-row-reverse sm:items-start sm:justify-between">
                <img
                  alt="سارة أحمد"
                  className="h-[150px] w-[150px] shrink-0 self-end rounded-full object-cover sm:self-auto"
                  src={avatarSrc}
                />

                <div className="flex-1 text-right" dir="rtl">
                  <h2 className="text-[18px] font-extrabold leading-normal text-[#242431]">
                    سارة أحمد
                  </h2>
                  <p className="mt-1 text-[14px] font-medium leading-normal text-black">
                    مؤسس، مستثمر، شريك في اكبر شركات التقنية
                  </p>
                  <p className="text-[14px] font-medium leading-normal text-black">
                    بالمملكة، خبرة 35 عاماً
                  </p>

                  <div className="mt-2 flex justify-end gap-2" dir="ltr">
                    {socialIcons.map((icon) => (
                      <img key={icon.alt} alt={icon.alt} className="h-6 w-6" src={icon.src} />
                    ))}
                  </div>

                  <p className="mt-3 text-[14px] font-extrabold leading-normal text-black">
                    متاح للجلسات
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-[#d9d9d9]" />

              <div className="px-5 py-5 text-right text-[14px] font-medium leading-normal text-black" dir="rtl">
                <section>
                  <h3 className="font-extrabold">نبذة تعريفية</h3>
                  <p className="mt-1">
                    متخصص في تطوير وادارة المنتجات الرقمية. مهتم في البزنس ولي عدة تجارب فيه.
                    مستثمر. معد ومقدم بودكاست #سوالف_بزنس.
                  </p>
                </section>

                <section className="mt-[10px]">
                  <h3 className="font-extrabold">نبذة</h3>
                  <p className="mt-1">أشياء يمكنني أن أنصح بها:</p>
                  <ul className="mt-1 space-y-0">
                    {advisoryTopics.map((topic) => (
                      <li key={topic}>- {topic}</li>
                    ))}
                  </ul>
                  <p className="mt-5">أحب مساعدة الآخرين، وخاصة رواد الأعمال الجائعين.</p>
                  <p className="mt-5">توسيع نطاق مجتمع المؤسس الخاص حالياً.</p>
                </section>
              </div>
            </article>
          </section>
        </div>
      </div>
    </main>
  );
}
