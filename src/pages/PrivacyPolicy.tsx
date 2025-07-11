import MobileLayout from "@/components/MobileLayout";
import BackToTop from "@/components/BackToTop";
import { useLocation } from "react-router-dom";

const PrivacyPolicy = () => {
  const location = useLocation();
  const hideNavbar = location.state?.hideNavbar;

  return (
    <MobileLayout hideNavbar={hideNavbar}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Name, email address, and phone number</li>
              <li>Location data for nearby restaurant discovery</li>
              <li>Payment information (processed securely by third parties)</li>
              <li>Profile preferences and dietary restrictions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Process orders and facilitate pickups</li>
              <li>Send notifications about orders and offers</li>
              <li>Improve our services and user experience</li>
              <li>Track environmental impact and savings</li>
              <li>Provide customer support</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Partner restaurants for order fulfillment</li>
              <li>Payment processors for transaction security</li>
              <li>Service providers who assist our operations</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Access your personal information</li>
              <li>Correct or update your data</li>
              <li>Delete your account and data</li>
              <li>Opt out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Email: hello@foodvrse.com</p>
              <p className="text-gray-600">Phone: 0110098266</p>
            </div>
          </section>
        </div>
      </div>
      <BackToTop />
    </MobileLayout>
  );
};

export default PrivacyPolicy;