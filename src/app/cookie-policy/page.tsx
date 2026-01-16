import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | White Rose Speakers",
  description: "Cookie policy for White Rose Speakers Leeds Toastmasters website.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">Cookie Policy</h1>

        <div className="prose prose-lg max-w-none text-foreground-muted">
          <p className="text-lg mb-6">
            Last updated: January 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your computer or mobile device when you visit a website.
              They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Cookies</h2>
            <p>White Rose Speakers uses cookies for the following purposes:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly, including authentication and session management.</li>
              <li><strong>Functional Cookies:</strong> These remember your preferences and settings to enhance your experience.</li>
              <li><strong>Analytics Cookies:</strong> We may use analytics services to understand how visitors interact with our website, helping us improve our content and services.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 mt-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Cookie Name</th>
                    <th className="px-4 py-2 text-left border-b">Purpose</th>
                    <th className="px-4 py-2 text-left border-b">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b">Session cookies</td>
                    <td className="px-4 py-2 border-b">Authentication and user session</td>
                    <td className="px-4 py-2 border-b">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Preference cookies</td>
                    <td className="px-4 py-2 border-b">Remember user preferences</td>
                    <td className="px-4 py-2 border-b">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. You can set your browser to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Block all cookies</li>
              <li>Accept only first-party cookies</li>
              <li>Delete cookies when you close your browser</li>
              <li>Browse in &quot;private&quot; or &quot;incognito&quot; mode</li>
            </ul>
            <p className="mt-4">
              Please note that blocking or deleting cookies may impact your experience on our website and limit certain functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Cookies</h2>
            <p>
              We may use third-party services that set their own cookies. These include:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>AWS Cognito for authentication</li>
              <li>YouTube for embedded videos</li>
            </ul>
            <p className="mt-4">
              We have no control over these third-party cookies. Please refer to the respective privacy policies of these services for more information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at{" "}
              <a href="mailto:whiterosespeaker@gmail.com" className="text-primary hover:underline">
                whiterosespeaker@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
