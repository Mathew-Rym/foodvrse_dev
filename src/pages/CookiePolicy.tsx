import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CookiePolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose max-w-none text-foreground space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">What are cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and 
              understanding how you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How we use cookies</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Essential Cookies</h3>
                <p>These cookies are necessary for the website to function and cannot be switched off.</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Authentication and login status</li>
                  <li>Shopping cart contents</li>
                  <li>Security and fraud prevention</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Analytics Cookies</h3>
                <p>Help us understand how visitors interact with our website.</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Page views and user behavior</li>
                  <li>Performance monitoring</li>
                  <li>Error tracking</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Preference Cookies</h3>
                <p>Remember your settings and preferences.</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Language preferences</li>
                  <li>Location settings</li>
                  <li>Theme preferences</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Managing cookies</h2>
            <p>
              You can control and/or delete cookies as you wish. You can delete all cookies that are 
              already on your computer and you can set most browsers to prevent them from being placed. 
              However, if you do this, you may have to manually adjust some preferences every time you 
              visit a site and some services and functionality may not work.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at{" "}
              <a href="mailto:privacy@foodvrse.com" className="text-primary hover:underline">
                privacy@foodvrse.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;