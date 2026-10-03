import React from "react";
import { Helmet } from "react-helmet-async";
import GaadiGlowBanner from "../../Components/User/Banner";
import Packages from "../../Components/User/Packages";
import WhyChooseUs from "./WhyChooseUs";
import AboutHome from "../User/Abouthome";
import HowItWorks from "./Howitworks";

const SITE = "https://doorsstep.in";
const PAGE_PATH = "/";
const PAGE_TITLE =
  "Doorstep Car Wash in Ahmedabad & Gandhinagar | Car Wash at Home from ₹299";
const PAGE_DESC =
  "Book doorstep car wash in Ahmedabad & Gandhinagar from ₹299. Professional car, bike & cycle cleaning at your home or office. Open 8 AM to 8 PM. Call +91 9898249789.";
const OG_TITLE = "Doorstep Car Wash in Ahmedabad & Gandhinagar | Car Wash at Home";
const OG_DESC =
  "Professional car wash & detailing at your doorstep in Ahmedabad & Gandhinagar. Packages from ₹299. Book online today!";
const OG_IMAGE = `${SITE}/og-image.jpg`;

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESC} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE}${PAGE_PATH}`} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Doorstep Car Wash" />
        <meta property="og:title" content={OG_TITLE} />
        <meta property="og:description" content={OG_DESC} />
        <meta property="og:url" content={`${SITE}${PAGE_PATH}`} />
        <meta property="og:image" content={OG_IMAGE} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={OG_TITLE} />
        <meta name="twitter:description" content={OG_DESC} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>

      <GaadiGlowBanner />
      <Packages />
      <WhyChooseUs />
      <AboutHome />
      <HowItWorks />
    </>
  );
}