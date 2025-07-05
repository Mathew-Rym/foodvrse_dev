
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-orange-800 mb-2">FoodVrse Privacy Policy</h2>
            <p className="text-orange-700">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              At FoodVrse, we collect information to provide better services to our users and support our mission of reducing food waste.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Account information (name, email, location preferences)</li>
              <li>Usage data (meals viewed, favorites, orders)</li>
              <li>Location data (to show nearby rescue meals)</li>
              <li>Device information (for optimization and security)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide personalized meal recommendations</li>
              <li>Show nearby restaurants and rescue meals</li>
              <li>Process orders and manage your account</li>
              <li>Track and display your positive environmental impact</li>
              <li>Improve our services and develop new features</li>
              <li>Send important updates about your orders</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze how you use our platform</li>
              <li>Provide personalized content</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Partner restaurants (order details only)</li>
              <li>Service providers (payment processing, analytics)</li>
              <li>Legal authorities (when required by law)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@foodvrse.com<br />
                <strong>Address:</strong> FoodVrse Privacy Team<br />
                Nairobi, Kenya
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
