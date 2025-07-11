import MobileLayout from "@/components/MobileLayout";
import BackToTop from "@/components/BackToTop";
import { useLocation } from "react-router-dom";

const TermsOfService = () => {
  const location = useLocation();
  const hideNavbar = location.state?.hideNavbar;

  return (
    <MobileLayout hideNavbar={hideNavbar}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              Welcome to FoodVrse ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our mobile application and services that connect consumers with local restaurants and stores to reduce food waste.
            </p>
            <p className="text-gray-600">
              By accessing or using FoodVrse, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-4">
              FoodVrse is a platform that:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Connects consumers with local food establishments offering surplus food</li>
              <li>Facilitates the purchase of "mystery bags" containing surplus food items</li>
              <li>Provides impact tracking for environmental and cost savings</li>
              <li>Enables communication between buyers and sellers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Creation</h3>
            <p className="text-gray-600 mb-4">
              To use certain features of FoodVrse, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Orders and Payments</h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Process</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Orders are confirmed upon successful payment</li>
              <li>Pickup times are specified by partner establishments</li>
              <li>You must collect orders within the designated time window</li>
              <li>Failure to collect may result in order forfeiture without refund</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Terms</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Payment is required at the time of order</li>
              <li>We accept M-Pesa, credit/debit cards, and mobile money</li>
              <li>All prices are in Kenyan Shillings (KSh)</li>
              <li>Taxes and fees are included in displayed prices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cancellations and Refunds</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Orders may be cancelled up to 1 hour before pickup time</li>
              <li>Refunds are processed within 3-5 business days</li>
              <li>No refunds for orders not collected within pickup windows</li>
              <li>Partner establishments reserve the right to cancel orders due to availability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Food Safety and Quality</h2>
            <p className="text-gray-600 mb-4">
              While we work with licensed establishments and maintain quality standards:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Food quality and safety are primarily the responsibility of partner establishments</li>
              <li>Users should inspect food before consumption</li>
              <li>Report any safety concerns immediately</li>
              <li>We are not liable for food-related illness or allergic reactions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. User Conduct</h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Use the service for illegal or unauthorized purposes</li>
              <li>Interfere with or disrupt the service</li>
              <li>Create false accounts or provide misleading information</li>
              <li>Abuse, harass, or harm partner establishments or other users</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              The FoodVrse app, including its design, features, and content, is owned by us and protected by intellectual property laws. You may not copy, modify, or distribute our content without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy</h2>
            <p className="text-gray-600 mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Disclaimers</h2>
            <p className="text-gray-600 mb-4">
              FoodVrse is provided "as is" without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to warranties of merchantability and fitness for a particular purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              In no event shall FoodVrse be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-600 mb-4">
              These Terms are governed by the laws of Kenya. Any disputes will be resolved in the courts of Kenya.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective upon posting in the app. Continued use constitutes acceptance of modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              For questions about these Terms, contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Email: hello@foodvrse.com</p>
              <p className="text-gray-600">Phone: 0110098266</p>
              <p className="text-gray-600">Address: Nairobi, Kenya</p>
            </div>
          </section>
        </div>
      </div>
      <BackToTop />
    </MobileLayout>
  );
};

export default TermsOfService;