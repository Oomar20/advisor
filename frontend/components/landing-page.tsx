import { BookingWidget } from "@/components/booking-widget";
import { LogoutButton } from "@/components/logout-button";
import type { SessionUser } from "@/lib/auth";

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

const avatarSrc =
  "https://www.figma.com/api/mcp/asset/a1c981f0-8c41-409d-9ff1-484ad5145a40";

const advisoryTopics = [
  "اشتراك e-com",
  "اعتماد الوسائط الرقمية / المنصة",
  "بناء + تحجيم SaaS",
  "الاستثمار المبكر",
  "استراتيجيات نمو تويتر",
  "بناء المجتمع",
];

type LandingPageProps = {
  user: SessionUser;
};

export function LandingPage({ user }: LandingPageProps) {
  return (
    <main className="min-h-screen bg-white text-[#1c1c1c]">
      <header className="sticky top-0 z-40 border-b border-[#ececec] bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-289.75 flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5 lg:px-0">
          <div className="text-right sm:order-2" dir="rtl">
            <h1 className="text-[19px] font-extrabold leading-none sm:text-[22px] sm:leading-normal">
              المستشار
            </h1>
            <p className="mt-1 max-w-55 truncate text-[13px] font-medium text-[#667085] sm:max-w-none">
              مرحباً {user.name}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-[14px] bg-[#f7f7f7] px-4 py-3 sm:order-1 sm:justify-start sm:gap-5 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0">
            <div className="flex items-center gap-4 sm:gap-5">
              {topIcons.map((icon) => (
                <img
                  key={icon.alt}
                  alt={icon.alt}
                  className="h-6 w-6"
                  src={icon.src}
                />
              ))}
            </div>
            <div className="shrink-0">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-289.75 px-5 pb-10 pt-6 sm:px-8 lg:px-0 lg:pb-0 lg:pt-8">
        <div className="mx-auto w-full max-w-250">
          <section className="grid gap-5 lg:grid-cols-[380px_600px]">
            <BookingWidget
              calendarTitle="الأيام المتاحة"
              calendarDescription="مدة الجلسة 60 دقيقة محددة سابقاً من قبل المستشار"
              slotsTitle="الأوقات المتاحة"
              slotsDescription="سيتم الحجز بتوقيت بلدك الحالي"
              buttonLabel="حجز جلسة"
            />

            <article className="overflow-hidden rounded-xl bg-[#f7f7f7]">
              <div className="flex flex-col gap-4 px-5 py-6 sm:flex-row-reverse sm:items-start sm:justify-between">
                <img
                  alt="سارة أحمد"
                  className="h-37.5 w-37.5 shrink-0 self-end rounded-full object-cover sm:self-auto"
                  src={avatarSrc}
                />

                <div className="flex-1 text-right" dir="rtl">
                  <h2 className="text-[18px] font-extrabold leading-normal text-[#242431]">
                    سارة أحمد
                  </h2>
                  <p className="mt-1 text-sm font-medium leading-normal text-black">
                    مؤسس، مستثمر، شريك في اكبر شركات التقنية
                  </p>
                  <p className="text-sm font-medium leading-normal text-black">
                    بالمملكة، خبرة 35 عاماً
                  </p>

                  <div className="mt-2 flex justify-end gap-2" dir="ltr">
                    {socialIcons.map((icon) => (
                      <img
                        key={icon.alt}
                        alt={icon.alt}
                        className="h-6 w-6"
                        src={icon.src}
                      />
                    ))}
                  </div>

                  <p className="mt-3 text-sm font-extrabold leading-normal text-black">
                    متاح للجلسات
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-[#d9d9d9]" />

              <div
                className="px-5 py-5 text-right text-sm font-medium leading-normal text-black"
                dir="rtl"
              >
                <section>
                  <h3 className="font-extrabold">نبذة تعريفية</h3>
                  <p className="mt-1">
                    متخصص في تطوير وادارة المنتجات الرقمية. مهتم في البزنس ولي
                    عدة تجارب فيه. مستثمر. معد ومقدم بودكاست #سوالف_بزنس.
                  </p>
                </section>

                <section className="mt-2.5">
                  <h3 className="font-extrabold">نبذة</h3>
                  <p className="mt-1">أشياء يمكنني أن أنصح بها:</p>
                  <ul className="mt-1 space-y-0">
                    {advisoryTopics.map((topic) => (
                      <li key={topic}>- {topic}</li>
                    ))}
                  </ul>
                  <p className="mt-5">
                    أحب مساعدة الآخرين، وخاصة رواد الأعمال الجائعين.
                  </p>
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
