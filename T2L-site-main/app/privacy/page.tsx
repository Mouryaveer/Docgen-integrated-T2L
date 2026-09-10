import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="legal-page">
        <div className="wrap legal-page-inner">
          <span className="eyebrow">Turn2Law policy</span>
          <h1>Privacy Policy</h1>
          <p className="legal-lede">Turn2Law respects the privacy of founders, lawyers, and teams using its legal technology platform.</p>
          <section><h2>Information we collect</h2><p>We collect information you provide when you contact us, create an account, or use Turn2Law products. This may include your name, email address, organisation details, and information needed to provide a requested service.</p></section>
          <section><h2>How we use information</h2><p>We use information to operate and improve the platform, respond to enquiries, provide requested services, maintain security, and communicate important account or service updates. We do not use your confidential documents to train public models.</p></section>
          <section><h2>Contact</h2><p>Questions about this policy can be sent to <a href="mailto:hello@turn2law.in">hello@turn2law.in</a>. For legal information, please consult qualified counsel.</p></section>
          <Link className="btn btn-ghost" href="/">Return home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
