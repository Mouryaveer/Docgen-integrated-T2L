import React from "react";
import LegalServices from "../pages/LegalServices";
import "../legal-services.css";

export const metadata = {
  title: "Legal Services | Turn2Law",
  description: "Incorporation, compliance, trademark, and advisory, delivered by an in-house bench of lawyers, CAs, and CS professionals. Done right, not just fast."
};

export default function Page() {
  return <LegalServices />;
}
