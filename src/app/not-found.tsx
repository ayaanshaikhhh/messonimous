// 'use client'
// import Link from "next/link";

// import { Button } from "@/components/ui/button";
// import ShinyText from "@/components/ui/ShinyText";

// const NotFound = () => {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
//       <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
//         <h1>
//             <ShinyText
//               text="404"
//               className="inline-block"
//               speed={2}
//               delay={0}
//               color="#6366F1"
//               shineColor="#06B6D4"
//               spread={120}
//               direction="left"
//               yoyo={false}
//               pauseOnHover={false}
//             />
//         </h1>

//         <h2 className="mt-4 text-2xl font-bold text-slate-900">
//           Page Not Found
//         </h2>

//         <p className="mt-2 text-sm leading-relaxed text-slate-500">
//           The Page you are looking for does not exist or is no
//           longer available.
//         </p>

//         <Link href="/dashboard" className="mt-6 inline-block">
//           <Button className="cursor-pointer rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white">
//             Go Home
//           </Button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default NotFound;


"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import ShinyText from "@/components/ui/ShinyText";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-8xl font-black leading-none sm:text-8xl">
          <ShinyText
            text="404"
            className="inline-block"
            speed={2}
            delay={0}
            color="#6366F1"
            shineColor="#06B6D4"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
          />
        </h1>

        <h2 className="mt-6 text-2xl font-bold text-slate-900">
          Page Not Found
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          The page you are looking for does not exist or is no
          longer available.
        </p>

        <Link href="/dashboard" className="mt-6 inline-block">
          <Button className="cursor-pointer rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;