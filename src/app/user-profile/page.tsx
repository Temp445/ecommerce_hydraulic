import type { Metadata } from 'next';
import ProfileClient from './ProfileClient'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export async function generateMetadata(): Promise<Metadata> {

   const res = await fetch(`${BASE_URL}/api/pages/contactpage`, { cache: "no-store" });
   const data = await res.json();
   const contact = data?.data;

   const logo = contact?.logo || `${BASE_URL}/og-images/AceLogo.png`;
   const alts = contact?.websiteTitle || "My Profile"
   const name = contact?.websiteTitle || "ACE";

    return {
  
      title: "My Profile | Manage Your Account Details",
      description:"Manage your profile details, edit your information, and keep your account secure and up to date.",

      alternates: {
        canonical: `${BASE_URL}/user-profile`,
      },

      openGraph: {
        title: "My Profile | Manage Your Account Details",
        description:"Access and update your profile information, account preferences, and personal details easily.",
        url: `${BASE_URL}/user-profile`,
        siteName: name,
        images: [
          {
            url: logo,
            width: 1200,
            height: 630,
            alt: alts,
          },
        ],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: "My Profile | Manage Your Account Details",
        description:"Manage your account, edit your personal information, and keep your profile up to date.",
        images: [logo],
      },
}
}

const UserProfile = () => {
  return (
    <div>
      <ProfileClient />
    </div>
  )
}

export default UserProfile