// app/(marketing)/layout.tsx

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { createClient } from "@/lib/supabase/server";


export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const supabase = await createClient();
    
      const {
        data: { user },
      } = await supabase.auth.getUser();
  return (
    <>
      <Header user={user?.user_metadata?.name ?? user?.email ?? null} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
