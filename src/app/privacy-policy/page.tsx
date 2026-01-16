import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | White Rose Speakers",
  description: "Privacy policy for White Rose Speakers Leeds Toastmasters website.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none text-foreground-muted">
          <p className="text-lg mb-6">
            Last updated: January 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
            <p>
              White Rose Speakers Leeds (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
            <h3 className="text-xl font-medium text-foreground mt-4 mb-2">Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us, including:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Name and email address (when you contact us or subscribe to our newsletter)</li>
              <li>Phone number (if provided in contact forms)</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-2">Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect certain information, including:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address</li>
              <li>Pages visited and time spent on those pages</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>To respond to your inquiries and provide customer support</li>
              <li>To send you newsletters and updates (if you have subscribed)</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
              <li>To protect against fraudulent or illegal activity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to outside parties except in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>With your consent</li>
              <li>To comply with legal requirements</li>
              <li>To protect our rights or property</li>
              <li>With service providers who assist us in operating our website (subject to confidentiality agreements)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information.
              However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
            <p>Under applicable data protection laws, you may have the following rights:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
              <li><strong>Portability:</strong> Request transfer of your data</li>
              <li><strong>Objection:</strong> Object to processing of your data</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us using the details provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.
              We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Children&apos;s Privacy</h2>
            <p>
              Our website is not intended for children under the age of 16. We do not knowingly collect personal information from children.
              If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page
              and updating the &quot;Last updated&quot; date at the top of this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <ul className="list-none mt-4 space-y-2">
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:whiterosespeaker@gmail.com" className="text-primary hover:underline">
                  whiterosespeaker@gmail.com
                </a>
              </li>
              <li>
                <strong>Website:</strong>{" "}
                <a href="https://whiterosespeakers.co.uk" className="text-primary hover:underline">
                  whiterosespeakers.co.uk
                </a>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Toastmasters International</h2>
            <p>
              White Rose Speakers is a member club of Toastmasters International. For information about Toastmasters International&apos;s
              privacy practices, please visit their{" "}
              <a
                href="https://www.toastmasters.org/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                privacy policy
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
